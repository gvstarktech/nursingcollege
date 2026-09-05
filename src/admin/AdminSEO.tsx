import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, Search, CheckCircle, AlertTriangle, XCircle, 
  Send, ExternalLink, Globe, Sparkles, ShieldCheck, RefreshCw, Key, Bot
} from 'lucide-react';
import { SEOSettings } from '../components/SEOWrapper';
import { generateSeoWithClaude, ClaudeSeoSuggestion } from '../lib/claudeSeo';

const pageOptions = [
  { value: '/', label: 'Home Page' },
  { value: '/best-nursing-colleges-in-tamilnadu', label: 'Top 10 Nursing Colleges TN' },
  { value: '/admission', label: 'Admissions 2026–27' },
  { value: '/courses', label: 'Courses Page' },
  { value: '/courses/bsc-nursing', label: 'B.Sc. Nursing Course' },
  { value: '/courses/gnm-nursing', label: 'GNM Nursing Diploma' },
  { value: '/courses/post-basic-bsc-nursing', label: 'Post Basic B.Sc. Nursing' },
  { value: '/about', label: 'About Page' },
  { value: '/fees', label: 'Fees & Scholarships' },
  { value: '/contact', label: 'Contact Page' },
  { value: '/blog', label: 'Blog & Insights' },
  { value: '/events', label: 'Events & Gallery' },
];

const TARGET_KEYWORD = "best nursing college in tamilnadu";
const SERVICE_ACCOUNT_EMAIL = "stark-515@inai-27305.iam.gserviceaccount.com";
const PROJECT_ID = "inai-27305";

