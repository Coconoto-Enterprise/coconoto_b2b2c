import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  BookOpen,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import blogService from '../../services/mernBlogService';

interface Blog {
  id: string;
  blog_id: string;
  title: string;
  banner: string;
  des: string;
  tags: string[];
  author_id: string;
  total_likes: number;
  total_comments: number;
  total_reads: number;
  is_draft: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const MernBlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');
  const [showNewBlogModal, setShowNewBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userId] = useState<string>('admin-user'); // Default to admin since vintage is already protected
  const navigate = useNavigate();

  // Initialize on mount
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        // Fetch all blogs (no auth needed - vintage dashboard is already protected)
        const data = await blogService.getPublishedBlogs();
        setBlogs(data || []);
      } catch (err) {
        setError('Failed to fetch blogs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const handleCreateNewBlog = async () => {
    if (!newBlogTitle.trim()) return;

    try {
      const newBlog = await blogService.createBlog({
        title: newBlogTitle,
        des: '',
        banner: '',
        content: [],
        tags: []
      }, userId);

      setBlogs([newBlog, ...blogs]);
      setNewBlogTitle('');
      setShowNewBlogModal(false);
      
      // Redirect to editor
      navigate(`/blog-editor/${newBlog.blog_id}`);
    } catch (err) {
      setError('Failed to create blog');
      console.error(err);
    }
  };

  const handleDeleteBlog = async () => {
    if (!selectedBlog) return;

    try {
      await blogService.deleteBlog(selectedBlog.blog_id, userId);
      setBlogs(blogs.filter(b => b.blog_id !== selectedBlog.blog_id));
      setShowDeleteModal(false);
      setSelectedBlog(null);
    } catch (err) {
      setError('Failed to delete blog');
      console.error(err);
    }
  };

  const handlePublishBlog = async (blog: Blog) => {
    try {
      const updated = await blogService.publishBlog(blog.blog_id, userId);
      setBlogs(blogs.map(b => b.blog_id === blog.blog_id ? updated : b));
    } catch (err) {
      setError('Failed to publish blog');
      console.error(err);
    }
  };

  const filteredBlogs = activeTab === 'published'
    ? blogs.filter(b => b.published)
    : blogs.filter(b => b.is_draft);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-700" />
          <h2 className="text-2xl font-bold text-amber-900">Blog Management</h2>
        </div>
        <button
          onClick={() => setShowNewBlogModal(true)}
          className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition"
        >
          <Plus className="w-4 h-4" />
          New Blog
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('published')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'published'
              ? 'border-b-2 border-amber-700 text-amber-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Published ({blogs.filter(b => b.published).length})
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'drafts'
              ? 'border-b-2 border-amber-700 text-amber-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Drafts ({blogs.filter(b => b.is_draft).length})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 text-amber-700 animate-spin" />
        </div>
      )}

      {/* Blogs List */}
      {!loading && filteredBlogs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No {activeTab} blogs yet</p>
          <p className="text-gray-500 text-sm">Start creating your first blog post</p>
        </div>
      )}

      {!loading && filteredBlogs.length > 0 && (
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <div key={blog.blog_id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
              <div className="flex gap-4">
                {blog.banner && (
                  <img
                    src={blog.banner}
                    alt={blog.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{blog.title}</h3>
                  {blog.des && <p className="text-sm text-gray-600 mb-2">{blog.des}</p>}
                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    <span>📖 {blog.total_reads} reads</span>
                    <span>❤️ {blog.total_likes} likes</span>
                    <span>💬 {blog.total_comments} comments</span>
                  </div>
                  {blog.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/blog-editor/${blog.blog_id}`)}
                    title="Edit blog"
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  {blog.is_draft && (
                    <button
                      onClick={() => handlePublishBlog(blog)}
                      title="Publish blog"
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedBlog(blog);
                      setShowDeleteModal(true);
                    }}
                    title="Delete blog"
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Blog Modal */}
      {showNewBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Blog</h3>
              <button
                onClick={() => {
                  setShowNewBlogModal(false);
                  setNewBlogTitle('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter blog title..."
              value={newBlogTitle}
              onChange={(e) => setNewBlogTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateNewBlog()}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-700"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowNewBlogModal(false);
                  setNewBlogTitle('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewBlog}
                disabled={!newBlogTitle.trim()}
                className="flex-1 px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Delete Blog?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{selectedBlog.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBlog(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBlog}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MernBlogManagement;
