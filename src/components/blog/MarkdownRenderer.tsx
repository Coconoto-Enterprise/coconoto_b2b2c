import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-900" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-bold mt-5 mb-2 text-gray-900" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-4 text-gray-700 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a 
              className="text-green-600 hover:text-green-700 underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-4 ml-6 list-disc text-gray-700" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-4 ml-6 list-decimal text-gray-700" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="my-2" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-green-500 pl-4 my-4 italic text-gray-600" 
              {...props} 
            />
          ),
          code: ({ node, inline, ...props }: any) => (
            inline ? (
              <code 
                className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" 
                {...props} 
              />
            ) : (
              <code 
                className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto" 
                {...props} 
              />
            )
          ),
          img: ({ node, ...props }) => (
            <img 
              className="my-6 rounded-lg shadow-md max-w-full h-auto" 
              {...props} 
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-200" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th 
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
              {...props} 
            />
          ),
          td: ({ node, ...props }) => (
            <td 
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" 
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
