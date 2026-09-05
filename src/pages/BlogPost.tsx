import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, ArrowLeft } from 'lucide-react';
import DOMPurify from 'dompurify';
import { supabase, type Blog } from '../lib/supabase';
import { SEO } from '../components/SEO';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    loadBlog(slug);
  }, [slug]);

  async function loadBlog(slug: string) {
    setLoading(true);
    let targetBlog: Blog | null = null;
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      targetBlog = data;
    } else {
      // Fallback check page_content
      const { data: pcData } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', 'blog')
        .eq('section', 'custom_blogs')
        .maybeSingle();

      if (pcData && pcData.extra_data && Array.isArray((pcData.extra_data as any).blogs)) {
        const found = ((pcData.extra_data as any).blogs as Blog[]).find((b) => b.slug === slug);
        if (found) targetBlog = found;
      }

      // Fallback check localStorage
      if (!targetBlog) {
        const localData = localStorage.getItem('mahs_custom_blog_posts');
        if (localData) {
          try {
            const localBlogs = JSON.parse(localData) as Blog[];
            const found = localBlogs.find((b) => b.slug === slug);
            if (found) targetBlog = found;
          } catch {
            // Ignore parse errors
          }
        }
      }
    }

    if (!targetBlog) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setBlog(targetBlog);

    const { data: relatedData } = await supabase
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .eq('category', targetBlog.category ?? '')
      .neq('id', targetBlog.id)
      .limit(3);
    if (relatedData) setRelated(relatedData);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
        <SEO title="Mahalakshmi College of Nursing | Blog Post Not Found" />
        <h2 className="text-3xl font-heading font-bold text-gray-800 mb-4">Post Not Found</h2>
        <p className="text-gray-500 mb-8">The blog post you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt ?? blog.title,
    "image": blog.image_url ?? 'https://mahalakshmicollegeofnursing.com/mahalakshmi_nursing_logo.png',
    "author": {
      "@type": "Organization",
      "name": "Mahalakshmi College of Nursing",
      "url": "https://mahalakshmicollegeofnursing.com"
    },
    "publisher": {
      "@type": "CollegeOrUniversity",
      "name": "Mahalakshmi College of Nursing",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mahalakshmicollegeofnursing.com/mahalakshmi_nursing_logo.png"
      }
    },
    "datePublished": blog.created_at ?? new Date().toISOString()
  };

  return (
    <div>
      <SEO 
        title={`Mahalakshmi College of Nursing | ${blog.title}`}
        description={blog.excerpt ?? blog.title}
        canonicalUrl={`https://mahalakshmicollegeofnursing.com/blog/${blog.slug}`}
        ogImage={blog.image_url ?? undefined}
        schema={blogSchema}
      />
      {/* Hero */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={blog.image_url ?? 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=1600'}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-green-300 line-clamp-1">{blog.title}</span>
          </div>
          <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {blog.category ?? 'General'}
          </span>
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-white line-clamp-3">{blog.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
                <span className="flex items-center gap-1.5"><User size={14} className="text-primary-700" /> {blog.author}</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary-700" />
                  {new Date(blog.published_at ?? blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              {blog.excerpt && (
                <p className="text-gray-600 text-lg leading-relaxed mb-8 italic border-l-4 border-green-500 pl-5">
                  {blog.excerpt}
                </p>
              )}
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content ?? '', {
                    ALLOWED_TAGS: [
                      'p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'br', 'img', 'span',
                      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div'
                    ],
                    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style']
                  })
                }}
              />
              <div className="mt-10 pt-8 border-t border-gray-200">
                <Link to="/blog" className="flex items-center gap-2 text-primary-700 hover:text-green-600 font-semibold transition-colors">
                  <ArrowLeft size={16} /> Back to Blog
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {related.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-heading font-bold text-base text-gray-900 mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link key={r.id} to={`/blog/${r.slug}`} className="flex gap-3 group">
                        <img
                          src={r.image_url ?? ''}
                          alt={r.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-primary-700 transition-colors">{r.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(r.published_at ?? r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="card p-6 bg-primary-700 text-white">
                <h3 className="font-heading font-bold text-base mb-3">Apply for Admission</h3>
                <p className="text-primary-200 text-sm mb-4">Ready to start your healthcare career? Apply to Mahalakshmi College today.</p>
                <Link to="/admission" className="btn-green w-full block text-center text-sm py-2.5">
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
