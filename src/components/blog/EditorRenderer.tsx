import React from 'react';
import { OutputData } from '@editorjs/editorjs';
import './EditorComponent.css';

interface EditorRendererProps {
  data?: OutputData;
}

export const EditorRenderer: React.FC<EditorRendererProps> = ({ data }) => {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return <div className="text-gray-400 italic">No content yet</div>;
  }

  const renderBlock = (block: any, index: number) => {
    const getAlignment = (alignment?: string) => {
      switch (alignment) {
        case 'center':
          return 'text-center';
        case 'right':
          return 'text-right';
        case 'justify':
          return 'text-justify';
        default:
          return 'text-left';
      }
    };

    switch (block.type) {
      case 'header':
        const headerLevelClass: Record<number, string> = {
          1: 'text-4xl font-bold',
          2: 'text-3xl font-bold',
          3: 'text-2xl font-bold'
        };
        return (
          <h2
            key={index}
            className={`${headerLevelClass[block.data?.level] || 'text-2xl font-bold'} my-4 ${getAlignment(block.data?.alignment)}`}
            dangerouslySetInnerHTML={{ __html: block.data?.text || '' }}
          />
        );

      case 'paragraph':
        return (
          <p
            key={index}
            className={`text-base leading-7 my-3 ${getAlignment(block.data?.alignment)}`}
            dangerouslySetInnerHTML={{ __html: block.data?.text || '' }}
          />
        );

      case 'list':
        const isOrdered = block.data?.style === 'ordered';
        const ListTag = isOrdered ? 'ol' : 'ul';
        return (
          <ListTag key={index} className={`${isOrdered ? 'list-decimal' : 'list-disc'} list-inside my-3 pl-4`}>
            {block.data?.items?.map((item: any, idx: number) => (
              <li key={idx} className="mb-1">
                {typeof item === 'string' ? item : item.content}
              </li>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote
            key={index}
            className="border-l-4 border-green-500 pl-4 italic my-4 text-gray-600"
          >
            <p dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} />
            {block.data?.caption && (
              <footer className="text-sm text-gray-500 mt-2">
                — {block.data.caption}
              </footer>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3">
            <code>{block.data?.code || ''}</code>
          </pre>
        );

      case 'image':
        return (
          <figure key={index} className="my-6">
            <img
              src={block.data?.file?.url || block.data?.url}
              alt={block.data?.caption || 'Blog image'}
              className="max-w-full h-auto rounded-lg"
            />
            {block.data?.caption && (
              <figcaption className="text-center text-sm text-gray-500 mt-2">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'embed':
        return (
          <div key={index} className="my-4 aspect-video">
            <iframe
              src={block.data?.embed}
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        );

      case 'table':
        return (
          <div key={index} className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-gray-300">
              <tbody>
                {block.data?.content?.map((row: any[], rowIdx: number) => (
                  <tr key={rowIdx}>
                    {row.map((cell: any, cellIdx: number) => (
                      <td key={cellIdx} className="border border-gray-300 p-2">
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
        return <hr key={index} className="my-6 border-gray-300" />;

      default:
        return null;
    }
  };

  return (
    <div className="blog-content">
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};
