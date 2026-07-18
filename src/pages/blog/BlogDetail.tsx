import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Heart, MessageCircle, Share2, AlertCircle, Calendar, Eye } from 'lucide-react';
import blogService from '../../services/mernBlogService';
import { supabase } from '../../lib/supabase';
import blogLogo from '../../assets/blog-logo.png';
import Navbar from '../../components/Navbar';

interface Blog {
  blog_id: string;
  title: string;
  des: string;
  banner: string;
  content: any[];
  content_blocks?: any;
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
  const [otherPosts, setOtherPosts] = useState<Blog[]>([]);
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

        // Fetch other published posts for the sidebar (read-only, no DB writes)
        const allPosts = await blogService.getPublishedBlogs();
        setOtherPosts((allPosts || []).filter((p: any) => p.blog_id !== blogId).slice(0, 6));

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

  // Set per-post SEO/social meta tags once the blog loads. Read-only: this
  // only touches the document head, never the database. Tags are restored to
  // the site defaults on unmount so other pages aren't affected.
  useEffect(() => {
    if (!blog) return;

    const SITE_URL = 'https://www.coconoto.africa';
    const pageUrl = `${SITE_URL}/blog/${blog.blog_id}`;
    const description = (blog.des || blog.title || '').slice(0, 160);
    const image = blog.banner || `${SITE_URL}/Icon_green.png`;

    const prevTitle = document.title;
    document.title = `${blog.title} | Coconoto Africa`;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      const created = !el;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        el.setAttribute('data-blog-meta', 'true');
        document.head.appendChild(el);
      }
      const previous = el.getAttribute('content');
      el.setAttribute('content', content);
      return { el, created, previous };
    };

