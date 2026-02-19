import { useState } from 'react';

interface FAQ {
  q: string;
  a: string;
}

interface Props {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-6 py-4 font-bold flex justify-between items-center hover:bg-white/5 transition faq-question"
            aria-expanded={open === i}
            aria-controls={`faq-${i}`}
            id={`faq-btn-${i}`}
          >
            {faq.q}
            <span className={`transform transition-transform ${open === i ? 'rotate-180' : ''}`}>▼</span>
          </button>
          <div
            id={`faq-${i}`}
            role="region"
            aria-labelledby={`faq-btn-${i}`}
            className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-96' : 'max-h-0'}`}
          >
            <div className="px-6 pb-4 pt-0 faq-answer">{faq.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
