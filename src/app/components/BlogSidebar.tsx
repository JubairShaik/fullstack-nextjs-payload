'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { BookOpen, TrendingUp, Tag as TagIcon, Filter, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  icon?: string
}

interface Tag {
  id: string
  name: string
  slug: string
  color: string
}

interface BlogSidebarProps {
  categories: Category[]
  tags?: Tag[]
  totalPosts: number
  publishedCount: number
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  tags = [],
  totalPosts,
  publishedCount
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentCategory = searchParams.get('category')
  const currentTag = searchParams.get('tag')
  const currentSearch = searchParams.get('search')

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Reset to first page when changing filters
    params.delete('page')
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  const hasActiveFilters = currentCategory || currentTag || currentSearch

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 space-y-6">
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Active Filters
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-2">
              {currentCategory && (
                <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-blue-800">
                    Category: {categories.find(cat => cat.slug === currentCategory)?.name || currentCategory}
                  </span>
                  <button
                    onClick={() => updateFilters('category', null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {currentTag && (
                <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-green-800">
                    Tag: {tags.find(tag => tag.slug === currentTag)?.name || currentTag}
                  </span>
                  <button
                    onClick={() => updateFilters('tag', null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {currentSearch && (
                <div className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-yellow-800">
                    Search: "{currentSearch}"
                  </span>
                  <button
                    onClick={() => updateFilters('search', null)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Categories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => updateFilters('category', null)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  !currentCategory 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50'
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => updateFilters('category', category.slug)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                    currentCategory === category.slug
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 10).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => updateFilters('tag', tag.slug)}
                  className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                    currentTag === tag.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag.name}
                </button>
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
              <span className="font-bold text-blue-600">{totalPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Categories</span>
              <span className="font-bold text-indigo-600">{categories.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Published</span>
              <span className="font-bold text-green-600">{publishedCount}</span>
            </div>
            {tags.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tags</span>
                <span className="font-bold text-purple-600">{tags.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions for logged in users */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/collections/posts/create"
              target="_blank"
              className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create New Post
            </Link>
            <Link
              href="/admin"
              target="_blank"
              className="block w-full px-4 py-2 bg-gray-600 text-white text-center rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogSidebar