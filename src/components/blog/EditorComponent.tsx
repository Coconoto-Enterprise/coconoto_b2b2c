import React, { useEffect, useRef, useState } from 'react';
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
import { Loader } from 'lucide-react';
import './EditorComponent.css';

interface EditorComponentProps {
  value?: OutputData;
  onChange: (data: OutputData) => void;
  placeholder?: string;
}

export const EditorComponent: React.FC<EditorComponentProps> = ({
  value,
  onChange,
  placeholder = 'Write your blog content...'
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editorRef.current) return;

    const initializeEditor = async () => {
      const editor = new EditorJS({
        holder: 'editorjs-container',
        placeholder,
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
            inlineToolbar: true
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O'
          },
          code: {
            class: Code,
            shortcut: 'CMD+SHIFT+C'
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  try {
                    setUploading(true);

                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                      throw new Error('Please select an image file');
                    }

                    // Validate file size (5MB max)
                    if (file.size > 5 * 1024 * 1024) {
                      throw new Error('Image size should be less than 5MB');
                    }

                    // Create unique file name
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                    const filePath = fileName;

                    // Upload to Supabase Storage
                    const { data, error } = await supabase.storage
                      .from('blog-images')
                      .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                      });

                    if (error) throw error;

                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                      .from('blog-images')
                      .getPublicUrl(filePath);

                    setUploading(false);
                    return { success: 1, file: { url: publicUrl } };
                  } catch (error) {
                    console.error('Error uploading image:', error);
                    setUploading(false);
                    return { success: 0 };
                  }
                },
                uploadByUrl: async (url: string) => {
                  return { success: 1, file: { url } };
                }
              }
            }
          },
          link: Link,
          marker: Marker,
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true
              }
            }
          },
          table: {
            class: Table,
            inlineToolbar: true
          }
        },
        data: value || { time: Date.now(), blocks: [] },
        onChange: async () => {
          if (editorRef.current) {
            const data = await editorRef.current.saver.save();
            onChange(data);
          }
        }
      });

      editorRef.current = editor;
      setIsReady(true);
    };

    initializeEditor();

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {uploading && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
          <Loader className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Uploading image...</span>
        </div>
      )}
      <div
        id="editorjs-container"
        className="editor-js-container"
      />
    </div>
  );
};
