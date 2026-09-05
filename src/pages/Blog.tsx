import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Calendar, User, Clock, Tag, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { supabase, type Blog } from '../lib/supabase';
import { FadeIn, StaggerChildren } from '../components/Animate';
import { SEO } from '../components/SEO';

const LEGACY_SEED_IDS = [
  '2f038858-c1c2-4cd4-9f82-ad27429d0f64',
  '801f5a5d-d4f3-49f0-acc2-e4b3cb3ea60f',
  '39f1cd79-244a-4785-aeea-91405e3086d1',
];

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Career' | 'Campus Life'>('All');

  useEffect(() => {
    async function loadBlogs() {
      let list: Blog[] = [];
      try {
        const { data } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (data) {
          list = data
            .filter((b) => !LEGACY_SEED_IDS.includes(b.id))
            .map((b) => ({
              ...b,
              category: b.category === 'Nursing' ? 'Career' : (b.category || 'Career'),
            }));
        }

        // Merge from page_content fallback
        const { data: pageContentData } = await supabase
          .from('page_content')
          .select('*')
          .eq('page', 'blog')
          .eq('section', 'custom_blogs')
          .maybeSingle();

        if (pageContentData && pageContentData.extra_data && Array.isArray((pageContentData.extra_data as any).blogs)) {
          const extraBlogs = (pageContentData.extra_data as any).blogs as Blog[];
          extraBlogs.forEach((extra) => {
            if (!list.some((b) => b.id === extra.id || b.slug === extra.slug)) {
              list.unshift(extra);
            }
          });
        }

        // Merge from localStorage fallback
        const localData = localStorage.getItem('mahs_custom_blog_posts');
        if (localData) {
          try {
            const localBlogs = JSON.parse(localData) as Blog[];
            localBlogs.forEach((lblg) => {
              if (!list.some((b) => b.id === lblg.id || b.slug === lblg.slug)) {
                list.unshift(lblg);
              }
            });
          } catch {
            // Ignore parse errors
          }
        }
      } catch (err) {
        console.error('Error in loadBlogs:', err);
      } finally {
        setBlogs(list);
        setLoading(false);
      }
    }

    loadBlogs();
  }, []);

  const categories: ('All' | 'Career' | 'Campus Life')[] = ['All', 'Career', 'Campus Life'];

  const filtered = blogs.filter((b) => {
    const categoryName = b.category === 'Nursing' ? 'Career' : (b.category || 'Career');
    const matchCat = selectedCategory === 'All' || categoryName === selectedCategory;
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.excerpt ?? '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredPost = filtered.length > 0 ? filtered[0] : null;
  const remainingPosts = filtered.length > 1 ? filtered.slice(1) : [];

  return (
    <div className="page-enter bg-gray-50/50 min-h-screen">
      <SEO 
        title="Mahalakshmi College of Nursing | News, Blogs & Health Articles"
        description="Read nursing career guides, OSCE clinical simulation insights, healthcare articles, and student stories from Mahalakshmi College of Nursing in Trichy."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/blog"
        keywords={['Mahalakshmi College of Nursing', 'Nursing Blog Trichy', 'BSc Nursing Career Guide', 'OSCE Simulation Insights', 'Nursing Student Stories']}
      />
      {/* ─── Hero Section ─── */}
      <section className="relative py-24 md:py-32 text-white bg-primary-950 overflow-hidden">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeInDown inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 text-green-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-inner">
            <Sparkles size={14} className="text-green-400" />
            <span>Official Nursing Journal & News</span>
          </div>

          <h1 className="animate-fadeInUp delay-100 text-4xl md:text-6xl font-heading font-black tracking-tight leading-tight mb-4">
            Nursing <span className="text-green-300">Blog & Insights</span>
          </h1>

          <p className="animate-fadeInUp delay-200 text-gray-200 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
            Stay updated with nursing career guides, OSCE clinical simulation insights, and campus life stories published by Mahalakshmi College of Nursing.
          </p>

          <div className="animate-fadeInUp delay-300 flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
            <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-green-300 font-semibold">Blog</span>
          </div>
        </div>
      </section>

      {/* ─── Search & Category Filter Bar ─── */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 md:top-20 z-30 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search published articles..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills (All, Career, Campus Life) */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === 'All'
                    ? blogs.length
                    : blogs.filter((b) => (b.category === 'Nursing' ? 'Career' : (b.category || 'Career')) === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-green-500 text-white shadow-md shadow-green-500/25 scale-[1.02]'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <Tag size={12} className={isSelected ? 'text-white' : 'text-gray-400'} />
                    {cat}
                    <span
                      className={`ml-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Section ─── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-2xl" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            /* ─── Empty State When Admin Has Not Published Any Posts Yet ─── */
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center mx-auto mb-4 border border-primary-100 shadow-sm">
                <BookOpen size={30} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">No Published Blog Articles Yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                Articles, news, and guides published directly by the college administration from the Admin Panel will automatically appear here.
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/" className="btn-primary text-xs px-6 py-2.5">
                  Return to Home
                </Link>
                <Link to="/admission" className="btn-green text-xs px-6 py-2.5">
                  View Admissions Info
                </Link>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            /* ─── Empty Search Result State ─── */
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-800 mb-1">No Matching Articles</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any blog posts matching "{search}". Try searching with a different keyword or category.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                className="btn-primary text-xs px-6 py-2.5"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* ─── Featured Article Showcase ─── */}
              {featuredPost && (
                <FadeIn direction="up">
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:border-green-300 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12"
                  >
                    <div className="lg:col-span-7 h-72 lg:h-auto overflow-hidden relative">
                      <img
                        src={
                          featuredPost.image_url ??
                          'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=800'
                        }
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-500 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                          Featured Article
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full border border-primary-100 flex items-center gap-1">
                            <Tag size={12} />
                            {featuredPost.category === 'Nursing' ? 'Career' : featuredPost.category || 'Career'}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Clock size={12} /> Published Notice
                          </span>
                        </div>

                        <h2 className="font-heading font-black text-xl sm:text-2xl text-gray-900 leading-snug group-hover:text-primary-700 transition-colors mb-3">
                          {featuredPost.title}
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            {featuredPost.author?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">{featuredPost.author}</div>
                            <div className="text-[10px] text-gray-400">
                              {new Date(featuredPost.published_at ?? featuredPost.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>

                        <span className="text-primary-700 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read Article <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              )}

              {/* ─── Articles Grid ─── */}
              {remainingPosts.length > 0 && (
                <div>
                  <FadeIn direction="up">
                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                      <BookOpen size={20} className="text-green-500" />
                      More Articles ({remainingPosts.length})
                    </h3>
                  </FadeIn>

                  <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={80}>
                    {remainingPosts.map((blog) => (
                      <Link
                        to={`/blog/${blog.slug}`}
                        key={blog.id}
                        className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div>
                          <div className="overflow-hidden h-52 relative">
                            <img
                              src={
                                blog.image_url ??
                                'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=600'
                              }
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="bg-white/90 backdrop-blur-md text-primary-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <Tag size={10} className="text-green-600" />
                                {blog.category === 'Nursing' ? 'Career' : blog.category || 'Career'}
                              </span>
                            </div>
                          </div>

                          <div className="p-6 space-y-3">
                            <h3 className="font-heading font-bold text-lg text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                              {blog.title}
                            </h3>
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                              {blog.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 mt-auto">
                          <span className="flex items-center gap-1.5 font-medium text-gray-600">
                            <User size={12} className="text-green-600" /> {blog.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(blog.published_at ?? blog.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </StaggerChildren>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
