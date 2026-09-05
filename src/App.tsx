import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import FeesPayment from './pages/FeesPayment';
import BlogList from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Admission from './pages/Admission';
import Events from './pages/Events';
import CourseDetails from './pages/CourseDetails';
import BestNursingCollegesTamilNadu from './pages/BestNursingCollegesTamilNadu';
import Campus from './pages/Campus';
import AdminApp from './admin/AdminApp';
import { HelmetProvider } from 'react-helmet-async';
import SEOWrapper from './components/SEOWrapper';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/best-nursing-colleges-in-tamilnadu" element={<BestNursingCollegesTamilNadu />} />
          <Route path="/best-nursing-college-in-tamilnadu" element={<BestNursingCollegesTamilNadu />} />
          <Route path="/nursing-college-tamil-nadu" element={<BestNursingCollegesTamilNadu />} />
          <Route path="/campus" element={<Campus />} />
          <Route path="/fees" element={<FeesPayment />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/bsc-nursing-admission" element={<Admission />} />
          <Route path="/events" element={<Events />} />

          {/* 301 / SPA Redirects for legacy and external URLs */}
          <Route path="/blogs/10-best-nursing-colleges-in-tamilnadu.html" element={<Navigate to="/" replace />} />
          <Route path="/blogs/*" element={<Navigate to="/" replace />} />
          <Route path="/10-best-nursing-colleges-in-tamilnadu.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function AppRouter({ showSplash, onSplashDone }: { showSplash: boolean; onSplashDone: () => void }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return <AdminApp />;

  return (
    <>
      {showSplash && <SplashScreen onDone={onSplashDone} />}
      <div
        style={{
          opacity: showSplash ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: showSplash ? 'none' : 'auto',
        }}
      >
        <SEOWrapper />
        <PublicLayout />
      </div>
    </>
  );
}

export default function App() {
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const [showSplash, setShowSplash] = useState(() => !isAdminPath);

  useEffect(() => {
    if (isAdminPath) return;

    let isMounted = true;
    async function checkSplashSetting() {
      try {
        const { data } = await supabase
          .from('page_content')
          .select('extra_data')
          .eq('page', 'site')
          .eq('section', 'settings')
          .single();
        
        if (isMounted && data && data.extra_data?.show_splash === false) {
          setShowSplash(false);
        }
      } catch (err) {
        console.error('Splash setting fetch error:', err);
      }
    }
    checkSplashSetting();

    return () => {
      isMounted = false;
    };
  }, [isAdminPath]);

  const onSplashDone = useCallback(() => setShowSplash(false), []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRouter showSplash={showSplash} onSplashDone={onSplashDone} />
      </BrowserRouter>
    </HelmetProvider>
  );
}
