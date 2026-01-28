import { supabase } from '../lib/supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  cover_image?: string;
  tags?: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  cover_image?: string;
  tags?: string[];
  published: boolean;
}

export interface UpdateBlogPost extends Partial<CreateBlogPost> {}

// Generate URL-friendly slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all published blog posts (public)
export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching published posts:', error);
    throw error;
  }

  return data || [];
};

// Get all blog posts (admin only)
export const getAllPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }

  return data || [];
};

// Get single blog post by slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Post not found
    }
    console.error('Error fetching post by slug:', error);
    throw error;
  }

  return data;
};

// Get single blog post by ID
export const getPostById = async (id: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Post not found
    }
    console.error('Error fetching post by ID:', error);
    throw error;
  }

  return data;
};

// Create new blog post
export const createPost = async (post: CreateBlogPost): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }

  return data;
};

// Update existing blog post
export const updatePost = async (
  id: string,
  updates: UpdateBlogPost
): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw error;
  }

  return data;
};

// Delete blog post
export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Toggle post published status
export const togglePublishStatus = async (
  id: string,
  published: boolean
): Promise<BlogPost> => {
  return updatePost(id, { published });
};

// Search blog posts
export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    throw error;
  }

  return data || [];
};

// Get posts by tag
export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .contains('tags', [tag])
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by tag:', error);
    throw error;
  }

  return data || [];
};
