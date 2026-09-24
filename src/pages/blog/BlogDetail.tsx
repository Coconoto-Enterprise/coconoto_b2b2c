import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ArrowLeft, Loader, Heart, MessageCircle, Share2, AlertCircle, Calendar, Eye, Copy, Check, X } from 'lucide-react';
import blogService from '../../services/mernBlogService';
import { buildBlogUrlSlug, matchesBlogUrlParam } from '../../services/blogUrlUtils.js';
import { supabase } from '../../lib/supabase';
import blogLogo from '../../assets/blog-logo.png';
import Navbar from '../../components/Navbar';

// EditorJS-authored blocks get rendered verbatim via dangerouslySetInnerHTML.
// Without sanitization, an XSS payload in any block (`<img src=x onerror=…>`)
// would execute on every visitor's browser. DOMPurify with a strict profile
// strips those before they reach the DOM but keeps the common HTML the editor
// (bold, links, lists, etc.) actually emits.
const sanitizeInline = (value: any) => {
  if (typeof window === 'undefined' || !value) return '';
  const sanitized = DOMPurify.sanitize(String(value), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
  });
  return typeof sanitized === 'string' ? sanitized : '';
};

// EditorJS `embed` blocks accept arbitrary URLs, including javascript: and
// data: schemes that would let a blog author pivot from iframe XSS to plain
// DOM XSS. Allowlist the legitimate embed providers and force https.
const ALLOWED_EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
  'player.vimeo.com',
  'vimeo.com',
  'codepen.io',
  'codesandbox.io',
]);

