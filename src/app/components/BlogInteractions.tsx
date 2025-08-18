// // BlogInteractions.tsx


// 'use client'

// import React, { useState, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { Search } from 'lucide-react'

// interface BlogInteractionsProps {
//   initialSearch?: string
// }

// const BlogInteractions: React.FC<BlogInteractionsProps> = ({ 
//   initialSearch = '' 
// }) => {
//   const [searchTerm, setSearchTerm] = useState(initialSearch)
//   const router = useRouter()

//   const handleSearch = useCallback((term: string) => {
//     setSearchTerm(term)
    
//     // Use router.push instead of useEffect for navigation
//     const params = new URLSearchParams()
//     if (term.trim()) {
//       params.set('search', term.trim())
//     }
    
//     const queryString = params.toString()
//     router.push(`/blog${queryString ? `?${queryString}` : ''}`)
//   }, [router])

//   const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSearch(searchTerm)
//     }
//   }, [handleSearch, searchTerm])

//   const handleSubmit = useCallback((e: React.FormEvent) => {
//     e.preventDefault()
//     handleSearch(searchTerm)
//   }, [handleSearch, searchTerm])

//   return (
//     <div className="max-w-2xl mx-auto relative">
//       <form onSubmit={handleSubmit}>
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search articles, topics, or authors..."
//             className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyPress={handleKeyPress}
//           />
//         </div>
//       </form>
//     </div>
//   )
// }

// export default BlogInteractions

"use client"


import React, { useState, useTransition } from 'react';
import { Search, Filter, X, Calendar, Tag, Grid, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BlogInteractionsProps {
  initialSearch: string;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
}

export default function BlogInteractions({ 
  initialSearch, 
  categories = [], 
  tags = [] 
}: BlogInteractionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentCategory = searchParams.get('category');
  const currentTag = searchParams.get('tag');

  const handleSearch = (searchTerm: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (currentCategory) params.set('category', currentCategory);
      if (currentTag) params.set('tag', currentTag);
      
      const queryString = params.toString();
      router.push(`/?${queryString}`);
    });
  };

  const handleFilterChange = (type: 'category' | 'tag', value: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      
      if (type === 'category') {
        if (value !== currentCategory) {
          params.set('category', value);
        }
        if (currentTag) params.set('tag', currentTag);
      } else {
        if (value !== currentTag) {
          params.set('tag', value);
        }
        if (currentCategory) params.set('category', currentCategory);
      }
      
      const queryString = params.toString();
      router.push(`/?${queryString}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      setSearch('');
      router.push('/');
    });
  };

  const hasActiveFilters = search || currentCategory || currentTag;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 z-10" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(search);
              }
            }}
            placeholder="Search articles, technologies, tutorials..."
            className="w-full pl-12 pr-20 py-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {[search, currentCategory, currentTag].filter(Boolean).length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleSearch(search)}
              disabled={isPending}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 transition-all duration-300"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filter Articles</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Categories Filter */}
          {categories.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Tag className="w-4 h-4" />
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    !currentCategory
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange('category', category.slug)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      currentCategory === category.slug
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: currentCategory === category.slug ? category.color : undefined
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags Filter */}
          {tags.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('tag', '')}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-300 ${
                    !currentTag
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Tags
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleFilterChange('tag', tag.slug)}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-300 ${
                      currentTag === tag.slug
                        ? 'text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: currentTag === tag.slug ? (tag.color || '#6366f1') : undefined
                    }}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* View Mode Toggle */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Grid className="w-4 h-4" />
              View Mode
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-300"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Search: "{search}"
              <button
                onClick={() => {
                  setSearch('');
                  handleSearch('');
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              Category: {categories.find(c => c.slug === currentCategory)?.name || currentCategory}
              <button
                onClick={() => handleFilterChange('category', '')}
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentTag && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Tag: #{tags.find(t => t.slug === currentTag)?.name || currentTag}
              <button
                onClick={() => handleFilterChange('tag', '')}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}