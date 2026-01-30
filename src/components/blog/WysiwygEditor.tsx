import React, { useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../lib/supabase';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange, placeholder }) => {
  const quillRef = useRef<ReactQuill | null>(null);

  // Custom image handler for Supabase upload
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      // Upload to Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;
      const { error } = await supabase.storage.from('blog-images').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) {
        alert('Failed to upload image.');
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      // Insert image into editor
      const quill = quillRef.current?.getEditor();
      const range = quill?.getSelection();
      if (publicUrl && range) {
        quill.insertEmbed(range.index, 'image', publicUrl);
      }
    };
  };

  // Quill modules config
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'align': [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      theme="snow"
      placeholder={placeholder || 'Write your content...'}
      style={{ minHeight: 300 }}
    />
  );
};
