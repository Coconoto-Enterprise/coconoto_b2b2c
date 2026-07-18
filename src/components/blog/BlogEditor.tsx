import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Upload, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
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
import { supabase } from '../../lib/supabase';
import blogService from '../../services/mernBlogService';
import './EditorComponent.css';

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
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    des: '',
    banner: '',
    tags: ''
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileName = `${userId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

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
        autofocus: true,
        placeholder: 'Start writing your story...',
        data: blog.content_blocks || { blocks: [] },
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a heading',
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2
            }
          },
          paragraph: {
            class: Paragraph,
            config: {
              placeholder: 'Tell your story...'
            }
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
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author'
            }
          },
          code: {
            class: Code,
            config: {
              placeholder: 'Paste your code here...'
            }
          },
          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M'
          },
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+C'
          },
          image: {
            class: ImageTool,
            config: {
              types: 'image/*',
              captionPlaceholder: 'Image caption',
              uploader: {
                uploadByFile: async (file: File) => {
                  try {
                    const url = await uploadImageToStorage(file);
                    return { success: 1, file: { url } };
                  } catch (err) {
                    console.error('Image upload failed:', err);
                    return { success: 0 };
                  }
                },
                uploadByUrl: async (url: string) => ({ success: 1, file: { url } })
              }
            }
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                instagram: true,
                twitter: true,
                codepen: true
              }
            }
          }
        },
        onChange: () => {
          setIsDirty(true);
        }
      });
    };

    initEditor();

    return () => {
      if (editorRef.current?.destroy) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
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

  // Auto-resize title textarea (also on first load with a prefilled title)
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = Math.max(titleRef.current.scrollHeight, 60) + 'px';
    }
  }, [formData.title, loading]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Ctrl/Cmd+S saves a draft
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleUploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !blog) return;

    try {
      setBannerUploading(true);
      const publicUrl = await uploadImageToStorage(file);
      setFormData({ ...formData, banner: publicUrl });
      setIsDirty(true);
    } catch (err) {
      showToast('error', 'Failed to upload banner');
      console.error(err);
    } finally {
      setBannerUploading(false);
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
      setIsDirty(false);
      showToast('success', 'Draft saved');
    } catch (err) {
      showToast('error', 'Failed to save blog');
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
      setIsDirty(false);
      showToast('success', 'Blog published!');
      setTimeout(() => navigate('/vintage-dashboard?tab=blog'), 1200);
    } catch (err) {
      showToast('error', 'Failed to publish blog');
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
            onClick={() => navigate('/vintage-dashboard?tab=blog')}
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
              onClick={() => navigate('/vintage-dashboard?tab=blog')}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Back to blogs"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div>
              <h1 className="text-2xl font-gelasio font-bold text-gray-900">
                {blog.is_draft ? '📝 Draft' : '✅ Published'}
              </h1>
              <p className={`text-xs mt-0.5 ${isDirty ? 'text-amber-600' : 'text-gray-400'}`}>
                {isDirty ? '● Unsaved changes' : 'All changes saved'}
              </p>
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
            ref={titleRef}
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setIsDirty(true);
            }}
            placeholder="Blog title"
            className="w-full text-5xl font-gelasio font-bold text-gray-900 placeholder:text-gray-300 resize-none border-0 p-0 focus:outline-none"
            rows={1}
            style={{ minHeight: '60px', overflow: 'hidden' }}
          />
        </div>

        {/* Description */}
        <div className="mb-12">
          <textarea
            value={formData.des}
            onChange={(e) => {
              setFormData({ ...formData, des: e.target.value.slice(0, 200) });
              setIsDirty(true);
            }}
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
              {bannerUploading && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <Loader className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <button
                onClick={() => bannerInputRef.current?.click()}
                disabled={bannerUploading}
                className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition font-medium disabled:opacity-50"
              >
                {bannerUploading ? 'Uploading...' : 'Change'}
              </button>
            </div>
          ) : (
            <div
              onClick={() => !bannerUploading && bannerInputRef.current?.click()}
              className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-green-400 transition"
            >
              <div className="text-center">
                {bannerUploading ? (
                  <>
                    <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Uploading banner...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Click to upload blog banner</p>
                    <p className="text-sm text-gray-500">Recommended: 16:9 aspect ratio</p>
                  </>
                )}
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
            onChange={(e) => {
              setFormData({ ...formData, tags: e.target.value });
              setIsDirty(true);
            }}
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
            className="border border-gray-300 rounded-lg overflow-visible bg-white shadow-sm"
            style={{
              position: 'relative',
              zIndex: 1
            }}
          >
            <div
              id="editorjs"
              className="editor-content"
              style={{
                minHeight: '500px',
                padding: '1.5rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 justify-center pb-12 border-t pt-8">
          <button
            onClick={() => navigate('/vintage-dashboard?tab=blog')}
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

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-xl px-5 py-3 shadow-lg text-white font-medium ${
            toast.type === 'success' ? 'bg-green-700' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
