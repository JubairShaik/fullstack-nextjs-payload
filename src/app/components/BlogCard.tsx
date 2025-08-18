'use client'

import { Calendar, Edit, Tag, Trash2, User } from 'lucide-react'
import { BlogPost } from '../types/blog'
 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

interface BlogCardProps {
  post: BlogPost
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
}

export function BlogCard({ post, onEdit, onDelete }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 line-clamp-2">{post.title}</CardTitle>
            <CardDescription className="text-sm text-gray-600 line-clamp-3">
              {post.excerpt}
            </CardDescription>
          </div>
          <div
            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {post.published ? 'Published' : 'Draft'}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(post)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(post.id)}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
