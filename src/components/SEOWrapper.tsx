import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';

export interface SEOSettings {
  page_path: string;
  title: string;
  description: string | null;
  keywords: string | null;
}

const ROUTE_SEO_DEFAULTS: Record<string, SEOSettings> = {
  '/': {
    page_path: '/',
    title: 'Best Nursing College in Tamil Nadu | Mahalakshmi College of Nursing - Admissions 2026',
    description: 'Ranked #1 Best Nursing College in Tamil Nadu: Mahalakshmi College of Nursing. INC Code 986 & TNNMC approved B.Sc Nursing & GNM with 10+ bed hospital rotations, 9 simulation labs, hostel & 100% placements. Admissions 2026–27.',
    keywords: 'best nursing college in tamilnadu, best nursing college in tamil nadu, best nursing colleges in tamilnadu, top nursing college in tamil nadu, Best Nursing Colleges in Tamil Nadu - Courses, Fees, bsc nursing colleges in tamilnadu, nursing admission 2026 tamil nadu'
  },
  '/best-nursing-colleges-in-tamilnadu': {
    page_path: '/best-nursing-colleges-in-tamilnadu',
    title: 'Best Nursing Colleges in Tamil Nadu 2026 - Courses, Fees & Top 10 Ranking',
    description: 'Best Nursing Colleges in Tamil Nadu - Courses, Fees, Eligibility & 2026-27 Admissions. Compare Top 10 B.Sc Nursing institutes, INC Code 986, 10+ bed hospital rotations & 100% placements.',
    keywords: 'Best Nursing Colleges in Tamil Nadu - Courses, Fees, top 10 nursing colleges in tamilnadu, best nursing college in tamilnadu, best nursing colleges in tamil nadu, top nursing colleges in tamil nadu'
  },
  '/courses/bsc-nursing': {
    page_path: '/courses/bsc-nursing',
    title: 'B.Sc Nursing Course in Tamil Nadu (2026) | Mahalakshmi College of Nursing',
    description: 'Top B.Sc Nursing 4-year degree in Tamil Nadu at Mahalakshmi College of Nursing. INC Code: 986, MGR University, 10+ bed hospital rotations & 100% placements. Admissions 2026–27.',
    keywords: 'best nursing college in tamilnadu, BSc Nursing College Trichy, Best Nursing College Tamil Nadu, INC Code 986 BSc Nursing, BSc Nursing Admission 2026 Tamil Nadu'
  },
  '/admission': {
    page_path: '/admission',
    title: 'Nursing Admissions 2026–27 | Mahalakshmi College of Nursing Tamil Nadu',
    description: 'Apply for B.Sc Nursing & GNM Admissions 2026–27 at Mahalakshmi College of Nursing, Tamil Nadu. INC Code: 986, 10+ bed hospital rotations, scholarships & 100% placement assurance.',
    keywords: 'Nursing Admission 2026-27 Tamil Nadu, BSc Nursing Application Form, Direct Nursing Admission Trichy, Best Nursing College in Tamil Nadu'
  },
  '/courses': {
    page_path: '/courses',
    title: 'Best Nursing Courses in Tamil Nadu (2026) | Mahalakshmi College of Nursing',
    description: 'Explore B.Sc Nursing, GNM & Post Basic B.Sc courses at Mahalakshmi College of Nursing, Tamil Nadu. INC Code 986, 10+ bed hospital rotations & 100% placements.',
    keywords: 'best nursing courses in tamil nadu, best nursing college in tamilnadu, BSc Nursing Course Trichy, GNM Nursing Admission Tamil Nadu'
  },
  '/about': {
    page_path: '/about',
    title: 'About Mahalakshmi College of Nursing | Best Nursing College in Tamil Nadu',
    description: 'Learn about Mahalakshmi College of Nursing in Trichy, Tamil Nadu. Estd. 2021 under Chairman Mr. Ravi. INC Code 986 & TNNMC recognized with 10+ bed hospital clinical rotations.',
    keywords: 'Mahalakshmi College of Nursing, About Mahalakshmi Nursing College, INC Recognized Nursing College Trichy, Best Nursing Institution Tamil Nadu'
  },
  '/campus': {
    page_path: '/campus',
    title: 'Nursing College Hostel, 9 Simulation Labs & Campus Facilities | Mahalakshmi College Trichy',
    description: 'Explore 9 specialized nursing simulation laboratories, separate secure student hostels, digital library, and college bus fleet at Mahalakshmi College of Nursing, Trichy, Tamil Nadu.',
    keywords: 'nursing college with hostel in tamil nadu, nursing simulation labs trichy, mahalakshmi college campus facilities, best nursing college hostel trichy'
  },
  '/fees': {
    page_path: '/fees',
    title: 'B.Sc Nursing Fees & Online Payment Portal | Mahalakshmi College of Nursing',
    description: 'Official online fee payment and scholarship guidance for B.Sc Nursing and GNM at Mahalakshmi College of Nursing, Trichy. Transparent fee structure and government scholarship assistance.',
    keywords: 'nursing college fees tamil nadu, bsc nursing fee structure trichy, online fee payment mahalakshmi nursing'
  },
  '/contact': {
    page_path: '/contact',
    title: 'Contact Admissions Desk & Campus Location | Mahalakshmi College of Nursing Trichy',
    description: 'Contact Mahalakshmi College of Nursing for 2026-27 admissions helpline (+91 73588 73106), campus address on Trichy-Salem Highway, Melpathu, Mannachanallur Taluk.',
    keywords: 'contact mahalakshmi nursing college, nursing admission helpline trichy, mahalakshmi college trichy address'
  },
  '/events': {
    page_path: '/events',
    title: 'College Events, Clinical Workshops & Gallery | Mahalakshmi College of Nursing',
    description: 'View photos and highlights from Lamp Lighting ceremonies, World Health Day, hospital clinical workshops, and campus activities at Mahalakshmi College of Nursing.',
    keywords: 'nursing college events trichy, lamp lighting ceremony mahalakshmi, nursing students clinical workshop'
  },
  '/blog': {
    page_path: '/blog',
    title: 'Nursing Career Insights, B.Sc Nursing Guides & Health Articles | MCN Trichy',
    description: 'Expert guides on B.Sc Nursing admissions, clinical simulation skills, NCLEX-RN exam preparation, and healthcare careers from faculty at Mahalakshmi College of Nursing.',
    keywords: 'nursing career guide tamil nadu, bsc nursing scope india, nclex rn guidance trichy, nursing college blog'
  }
};

