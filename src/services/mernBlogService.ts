import { supabase } from '../lib/supabase';
import { buildBlogUrlSlug, buildUniqueBlogSlug, slugifyBlogTitle } from './blogUrlUtils.js';

async function generateUniqueSlug(title: string, currentSlug?: string, blogIdToIgnore?: string) {
  const base = slugifyBlogTitle(title) || 'blog-post';
  const slugToKeep = currentSlug && currentSlug.trim() ? currentSlug.trim() : null;

  const { data: existingRows, error } = await supabase
    .from('mern_blogs')
    .select('slug, blog_id')
    .neq('blog_id', blogIdToIgnore || '');

  if (error) throw new Error(error.message);

  const usedSlugs = new Set((existingRows || [])
    .map((row: any) => String(row?.slug || '').trim())
    .filter(Boolean));

  if (slugToKeep && slugToKeep === base) {
    return slugToKeep;
  }

  if (slugToKeep && !usedSlugs.has(slugToKeep)) {
    return slugToKeep;
  }

  return buildUniqueBlogSlug(base, [...usedSlugs], slugToKeep || '');
}

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
export async function getUserBlogs(userId: string) {
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
export async function getBlogById(blogId: string) {
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

export async function getBlogByUrlParam(blogParam: string) {
  const value = String(blogParam || '').trim();
  if (!value) return null;

  try {
    const { data, error } = await supabase
      .from('mern_blogs')
      .select(`
        *,
        blog_authors:author_id(id, username, fullname, profile_img, bio, youtube, instagram, facebook, twitter)
      `)
      .eq('slug', value)
      .eq('published', true)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (data) {
      return {
        ...data,
        blog_comments: []
      };
    }
  } catch {
    // Ignore slug lookup failures while the table is still being migrated.
  }

  try {
    const byId = await getBlogById(value);
    if (byId) return byId;
  } catch {
    // Legacy ID fallback for older URLs.
  }

  try {
    const { data: blogs, error } = await supabase
      .from('mern_blogs')
      .select(`
        *,
        blog_authors:author_id(id, username, fullname, profile_img, bio, youtube, instagram, facebook, twitter)
      `)
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);

    const matchingBlog = (blogs || []).find((blog: any) => buildBlogUrlSlug(blog) === value);
    if (matchingBlog) return getBlogById(matchingBlog.blog_id);
  } catch {
    // Keep the not-found result below if neither lookup is available.
  }

  return null;
}

// Create new blog
export async function createBlog(blogData: any, userId: string) {
  const blogId = Math.random().toString(36).substring(2, 15);
  const slug = await generateUniqueSlug(blogData.title || 'blog-post');

  const { data, error } = await supabase
    .from('mern_blogs')
    .insert([
      {
        blog_id: blogId,
        title: blogData.title,
        slug,
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
export async function updateBlog(blogId: string, blogData: any, userId: string) {
  // Verify ownership
  const { data: blog } = await supabase
    .from('mern_blogs')
    .select('author_id, title, slug')
    .eq('blog_id', blogId)
    .single();

  if (!blog || blog.author_id !== userId) {
    throw new Error('Unauthorized');
  }

  const nextTitle = blogData.title ?? blog.title;
  const nextSlug = await generateUniqueSlug(nextTitle, blog.slug || buildBlogUrlSlug(blog), blogId);

  const updates: Record<string, any> = {
    title: nextTitle,
    slug: nextSlug,
    banner: blogData.banner,
    des: blogData.des,
    content: blogData.content,
    tags: blogData.tags,
    content_blocks: blogData.content_blocks,
    updated_at: new Date().toISOString()
  };

  // Only touch publish state when the caller explicitly sets it, so that
  // saving a draft doesn't accidentally unpublish an already-live post.
  if (blogData.published === true) {
    updates.published = true;
    updates.is_draft = false;
    updates.published_at = new Date().toISOString();
  } else if (blogData.is_draft === true || blogData.published === false) {
    updates.published = false;
    updates.is_draft = true;
    updates.published_at = null;
  }

  const { data, error } = await supabase
    .from('mern_blogs')
    .update(updates)
    .eq('blog_id', blogId)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Publish blog
export async function publishBlog(blogId: string, userId: string) {
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
export async function deleteBlog(blogId: string, userId: string) {
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
export async function toggleBlogLike(blogId: string, userId: string, liked: boolean = true) {
  await ensureAuthorProfile(userId);

  if (liked) {
    const { error } = await supabase
      .from('blog_likes')
      .upsert([{ blog_id: blogId, user_id: userId, liked: true }], { onConflict: 'blog_id,user_id' });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('blog_likes')
      .delete()
      .eq('blog_id', blogId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }

  // Update like count
  const { data: likes } = await supabase
    .from('blog_likes')
    .select('id')
    .eq('blog_id', blogId);

  const { error: countError } = await supabase
    .from('mern_blogs')
    .update({ total_likes: likes?.length || 0 })
    .eq('blog_id', blogId);
  if (countError) throw new Error(countError.message);
}

export async function getBlogLikeStatus(blogId: string, userId: string) {
  const { data, error } = await supabase
    .from('blog_likes')
    .select('id')
    .eq('blog_id', blogId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function getGuestBlogInteraction(blogId: string, email: string) {
  const { data, error } = await supabase
    .from('blog_guest_interactions')
    .select('id, name, email, liked, wants_newsletter')
    .eq('blog_id', blogId)
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function saveGuestBlogInteraction(
  blogId: string,
  interaction: { name: string; email: string; liked?: boolean; comment?: string; wants_newsletter?: boolean }
) {
  const payload = {
    blog_id: blogId,
    name: interaction.name.trim(),
    email: interaction.email.trim().toLowerCase(),
    liked: Boolean(interaction.liked),
    comment: interaction.comment?.trim() || '',
    wants_newsletter: Boolean(interaction.wants_newsletter),
  };

  const { error } = await supabase
    .from('blog_guest_interactions')
    .upsert(payload, { onConflict: 'blog_id,email' });

  if (error) throw new Error(error.message);

  const { data: counts, error: countError } = await supabase.rpc('get_guest_blog_counts', { p_blog_id: blogId });
  if (countError) throw new Error(countError.message);

  return {
    interaction: { ...payload, id: `${blogId}-${payload.email}`, created_at: new Date().toISOString() },
    likes: counts?.[0]?.total_likes || 0,
    comments: counts?.[0]?.total_comments || 0,
  };
}

export async function getGuestBlogCounts(blogId: string) {
  const { data, error } = await supabase.rpc('get_guest_blog_counts', { p_blog_id: blogId });
  if (error) throw new Error(error.message);
  return { likes: data?.[0]?.total_likes || 0, comments: data?.[0]?.total_comments || 0 };
}

// Add comment
export async function addComment(blogId: string, commentData: any, userId: string) {
  const commentId = Math.random().toString(36).substring(2, 15);
  await ensureAuthorProfile(userId);

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
    .select(`
      *,
      author:author_id(id, username, profile_img)
    `)
    .single();

  if (error) throw new Error(error.message);

  // Update comment count
  const { data: comments } = await supabase
    .from('blog_comments')
    .select('id')
    .eq('blog_id', blogId)
    .eq('is_deleted', false);

  const totalParentComments = (comments as any[] | null)?.filter((c: any) => !c.is_reply_to).length || 0;

  const { error: countError } = await supabase
    .from('mern_blogs')
    .update({
      total_comments: comments?.length || 0,
      total_parent_comments: totalParentComments
    })
    .eq('blog_id', blogId);
  if (countError) throw new Error(countError.message);

  return data;
}

// Get blog comments
export async function getBlogComments(blogId: string) {
  const [{ data, error }, { data: guestComments, error: guestError }] = await Promise.all([
    supabase
    .from('blog_comments')
    .select(`
      *,
      author:author_id(id, username, profile_img)
    `)
    .eq('blog_id', blogId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true }),
    supabase
      .from('blog_guest_interactions')
      .select('id, name, comment, created_at')
      .eq('blog_id', blogId)
      .neq('comment', '')
      .order('created_at', { ascending: true }),
  ]);

  if (error) throw new Error(error.message);
  if (guestError) throw new Error(guestError.message);
  return [
    ...(data || []),
    ...(guestComments || []).map((comment: any) => ({
      comment_id: `guest-${comment.id}`,
      content: comment.comment,
      created_at: comment.created_at,
      author: { username: comment.name, profile_img: '' },
    })),
  ].sort((left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime());
}

// Delete comment
export async function deleteComment(commentId: string, userId: string) {
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
export async function getAuthorProfile(userId: string) {
  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Update author profile
export async function updateAuthorProfile(userId: string, profileData: any) {
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
export async function searchBlogs(query: string) {
  const escapedQuery = query.trim().replace(/\\/g, '\\\\').replace(/[%_(),.]/g, '\\$&');
  if (!escapedQuery) return getPublishedBlogs();

  const { data, error } = await supabase
    .from('mern_blogs')
    .select(`
      *,
      blog_authors:author_id(username, fullname, profile_img)
    `)
    .eq('published', true)
    .or(`title.ilike.%${escapedQuery}%,des.ilike.%${escapedQuery}%`)
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

async function ensureAuthorProfile(userId: string) {
  const { data: existing, error: lookupError } = await supabase
    .from('blog_authors')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (lookupError) throw new Error(lookupError.message);
  if (existing) return;

  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('blog_authors')
    .insert([{
      id: userId,
      username: user?.user_metadata?.username || user?.email?.split('@')[0] || `user_${Date.now()}`,
      fullname: user?.user_metadata?.fullname || user?.email?.split('@')[0] || 'Anonymous',
      profile_img: user?.user_metadata?.profile_img || ''
    }]);

  if (error && error.code !== '23505') throw new Error(error.message);
}

// Create author profile (called when user first creates a blog)
export async function createAuthorProfile(userId: string, userData: any) {
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
  getBlogByUrlParam,
  createBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
  toggleBlogLike,
  getBlogLikeStatus,
  addComment,
  getBlogComments,
  deleteComment,
  getAuthorProfile,
  updateAuthorProfile,
  searchBlogs,
  createAuthorProfile
};
