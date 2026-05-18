import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Heart, MessageCircle, Share2, AlertCircle } from 'lucide-react';
import blogService from '../../services/mernBlogService';
import { supabase } from '../../lib/supabase';

interface Blog {
  blog_id: string;
  title: string;
  des: string;
  banner: string;
  content: any[];
  tags: string[];
  total_likes: number;
  total_comments: number;
  total_reads: number;
  published_at: string;
  blog_authors?: {
    id: string;
    username: string;
    fullname: string;
    profile_img: string;
    bio: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export const BlogDetail: React.FC = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Fetch blog and comments
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

        // Fetch comments
        const commentsData = await blogService.getBlogComments(blogId);
        setComments(commentsData || []);
      } catch (err) {
        setError('Failed to load blog');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleLike = async () => {
    if (!userId || !blog) return;

    try {
      setLiked(!liked);
      await blogService.toggleBlogLike(blog.blog_id, userId, !liked);
    } catch (err) {
      setLiked(liked);
      console.error('Failed to toggle like:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !userId || !blog) return;

    try {
      setAddingComment(true);
      const comment = await blogService.addComment(
        blog.blog_id,
        { content: newComment },
        userId
      );

      if (comment) {
        setComments([...comments, comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-amber-700 animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to blogs
          </button>
          <div className="bg-white rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-700">{error || 'Blog not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to blogs
        </button>
      </div>

      {/* Banner */}
      {blog.banner && (
        <div className="h-96 bg-gray-300 overflow-hidden">
          <img
            src={blog.banner}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md p-8 mb-8">
          {/* Title and Meta */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{blog.des}</p>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {blog.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          {blog.blog_authors && (
            <div className="py-6 border-y border-gray-200 mb-8">
              <div className="flex items-center gap-4">
                <img
                  src={blog.blog_authors.profile_img}
                  alt={blog.blog_authors.username}
                  className="w-16 h-16 rounded-full bg-gray-300"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {blog.blog_authors.fullname}
                  </h3>
                  <p className="text-gray-600 text-sm">@{blog.blog_authors.username}</p>
                  {blog.blog_authors.bio && (
                    <p className="text-gray-700 mt-2">{blog.blog_authors.bio}</p>
                  )}
                  {/* Social Links */}
                  <div className="flex gap-2 mt-3">
                    {blog.blog_authors.twitter && (
                      <a
                        href={`https://twitter.com/${blog.blog_authors.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Twitter
                      </a>
                    )}
                    {blog.blog_authors.instagram && (
                      <a
                        href={`https://instagram.com/${blog.blog_authors.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-700 text-sm"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-sm max-w-none mb-8">
            {/* Content rendering - placeholder for EditorJS content */}
            {blog.content && blog.content.length > 0 ? (
              <div className="bg-gray-50 p-6 rounded border border-gray-200">
                <p className="text-gray-600">
                  Full content rendering with EditorJS coming soon
                </p>
                <pre className="mt-4 text-xs overflow-auto">
                  {JSON.stringify(blog.content, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-600">No content yet</p>
            )}
          </div>

          {/* Engagement Actions */}
          <div className="flex gap-4 py-6 border-y border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                liked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              {blog.total_likes} Likes
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
              <MessageCircle className="w-5 h-5" />
              {blog.total_comments} Comments
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 text-sm text-gray-600">
            <span>📖 {blog.total_reads} reads</span>
            <span>❤️ {blog.total_likes} likes</span>
            <span>💬 {blog.total_comments} comments</span>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

          {/* Add Comment */}
          {userId && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700 resize-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || addingComment}
                className="mt-3 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition disabled:opacity-50"
              >
                {addingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.comment_id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <img
                    src={comment.author?.profile_img}
                    alt={comment.author?.username}
                    className="w-10 h-10 rounded-full bg-gray-300"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {comment.author?.username}
                    </p>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
