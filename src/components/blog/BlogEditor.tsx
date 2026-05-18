import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Upload, ChevronLeft } from 'lucide-react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import LinkTool from '@editorjs/link';
import { supabase } from '../../lib/supabase';
import blogService from '../../services/mernBlogService';

interface Blog {
  blog_id: string;
  title: string;
  des: string;
  banner: string;
  content: any[];
  content_blocks: OutputData | any;
  tags: string[];
  is_draft: boolean;
  published: boolean;
}

export const BlogEditor: React.FC = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId] = useState<string>('00000000-0000-0000-0000-000000000001');
  const [error, setError] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    des: '',
    banner: '',
    tags: ''
  });

  // Initialize EditorJS
  useEffect(() => {
    if (!blog || !editorContainerRef.current) return;

    const initEditor = async () => {
      if (editorRef.current) {
        try {
          await editorRef.current.isReady;
          editorRef.current.destroy();
        } catch {
          console.log('Destroying previous editor instance');
        }
      }

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
            }
          },
          embed: Embed,
          linkTool: LinkTool
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
      if (editorRef.current?.destroy) {
        try {
          editorRef.current.destroy();
        } catch {
          console.log('Error destroying editor');
        }
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
      const { error: uploadError } = await supabase.storage
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

      let editorContent: OutputData = { blocks: [] };
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
      alert('Blog saved as draft!');
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

      let editorContent: OutputData = { blocks: [] };
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-gray-900 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading blog editor...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">{error || 'Blog not found'}</p>
          <button
            onClick={() => navigate('/vintage?tab=blog')}
            className="btn-dark"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="navbar border-b border-gray-300">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/vintage?tab=blog')}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Back to blogs"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div>
              <h1 className="text-2xl font-gelasio font-bold text-gray-900">
                {blog.is_draft ? '📝 Draft' : '✅ Published'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !formData.title.trim()}
              className="px-6 py-2 text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 font-medium"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving || !formData.title.trim()}
              className="btn-dark disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Title Input */}
        <div className="mb-8">
          <textarea
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Blog title"
            className="w-full text-5xl font-gelasio font-bold text-gray-900 placeholder:text-gray-300 resize-none border-0 p-0 focus:outline-none"
            rows={1}
            style={{ minHeight: '60px', overflow: 'hidden' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.max(target.scrollHeight, 60) + 'px';
            }}
          />
        </div>

        {/* Description */}
        <div className="mb-12">
          <textarea
            value={formData.des}
            onChange={(e) => setFormData({ ...formData, des: e.target.value.slice(0, 200) })}
            maxLength={200}
            placeholder="Add a short description (max 200 characters)"
            className="w-full text-xl text-gray-700 placeholder:text-gray-400 resize-none border-0 p-0 focus:outline-none"
            rows={2}
          />
          <p className="text-sm text-gray-500 mt-2">{formData.des.length}/200</p>
        </div>

        {/* Banner */}
        <div className="mb-12">
          {formData.banner ? (
            <div className="relative mb-6">
              <img
                src={formData.banner}
                alt="Blog banner"
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition font-medium"
              >
                Change
              </button>
            </div>
          ) : (
            <div
              onClick={() => bannerInputRef.current?.click()}
              className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Click to upload blog banner</p>
                <p className="text-sm text-gray-500">Recommended: 16:9 aspect ratio</p>
              </div>
            </div>
          )}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadBanner}
            className="hidden"
            aria-label="Upload banner"
          />
        </div>

        {/* Tags */}
        <div className="mb-12">
          <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Enter tags separated by commas (e.g., coconut, agriculture, business)"
            className="input-box"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags
              .split(',')
              .map(t => t.trim())
              .filter(t => t)
              .map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Editor */}
        <div className="mb-12">
          <label className="block text-lg font-gelasio font-bold text-gray-900 mb-4">
            Story
          </label>
          <div
            ref={editorContainerRef}
            className="border border-gray-300 rounded-lg overflow-hidden bg-white"
          >
            <div
              id="editorjs"
              className="editor-content"
              style={{
                minHeight: '400px',
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 justify-center pb-12 border-t pt-8">
          <button
            onClick={() => navigate('/vintage?tab=blog')}
            className="px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition font-medium text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.title.trim()}
            className="px-8 py-3 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving || !formData.title.trim()}
            className="btn-dark disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
