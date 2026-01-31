
import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './WysiwygEditor.css';

// Helper to apply block formatting only to selected text (splitting blocks)
function setBlockTypeForSelection(editor: any, type: string, attrs: any = {}) {
  if (!editor) return;
  const { state, view } = editor;
  const { from, to } = state.selection;
  // Split at selection boundaries
  editor.commands.splitBlock();
  // Select the range again (after split)
  editor.commands.setTextSelection({ from, to });
  // Apply block type to selection
  if (type === 'heading') {
    editor.commands.setNode('heading', attrs);
  } else if (type === 'paragraph') {
    editor.commands.setNode('paragraph');
  } else if (type === 'blockquote') {
    editor.commands.setNode('blockquote');
  } else if (type === 'bulletList') {
    editor.commands.toggleBulletList();
  } else if (type === 'orderedList') {
    editor.commands.toggleOrderedList();
  }
}

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
        <button type="button" onClick={() => setBlockTypeForSelection(editor, 'heading', { level: 1 })} className={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
        <button type="button" onClick={() => setBlockTypeForSelection(editor, 'heading', { level: 2 })} className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
        <button type="button" onClick={() => setBlockTypeForSelection(editor, 'heading', { level: 3 })} className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
        <button type="button" onClick={() => setBlockTypeForSelection(editor, 'bulletList')} className={editor?.isActive('bulletList') ? 'is-active' : ''}>• List</button>
        <button type="button" onClick={() => setBlockTypeForSelection(editor, 'orderedList')} className={editor?.isActive('orderedList') ? 'is-active' : ''}>1. List</button>
        <button type="button" onClick={() => setBlockTypeForSelection(editor, 'blockquote')} className={editor?.isActive('blockquote') ? 'is-active' : ''}>&quot;</button>
        <button type="button" onClick={() => setBlockTypeForSelection(editor, 'paragraph')} className={editor?.isActive('paragraph') ? 'is-active' : ''}>P</button>
      </div>
      <EditorContent editor={editor} className="wysiwyg-editor-content" />
    </div>
  );
};
