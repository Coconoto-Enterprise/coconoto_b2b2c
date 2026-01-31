
import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './WysiwygEditor.css';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}


export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange, placeholder }) => {
  const lastValue = useRef(value);
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== lastValue.current) {
        lastValue.current = html;
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        placeholder: placeholder || 'Write your content...'
      }
    }
  });

  // Only update editor content if value prop changes from outside
  useEffect(() => {
    if (editor && value !== lastValue.current) {
      editor.commands.setContent(value, false);
      lastValue.current = value;
    }
  }, [value, editor]);

  return (
    <div className="wysiwyg-editor-container">
      <div className="wysiwyg-toolbar">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'is-active' : ''}><b>B</b></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'is-active' : ''}><i>I</i></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'is-active' : ''}>• List</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'is-active' : ''}>1. List</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive('blockquote') ? 'is-active' : ''}>&quot;</button>
        <button type="button" onClick={() => editor?.chain().focus().setParagraph().run()} className={editor?.isActive('paragraph') ? 'is-active' : ''}>P</button>
      </div>
      <EditorContent editor={editor} className="wysiwyg-editor-content" />
    </div>
  );
};
