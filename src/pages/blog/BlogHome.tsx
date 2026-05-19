import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';
import blogService from '../../services/mernBlogService';
import blogLogo from '../../assets/blog-logo.png';
import Navbar from '../../components/Navbar';

interface Blog {
  blog_id: string;
  title: string;
  des: string;
  banner: string;
  tags: string[];
  total_likes: number;
  total_comments: number;
  total_reads: number;
  published_at: string;
  blog_authors?: {
    username: string;
    fullname: string;
    profile_img: string;
  };
}

export const BlogHome: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getPublishedBlogs();
        setBlogs(data || []);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      const data = await blogService.getPublishedBlogs();
      setBlogs(data || []);
      return;
    }

    try {
      const results = await blogService.searchBlogs(query);
      setBlogs(results || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const filteredBlogs = selectedTag
    ? blogs.filter(blog => blog.tags.includes(selectedTag))
    : blogs;

  const allTags = Array.from(new Set(blogs.flatMap(b => b.tags))).slice(0, 10);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Coconoto Blog</h1>
          <p className="text-amber-100">Insights and stories from our community</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full transition ${
                !selectedTag
                  ? 'bg-amber-700 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedTag === tag
                    ? 'bg-amber-700 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-amber-700 animate-spin" />
          </div>
        )}

        {/* No Blogs State */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No blogs found</p>
            <p className="text-gray-500 text-sm">Check back soon for new stories</p>
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map(blog => (
              <article
                key={blog.blog_id}
                onClick={() => navigate(`/blog/${blog.blog_id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
              >
                {blog.banner && (
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img
                      src={blog.banner}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {blog.des}
                  </p>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {blog.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
                      )}
                    </div>
                  )}

                  {/* Author */}
                  {blog.blog_authors && (
                    <div className="flex items-center gap-2 mb-4 py-2 border-t">
                      <img
                        src={blog.blog_authors.profile_img || blogLogo}
                        alt={blog.blog_authors.username}
                        className="w-8 h-8 rounded-full bg-gray-300 border-2 border-black"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {blog.blog_authors.fullname}
                        </p>
                        <p className="text-xs text-gray-500">@{blog.blog_authors.username}</p>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-gray-500 pt-3 border-t">
                    <span>📖 {blog.total_reads}</span>
                    <span>❤️ {blog.total_likes}</span>
                    <span>💬 {blog.total_comments}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default BlogHome;
