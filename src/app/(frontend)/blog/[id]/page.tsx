// @ts-nocheck


import { headers as getHeaders } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import { Calendar, User, Clock, ArrowLeft, Tag as TagIcon, Share2, Sparkles } from 'lucide-react'

import config from '@/payload.config'
import { getBlogPost, getRecentPosts } from '@/lib/blog-actions'

interface BlogPostPageProps {
  params: {
    id: string
  }
}




const LexicalRenderer = ({ content }) => {
  const renderNode = (node) => {
    // Skip empty nodes
    if (!node || (!node.children && !node.text)) return null;

    switch (node.type) {
      case 'root':
        return (
          <div className="prose prose-lg prose-blue max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-2 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg prose-img:shadow-lg">
            {node.children?.map((child, index) => {
              const rendered = renderNode(child);
              return rendered ? <div key={index}>{rendered}</div> : null;
            })}
          </div>
        );

      case 'heading':
        const HeadingTag = node.tag || 'h1';
        return (
          <HeadingTag>
            {node.children?.map((child, index) => (
              <span key={index}>{renderText(child)}</span>
            ))}
          </HeadingTag>
        );

      case 'paragraph':
        // Skip empty paragraphs
        if (!node.children || node.children.length === 0) return null;
        
       

        const isCodeBlock = node.textFormat === 16;

 


      if (isCodeBlock) {
          return (
            <pre className="bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-500  rounded-xl overflow-x-auto    ">
              <code className="text-sm font-mono">
                {node.children?.map((child, index) => (
                  <span key={index}>{renderText(child)}</span>
                ))}
              </code>
            </pre>
          );
        }
        return (
          <p>
            {node.children?.map((child, index) => (
              <span key={index}>{renderText(child)}</span>
            ))}
          </p>
        );




        return (
          <p>
            {node.children?.map((child, index) => (
              <span key={index}>{renderText(child)}</span>
            ))}
          </p>
        );

      case 'quote':
        return (
          <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 py-2 px-4 my-4">
            {node.children?.map((child, index) => (
              <span key={index}>{renderText(child)}</span>
            ))}
          </blockquote>
        );

      case 'horizontalrule':
        return <hr className="my-6 border-gray-300" />;

      default:
        // If it's an unknown node type but has children, try to render them
        if (node.children && node.children.length > 0) {
          return (
            <div>
              {node.children.map((child, index) => {
                const rendered = renderNode(child);
                return rendered ? <span key={index}>{rendered}</span> : null;
              })}
            </div>
          );
        }
        return null;
    }
  };

  const renderText = (textNode) => {
    if (textNode.type !== 'text') return null;
    
    let text = textNode.text;
    
    // Handle formatting (16 = code/monospace)
    if (textNode.format === 16) {
      return <code className="bg-gray-100 px-2 py-1 rounded text-sm">{text}</code>;
    }
    
    return text;
  };

  // Parse JSON if it's a string
  const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;

  return (
    <div>
      {renderNode(parsedContent.root)}
    </div>
  );
};












export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  
  // Fetch the blog post using Local API
  const post = await getBlogPost(params.id)
  const recentPosts = await getRecentPosts(3)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TechBlog Pro
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              
              {user && (
                <Link
                  href="/admin"
                  target="_blank"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-96 overflow-hidden">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-contain p-4"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

          {/* Article Content */}
          <div className="p-8 lg:p-12">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.category && (
                <span
                  className="px-4 py-2 text-sm font-semibold rounded-full text-white"
                  style={{ backgroundColor: post.category.color }}
                >
                  {post.category.name}
                </span>
              )}
              
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedDate || post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime || 5} min read
                </span>
            
              </div>
            </div>

       
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

       
            <p className="text-xl text-gray-600 leading-relaxed mb-8 border-l-4 border-blue-500 pl-6 italic">
              {post.excerpt}
            </p>

         

      
        

            <LexicalRenderer content={post.content} />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TagIcon className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/?tag=${tag.slug}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share this article</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Twitter
                  </button>
                  <button className="px-4 py-2 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors">
                    LinkedIn
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {recentPosts.length > 0 && (
          <section className="mt-16 ">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
            <div className="grid md:grid-cols-2  w-full gap-3">


              {recentPosts.filter(recentPost => recentPost.id !== post.id).slice(0, 3).map((recentPost) => (
                <article
                  key={recentPost.id}
                  className="bg-whi  backdrop-blur-sm  rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 
                  transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {recentPost.featuredImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={recentPost.featuredImage.url}
                        alt={recentPost.featuredImage.alt || recentPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {recentPost.category && (
                      <span
                        className="inline-block px-2 py-1 text-xs font-semibold rounded-full text-white mb-3"
                        style={{ backgroundColor: recentPost.category.color }}
                      >
                        {recentPost.category.name}
                      </span>
                    )}
                    
                    <Link href={`/blog/${recentPost.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        {recentPost.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {recentPost.excerpt}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500 gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(recentPost.publishedDate || recentPost.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recentPost.readingTime || 5} min
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Posts
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-xl font-bold mb-2">
              <Sparkles className="w-5 h-5" />
              TechBlog Pro
            </div>
            <p className="text-gray-400">
              Built with ❤️ by JUBAIR AHMED 
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}