const sanitizeEmbedUrl = (raw: any) => {
  if (!raw || typeof raw !== 'string') return '';
  let parsed;
  try {
    parsed = new URL(raw, 'https://coconoto.africa');
  } catch {
    return '';
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return '';
  if (!ALLOWED_EMBED_HOSTS.has(parsed.hostname)) return '';
  return parsed.toString();
};

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
  const { blogParam } = useParams();
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
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [guestSession, setGuestSession] = useState<{ name: string; email: string; liked: boolean } | null>(null);
  const [interactionMode, setInteractionMode] = useState<'like' | 'comment' | null>(null);
  const [interactionError, setInteractionError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
    if (!blogParam) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogByUrlParam(blogParam);
        if (!data) {
          setError('Blog not found');
          return;
        }

        setBlog(data);

        // Fetch other published posts for the sidebar (read-only, no DB writes)
        const allPosts = await blogService.getPublishedBlogs();
        setOtherPosts((allPosts || []).filter((p: any) => !matchesBlogUrlParam(p, blogParam)).slice(0, 6));

        // Fetch comments
        const commentsData = await blogService.getBlogComments(data.blog_id);
        setComments(commentsData || []);
        const guestCounts = await blogService.getGuestBlogCounts(data.blog_id);
        setBlog((current) => current ? {
          ...current,
          total_likes: Math.max(current.total_likes || 0, guestCounts.likes),
          total_comments: (current.total_comments || 0) + guestCounts.comments,
        } : current);
      } catch (err) {
        setError('Failed to load blog');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogParam]);

  useEffect(() => {
    if (!blog) return;

    const key = `coconoto-blog-session:${blog.blog_id}`;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved && saved.expiresAt > Date.now()) {
        setGuestSession(saved);
        setGuestName(saved.name);
        setGuestEmail(saved.email);
        setLiked(Boolean(saved.liked));
      } else {
        localStorage.removeItem(key);
      }
    } catch {
      localStorage.removeItem(key);
    }
  }, [blog]);

  useEffect(() => {
    if (!blog || !userId) return;

    blogService.getBlogLikeStatus(blog.blog_id, userId)
      .then(setLiked)
      .catch((err) => console.error('Failed to load like status:', err));
  }, [blog, userId]);

  // Set per-post SEO/social meta tags once the blog loads. Read-only: this
  // only touches the document head, never the database. Tags are restored to
  // the site defaults on unmount so other pages aren't affected.
  useEffect(() => {
    if (!blog) return;

    const SITE_URL = 'https://www.coconoto.africa';
    const pageUrl = `${SITE_URL}/blog/${buildBlogUrlSlug(blog)}`;
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
    if (!blog) return;

    if (!userId && !guestSession) {
      setInteractionMode('like');
      setInteractionError('');
      return;
    }

    try {
      const nextLiked = !liked;
      if (userId) {
        await blogService.toggleBlogLike(blog.blog_id, userId, nextLiked);
      } else if (guestSession) {
        const result = await blogService.saveGuestBlogInteraction(blog.blog_id, {
          ...guestSession,
          liked: nextLiked,
        });
        setBlog((current) => current ? {
          ...current,
          total_likes: current.total_likes + (nextLiked === guestSession.liked ? 0 : nextLiked ? 1 : -1),
        } : current);
        const nextSession = { ...guestSession, liked: nextLiked };
        setGuestSession(nextSession);
        localStorage.setItem(`coconoto-blog-session:${blog.blog_id}`, JSON.stringify({ ...nextSession, expiresAt: Date.now() + 15 * 60 * 1000 }));
      }
      setLiked(nextLiked);
      if (userId) setBlog((current) => current ? { ...current, total_likes: Math.max(0, current.total_likes + (nextLiked ? 1 : -1)) } : current);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      setInteractionError('We could not save your like. Please try again.');
    }
  };

  const saveGuestInteraction = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!blog || !guestName.trim() || !guestEmail.trim() || (interactionMode === 'comment' && !newComment.trim())) return;

    try {
      setAddingComment(true);
      setInteractionError('');
      const result = await blogService.saveGuestBlogInteraction(blog.blog_id, {
        name: guestName,
        email: guestEmail,
        liked: interactionMode === 'like',
        comment: interactionMode === 'comment' ? newComment : '',
        wants_newsletter: wantsNewsletter,
      });
      const nextSession = { name: result.interaction.name, email: result.interaction.email, liked: result.interaction.liked };
      setGuestSession(nextSession);
      setLiked(nextSession.liked);
      localStorage.setItem(`coconoto-blog-session:${blog.blog_id}`, JSON.stringify({ ...nextSession, expiresAt: Date.now() + 15 * 60 * 1000 }));
      setBlog((current) => current ? {
        ...current,
        total_likes: current.total_likes + (interactionMode === 'like' ? 1 : 0),
        total_comments: current.total_comments + (interactionMode === 'comment' ? 1 : 0),
      } : current);
      if (interactionMode === 'comment' && result.interaction.comment) {
        setComments((current) => [...current, {
          comment_id: `guest-${result.interaction.id}`,
          content: result.interaction.comment,
          created_at: result.interaction.created_at,
          author: { username: result.interaction.name, profile_img: '' },
        }]);
        setNewComment('');
      }
      setInteractionMode(null);
    } catch (err) {
      console.error('Failed to save guest interaction:', err);
      setInteractionError('We could not save this yet. Please check your details and try again.');
    } finally {
      setAddingComment(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !blog) return;
    if (!userId) {
      setInteractionMode('comment');
      setInteractionError('');
      return;
    }

    try {
      setAddingComment(true);
      const comment = await blogService.addComment(
        blog.blog_id,
        { content: newComment },
        userId
      );

      if (comment) {
        setComments((current) => [...current, comment]);
        setBlog((current) => current ? {
          ...current,
          total_comments: current.total_comments + 1
        } : current);
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
                    const safeHeaderHtml = sanitizeInline(block.data.text);
                    return (
                      <Tag key={index} className={`font-bold text-gray-900 mt-6 mb-2 ${sizes[level] || 'text-2xl'}`}
                        dangerouslySetInnerHTML={{ __html: safeHeaderHtml }} />
                    );
                  }
                  case 'paragraph':
                    return (
                      <p key={index} className="text-gray-700 leading-relaxed text-base sm:text-lg"
                        dangerouslySetInnerHTML={{ __html: sanitizeInline(block.data.text) }} />
                    );
                  case 'list':
                    return block.data.style === 'ordered' ? (
                      <ol key={index} className="list-decimal ml-6 space-y-1 text-gray-700">
                        {block.data.items.map((item: any, i: number) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeInline(typeof item === 'string' ? item : item.content || '') }} />
                        ))}
                      </ol>
                    ) : (
                      <ul key={index} className="list-disc ml-6 space-y-1 text-gray-700">
                        {block.data.items.map((item: any, i: number) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeInline(typeof item === 'string' ? item : item.content || '') }} />
                        ))}
                      </ul>
                    );
                  case 'quote':
                    return (
                      <blockquote key={index} className="border-l-4 border-amber-400 pl-5 py-1 my-4 italic text-gray-600 bg-amber-50 rounded-r-lg">
                        <p dangerouslySetInnerHTML={{ __html: sanitizeInline(block.data.text) }} />
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
                  case 'embed': {
                    const safeEmbedUrl = sanitizeEmbedUrl(block.data.embed);
                    if (!safeEmbedUrl) return null;
                    return (
                      <div key={index} className="my-6 aspect-video rounded-xl overflow-hidden shadow">
                        <iframe
                          src={safeEmbedUrl}
                          width="100%"
                          height="100%"
                          title={block.data.caption || 'Embedded'}
                          frameBorder="0"
                          allowFullScreen
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    );
                  }
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
              <button onClick={() => document.getElementById('blog-comments')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium">
                <MessageCircle className="w-4 h-4" />
                {blog.total_comments} Comments
              </button>
              <button
                onClick={() => setShareOpen((open) => !open)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {shareOpen && (
              <div className="relative -mt-2 mb-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <button onClick={() => setShareOpen(false)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-700" aria-label="Close share options">
                  <X className="w-4 h-4" />
                </button>
                <p className="font-semibold text-gray-900 text-sm mb-3">Share this post</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer')} className="px-3 py-2 rounded-lg bg-[#1877f2] text-white text-xs font-semibold">Facebook</button>
                  <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank', 'noopener,noreferrer')} className="px-3 py-2 rounded-lg bg-black text-white text-xs font-semibold">X / Twitter</button>
                  <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer')} className="px-3 py-2 rounded-lg bg-[#0a66c2] text-white text-xs font-semibold">LinkedIn</button>
                  <button onClick={async () => { await navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); }} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                </div>
              </div>
            )}

            {/* Comments */}
            <div id="blog-comments" className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Comments ({comments.length})</h2>
              {(userId || guestSession) && (
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
              {!userId && !guestSession && interactionMode === null && (
                <p className="mb-4 text-sm text-gray-500">Add your name and email once to like or comment on this post.</p>
              )}
              {interactionMode && (
                <form onSubmit={saveGuestInteraction} className="mb-6 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{interactionMode === 'like' ? 'Like this post' : 'Join the conversation'}</p>
                      <p className="text-xs text-gray-600 mt-1">Your details stay attached to this post for 15 minutes.</p>
                    </div>
                    <button type="button" onClick={() => setInteractionMode(null)} aria-label="Close form"><X className="w-4 h-4 text-gray-500" /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input required value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
                    <input required type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="Email address" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                  {interactionMode === 'comment' && <textarea required value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." rows={3} className="mt-3 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white resize-none" />}
                  <label className="mt-3 flex items-center gap-2 text-xs text-gray-600"><input type="checkbox" checked={wantsNewsletter} onChange={(e) => setWantsNewsletter(e.target.checked)} className="accent-amber-700" /> Add me to the Coconoto newsletter</label>
                  {interactionError && <p className="mt-3 text-sm text-red-700">{interactionError}</p>}
                  <button type="submit" disabled={addingComment} className="mt-4 px-5 py-2 rounded-lg bg-amber-700 text-white text-sm font-semibold disabled:opacity-50">{addingComment ? 'Saving...' : interactionMode === 'like' ? 'Like post' : 'Post comment'}</button>
                </form>
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
                  onClick={() => navigate(`/blog/${buildBlogUrlSlug(post)}`)}
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
