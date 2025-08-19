 


'use client'

import React, { useState, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface BlogInteractionsProps {
  initialSearch?: string
}

const BlogInteractions: React.FC<BlogInteractionsProps> = ({
  initialSearch = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    
    // Create new URLSearchParams from current search params
    const params = new URLSearchParams(searchParams)
    
    if (term.trim()) {
      params.set('search', term.trim())
      params.delete('page') // Reset to first page when searching
    } else {
      params.delete('search')
    }
    
    // Keep existing category filter if present
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }, [router, searchParams, pathname])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }, [handleSearch, searchTerm])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }, [handleSearch, searchTerm])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    const params = new URLSearchParams(searchParams)
    params.delete('search')
    params.delete('page')
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }, [router, searchParams, pathname])

  return (
    <div className="max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles, topics, or authors..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
      
      {/* Active Filters Display */}
      {(searchTerm || searchParams.get('category')) && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {searchTerm && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              <span>Search: "{searchTerm}"</span>
              <button
                onClick={clearSearch}
                className="hover:text-blue-900 transition-colors"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {searchParams.get('category') && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <span>Category: {searchParams.get('category')}</span>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.delete('category')
                  params.delete('page')
                  const queryString = params.toString()
                  router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
                }}
                className="hover:text-green-900 transition-colors"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BlogInteractions




