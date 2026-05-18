# MERN Blog System - API Reference Guide

## Service Functions Overview

All blog functions are in `src/services/mernBlogService.ts`

### Blog Management

#### `getPublishedBlogs()`
Get all published blogs (public read)
```typescript
const blogs = await blogService.getPublishedBlogs();
```
**Returns**: `Blog[]`

#### `getUserBlogs(userId: string)`
Get all blogs for a specific user (including drafts)
```typescript
const blogs = await blogService.getUserBlogs(userId);
```
**Returns**: `Blog[]`

#### `getBlogById(blogId: string)`
Get a single blog with comments and author details
```typescript
const blog = await blogService.getBlogById(blogId);
```
**Returns**: `Blog` (increments read count automatically)

#### `createBlog(blogData, userId)`
Create a new blog (starts as draft)
```typescript
const blog = await blogService.createBlog({
  title: 'My First Blog',
  banner: 'https://...',
  des: 'Brief description',
  content: [],
  tags: ['coconut', 'agriculture']
}, userId);
```
**Returns**: `Blog`

#### `updateBlog(blogId, blogData, userId)`
Update an existing blog
```typescript
await blogService.updateBlog(blogId, {
  title: 'Updated Title',
  published: true,
  tags: ['new', 'tags']
}, userId);
```
**Returns**: `Blog`

#### `publishBlog(blogId, userId)`
Publish a draft blog (sets published=true)
```typescript
await blogService.publishBlog(blogId, userId);
```
**Returns**: `Blog`

#### `deleteBlog(blogId, userId)`
Delete a blog permanently
```typescript
await blogService.deleteBlog(blogId, userId);
```

---

### Comments

#### `addComment(blogId, commentData, userId)`
Add a comment to a blog
```typescript
await blogService.addComment(blogId, {
  content: 'Great post!',
  is_reply_to: '', // Optional: comment_id to reply to
  children_level: 0
}, userId);
```
**Returns**: `Comment`

#### `getBlogComments(blogId)`
Get all comments for a blog
```typescript
const comments = await blogService.getBlogComments(blogId);
```
**Returns**: `Comment[]`

#### `deleteComment(commentId, userId)`
Delete a comment (marks as deleted, not removed)
```typescript
await blogService.deleteComment(commentId, userId);
```

---

### Engagement

#### `toggleBlogLike(blogId, userId, liked)`
Like or unlike a blog
```typescript
await blogService.toggleBlogLike(blogId, userId, true);
// Call again with false to unlike
```

---

### Search & Discovery

#### `searchBlogs(query: string)`
Search published blogs by title or description
```typescript
const results = await blogService.searchBlogs('coconut farming');
```
**Returns**: `Blog[]`

---

### Author Profiles

#### `getAuthorProfile(userId)`
Get author profile details
```typescript
const author = await blogService.getAuthorProfile(userId);
```
**Returns**: `Author`

#### `updateAuthorProfile(userId, profileData)`
Update author profile
```typescript
await blogService.updateAuthorProfile(userId, {
  fullname: 'John Doe',
  username: 'johndoe',
  bio: 'Coconut farmer and blogger',
  profile_img: 'https://...',
  youtube: 'johndoe',
  instagram: 'johndoe',
  facebook: 'johndoe',
  twitter: 'johndoe'
});
```
**Returns**: `Author`

#### `createAuthorProfile(userId, userData)`
Create an author profile (auto-called on first blog)
```typescript
await blogService.createAuthorProfile(userId, {
  username: 'johndoe',
  email: 'john@example.com',
  fullname: 'John Doe'
});
```
**Returns**: `Author`

---

## Type Definitions

```typescript
interface Blog {
  id: string;
  blog_id: string;
  title: string;
  banner: string;
  des: string;
  content: any[];
  tags: string[];
  author_id: string;
  total_likes: number;
  total_comments: number;
  total_reads: number;
  total_parent_comments: number;
  is_draft: boolean;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  blog_authors?: Author;
}

interface Author {
  id: string;
  username: string;
  fullname: string;
  bio: string;
  profile_img: string;
  youtube: string;
  instagram: string;
  facebook: string;
  twitter: string;
  github: string;
  website: string;
  joined_at: string;
}

interface Comment {
  id: string;
  comment_id: string;
  blog_id: string;
  author_id: string;
  content: string;
  children_level: number;
  is_reply_to: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    profile_img: string;
  };
}
```

