import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader,
  Upload,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  X as XIcon,
  Image as ImageIcon,
  Save,
  Send,
  Sparkles,
  Keyboard,
  FileText,
  Tag as TagIcon,
} from 'lucide-react';
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

const countWords = (s: string) => {
  const trimmed = s.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

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
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tagChips, setTagChips] = useState<string[]>([]);

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
            class: Paragraph as any,
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
        const initialTags = data.tags || [];
        setFormData({
          title: data.title,
          des: data.des,
          banner: data.banner,
          tags: initialTags.join(', ')
        });
        setTagChips(initialTags);
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
      const tags = tagChips.length > 0 ? tagChips : formData.tags.split(',').map(t => t.trim()).filter(t => t);

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
      setLastSavedAt(new Date());
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
      const tags = tagChips.length > 0 ? tagChips : formData.tags.split(',').map(t => t.trim()).filter(t => t);

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
      setLastSavedAt(new Date());
      showToast('success', 'Blog published!');
      setTimeout(() => navigate('/vintage-dashboard?tab=blog'), 1200);
    } catch (err) {
      showToast('error', 'Failed to publish blog');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const removeTag = (idx: number) => {
    setTagChips(prev => {
      const next = prev.filter((_, i) => i !== idx);
      setFormData(f => ({ ...f, tags: next.join(', ') }));
      return next;
    });
    setIsDirty(true);
  };

  const handleTagsChange = (value: string) => {
    setFormData(prev => ({ ...prev, tags: value }));
    const parts = value.split(',').map(t => t.trim()).filter(t => t);
    setTagChips(parts);
    setIsDirty(true);
  };

  const formattedSavedTime = lastSavedAt
    ? lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      {/* Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/vintage-dashboard?tab=blog')}
              className="p-2 hover:bg-gray-100 rounded-xl transition"
              title="Back to blogs"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    blog.is_draft
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {blog.is_draft ? (
                    <>
                      <FileText className="h-3 w-3" />
                      Draft
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Published
                    </>
                  )}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                    isDirty ? 'text-amber-600' : 'text-gray-400'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isDirty ? 'bg-amber-500' : 'bg-gray-300'}`} />
                  {isDirty
                    ? 'Unsaved changes'
                    : formattedSavedTime
                      ? `Saved at ${formattedSavedTime}`
                      : 'All changes saved'}
                </span>
              </div>
              <h1 className="text-base font-semibold text-gray-900 tracking-tight mt-0.5">
                Blog Editor
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !formData.title.trim()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 border border-gray-200 bg-white rounded-full hover:bg-gray-50 transition disabled:opacity-50 font-medium shadow-sm"
              title="Save draft (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving || !formData.title.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full font-semibold disabled:opacity-50 transition shadow-sm hover:shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <p className="text-red-800 font-medium text-sm">{error}</p>
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
            className="w-full text-4xl sm:text-5xl font-gelasio font-bold text-gray-900 placeholder:text-gray-300 resize-none border-0 p-0 focus:outline-none leading-tight"
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
            className="w-full text-lg sm:text-xl text-gray-700 placeholder:text-gray-400 resize-none border-0 p-0 focus:outline-none leading-relaxed"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2 text-xs">
            <p className="text-gray-500">
              <span className="font-medium text-gray-700">{countWords(formData.des)}</span> words · <span className="font-medium text-gray-700">{formData.des.length}</span>/200
            </p>
          </div>
        </div>

        {/* Banner */}
        <div className="mb-12">
          {formData.banner ? (
            <div className="relative mb-6 group">
              <img
                src={formData.banner}
                alt="Blog banner"
                className="w-full h-72 sm:h-96 object-cover rounded-2xl shadow-lg"
              />
              {bannerUploading && (
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                  <Loader className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <button
                onClick={() => bannerInputRef.current?.click()}
                disabled={bannerUploading}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur text-gray-900 px-4 py-2 rounded-xl shadow-lg hover:bg-white transition font-medium disabled:opacity-50 inline-flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {bannerUploading ? 'Uploading...' : 'Change'}
              </button>
            </div>
          ) : (
            <div
              onClick={() => !bannerUploading && bannerInputRef.current?.click()}
              className="w-full h-56 sm:h-72 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-dashed border-emerald-200/80 flex items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition group"
            >
              <div className="text-center px-6">
                {bannerUploading ? (
                  <>
                    <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Uploading banner...</p>
                  </>
                ) : (
                  <>
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-emerald-100 shadow-sm group-hover:scale-105 transition mb-3">
                      <Upload className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-gray-800 font-medium">Click to upload blog banner</p>
                    <p className="text-sm text-gray-500 mt-1">Recommended: 16:9 aspect ratio</p>
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
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <TagIcon className="h-4 w-4" />
            Tags
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="Enter tags separated by commas (e.g., coconut, agriculture, business)"
            className="input-box"
          />
          {tagChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tagChips.map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="tag group inline-flex items-center gap-1.5"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    className="opacity-60 group-hover:opacity-100 hover:text-red-600 transition"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-gelasio font-bold text-gray-900 tracking-tight">
              Story
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              <Keyboard className="h-3 w-3" />
              Ctrl+S to save
            </span>
          </div>
          <div
            ref={editorContainerRef}
            className="border border-gray-200 rounded-2xl overflow-visible bg-white shadow-sm hover:shadow-md transition px-4 sm:px-8 py-6 sm:py-8"
            style={{
              position: 'relative',
              zIndex: 1
            }}
          >
            <div
              id="editorjs"
              className="editor-content"
              style={{ outline: 'none' }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap gap-3 justify-center sm:justify-end pb-12 border-t border-gray-100 pt-8">
          <button
            onClick={() => navigate('/vintage-dashboard?tab=blog')}
            className="px-6 py-2.5 border border-gray-200 rounded-full hover:bg-gray-50 transition font-medium text-gray-700 text-sm shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.title.trim()}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50 inline-flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving || !formData.title.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full font-semibold text-sm transition shadow-sm hover:shadow-md disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-2xl px-5 py-3 shadow-xl text-white font-medium ${
            toast.type === 'success' ? 'bg-emerald-700' : 'bg-red-600'
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
