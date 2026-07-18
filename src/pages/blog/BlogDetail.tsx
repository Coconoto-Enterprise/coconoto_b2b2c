import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Heart, MessageCircle, Share2, AlertCircle } from 'lucide-react';
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
                  src={blog.blog_authors.profile_img || blogLogo}
                  alt={blog.blog_authors.username}
                  className="w-16 h-16 rounded-full bg-gray-300 border-2 border-black"
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
            {/* Render EditorJS content blocks */}
            {blog.content && blog.content.length > 0 ? (
              <div className="editor-content space-y-4">
                {blog.content.map((block: any, index: number) => (
                  <div key={index}>
                    {/* Header Block */}
                    {block.type === 'header' && (
                      <div
                        className={`ce-header ce-header--h${block.data.level || 2}`}
                        style={{
                          fontSize: block.data.level === 1 ? '2em' : 
                                   block.data.level === 2 ? '1.5em' :
                                   block.data.level === 3 ? '1.25em' : '1em',
                          fontWeight: 600,
                          marginTop: index > 0 ? '1.5rem' : '0',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {block.data.text}
                      </div>
                    )}

                    {/* Paragraph Block */}
                    {block.type === 'paragraph' && (
                      <p className="ce-paragraph text-gray-700 leading-relaxed">
                        {block.data.text}
                      </p>
                    )}

                    {/* List Block */}
                    {block.type === 'list' && (
                      <div
                        className={`ce-list ml-6 my-4 ${
                          block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'
                        }`}
                        style={{ listStyleType: block.data.style === 'ordered' ? 'decimal' : 'disc' }}
                      >
                        {block.data.items.map((item: any, idx: number) => (
                          <li key={idx} className="text-gray-700 mb-2">
                            {typeof item === 'string' ? item : item.content || ''}
                          </li>
                        ))}
                      </div>
                    )}

                    {/* Quote Block */}
                    {block.type === 'quote' && (
                      <blockquote
                        className="ce-quote border-l-4 border-amber-500 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded"
                        style={{
                          borderLeftColor: '#d4af37',
                          paddingLeft: '1rem',
                          margin: '1rem 0',
                          fontStyle: 'italic',
                          color: '#6b7280'
                        }}
                      >
                        <p>{block.data.text}</p>
                        {block.data.caption && (
                          <footer className="text-sm mt-2 not-italic text-gray-500">
                            — {block.data.caption}
                          </footer>
                        )}
                      </blockquote>
                    )}

                    {/* Code Block */}
                    {block.type === 'code' && (
                      <pre className="ce-code bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto my-4">
                        <code>{block.data.code}</code>
                      </pre>
                    )}

                    {/* Image Block */}
                    {block.type === 'image' && (
                      <figure className="ce-image my-6">
                        <img
                          src={block.data.url}
                          alt={block.data.caption || 'Blog image'}
                          className="w-full rounded"
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '0.375rem'
                          }}
                        />
                        {block.data.caption && (
                          <figcaption className="ce-image__caption text-sm text-gray-500 mt-2 italic">
                            {block.data.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {/* Marker/Highlight Block */}
                    {block.type === 'marker' && (
                      <div className="ce-marker bg-yellow-100 p-2 rounded my-2">
                        <mark style={{ backgroundColor: '#fef3c7' }}>
                          {block.data.text}
                        </mark>
                      </div>
                    )}

                    {/* Inline Code */}
                    {block.type === 'inlineCode' && (
                      <code className="ce-inline-code bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                        {block.data.code}
                      </code>
                    )}

                    {/* Embed Block */}
                    {block.type === 'embed' && (
                      <div className="ce-embed my-6 rounded overflow-hidden">
                        <iframe
                          width="100%"
                          height="400"
                          src={block.data.embed}
                          title={block.data.caption || 'Embedded content'}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full rounded"
                        />
                        {block.data.caption && (
                          <p className="text-sm text-gray-500 mt-2 italic">{block.data.caption}</p>
                        )}
                      </div>
                    )}

                    {/* Link Tool Block */}
                    {block.type === 'linkTool' && (
                      <a
                        href={block.data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block ce-link-tool border border-gray-300 rounded p-4 my-4 hover:shadow-md transition"
                      >
                        {block.data.meta?.image && (
                          <img
                            src={block.data.meta.image[0]}
                            alt={block.data.meta?.title}
                            className="w-full h-40 object-cover rounded mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-gray-900">
                          {block.data.meta?.title || 'Link'}
                        </h4>
                        {block.data.meta?.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {block.data.meta.description}
                          </p>
                        )}
                        <p className="text-xs text-blue-600 mt-2 break-all">
                          {block.data.link}
                        </p>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No content yet</p>
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
    </>
  );
};

export default BlogDetail;