export default function SEOWrapper() {
  const location = useLocation();
  const [seo, setSeo] = useState<SEOSettings | null>(() => ROUTE_SEO_DEFAULTS[location.pathname] || ROUTE_SEO_DEFAULTS['/']);

  useEffect(() => {
    async function fetchSEO() {
      const fallback = ROUTE_SEO_DEFAULTS[location.pathname] || ROUTE_SEO_DEFAULTS['/'];
      try {
        const { data, error } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page_path', location.pathname)
          .single();
        
        if (!error && data) {
          setSeo(data as SEOSettings);
        } else {
          setSeo(fallback);
        }
      } catch {
        setSeo(fallback);
      }
    }
    fetchSEO();
  }, [location.pathname]);

  if (!seo) return null;

  return (
    <Helmet>
      <title>{seo.title}</title>
      {seo.description && <meta name="description" content={seo.description} />}
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      
      {/* Open Graph / Facebook / LinkedIn SEO */}
      <meta property="og:title" content={seo.title} />
      {seo.description && <meta property="og:description" content={seo.description} />}
      <meta property="og:url" content={`https://mahalakshmicollegeofnursing.com${location.pathname}`} />
      
      {/* Twitter Card SEO */}
      <meta name="twitter:title" content={seo.title} />
      {seo.description && <meta name="twitter:description" content={seo.description} />}
    </Helmet>
  );
}
