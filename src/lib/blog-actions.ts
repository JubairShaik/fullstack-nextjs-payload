'use server'

import { revalidatePath } from 'next/cache'
import { categoriesApi, postsApi, tagsApi } from './api'
 

const API_BASE_URL = 'http://localhost:3000/api'



const api = {
  async getPost(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`)
      if (!response.ok) throw new Error('Failed to fetch post')
      return await response.json()
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  },

  async getPosts() {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      return data.docs || []
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }
}




export async function createPostAction(formData: FormData) {
  try {
    const postData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      category: formData.get('category'),
      tags: formData.getAll('tags'),
      status: formData.get('status') || 'draft',
      publishedDate: formData.get('publishedDate'),
      seo: {
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription'),
        keywords: formData.get('keywords'),
      },
    }

    const post = await postsApi.create(postData)

    // Revalidate the posts list and redirect
    revalidatePath('/blog')
    revalidatePath('/admin/posts')

    return { success: true, post }
  } catch (error) {
    console.error('Error creating post:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function updatePostAction(postId: string, formData: FormData) {
  try {
    const postData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      category: formData.get('category'),
      tags: formData.getAll('tags'),
      status: formData.get('status'),
      publishedDate: formData.get('publishedDate'),
      seo: {
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription'),
        keywords: formData.get('keywords'),
      },
    }

    const post = await postsApi.update(postId, postData)

    // Revalidate relevant paths
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/admin/posts')

    return { success: true, post }
  } catch (error) {
    console.error('Error updating post:', error)
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deletePostAction(postId: string) {
  try {
    await postsApi.delete(postId)

    // Revalidate posts list
    revalidatePath('/blog')
    revalidatePath('/admin/posts')

    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}

export async function createCategoryAction(formData: FormData) {
  try {
    const categoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      color: formData.get('color') as string,
      icon: formData.get('icon') as string,
    }

    const category = await categoriesApi.create(categoryData)

    revalidatePath('/admin/categories')
    revalidatePath('/blog')

    return { success: true, category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function createTagAction(formData: FormData) {
  try {
    const tagData = {
      name: formData.get('name') as string,
      color: formData.get('color') as string,
    }

    const tag = await tagsApi.create(tagData)

    revalidatePath('/admin/tags')
    revalidatePath('/blog')

    return { success: true, tag }
  } catch (error) {
    console.error('Error creating tag:', error)
    return { success: false, error: 'Failed to create tag' }
  }
}

 
// React Server Component data fetchers
export async function getBlogPosts(searchParams?: {
  category?: string
  tag?: string
  search?: string
  page?: string
}) {
  try {
    const params = {
      ...(searchParams?.category && { category: searchParams.category }),
      ...(searchParams?.tag && { tag: searchParams.tag }),
      ...(searchParams?.search && { search: searchParams.search }),
      ...(searchParams?.page && { page: parseInt(searchParams.page) }),
      status: 'published',
      limit: 10,
    }

    return await postsApi.getAll(params)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
  }
}

 

export async function getBlogPost(id: string) {
  try {
    console.log('Fetching post with ID:', id)
    
    const post = await api.getPost(id)
    
    console.log('Retrieved post:', post)
    
 
    if (!post  ) {
      console.log('Post not found or not published:', { id, post })
      return null
    }
    
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}
 

export async function getAllCategories() {
  try {
    const result = await categoriesApi.getAll()
    return result.docs
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getAllTags() {
  try {
    const result = await tagsApi.getAll()
    return result.docs
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}