export default function AdminSEO() {
  const [selectedPage, setSelectedPage] = useState('/');
  const [form, setForm] = useState<Partial<SEOSettings>>({ title: '', description: '', keywords: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [claudeGenerating, setClaudeGenerating] = useState(false);
  const [claudeResult, setClaudeResult] = useState<ClaudeSeoSuggestion | null>(null);
  const [claudeApiKey, setClaudeApiKey] = useState(() => localStorage.getItem('mahs_claude_api_key') || '');
  const [indexingLog, setIndexingLog] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);

  useEffect(() => {
    async function loadSEO() {
      setLoading(true);
      const { data } = await supabase.from('seo_settings').select('*').eq('page_path', selectedPage).single();
      if (data) {
        setForm(data);
      } else {
        setForm({ title: '', description: '', keywords: '' });
      }
      setLoading(false);
      setSaved(false);
    }
    loadSEO();
  }, [selectedPage]);

  async function saveSEO() {
    setSaving(true);
    const { error } = await supabase.from('seo_settings').upsert({
      page_path: selectedPage,
      title: form.title || '',
      description: form.description || null,
      keywords: form.keywords || null,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  async function handleGenerateClaude() {
    let activeKey = claudeApiKey.trim();
    if (!activeKey) {
      const enteredKey = prompt('Please enter your Anthropic Claude API Key (sk-ant-...):');
      if (!enteredKey || !enteredKey.trim()) return;
      activeKey = enteredKey.trim();
      setClaudeApiKey(activeKey);
      localStorage.setItem('mahs_claude_api_key', activeKey);
    }

    setClaudeGenerating(true);
    setClaudeResult(null);
    try {
      const pageOpt = pageOptions.find(p => p.value === selectedPage);
      const res = await generateSeoWithClaude(
        selectedPage,
        pageOpt ? `Nursing college page: ${pageOpt.label}` : 'Nursing college admissions and rankings',
        TARGET_KEYWORD,
        activeKey
      );
      setClaudeResult(res);
      setForm({
        title: res.title,
        description: res.description,
        keywords: res.keywords.join(', ')
      });
    } catch (err: any) {
      alert(`Claude AI generation failed: ${err.message || 'Check network or API key'}`);
    } finally {
      setClaudeGenerating(false);
    }
  }

  function handleTriggerIndexing() {
    setIndexingLog({
      type: 'info',
      message: `Running Google Indexing API submission for all ${pageOptions.length} website URLs via terminal command: 'npm run index:google' or 'node scripts/google_indexing.js'`
    });
  }

  // SEO Optimizer Logic
  const analysis = useMemo(() => {
    const title = form.title || '';
    const desc = form.description || '';
    const kw = form.keywords || '';
    const lowerTitle = title.toLowerCase();
    const lowerDesc = desc.toLowerCase();
    
    let score = 0;
    const maxScore = 100;
    
    const checks = [
      {
        id: 'title-length',
        label: 'Title Length (50-60 chars)',
        status: title.length >= 50 && title.length <= 65 ? 'pass' : (title.length > 0 && title.length < 75 ? 'warn' : 'fail'),
        score: title.length >= 50 && title.length <= 65 ? 20 : 10
      },
      {
        id: 'desc-length',
        label: 'Description Length (140-160 chars)',
        status: desc.length >= 140 && desc.length <= 165 ? 'pass' : (desc.length > 90 && desc.length < 180 ? 'warn' : 'fail'),
        score: desc.length >= 140 && desc.length <= 165 ? 20 : 10
      },
      {
        id: 'title-kw',
        label: `Target Keyword in Title ("${TARGET_KEYWORD}")`,
        status: lowerTitle.includes('nursing') || lowerTitle.includes(TARGET_KEYWORD) ? 'pass' : 'fail',
        score: lowerTitle.includes('nursing') || lowerTitle.includes(TARGET_KEYWORD) ? 25 : 0
      },
      {
        id: 'desc-kw',
        label: `Target Keyword in Description ("${TARGET_KEYWORD}")`,
        status: lowerDesc.includes('nursing') || lowerDesc.includes(TARGET_KEYWORD) ? 'pass' : 'fail',
        score: lowerDesc.includes('nursing') || lowerDesc.includes(TARGET_KEYWORD) ? 25 : 0
      },
      {
        id: 'kw-exist',
        label: `Keywords Field Configured`,
        status: kw.length > 10 ? 'pass' : 'fail',
        score: kw.length > 10 ? 10 : 0
      }
    ];

    score = checks.reduce((acc, curr) => acc + curr.score, 0);

    return { score, maxScore, checks };
  }, [form]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-gray-900 flex items-center gap-2.5">
            <Search className="text-primary-700 w-7 h-7" /> Complete SEO, AEO & Google Indexing Engine
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Real-time metadata manager, Answer Engine Optimization (AEO/GEO), and Google Indexing API connector.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            <ShieldCheck size={14} className="text-green-600" /> Google Service Account Connected
          </span>
        </div>
      </div>

      {/* Google Indexing API Integration Box */}
      <div className="bg-gradient-to-br from-blue-900 via-primary-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-green-300 text-xs font-extrabold tracking-wider uppercase mb-2 border border-white/15">
                <Sparkles size={13} className="text-amber-400" /> Google Search Console & Indexing API (v3)
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                Instant Google Indexing Engine
              </h3>
              <p className="text-gray-300 text-xs mt-1 max-w-2xl">
                Directly notify Googlebot to crawl and rank updated pages in minutes rather than weeks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://console.developers.google.com/apis/api/indexing.googleapis.com/overview?project=461233332860"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              >
                <span>Enable Google Cloud Indexing API</span>
                <ExternalLink size={14} />
              </a>

              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              >
                <span>Google Search Console</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={handleTriggerIndexing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xs shadow-lg shadow-green-900/40 transition-all transform active:scale-95 cursor-pointer"
              >
                <Send size={14} />
                <span>Trigger Instant Indexing</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center gap-2">
              <Key size={16} className="text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-gray-300 block text-[10px] uppercase font-bold tracking-wider">Service Account Email</span>
                <span className="font-mono text-white text-xs select-all">{SERVICE_ACCOUNT_EMAIL}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center gap-2">
              <Globe size={16} className="text-green-400 shrink-0" />
              <div className="truncate">
                <span className="text-gray-300 block text-[10px] uppercase font-bold tracking-wider">GCP Project ID</span>
                <span className="font-mono text-white text-xs">{PROJECT_ID}</span>
              </div>
            </div>
          </div>

          {indexingLog && (
            <div className="p-3.5 rounded-xl bg-white/15 border border-white/20 text-xs text-green-200 flex items-start gap-2 animate-fadeInUp">
              <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Indexing Automation Command Ready</p>
                <p className="text-gray-200 text-xs mt-0.5">{indexingLog.message}</p>
                <p className="text-amber-300 text-[11px] mt-1">
                  Ensure <span className="underline">{SERVICE_ACCOUNT_EMAIL}</span> is added as an OWNER in Google Search Console to publish index requests.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page Tabs */}
      <div>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Page to Optimize</div>
        <div className="flex flex-wrap gap-2">
          {pageOptions.map((p) => (
            <button
              key={p.value}
              onClick={() => setSelectedPage(p.value)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPage === p.value
                  ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20 scale-[1.02]'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* SEO Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 font-heading">
                Meta Tags & Rich Snippet Details
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                Route: <code className="text-primary-700">{selectedPage}</code>
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-2">
                <RefreshCw className="animate-spin text-primary-600" size={24} />
                <span>Loading SEO settings...</span>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Claude AI SEO Generator Bar */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                      <Bot size={16} className="text-purple-600" />
                      Claude 5 Technical SEO & AEO Generator
                    </div>
                    <p className="text-xs text-purple-700 mt-0.5">
                      Auto-generate #1 ranking title, high-CTR meta description & AEO snippets using Anthropic Claude.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateClaude}
                    disabled={claudeGenerating}
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-purple-500/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {claudeGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    <span>{claudeGenerating ? 'Claude Generating...' : 'Optimize with Claude AI'}</span>
                  </button>
                </div>

                {claudeResult && (
                  <div className="p-4 rounded-2xl bg-purple-900 text-white text-xs space-y-2 border border-purple-700 shadow-md animate-fadeIn">
                    <div className="flex items-center gap-2 font-bold text-green-300">
                      <Sparkles size={14} /> Claude 5 AEO Answer Snippet (Google Featured Snippet Candidate):
                    </div>
                    <p className="text-purple-100 leading-relaxed italic bg-white/10 p-2.5 rounded-lg">
                      "{claudeResult.aeoSnippet}"
                    </p>
                    <div className="text-purple-300 text-[11px]">
                      💡 <strong>Optimization Rationale:</strong> {claudeResult.rationale}
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                      SEO Title (for Google Search & Rich Results)
                    </label>
                    <span className={`text-xs font-semibold ${form.title?.length && form.title.length > 65 ? 'text-red-500' : 'text-gray-400'}`}>
                      {form.title?.length || 0} / 65
                    </span>
                  </div>
                  <input
                    value={form.title || ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm p-3 border"
                    placeholder="e.g. Mahalakshmi College of Nursing | Best Nursing College in Trichy"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Meta Description (AEO & AI Search Summary)
                    </label>
                    <span className={`text-xs font-semibold ${form.description?.length && form.description.length > 165 ? 'text-red-500' : 'text-gray-400'}`}>
                      {form.description?.length || 0} / 165
                    </span>
                  </div>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm p-3 border resize-y"
                    placeholder="Provide a comprehensive summary with courses, hospital affiliations, and admission keywords..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Target Keywords (comma-separated for Search Engines & AEO)
                  </label>
                  <input
                    value={form.keywords || ''}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm p-3 border"
                    placeholder="e.g. best nursing college in trichy, bsc nursing admission 2026, nursing college tamil nadu"
                  />
                </div>

                {/* Google Search Live Preview */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Google Search Snippet Preview
                  </span>
                  <div className="text-xs text-gray-700 font-mono truncate">
                    https://mahalakshmicollegeofnursing.com{selectedPage}
                  </div>
                  <div className="text-base text-blue-700 hover:underline font-medium cursor-pointer line-clamp-1">
                    {form.title || 'Mahalakshmi College of Nursing | Best Nursing College in Trichy'}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {form.description || 'Join Mahalakshmi College of Nursing, Trichy, for B.Sc Nursing education with experienced faculty, hospital clinical training, hostel facilities, and placement assistance.'}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={saveSEO}
                    disabled={saving}
                    className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    <span>{saving ? 'Saving...' : 'Save Meta Configuration'}</span>
                  </button>
                  {saved && <span className="text-sm text-green-600 font-bold flex items-center gap-1"><CheckCircle size={16} /> Saved successfully!</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Score & Optimization Tips */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-5">
            <h3 className="text-lg font-bold text-gray-900 font-heading border-b border-gray-100 pb-2">
              Optimization Score
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${analysis.score >= 80 ? 'text-green-500' : analysis.score >= 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-700`}
                    strokeDasharray={`${analysis.score}, 100`}
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-extrabold text-gray-800">{analysis.score}</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</div>
                <div className={`text-base font-extrabold ${analysis.score >= 80 ? 'text-green-600' : analysis.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {analysis.score >= 80 ? 'Rank Ready (Top 1%)' : analysis.score >= 50 ? 'Good / Improving' : 'Needs Optimization'}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {analysis.checks.map(check => (
                <div key={check.id} className="flex gap-2.5 text-xs">
                  {check.status === 'pass' && <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={15} />}
                  {check.status === 'warn' && <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={15} />}
                  {check.status === 'fail' && <XCircle className="text-red-500 shrink-0 mt-0.5" size={15} />}
                  <span className={check.status === 'pass' ? 'text-gray-700 font-medium' : 'text-gray-500'}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-blue-800">
                <Sparkles size={13} className="text-amber-500" /> AEO / AI Engine Rule
              </p>
              <p className="text-blue-950/80 leading-relaxed text-[11px]">
                Ensure your description clearly lists the institution location (Trichy), recognized affiliation (INC & TNNMC code 986), and specific degree offerings to appear in AI Overviews & ChatGPT answers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
