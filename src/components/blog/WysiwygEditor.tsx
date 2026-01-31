
import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}


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
	<div style={{ minHeight: 300, border: '1px solid #ccc', borderRadius: 8, padding: 8 }}>
		<EditorContent editor={editor} />
	</div>
  );
}
