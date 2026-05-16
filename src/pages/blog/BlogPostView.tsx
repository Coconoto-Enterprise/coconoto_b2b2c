import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { getPostBySlug, BlogPost } from '../../services/blogService';
import { EditorRenderer } from '../../components/blog/EditorRenderer';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const BlogPostView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPostBySlug(slug);
      
      if (!data) {
        setError('Blog post not found');
        return;
      }

      if (!data.published) {
        setError('This post is not published yet');
        return;
      }

      setPost(data);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadTime = (blocks?: any[]): number => {
    if (!blocks) return 0;
    const wordsPerMinute = 200;
    let wordCount = 0;
    
    blocks.forEach(block => {
      if (block.type === 'paragraph' && block.data?.text) {
        wordCount += block.data.text.split(/\s+/).length;
      } else if (block.type === 'header' && block.data?.text) {
        wordCount += block.data.text.split(/\s+/).length;
      } else if (block.type === 'list' && block.data?.items) {
        block.data.items.forEach((item: string) => {
          wordCount += item.split(/\s+/).length;
        });
      }
    });
    
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {error || 'Post not found'}
            </h2>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Cover Image */}
        <div className="relative">
          {post.cover_image && (
            <div className="h-96 overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}
          
          {/* Back Button */}
          <div className="absolute top-8 left-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Blog</span>
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 border-t border-b border-gray-200 py-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{post.author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(post.created_at)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{estimateReadTime(post.content_blocks?.blocks)} min read</span>
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mt-6 leading-relaxed italic">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Article Body */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
            <EditorRenderer data={post.content_blocks} />
          </div>

          {/* Share/Back Section */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
            <div className="flex items-center justify-between">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to all articles
              </Link>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
};
