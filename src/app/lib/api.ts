import { BlogPost } from "../types/blog";

 
const API_BASE_URL = 'http://localhost:3000/api';

// Mock data for fallback when Payload CMS is not available
 

// Transform Payload CMS post to BlogPost format
const transformPayloadPost = (payloadPost: any): BlogPost => {
  return {
    id: payloadPost.id,
    title: payloadPost.title,
    content: payloadPost.content,
    excerpt: payloadPost.excerpt,
    author: payloadPost.author,
    createdAt: payloadPost.createdAt,
    updatedAt: payloadPost.updatedAt,
    published: payloadPost.published || false,
    tags: payloadPost.tags?.map((tagObj: any) => tagObj.tag).filter(Boolean) || []
  };
};

// Transform BlogPost to Payload CMS format
const transformToPayloadPost = (blogPost: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  return {
    title: blogPost.title,
    content: blogPost.content,
    excerpt: blogPost.excerpt,
    author: blogPost.author,
    published: blogPost.published,
    tags: blogPost.tags.map(tag => ({ tag }))
  };
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Get all blog posts
  async getPosts(): Promise<BlogPost[]> {
    try {
      await delay(500);
      const response = await fetch(`${API_BASE_URL}/posts`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts from Payload CMS');
      }
      
      const data = await response.json();
      return data.docs.map(transformPayloadPost);
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      await delay(500);
      return [...mockPosts];
    }
  },

  // Get a single blog post by ID
  async getPost(id: string): Promise<BlogPost | null> {
    try {
      await delay(300);
      const response = await fetch(`${API_BASE_URL}/posts/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch post from Payload CMS');
      }
      
      const data = await response.json();
      return transformPayloadPost(data);
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      await delay(300);
      return mockPosts.find(post => post.id === id) || null;
    }
  },

  // Create a new blog post
  async createPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    try {
      await delay(800);
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformToPayloadPost(postData)),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post in Payload CMS');
      }
      
      const data = await response.json();
      return transformPayloadPost(data.doc);
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      await delay(800);
      const newPost: BlogPost = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockPosts.unshift(newPost);
      return newPost;
    }
  },

  // Update an existing blog post
  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      await delay(600);
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformToPayloadPost(postData as any)),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post in Payload CMS');
      }
      
      const data = await response.json();
      return transformPayloadPost(data.doc);
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      await delay(600);
      const index = mockPosts.findIndex(post => post.id === id);
      if (index === -1) return null;
      
      mockPosts[index] = {
        ...mockPosts[index],
        ...postData,
        updatedAt: new Date().toISOString(),
      };
      return mockPosts[index];
    }
  },

  // Delete a blog post
  async deletePost(id: string): Promise<boolean> {
    try {
      await delay(400);
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post from Payload CMS');
      }
      
      return true;
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      await delay(400);
      const index = mockPosts.findIndex(post => post.id === id);
      if (index === -1) return false;
      
      mockPosts.splice(index, 1);
      return true;
    }
  }
};




export const api = {
  getPosts: () => postsApi.getAll(),
  getPost: (id: string) => postsApi.getById(id),
  createPost: (postData: any) => postsApi.create(postData),
  updatePost: (id: string, postData: any) => postsApi.update(id, postData),
  deletePost: (id: string) => postsApi.delete(id)
};