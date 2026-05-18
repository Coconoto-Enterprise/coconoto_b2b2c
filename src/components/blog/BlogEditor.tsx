import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Loader, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import blogService from '../../services/mernBlogService';

interface Blog {
  blog_id: string;
  title: string;
  des: string;
  banner: string;
  content: any[];
  tags: string[];
  is_draft: boolean;
  published: boolean;
}

export const BlogEditor: React.FC = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    des: '',
    banner: '',
    tags: ''
  });

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Fetch blog data
  useEffect(() => {
    if (!blogId || !userId) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogById(blogId);
        if (!data) {
          setError('Blog not found');
          return;
        }
        
        if (data.author_id !== userId) {
          setError('Unauthorized');
          navigate('/vintage');
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
  }, [blogId, userId]);

  const handleUploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId || !blog) return;

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
    if (!blog || !userId) return;

    try {
      setSaving(true);
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      await blogService.updateBlog(blog.blog_id, {
        title: formData.title,
        des: formData.des,
        banner: formData.banner,
        tags,
        content: blog.content,
        content_blocks: { time: Date.now(), blocks: blog.content }
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
    if (!blog || !userId) return;

    try {
      setSaving(true);
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      await blogService.updateBlog(blog.blog_id, {
        title: formData.title,
        des: formData.des,
        banner: formData.banner,
        tags,
        content: blog.content,
        content_blocks: { time: Date.now(), blocks: blog.content },
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

        {/* Note: Content editing would require EditorJS integration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📝 Full content editor with EditorJS coming soon. For now, you can save this blog with title, description, banner, and tags.
          </p>
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
    </div>
  );
};

export default BlogEditor;
