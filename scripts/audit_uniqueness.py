#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
import string
from collections import defaultdict
from pathlib import Path

PUNCT_TABLE = str.maketrans('', '', string.punctuation)
WS_RE = re.compile(r'\s+')


def normalize_text(value: str) -> str:
    text = (value or '').lower().strip()
    text = text.translate(PUNCT_TABLE)
    text = WS_RE.sub(' ', text)
    return text


def token_hash_64(token: str) -> int:
    digest = hashlib.md5(token.encode('utf-8')).hexdigest()
    return int(digest[:16], 16)


def simhash_64(text: str) -> int:
    tokens = normalize_text(text).split()
    if not tokens:
        return 0

    bits = [0] * 64
    for tok in tokens:
        h = token_hash_64(tok)
        for i in range(64):
            if (h >> i) & 1:
                bits[i] += 1
            else:
                bits[i] -= 1

    out = 0
    for i, score in enumerate(bits):
        if score >= 0:
            out |= (1 << i)
    return out


def hamming_distance(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def extract_headline(blocks_raw):
    if isinstance(blocks_raw, str):
        try:
            blocks = json.loads(blocks_raw)
        except json.JSONDecodeError:
            return ''
    elif isinstance(blocks_raw, list):
        blocks = blocks_raw
    else:
        return ''

    for block in blocks:
        if block.get('block_type') == 'hero':
            data = block.get('data') or {}
            headline = data.get('headline')
            if isinstance(headline, str):
                return headline
    return ''


def infer_loc_and_category(slug: str, location_map: dict):
    parts = (slug or '').split('/')
    city = 'Unknown'
    state = 'Unknown'
    category = ''

    if len(parts) >= 3 and parts[0] == 'insights':
        # Matrix format: insights/<city-state>/<category>
        if parts[1] in location_map:
            city, state = location_map[parts[1]]
            category = parts[2].replace('-', ' ')
            return city, state, category

        # Legacy: insights/<category>/<slug-with-city-state>
        filename = parts[-1]
        for loc_slug, (loc_city, loc_state) in location_map.items():
            if filename.endswith(f'-{loc_slug}'):
                city, state = loc_city, loc_state
                break
        if len(parts) > 1:
            category = parts[1].replace('-', ' ')

    return city, state, category


def load_location_map(locations_path: Path):
    with locations_path.open('r', encoding='utf-8') as f:
        locations = json.load(f)

    out = {}
    for row in locations:
        slug = row.get('slug')
        city = row.get('city', 'Unknown')
        state = row.get('state', 'Unknown')
        if slug:
            out[slug] = (city, state)
    return out


def main():
    parser = argparse.ArgumentParser(description='Audit exact and near-duplicate headlines in generated PSEO content.')
    parser.add_argument('--input', default='src/data/pseo/jss_content.json', help='Input content JSON path')
    parser.add_argument('--locations', default='src/data/pseo/locations.json', help='Locations JSON path')
    parser.add_argument('--out', default='scripts/uniqueness_report.json', help='Output report JSON path')
    parser.add_argument('--distance', type=int, default=3, help='Max Hamming distance for near-duplicate SimHash clustering')
    parser.add_argument('--min-length', type=int, default=12, help='Ignore headlines shorter than this length for near-dup clustering')
    args = parser.parse_args()

    root = Path.cwd()
    input_path = (root / args.input).resolve()
    locations_path = (root / args.locations).resolve()
    out_path = (root / args.out).resolve()

    if not input_path.exists():
        raise FileNotFoundError(f'Input file not found: {input_path}')
    if not locations_path.exists():
        raise FileNotFoundError(f'Locations file not found: {locations_path}')

    location_map = load_location_map(locations_path)

    with input_path.open('r', encoding='utf-8') as f:
        rows = json.load(f)

    items = []
    for row in rows:
        slug = row.get('slug', '')
        title = row.get('title', '')
        headline = extract_headline(row.get('blocks'))
        city, state, category = infer_loc_and_category(slug, location_map)
        normalized = normalize_text(headline)

        items.append({
            'slug': slug,
            'title': title,
            'headline': headline,
            'headline_normalized': normalized,
            'city': city,
            'state': state,
            'category': category,
            'simhash': simhash_64(headline) if len(headline) >= args.min_length else 0,
        })

    exact_map = defaultdict(list)
    for item in items:
        key = item['headline_normalized']
        if key:
            exact_map[key].append(item)

    exact_clusters = [
        {
            'headline_normalized': k,
            'count': len(v),
            'entries': [{
                'slug': e['slug'],
                'state': e['state'],
                'city': e['city'],
                'category': e['category'],
                'headline': e['headline']
            } for e in v]
        }
        for k, v in exact_map.items() if len(v) > 1
    ]

    # Build near-duplicate clusters using union-find over simhash distance.
    parent = list(range(len(items)))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    for i in range(len(items)):
        if not items[i]['headline'] or len(items[i]['headline']) < args.min_length:
            continue
        for j in range(i + 1, len(items)):
            if not items[j]['headline'] or len(items[j]['headline']) < args.min_length:
                continue
            dist = hamming_distance(items[i]['simhash'], items[j]['simhash'])
            if dist <= args.distance:
                union(i, j)

    grouped = defaultdict(list)
    for idx, item in enumerate(items):
        grouped[find(idx)].append(item)

    near_clusters = []
    for _, group in grouped.items():
        unique_headlines = {g['headline_normalized'] for g in group if g['headline_normalized']}
        if len(group) > 1 and len(unique_headlines) > 1:
            near_clusters.append({
                'count': len(group),
                'entries': [{
                    'slug': g['slug'],
                    'state': g['state'],
                    'city': g['city'],
                    'category': g['category'],
                    'headline': g['headline']
                } for g in group]
            })

    report = {
        'total_items': len(items),
        'exact_duplicate_clusters': sorted(exact_clusters, key=lambda c: c['count'], reverse=True),
        'exact_duplicate_items': sum(c['count'] for c in exact_clusters),
        'near_duplicate_clusters': sorted(near_clusters, key=lambda c: c['count'], reverse=True),
        'near_duplicate_items': sum(c['count'] for c in near_clusters),
        'config': {
            'distance_threshold': args.distance,
            'min_length': args.min_length,
            'input': str(input_path),
            'locations': str(locations_path)
        }
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open('w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"Audited {len(items)} entries")
    print(f"Exact duplicate clusters: {len(exact_clusters)}")
    print(f"Near-duplicate clusters: {len(near_clusters)} (distance <= {args.distance})")
    print(f"Report written to: {out_path}")


if __name__ == '__main__':
    main()
