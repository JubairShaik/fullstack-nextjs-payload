import { headers as getHeaders } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'
import { Calendar, User, Clock, ArrowRight, BookOpen, Sparkles, Plus } from 'lucide-react'

import config from '@/payload.config'
import "./globals.css"
import BlogInteractions from '../components/BlogInteractions'
import BlogSidebar from '../components/BlogSidebar'
import { getAllCategories, getAllTags, getBlogPosts } from '@/lib/blog-actions'

interface SearchParams {
  category?: string
  tag?: string
  search?: string
  page?: string
}

interface HomePageProps {
  searchParams: SearchParams
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
 
  const postsData = await getBlogPosts(searchParams)
  const categories = await getAllCategories()
  const tags = await getAllTags()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TechBlog Pro
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link
                href="/about"
                className="text-slate-500 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/admin"
                    target="_blank"
                    className="text-slate-800 hover:text-blue-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    target="_blank"
                    href="/admin/collections/posts/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Post
                  </Link>
                </div>
              ) : (
                <Link
                  href="/admin"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
          
          <div className="text-center">
            {!user && <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to TechBlog Pro.</h1>}

            {user && (
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user.email}</span>
              </h1>
            )}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Explore cutting-edge technology, development insights, and creative inspiration from industry experts.
            </p>
            
            {/* Search - Client Component for interactivity */}
            <BlogInteractions initialSearch={searchParams.search || ''} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar with Filtering */}
          <BlogSidebar 
            categories={categories}
            tags={tags}
            totalPosts={postsData.totalDocs}
            publishedCount={postsData.docs.filter(post => post.status === 'published').length}
          />

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchParams.search ? `Search Results` :
                   searchParams.category ? `${categories.find(cat => cat.slug === searchParams.category)?.name || searchParams.category} Posts` : 
                   searchParams.tag ? `#${tags.find(tag => tag.slug === searchParams.tag)?.name || searchParams.tag} Posts` :
                   'Latest Articles'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {postsData.docs.length} {postsData.docs.length === 1 ? 'article' : 'articles'} found
                  {postsData.totalPages > 1 && ` • Page ${postsData.page} of ${postsData.totalPages}`}
                </p>
              </div>
            </div>

            {/* Posts Grid */}
            {postsData.docs.length > 0 ? (
              <div className="grid gap-8 mb-12">
                {postsData.docs.map((post, index) => (
                  <article
                    key={post.id}
                    className={`group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                      index === 0 ? 'md:flex' : ''
                    }`}
                  >
                    <div className={`${index === 0 ? 'md:w-1/2' : ''} relative overflow-hidden`}>
                      {post.featuredImage && (
                        <>
                          <Image
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt || post.title}
                            width={index === 0 ? 600 : 400}
                            height={index === 0 ? 400 : 200}
                            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                              index === 0 ? 'h-80 md:h-full' : 'h-48'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                        </>
                      )}
                    </div>
                    
                    <div className={`p-6 ${index === 0 ? 'md:w-1/2' : ''}`}>
                      <div className="flex items-center gap-4 mb-4">
                        {post.category && (
                          <span
                            className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                            style={{ backgroundColor: post.category.color }}
                          >
                            {post.category.name}
                          </span>
                        )}
                        <div className="flex items-center text-sm text-gray-500 gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.publishedDate || post.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readingTime || 5} min read
                          </span>
                        </div>
                      </div>
                      
                      <Link href={`/blog/${post.id}`}>
                        <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors cursor-pointer ${
                          index === 0 ? 'text-2xl' : 'text-xl'
                        }`}>
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="w-4 h-4" />
                          By {post.author?.email?.split('@')[0] || 'Anonymous'}
                        </div>
                        
                        <Link
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag, tagIndex) => (
                            <Link
                              key={tagIndex}
                              href={`/?tag=${tag.slug}`}
                              className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              #{tag.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  {searchParams.category || searchParams.search || searchParams.tag
                    ? 'Try adjusting your filters or search terms.' 
                    : 'Start by creating your first blog post!'}
                </p>
                {user && (
                  <Link
                    href="/admin/collections/posts/create"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Post
                  </Link>
                )}
              </div>
            )}

            {/* Pagination */}
            {postsData.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {postsData.hasPrevPage && (
                  <Link
                    href={`/?page=${postsData.page - 1}${
                      searchParams.category ? `&category=${searchParams.category}` : ''
                    }${searchParams.search ? `&search=${searchParams.search}` : ''}${
                      searchParams.tag ? `&tag=${searchParams.tag}` : ''
                    }`}
                    className="px-4 py-2 bg-white text-slate-800 rounded-lg font-medium hover:bg-gray-100 transition-all border"
                  >
                    Previous
                  </Link>
                )}
                
                {Array.from({ length: postsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/?page=${pageNum}${
                      searchParams.category ? `&category=${searchParams.category}` : ''
                    }${searchParams.search ? `&search=${searchParams.search}` : ''}${
                      searchParams.tag ? `&tag=${searchParams.tag}` : ''
                    }`}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      pageNum === (parseInt(searchParams.page || '1'))
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-800 hover:bg-gray-100 border'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
                
                {postsData.hasNextPage && (
                  <Link
                    href={`/?page=${postsData.page + 1}${
                      searchParams.category ? `&category=${searchParams.category}` : ''
                    }${searchParams.search ? `&search=${searchParams.search}` : ''}${
                      searchParams.tag ? `&tag=${searchParams.tag}` : ''
                    }`}
                    className="px-4 py-2 bg-white text-slate-800 rounded-lg font-medium hover:bg-gray-100 transition-all border"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-2xl font-bold mb-4">
              <Sparkles className="w-6 h-6" />
              TechBlog Pro
            </div>
            <p className="text-gray-400 mb-6">
              Built with ❤️ by JUBAIR AHMED 
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}