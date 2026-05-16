import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Image from '@editorjs/image';
import Link from '@editorjs/link';
import Marker from '@editorjs/marker';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import { supabase } from '../../lib/supabase';
import './EditorComponent.css';

interface EditorComponentProps {
  value?: OutputData;
  onChange: (data: OutputData) => void;
  placeholder?: string;
}

export const EditorComponent: React.FC<EditorComponentProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your blog post...'
}) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (editorRef.current) return;

    const uploadImageToSupabase = async (file: File) => {
      try {
        const fileName = `blog-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file);

        if (error) throw error;

        const {
          data: { publicUrl }
        } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        return {
          success: 1,
          file: { url: publicUrl }
        };
      } catch (error) {
        console.error('Image upload error:', error);
        return {
          success: 0,
          error: 'Failed to upload image'
        };
      }
    };

    const editor = new EditorJS({
      holder: 'editorjs-container',
      placeholder: placeholder,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2
          }
        },
        paragraph: {
          class: Paragraph,
          config: {
            preserveBlank: true
          }
        },
        list: List,
        quote: Quote,
        code: Code,
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile: uploadImageToSupabase
            }
          }
        },
        link: Link,
        marker: Marker,
        embed: Embed,
        table: Table
      },
      data: value || {
        time: Date.now(),
        blocks: [],
        version: '2.27.2'
      },
      onChange: async () => {
        try {
          const data = await editor.saver.save();
          onChange(data);
        } catch (error) {
          console.error('Save error:', error);
        }
      }
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="editor-js-container">
      <div id="editorjs-container" />
    </div>
  );
};
