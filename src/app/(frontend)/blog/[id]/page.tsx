import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  BookmarkPlus, 
  Heart,
  MessageCircle,
  ChevronRight,
  Tag
} from 'lucide-react'
import { getBlogPost } from '@/lib/blog-actions'

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
  const post = await getBlogPost(params.id)  // Use params.id
  
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                <BookmarkPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-5">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
       
            <span className="text-gray-900 font-medium">{post.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>5 min read</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700"
                >
                  <Tag className="w-3 h-3" />
                  {typeof tag === 'string' ? tag : tag.name || tag.tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-4">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Article Content */}
          <article className="lg:col-span-8">
            {/* Content */}

 
          
             <LexicalRenderer content={post.content} />
           
            {/* Article Actions */}
            <div className="mt-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Was this article helpful?
                </div>
                <div className="flex items-center gap-4">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-all">
                    <Heart className="w-4 h-4" />
                    Like
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-all">
                    <MessageCircle className="w-4 h-4" />
                    Comment
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-all">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                <p className="text-blue-100 mb-6">
                  Get the latest articles and insights delivered to your inbox.
                </p>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}