    const setCanonical = (href: string) => {
      let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      const created = !el;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
      }
      const previous = el.getAttribute('href');
      el.setAttribute('href', href);
      return { el, created, previous };
    };

    const managed = [
      setMeta('meta[name="description"]', 'name', 'description', description),
      setMeta('meta[property="og:type"]', 'property', 'og:type', 'article'),
      setMeta('meta[property="og:title"]', 'property', 'og:title', blog.title),
      setMeta('meta[property="og:description"]', 'property', 'og:description', description),
      setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl),
      setMeta('meta[property="og:image"]', 'property', 'og:image', image),
      setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image'),
      setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', blog.title),
      setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description),
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image),
    ];
    const canonical = setCanonical(pageUrl);

    return () => {
      document.title = prevTitle;
      for (const m of managed) {
        if (m.created) m.el.remove();
        else if (m.previous !== null) m.el.setAttribute('content', m.previous);
      }
      if (canonical.created) canonical.el.remove();
      else if (canonical.previous !== null) canonical.el.setAttribute('href', canonical.previous);
    };
  }, [blog]);

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
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <Loader className="w-8 h-8 text-amber-700 animate-spin" />
      </div>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16">
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
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Back nav */}
        <div className="max-w-7xl mx-auto px-4 py-6">
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
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className="h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md">
              <img src={blog.banner} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Two-column layout */}
        <div className="max-w-7xl mx-auto px-4 pb-12 flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Main article ── */}
          <article className="flex-1 min-w-0 bg-white rounded-2xl shadow-md p-6 sm:p-10">
            {/* Title & meta */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">{blog.title}</h1>
            {blog.des && <p className="text-lg text-gray-500 mb-5 leading-relaxed">{blog.des}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
              {blog.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.published_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.total_reads} reads
              </span>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6">
                {blog.tags.map(tag => (
                  <span key={tag} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author */}
            {blog.blog_authors && (
              <div className="py-5 border-y border-gray-100 mb-8 flex items-center gap-4">
                <img
                  src={blog.blog_authors.profile_img || blogLogo}
                  alt={blog.blog_authors.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-200"
                />
                <div>
                  <p className="font-bold text-gray-900">{blog.blog_authors.fullname}</p>
                  <p className="text-sm text-gray-500">@{blog.blog_authors.username}</p>
                  {blog.blog_authors.bio && <p className="text-sm text-gray-600 mt-1">{blog.blog_authors.bio}</p>}
                </div>
              </div>
            )}

            {/* ── Content blocks ── */}
            <div className="blog-post-content space-y-4 mb-10">
              {blog.content && blog.content.length > 0 ? blog.content.map((block: any, index: number) => {
                switch (block.type) {
                  case 'header': {
                    const level = block.data.level || 2;
                    const sizes: Record<number, string> = { 1: 'text-4xl', 2: 'text-3xl', 3: 'text-2xl', 4: 'text-xl', 5: 'text-lg', 6: 'text-base uppercase tracking-wide' };
                    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                    return (
                      <Tag key={index} className={`font-bold text-gray-900 mt-6 mb-2 ${sizes[level] || 'text-2xl'}`}
                        dangerouslySetInnerHTML={{ __html: block.data.text }} />
                    );
                  }
                  case 'paragraph':
                    return (
                      <p key={index} className="text-gray-700 leading-relaxed text-base sm:text-lg"
                        dangerouslySetInnerHTML={{ __html: block.data.text }} />
                    );
                  case 'list':
                    return block.data.style === 'ordered' ? (
                      <ol key={index} className="list-decimal ml-6 space-y-1 text-gray-700">
                        {block.data.items.map((item: any, i: number) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: typeof item === 'string' ? item : item.content || '' }} />
                        ))}
                      </ol>
                    ) : (
                      <ul key={index} className="list-disc ml-6 space-y-1 text-gray-700">
                        {block.data.items.map((item: any, i: number) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: typeof item === 'string' ? item : item.content || '' }} />
                        ))}
                      </ul>
                    );
                  case 'quote':
                    return (
                      <blockquote key={index} className="border-l-4 border-amber-400 pl-5 py-1 my-4 italic text-gray-600 bg-amber-50 rounded-r-lg">
                        <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                        {block.data.caption && <footer className="text-sm mt-2 not-italic text-gray-500">— {block.data.caption}</footer>}
                      </blockquote>
                    );
                  case 'code':
                    return (
                      <pre key={index} className="bg-gray-900 text-green-300 p-5 rounded-xl overflow-x-auto my-4 text-sm font-mono">
                        <code>{block.data.code}</code>
                      </pre>
                    );
                  case 'image':
                    return (
                      <figure key={index} className="my-6">
                        <img src={block.data.file?.url || block.data.url} alt={block.data.caption || ''} className="w-full rounded-xl shadow-md" loading="lazy" />
                        {block.data.caption && <figcaption className="text-sm text-gray-500 text-center mt-2 italic">{block.data.caption}</figcaption>}
                      </figure>
                    );
                  case 'embed':
                    return (
                      <div key={index} className="my-6 aspect-video rounded-xl overflow-hidden shadow">
                        <iframe src={block.data.embed} width="100%" height="100%" title={block.data.caption || 'Embedded'} frameBorder="0" allowFullScreen />
                      </div>
                    );
                  case 'delimiter':
                    return <hr key={index} className="my-8 border-gray-200" />;
                  default:
                    return null;
                }
              }) : <p className="text-gray-500 italic">No content yet.</p>}
            </div>

            {/* Engagement */}
            <div className="flex flex-wrap gap-3 py-5 border-t border-gray-100">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition font-medium text-sm ${liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {blog.total_likes} Likes
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium">
                <MessageCircle className="w-4 h-4" />
                {blog.total_comments} Comments
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Comments */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Comments ({comments.length})</h2>
              {userId && (
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-sm"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || addingComment}
                    className="mt-2 px-5 py-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition disabled:opacity-50 text-sm font-medium"
                  >
                    {addingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              )}
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.comment_id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <img src={comment.author?.profile_img || blogLogo} alt={comment.author?.username} className="w-9 h-9 rounded-full object-cover bg-gray-200 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{comment.author?.username}</p>
                        <p className="text-gray-700 mt-0.5 text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(comment.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* ── Sidebar: other posts ── */}
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">More from Coconoto</h3>
              {otherPosts.length === 0 ? (
                <p className="text-sm text-gray-500">No other posts yet.</p>
              ) : otherPosts.map((post: any) => (
                <button
                  key={post.blog_id}
                  onClick={() => navigate(`/blog/${post.blog_id}`)}
                  className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {post.banner && (
                    <img src={post.banner} alt={post.title} className="w-full h-32 object-cover" loading="lazy" />
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">{post.title}</p>
                    {post.des && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.des}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {post.published_at && <span>{new Date(post.published_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>}
                      <span>📖 {post.total_reads}</span>
                    </div>
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-medium">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}

              {/* Link to all posts */}
              <button
                onClick={() => navigate('/blog')}
                className="w-full py-3 border-2 border-amber-200 text-amber-700 rounded-2xl font-semibold text-sm hover:bg-amber-50 transition"
              >
                View all posts →
              </button>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
};

export default BlogDetail;
