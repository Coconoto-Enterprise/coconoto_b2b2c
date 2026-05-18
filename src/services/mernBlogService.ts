import { supabase } from '../lib/supabase';

// Get all published blogs
export async function getPublishedBlogs() {
  const { data, error } = await supabase
    .from('mern_blogs')
    .select(`
      *,
      blog_authors:author_id(id, username, fullname, profile_img)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Get all blogs for logged-in user (including drafts)
export async function getUserBlogs(userId) {
  const { data, error } = await supabase
    .from('mern_blogs')
    .select(`
      *,
      blog_authors:author_id(id, username, fullname, profile_img)
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Get single blog by blog_id
export async function getBlogById(blogId) {
  // Fetch blog with author details
  const { data: blogData, error: blogError } = await supabase
    .from('mern_blogs')
    .select(`
      *,
      blog_authors:author_id(id, username, fullname, profile_img, bio, youtube, instagram, facebook, twitter)
    `)
    .eq('blog_id', blogId)
    .single();

  if (blogError) throw new Error(blogError.message);
  
  // Fetch comments separately due to multiple relationships
  let comments = [];
  if (blogData) {
    const { data: commentsData, error: commentsError } = await supabase
      .from('blog_comments')
      .select(`
        *,
        author:author_id(username, profile_img)
      `)
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true });
    
    if (!commentsError) {
      comments = commentsData || [];
    }
    
    // Increment read count
    await supabase
      .from('mern_blogs')
      .update({ total_reads: (blogData.total_reads || 0) + 1 })
      .eq('blog_id', blogId);
  }
  
  // Combine blog data with comments
  return {
    ...blogData,
    blog_comments: comments
  };
}

// Create new blog
export async function createBlog(blogData, userId) {
  const blogId = Math.random().toString(36).substring(2, 15);
  
  const { data, error } = await supabase
    .from('mern_blogs')
    .insert([
      {
        blog_id: blogId,
        title: blogData.title,
        banner: blogData.banner || '',
        des: blogData.des || '',
        content: blogData.content || [],
        tags: blogData.tags || [],
        author_id: userId,
        is_draft: true,
        published: false,
        content_blocks: blogData.content_blocks || { time: 0, blocks: [] }
      }
    ])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Update blog
export async function updateBlog(blogId, blogData, userId) {
  // Verify ownership
  const { data: blog } = await supabase
    .from('mern_blogs')
    .select('author_id')
    .eq('blog_id', blogId)
    .single();

  if (!blog || blog.author_id !== userId) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('mern_blogs')
    .update({
      title: blogData.title,
      banner: blogData.banner,
      des: blogData.des,
      content: blogData.content,
      tags: blogData.tags,
      content_blocks: blogData.content_blocks,
      is_draft: blogData.is_draft !== false,
      published: blogData.published || false,
      published_at: blogData.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('blog_id', blogId)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Publish blog
export async function publishBlog(blogId, userId) {
  const { data: blog } = await supabase
    .from('mern_blogs')
    .select('author_id')
    .eq('blog_id', blogId)
    .single();

  if (!blog || blog.author_id !== userId) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('mern_blogs')
    .update({
      published: true,
      is_draft: false,
      published_at: new Date().toISOString()
    })
    .eq('blog_id', blogId)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Delete blog
export async function deleteBlog(blogId, userId) {
  const { data: blog } = await supabase
    .from('mern_blogs')
    .select('author_id')
    .eq('blog_id', blogId)
    .single();

  if (!blog || blog.author_id !== userId) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('mern_blogs')
    .delete()
    .eq('blog_id', blogId);

  if (error) throw new Error(error.message);
}

// Like/Unlike blog
export async function toggleBlogLike(blogId, userId, liked = true) {
  const { data: existing } = await supabase
    .from('blog_likes')
    .select('*')
    .eq('blog_id', blogId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    await supabase
      .from('blog_likes')
      .delete()
      .eq('blog_id', blogId)
      .eq('user_id', userId);
  } else {
    await supabase
      .from('blog_likes')
      .insert([{ blog_id: blogId, user_id: userId, liked }]);
  }

  // Update like count
  const { data: likes } = await supabase
    .from('blog_likes')
    .select('id')
    .eq('blog_id', blogId);

  await supabase
    .from('mern_blogs')
    .update({ total_likes: likes?.length || 0 })
    .eq('blog_id', blogId);
}

// Add comment
export async function addComment(blogId, commentData, userId) {
  const commentId = Math.random().toString(36).substring(2, 15);

  const { data, error } = await supabase
    .from('blog_comments')
    .insert([
      {
        comment_id: commentId,
        blog_id: blogId,
        author_id: userId,
        content: commentData.content,
        is_reply_to: commentData.is_reply_to || '',
        children_level: commentData.children_level || 0
      }
    ])
    .select();

  if (error) throw new Error(error.message);

  // Update comment count
  const { data: comments } = await supabase
    .from('blog_comments')
    .select('id')
    .eq('blog_id', blogId)
    .eq('is_deleted', false);

  const totalParentComments = comments?.filter(c => !c.is_reply_to).length || 0;

  await supabase
    .from('mern_blogs')
    .update({
      total_comments: comments?.length || 0,
      total_parent_comments: totalParentComments
    })
    .eq('blog_id', blogId);

  return data[0];
}

// Get blog comments
export async function getBlogComments(blogId) {
  const { data, error } = await supabase
    .from('blog_comments')
    .select(`
      *,
      author:author_id(id, username, profile_img)
    `)
    .eq('blog_id', blogId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

// Delete comment
export async function deleteComment(commentId, userId) {
  const { data: comment } = await supabase
    .from('blog_comments')
    .select('author_id, blog_id')
    .eq('comment_id', commentId)
    .single();

  if (!comment || comment.author_id !== userId) {
    throw new Error('Unauthorized');
  }

  await supabase
    .from('blog_comments')
    .update({ is_deleted: true })
    .eq('comment_id', commentId);
}

// Get author profile
export async function getAuthorProfile(userId) {
  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Update author profile
export async function updateAuthorProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('blog_authors')
    .update({
      fullname: profileData.fullname,
      username: profileData.username,
      bio: profileData.bio,
      profile_img: profileData.profile_img,
      youtube: profileData.youtube,
      instagram: profileData.instagram,
      facebook: profileData.facebook,
      twitter: profileData.twitter,
      github: profileData.github,
      website: profileData.website,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Search blogs
export async function searchBlogs(query) {
  const { data, error } = await supabase
    .from('mern_blogs')
    .select(`
      *,
      blog_authors:author_id(username, fullname, profile_img)
    `)
    .eq('published', true)
    .or(`title.ilike.%${query}%, des.ilike.%${query}%`)
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Create author profile (called when user first creates a blog)
export async function createAuthorProfile(userId, userData) {
  const { data, error } = await supabase
    .from('blog_authors')
    .insert([
      {
        id: userId,
        username: userData.username || userData.email?.split('@')[0] || `user_${Date.now()}`,
        fullname: userData.fullname || userData.email?.split('@')[0] || 'Anonymous',
        bio: userData.bio || '',
        profile_img: userData.profile_img || `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${userData.username || userId}`
      }
    ])
    .select();

  if (error && error.code !== '23505') { // Ignore duplicate key error
    throw new Error(error.message);
  }
  return data?.[0];
}

export default {
  getPublishedBlogs,
  getUserBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
  toggleBlogLike,
  addComment,
  getBlogComments,
  deleteComment,
  getAuthorProfile,
  updateAuthorProfile,
  searchBlogs,
  createAuthorProfile
};