---

## Error Handling

All functions throw errors. Always wrap in try-catch:

```typescript
try {
  const blog = await blogService.getBlogById(blogId);
} catch (error) {
  console.error('Failed to fetch blog:', error.message);
  // Handle error
}
```

---

## Usage Examples

### Create and Publish a Blog

```typescript
// 1. Create draft
const blog = await blogService.createBlog({
  title: 'My Blog Post',
  banner: 'image-url',
  des: 'A short description',
  content: [],
  tags: ['tag1', 'tag2']
}, userId);

// 2. Update with more details
await blogService.updateBlog(blog.blog_id, {
  title: 'Updated Title',
  content: [...] // EditorJS content
}, userId);

// 3. Publish
await blogService.publishBlog(blog.blog_id, userId);
```

### View Blog and Add Comment

```typescript
// 1. Get blog details
const blog = await blogService.getBlogById(blogId);

// 2. Get comments
const comments = await blogService.getBlogComments(blogId);

// 3. Add new comment
const newComment = await blogService.addComment(
  blogId,
  { content: 'Great article!' },
  userId
);

// 4. Like the blog
await blogService.toggleBlogLike(blogId, userId, true);
```

### Search and Filter

```typescript
// Search by keyword
const results = await blogService.searchBlogs('agriculture');

// Get all published
const allBlogs = await blogService.getPublishedBlogs();

// Manual filter by tag (in component)
const filtered = allBlogs.filter(blog => 
  blog.tags.includes('coconut')
);
```

---

## Integration with Components

### In MernBlogManagement Component
```typescript
// Fetch user's blogs
const blogs = await blogService.getUserBlogs(userId);

// Create new blog
const newBlog = await blogService.createBlog(formData, userId);

// Delete blog
await blogService.deleteBlog(blogId, userId);
```

### In BlogEditor Component
```typescript
// Fetch blog to edit
const blog = await blogService.getBlogById(blogId);

// Update blog
await blogService.updateBlog(blogId, updatedData, userId);

// Publish
await blogService.publishBlog(blogId, userId);
```

### In BlogHome Component
```typescript
// Get all published blogs
const blogs = await blogService.getPublishedBlogs();

// Search
const results = await blogService.searchBlogs(query);
```

### In BlogDetail Component
```typescript
// Get blog with comments
const blog = await blogService.getBlogById(blogId);

// Get comments
const comments = await blogService.getBlogComments(blogId);

// Add comment
await blogService.addComment(blogId, comment, userId);

// Like blog
await blogService.toggleBlogLike(blogId, userId, true);
```

---

## Common Patterns

### Check if User is Blog Owner
```typescript
const blog = await blogService.getBlogById(blogId);
const isOwner = blog.author_id === userId;
```

### Get User's Blog Stats
```typescript
const blogs = await blogService.getUserBlogs(userId);
const totalReads = blogs.reduce((sum, b) => sum + b.total_reads, 0);
const totalLikes = blogs.reduce((sum, b) => sum + b.total_likes, 0);
```

### Feature: View Most Read Blogs
```typescript
const blogs = await blogService.getPublishedBlogs();
const mostRead = blogs.sort((a, b) => b.total_reads - a.total_reads).slice(0, 10);
```

### Feature: Trending Tags
```typescript
const blogs = await blogService.getPublishedBlogs();
const tagCounts = {};
blogs.forEach(blog => {
  blog.tags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
});
const trending = Object.entries(tagCounts)
  .sort(([,a], [,b]) => b - a)
  .map(([tag]) => tag)
  .slice(0, 10);
```

---

## Notes

- **Authentication**: Requires Supabase auth session
- **Authorization**: RLS policies enforce user ownership
- **Read-only operations**: No auth required for published blogs
- **Write operations**: Must be logged in and own the resource
- **Performance**: Comments include author details automatically
- **Pagination**: Not yet implemented (fetch all, then paginate in component)

