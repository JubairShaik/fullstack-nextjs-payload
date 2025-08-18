// lib/api.ts - Modern API utilities using server actions and React Server Components

import { headers } from 'next/headers'

 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Generic API fetch wrapper
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headersList = await headers()
  const authToken = headersList.get('authorization')

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(authToken && { Authorization: authToken }),
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Blog Posts API
export const postsApi = {
  // Get all posts with optional filtering
  async getAll(params?: {
    category?: string
    tag?: string
    status?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }

    const query = searchParams.toString()
    return apiRequest<{
      docs: any[]
      totalDocs: number
      totalPages: number
      page: number
    }>(`/posts${query ? `?${query}` : ''}`)
  },

  // Get single post by slug
  async getBySlug(slug: string) {
    return apiRequest<any>(`/posts/slug/${slug}`)
  },

  // Get single post by ID
  async getById(id: string) {
    return apiRequest<any>(`/posts/${id}`)
  },

  // Create new post
  async create(data: any) {
    return apiRequest<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update existing post
  async update(id: string, data: any) {
    return apiRequest<any>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  // Delete post
  async delete(id: string) {
    return apiRequest<void>(`/posts/${id}`, {
      method: 'DELETE',
    })
  },
}

// Categories API
export const categoriesApi = {
  async getAll() {
    return apiRequest<{
      docs: any[]
      totalDocs: number
    }>('/categories')
  },

  async getById(id: string) {
    return apiRequest<any>(`/categories/${id}`)
  },

  async create(data: { name: string; description?: string; color?: string; icon?: string }) {
    return apiRequest<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: any) {
    return apiRequest<any>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string) {
    return apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    })
  },
}

// Tags API
export const tagsApi = {
  async getAll() {
    return apiRequest<{
      docs: any[]
      totalDocs: number
    }>('/tags')
  },

  async getById(id: string) {
    return apiRequest<any>(`/tags/${id}`)
  },

  async create(data: { name: string; color?: string }) {
    return apiRequest<any>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: any) {
    return apiRequest<any>(`/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string) {
    return apiRequest<void>(`/tags/${id}`, {
      method: 'DELETE',
    })
  },
}

// Media API
export const mediaApi = {
  async getAll() {
    return apiRequest<{
      docs: any[]
      totalDocs: number
    }>('/media')
  },

  async upload(file: File, alt: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', alt)

    const response = await fetch(`${API_BASE_URL}/media`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },

  async delete(id: string) {
    return apiRequest<void>(`/media/${id}`, {
      method: 'DELETE',
    })
  },
};

