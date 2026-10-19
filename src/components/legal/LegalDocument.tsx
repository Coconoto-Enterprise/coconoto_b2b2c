import React from 'react';
import { Link } from 'react-router-dom';
import FigmaNav from '@/components/figma/FigmaNav';
import Footer from '@/components/Footer';
import { LEGAL_UPDATED } from '../../../api/_legal-content.js';
import type { LegalBlock, LegalPage } from '@/types/legal';

/**
 * Renders `**bold**` inside otherwise-plain strings. The content module stores
 * every block as a string so the same text can also be server-rendered by
 * `api/seo.js`, where a React node is not an option.
 */
const inline = (text: string): React.ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

const renderBlock = (block: LegalBlock, key: string): React.ReactNode => {
  if (block.p) return <p key={key} className="text-gray-700 mb-4">{inline(block.p)}</p>;

  if (block.h3)
    return (
      <h3 key={key} className="text-lg font-semibold text-gray-800 mt-6 mb-3">
        {block.h3}
      </h3>
    );

  if (block.ul)
    return (
      <ul key={key} className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
        {block.ul.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>
    );

  if (block.note)
    return (
      <div key={key} className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded mb-4">
        <p className="text-gray-700 m-0">{inline(block.note)}</p>
      </div>
    );

  if (block.dl)
    return (
      <div key={key} className="bg-gray-100 p-6 rounded-lg space-y-2 text-gray-700 mb-4">
        {block.dl.map(([term, value], i) => (
          <p key={i} className="m-0">
            <strong>{term}:</strong> {inline(value)}
          </p>
        ))}
      </div>
    );

  return null;
};

export default function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <div className="flex flex-col min-h-screen">
      <FigmaNav />

      <div className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-2 text-center">{page.heading}</h1>
            <p className="text-gray-600 mb-8 text-center text-sm">
              Last updated: {LEGAL_UPDATED}
            </p>

            {page.intro && (
              <p className="text-gray-700 mb-8 leading-relaxed">{inline(page.intro)}</p>
            )}

            <div className="space-y-8">
              {page.sections.map((section, si) => (
                <section key={si}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {section.heading}
                  </h2>
                  {section.blocks.map((block, bi) => renderBlock(block, `${si}-${bi}`))}
                </section>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t text-center">
              <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
