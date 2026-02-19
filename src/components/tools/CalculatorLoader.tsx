import { getToolComponent } from '../../lib/tools-registry';
import { useState, useEffect } from 'react';

interface Props {
  slug: string;
}

export default function CalculatorLoader({ slug }: Props) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loader = getToolComponent(slug);
    if (loader) {
      loader().then((mod) => setComponent(() => mod.default));
    }
  }, [slug]);

  if (!Component) return <div className="text-white/60">Loading calculator...</div>;
  return <Component />;
}
