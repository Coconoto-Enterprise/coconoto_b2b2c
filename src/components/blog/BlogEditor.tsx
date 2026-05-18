import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Loader, Upload } from 'lucide-react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import ImageTool from '@editorjs/image';
import { supabase } from '../../lib/supabase';
import blogService from '../../services/mernBlogService';

interface Blog {
  blog_id: string;
  title: string;
  des: string;
  banner: string;
  content: any[];
  content_blocks: any;
  tags: string[];
  is_draft: boolean;
  published: boolean;
}

export const BlogEditor: React.FC = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<EditorJS | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId] = useState<string>('00000000-0000-0000-0000-000000000001'); // Admin user UUID
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    des: '',
    banner: '',
    tags: ''
  });

  // Initialize EditorJS
  useEffect(() => {
    if (!blog) return;

    const initEditor = () => {
      editorRef.current = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          paragraph: Paragraph,
          list: List,
          quote: Quote,
          code: Code,
          marker: Marker,
          inlineCode: InlineCode,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: '/api/upload',
                byUrl: '/api/fetch-url',
              },
              field: 'image',
              types: 'image/*',
              additionalRequestHeaders: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
              }
            }
          }
        },
        data: blog.content_blocks || { blocks: [] },
        onReady: () => {
          console.log('Editor ready');
        },
        onChange: () => {
          console.log('Editor content changed');
        }
      });
    };

    initEditor();

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [blog]);

  // Fetch blog data
  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogById(blogId);
        if (!data) {
          setError('Blog not found');
          return;
        }

        setBlog(data);
        setFormData({
          title: data.title,
          des: data.des,
          banner: data.banner,
          tags: data.tags.join(', ')
        });
      } catch (err) {
        setError('Failed to load blog');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleUploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !blog) return;

    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, banner: publicUrl });
    } catch (err) {
      setError('Failed to upload banner');
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!blog) return;

    try {
      setSaving(true);
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      // Get editor content
      let editorContent = { blocks: [] };
      if (editorRef.current) {
        try {
          editorContent = await editorRef.current.save();
        } catch (err) {
          console.error('Failed to save editor content:', err);
        }
      }

      await blogService.updateBlog(blog.blog_id, {
        title: formData.title,
        des: formData.des,
        banner: formData.banner,
        tags,
        content: editorContent.blocks,
        content_blocks: editorContent
      }, userId);

      setError(null);
      alert('Blog saved successfully!');
    } catch (err) {
      setError('Failed to save blog');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!blog) return;

    try {
      setSaving(true);
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      // Get editor content
      let editorContent = { blocks: [] };
      if (editorRef.current) {
        try {
          editorContent = await editorRef.current.save();
        } catch (err) {
          console.error('Failed to save editor content:', err);
        }
      }

      await blogService.updateBlog(blog.blog_id, {
        title: formData.title,
        des: formData.des,
        banner: formData.banner,
        tags,
        content: editorContent.blocks,
        content_blocks: editorContent,
        published: true,
        is_draft: false
      }, userId);

      await blogService.publishBlog(blog.blog_id, userId);
      alert('Blog published successfully!');
      navigate('/vintage?tab=blog');
    } catch (err) {
      setError('Failed to publish blog');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 text-amber-700 animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{error || 'Blog not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
        <button
          onClick={() => navigate('/vintage?tab=blog')}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            placeholder="Enter blog title"
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Banner
          </label>
          <div className="flex gap-4">
            {formData.banner && (
              <img
                src={formData.banner}
                alt="Banner"
                className="w-32 h-32 object-cover rounded"
              />
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload banner image"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              Upload Banner
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadBanner}
              aria-label="Upload banner image"
              className="hidden"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Short excerpt - max 200 chars)
          </label>
          <textarea
            value={formData.des}
            onChange={(e) => setFormData({ ...formData, des: e.target.value.slice(0, 200) })}
            maxLength={200}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            placeholder="Brief description of your blog post"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.des.length}/200</p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            placeholder="e.g., coconut, agriculture, business"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Content
          </label>
          <div 
            id="editorjs" 
            className="border border-gray-300 rounded-lg p-4 bg-white editor-content min-h-96"
            style={{
              fontSize: '16px',
              lineHeight: '1.6'
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-6 border-t">
          <button
            onClick={() => navigate('/vintage?tab=blog')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.title.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving || !formData.title.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* EditorJS Styles */}
      <style>{`
        #editorjs {
          outline: none;
        }

        #editorjs .cdx-block {
          margin-bottom: 1rem;
        }

        #editorjs h1,
        #editorjs h2,
        #editorjs h3,
        #editorjs h4,
        #editorjs h5,
        #editorjs h6 {
          margin: 1rem 0 0.5rem 0;
          font-weight: 600;
          line-height: 1.2;
        }

        #editorjs h1 {
          font-size: 2em;
        }

        #editorjs h2 {
          font-size: 1.5em;
        }

        #editorjs h3 {
          font-size: 1.25em;
        }

        #editorjs ul,
        #editorjs ol {
          margin: 0.5rem 0 0.5rem 1.5rem;
        }

        #editorjs li {
          margin-bottom: 0.25rem;
        }

        #editorjs blockquote {
          border-left: 3px solid #d4af37;
          padding-left: 1rem;
          margin: 0.5rem 0;
          font-style: italic;
          color: #666;
        }

        #editorjs code {
          background-color: #f4f4f4;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
        }

        #editorjs pre {
          background-color: #f4f4f4;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          margin: 0.5rem 0;
        }

        #editorjs pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }

        #editorjs img {
          max-width: 100%;
          height: auto;
          margin: 0.5rem 0;
          border-radius: 4px;
        }

        .ce-header {
          margin: 0.5rem 0 0.25rem 0;
        }

        .ce-paragraph {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;
