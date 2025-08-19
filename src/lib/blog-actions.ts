'use server'




import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

// Initialize Payload instance
const payload = await getPayload({ config })

// Blog Post Operations using Local API
export async function createPostAction(formData: FormData) {
  try {
    const postData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      tags: formData.getAll('tags'),
      status: (formData.get('status') as string) || 'draft',
      publishedDate: formData.get('publishedDate') as string,
      seo: {
        metaTitle: formData.get('metaTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
        keywords: formData.get('keywords') as string,
      },
    }

    const post = await payload.create({
      collection: 'posts',
      data: postData,
      overrideAccess: false, // Enable access control
    })

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
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      tags: formData.getAll('tags'),
      status: formData.get('status') as string,
      publishedDate: formData.get('publishedDate') as string,
      seo: {
        metaTitle: formData.get('metaTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
        keywords: formData.get('keywords') as string,
      },
    }

    const post = await payload.update({
      collection: 'posts',
      id: postId,
      data : postData,
      overrideAccess: false,
    })

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
    await payload.delete({
      collection: 'posts',
      id: postId,
      overrideAccess: false,
    })

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

    const category = await payload.create({
      collection: 'categories',
      data: categoryData,
      overrideAccess: false,
    })

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

    const tag = await payload.create({
      collection: 'tags',
      data: tagData,
      overrideAccess: false,
    })

    revalidatePath('/admin/tags')
    revalidatePath('/blog')

    return { success: true, tag }
  } catch (error) {
    console.error('Error creating tag:', error)
    return { success: false, error: 'Failed to create tag' }
  }
}

 


export async function getBlogPosts(searchParams?: {
  category?: string
  tag?: string
  search?: string
  page?: string
}) {
  try {
    const whereConditions: any = {
      status: { equals: 'published' }
    }

    // Add category filter - handle both slug and ID
    if (searchParams?.category) {
      // First, try to find category by slug
      const categoryResult = await payload.find({
        collection: 'categories',
        where: { slug: { equals: searchParams.category } },
        limit: 1,
      })

      if (categoryResult.docs[0]) {
        whereConditions.category = { equals: categoryResult.docs[0].id }
      } else {
        // Fallback: try direct ID match
        whereConditions.category = { equals: searchParams.category }
      }
    }

    // Add tag filter - handle both slug and ID
    if (searchParams?.tag) {
      const tagResult = await payload.find({
        collection: 'tags',
        where: { slug: { equals: searchParams.tag } },
        limit: 1,
      })

      if (tagResult.docs[0]) {
        whereConditions.tags = { in: [tagResult.docs[0].id] }
      } else {
        // Fallback: try direct ID match
        whereConditions.tags = { in: [searchParams.tag] }
      }
    }

    // Add search filter with comprehensive text search
    if (searchParams?.search && searchParams.search.trim()) {
      const searchTerm = searchParams.search.trim()
      whereConditions.or = [
        { title: { contains: searchTerm } },
        { excerpt: { contains: searchTerm } },
        { content: { contains: searchTerm } },
        { 'seo.keywords': { contains: searchTerm } }
      ]
    }

    console.log('Query conditions:', JSON.stringify(whereConditions, null, 2))

    const result = await payload.find({
      collection: 'posts',
      where: whereConditions,
      limit: 10,
      page: searchParams?.page ? parseInt(searchParams.page) : 1,
      sort: '-publishedDate',
      depth: 2, // Include related data (category, tags, author, featuredImage)
      overrideAccess: false,
    })

    return {
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1, hasPrevPage: false, hasNextPage: false }
  }
}


export async function getBlogPost(id: string) {
  try {
    console.log('Fetching post with ID using Local API:', id)
    
    const post = await payload.findByID({
      collection: 'posts',
      id: id,
      depth: 2, // Include related data (category, tags, author, featuredImage)
      overrideAccess: false, // Respect access control
    })
    
    console.log('Retrieved post using Local API:', post)
    
    // Check if post exists and is published
    if (!post || post.status !== 'published') {
      console.log('Post not found or not published:', { id, post })
      return null
    }
    
    return post
  } catch (error) {
    console.error('Error fetching post using Local API:', error)
    return null
  }
}

// Get single post by slug (alternative method)
export async function getBlogPostBySlug(slug: string) {
  try {
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: 'published' } }
        ]
      },
      limit: 1,
      depth: 2,
      overrideAccess: false,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

export async function getAllCategories() {
  try {
    const result = await payload.find({
      collection: 'categories',
      limit: 0, // Get all categories
      sort: 'name',
      overrideAccess: false,
    })
    
    return result.docs
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getAllTags() {
  try {
    const result = await payload.find({
      collection: 'tags',
      limit: 0, // Get all tags
      sort: 'name',
      overrideAccess: false,
    })
    
    return result.docs
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}
 export async function getRecentPosts(limit: number = 5) {
  try {
    const result = await payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' }
      },
      limit,
      sort: '-publishedDate',
      depth: 1,
      overrideAccess: false,
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
}


export async function getPostsByCategory(categorySlug: string, limit?: number) {
  try {
    const categoryResult = await payload.find({
      collection: 'categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
    })

    if (!categoryResult.docs[0]) {
      return []
    }

    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { category: { equals: categoryResult.docs[0].id } },
          { status: { equals: 'published' } }
        ]
      },
      limit: limit || 10,
      sort: '-publishedDate',
      depth: 2,
      overrideAccess: false,
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}




export async function getPostsByTag(tagSlug: string, limit?: number) {
  try {
    // First get the tag by slug
    const tagResult = await payload.find({
      collection: 'tags',
      where: { slug: { equals: tagSlug } },
      limit: 1,
    })

    if (!tagResult.docs[0]) {
      return []
    }

    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { tags: { in: [tagResult.docs[0].id] } },
          { status: { equals: 'published' } }
        ]
      },
      limit: limit || 10,
      sort: '-publishedDate',
      depth: 2,
      overrideAccess: false,
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching posts by tag:', error)
    return []
  }
}


// Search functionality
export async function searchPosts(query: string, limit?: number) {
  try {
    if (!query.trim()) {
      return []
    }

    const searchTerm = query.trim()
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          {
            or: [
              { title: { contains: searchTerm } },
              { excerpt: { contains: searchTerm } },
              { content: { contains: searchTerm } },
              { 'seo.keywords': { contains: searchTerm } }
            ]
          }
        ]
      },
      limit: limit || 20,
      sort: '-publishedDate',
      depth: 2,
      overrideAccess: false,
    })

    return result.docs
  } catch (error) {
    console.error('Error searching posts:', error)
    return []
  }
}