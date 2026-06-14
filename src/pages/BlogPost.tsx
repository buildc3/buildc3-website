import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { getBlogBySlug, type ContentBlock } from '@/data/blogs';

function CodeBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl border border-gray-200 bg-gray-50">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="overflow-x-auto p-5 pt-12 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap font-mono">
        {text}
      </pre>
    </div>
  );
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const blog = slug ? getBlogBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!blog) {
    return <Navigate to="/resources" replace />;
  }

  const content: ContentBlock[] = blog.content ?? [
    { type: 'intro', text: blog.excerpt },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />

      <main className="pt-28 pb-20">
        <style>{`
          @keyframes blogFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes blogFadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .blog-animate-fade-in {
            opacity: 0;
            animation: blogFadeIn 0.8s ease-out forwards;
          }
          .blog-animate-fade-in-up {
            opacity: 0;
            animation: blogFadeInUp 0.8s ease-out forwards;
            animation-delay: 0.5s;
          }
        `}</style>

        {/* Hero Image - Full width outside article container */}
        <div className="w-[90vw] h-[60vh] mx-auto relative rounded-xl overflow-hidden blog-animate-fade-in">
          <img
            src={blog.image}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <article className="max-w-3xl mx-auto px-6 md:px-10 py-10 bg-white rounded-2xl shadow-lg relative -mt-24 z-10 blog-animate-fade-in-up">
          {/* Category */}
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            {blog.category}
          </p>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight tracking-tight text-foreground mb-6">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground mb-10 pb-8 border-b border-gray-200">
            <span>
              <span className="text-gray-400 mr-1">Written by</span>
              <span className="font-medium text-foreground">{blog.author}</span>
            </span>
            <span>{blog.date}</span>
            <span>{blog.category}</span>
          </div>

          {/* Article Body */}
          <div className="space-y-6 text-base leading-relaxed text-gray-700">
            {content.map((block, i) => {
              if (block.type === 'intro') {
                return (
                  <p key={i} className="font-semibold text-foreground leading-relaxed">
                    {block.text}
                  </p>
                );
              }

              if (block.type === 'heading') {
                return (
                  <h2 key={i} className="text-xl md:text-2xl font-bold text-foreground pt-4">
                    {block.text}
                  </h2>
                );
              }

              if (block.type === 'paragraph') {
                return <p key={i}>{block.text}</p>;
              }

              if (block.type === 'code' && block.text) {
                return <CodeBlock key={i} text={block.text} />;
              }

              if (block.type === 'numbered_list' && block.items) {
                return (
                  <ol key={i} className="space-y-6 mt-4">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-foreground text-sm font-bold flex items-center justify-center mt-0.5">
                          {j + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground mb-1">{item.title}</p>
                          <p>{item.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                );
              }

              return null;
            })}
          </div>

          {/* Tags / Share Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-14 pt-8 border-t border-gray-200">
            <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-sm">
              {blog.category}
            </span>
          </div>

          {/* Back link */}
          <div className="mt-10">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0065F4] hover:underline"
            >
              ← Back to all articles
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogPost;
