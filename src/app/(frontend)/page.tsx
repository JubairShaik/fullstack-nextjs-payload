 
import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import { Search, Calendar, User, Clock, ArrowRight, BookOpen, Sparkles, TrendingUp, Plus } from 'lucide-react'

import config from '@/payload.config'
 
// import './styles.css'
import "./globals.css" 
import BlogInteractions from '../components/BlogInteractions'
import { getAllCategories, getBlogPosts } from '@/lib/blog-actions'

// Client component for interactive features
 
export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; page?: string }
}) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  
  // Fetch blog data using Server Components
  const postsData = await getBlogPosts(searchParams)
  const categories = await getAllCategories()
  
  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

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
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions */}
         
              {/* Categories */}
              {categories.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Categories
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/blog"
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 block ${
                        !searchParams.category 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      All Posts
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.slug}`}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                          searchParams.category === category.slug
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Blog Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Posts</span>
                    <span className="font-bold text-blue-600">{postsData.totalDocs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Categories</span>
                    <span className="font-bold text-indigo-600">{categories.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Published</span>
                    <span className="font-bold text-green-600">
                      {postsData.docs.filter(post => post.status === 'published').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchParams.category ? `${searchParams.category} Posts` : 'Latest Articles'}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({postsData.docs.length} articles)
                </span>
              </h2>
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
                      
                      <Link href={`/blog/${post.slug}`}>
                      
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
                              href={`/blog?tag=${tag.slug}`}
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
                  {searchParams.category || searchParams.search 
                    ? 'Try adjusting your filters or search terms.' 
                    : 'Start by creating your first blog post!'}
                </p>
                {user && (
                  <Link
                    href="/admin/posts/create"
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
                {Array.from({ length: postsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/?page=${pageNum}${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      pageNum === (parseInt(searchParams.page || '1'))
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-800 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
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
              Build with ❤️ by JUBAIR AHMED 
            </p>
            
          </div>
        </div>
      </footer>
    </div>
  )
}