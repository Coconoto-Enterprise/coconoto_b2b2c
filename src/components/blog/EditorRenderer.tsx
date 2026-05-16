import React from 'react';
import { OutputData } from '@editorjs/editorjs';

interface EditorRendererProps {
  data?: OutputData;
  className?: string;
}

export const EditorRenderer: React.FC<EditorRendererProps> = ({
  data,
  className = ''
}) => {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return <div className={`text-gray-500 italic ${className}`}>No content</div>;
  }

  const renderBlock = (block: any, index: number) => {
    const { type, data: blockData } = block;

    switch (type) {
      case 'header':
        const HeaderTag = `h${blockData.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag
            key={index}
            className={`font-bold mb-4 ${
              blockData.level === 1
                ? 'text-4xl'
                : blockData.level === 2
                ? 'text-3xl'
                : 'text-2xl'
            }`}
          >
            {blockData.text}
          </HeaderTag>
        );

      case 'paragraph':
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {blockData.text}
          </p>
        );

      case 'list':
        if (blockData.style === 'ordered') {
          return (
            <ol key={index} className="mb-4 ml-6 list-decimal text-gray-700">
              {blockData.items.map((item: string, i: number) => (
                <li key={i} className="mb-2">
                  {item}
                </li>
              ))}
            </ol>
          );
        } else {
          return (
            <ul key={index} className="mb-4 ml-6 list-disc text-gray-700">
              {blockData.items.map((item: string, i: number) => (
                <li key={i} className="mb-2">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

      case 'quote':
        return (
          <blockquote
            key={index}
            className="border-l-4 border-green-500 pl-4 my-4 italic text-gray-600"
          >
            {blockData.text}
            {blockData.caption && <p className="text-sm mt-2">— {blockData.caption}</p>}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={index} className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4">
            <code className="font-mono text-sm">{blockData.code}</code>
          </pre>
        );

      case 'image':
        return (
          <figure key={index} className="my-6">
            <img
              src={blockData.url}
              alt={blockData.caption || 'Blog image'}
              className="w-full rounded-lg shadow-md"
            />
            {blockData.caption && (
              <figcaption className="text-sm text-gray-600 text-center mt-2">
                {blockData.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'embed':
        return (
          <div
            key={index}
            className="mb-6"
            dangerouslySetInnerHTML={{ __html: blockData.embed }}
          />
        );

      case 'table':
        return (
          <div key={index} className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <tbody>
                {blockData.content.map((row: string[], rowIdx: number) => (
                  <tr key={rowIdx} className={rowIdx === 0 ? 'bg-gray-50' : ''}>
                    {row.map((cell: string, cellIdx: number) => (
                      <td
                        key={cellIdx}
                        className="px-6 py-3 text-sm text-gray-900 border-r border-gray-200"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'delimiter':
        return <hr key={index} className="my-8 border-gray-300" />;

      case 'link':
        return (
          <div key={index} className="mb-4">
            <a
              href={blockData.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 underline"
            >
              {blockData.title || blockData.link}
            </a>
            {blockData.description && (
              <p className="text-sm text-gray-600 mt-1">{blockData.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};
