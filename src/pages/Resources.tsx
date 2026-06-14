import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { blogPosts, type BlogPost } from '@/data/blogs';

const BlogCard = ({ blog, size, index }: { blog: BlogPost, size: 'banner' | 'large' | 'medium' | 'small', index: number }) => {
  const navigate = useNavigate();

  const sizeClasses = {
    banner: 'h-64 md:h-80',
    large: 'h-96 md:h-[520px]',
    medium: 'h-80 md:h-[360px]',
    small: 'h-40 md:h-48',
  };

  const textSizeClasses = {
    banner: 'text-3xl md:text-4xl',
    large: 'text-3xl',
    medium: 'text-lg',
    small: 'text-lg',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/resources/${blog.slug}`)}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${sizeClasses[size]}`}
    >
      <img
        src={blog.image}
        alt={blog.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-3">
          {blog.category}
        </span>
        <h3 className={`font-bold text-white mb-2 ${textSizeClasses[size]}`}>
          {blog.title}
        </h3>
        {(size === 'banner' || size === 'large' || size === 'medium') && (
          <p className="text-slate-200 text-sm line-clamp-2 max-w-2xl">{blog.excerpt}</p>
        )}
        <div className="flex items-center gap-2 mt-3 text-slate-300 text-xs">
          <span>{blog.author}</span>
          <span>·</span>
          <span>{blog.date}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-20 md:pt-24">
        <section className="pb-12 px-4 md:px-6 max-w-7xl mx-auto">
          {/* Full-width title card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 rounded-2xl border border-[#9F8064]/20 px-8 py-12 md:px-12 md:py-16 text-right bg-cover bg-center"
            style={{ backgroundImage: 'url(/resoucrs%20background%20.png)' }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: '#9F8064' }}>
              Resources & Insights
            </h1>
            <p className="mt-4 text-base md:text-lg max-w-md ml-auto font-light leading-relaxed" style={{ color: '#7A6654' }}>
              Practical guides, hard-won lessons, and ideas to help you build better — from choosing what to make to shipping it well.
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left Section: Large + Small Cards */}
            <div className="md:col-span-3 flex flex-col gap-6">
              <BlogCard blog={blogPosts[0]} size="large" index={0} />
              <div className="grid grid-cols-2 gap-6">
                <BlogCard blog={blogPosts[3]} size="small" index={3} />
                <BlogCard blog={blogPosts[2]} size="small" index={2} />
              </div>
            </div>

            {/* Right Section: Two Medium Cards Stacked */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <BlogCard blog={blogPosts[1]} size="medium" index={1} />
              <BlogCard blog={blogPosts[4]} size="medium" index={4} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto border-t">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-slate-200 mb-8 max-w-lg mx-auto">
              Subscribe to our newsletter for the latest resources, guides, and tutorials
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Resources;
