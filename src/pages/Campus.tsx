import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Wifi, BookOpen, Dumbbell, Utensils, Bus, 
  Home as HomeIcon, Stethoscope, Users, HeartPulse, Baby,
  Laptop, Video 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FadeIn, StaggerChildren } from '../components/Animate';
import { SEO } from '../components/SEO';

interface ContentMap {
  [key: string]: { title?: string; subtitle?: string; content?: string; extra_data?: Record<string, unknown> };
}

const nursingLaboratories = [
  { icon: Stethoscope, title: 'Foundation Lab', category: 'Core Clinical', desc: 'Equipped with full-size adult and child simulation manikins, clinical beds, CPR trainers, and crash carts for fundamental nursing procedures and bedside care.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=compress&cs=tinysrgb&w=600' },
  { icon: BookOpen, title: 'Anatomy & Physiology Lab', category: 'Basic Sciences', desc: 'Anatomical specimen jars, articulated skeletons, 3D muscular and organ system models, and high-definition microscopes.', image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=compress&cs=tinysrgb&w=600' },
  { icon: Users, title: 'Community Nursing Lab', category: 'Public Health', desc: 'Urban and rural health delivery simulation with community nursing bags, family health records, vaccination cold-chain units, and health education kits.', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=compress&cs=tinysrgb&w=600' },
  { icon: HeartPulse, title: 'OBG Lab (Maternal & Neonatal)', category: 'Specialized Nursing', desc: 'Birthing simulators, maternal pelvimetry models, fetal Doppler monitors, and neonatal resuscitation units for specialized maternal-child care.', image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=compress&cs=tinysrgb&w=600' },
  { icon: Utensils, title: 'Nutrition Lab', category: 'Dietetics', desc: 'Culinary workstations, caloric calculation charts, dietary scales, and nutrient analysis tools for therapeutic diet formulation.', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=compress&cs=tinysrgb&w=600' },
  { icon: Baby, title: 'Paediatric Nursing Lab', category: 'Child Health', desc: 'Child-friendly simulation ward with infant incubators, pediatric CPR manikins, phototherapy units, and developmental monitoring charts.', image: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=compress&cs=tinysrgb&w=600' },
  { icon: Dumbbell, title: 'Sports Lab', category: 'Physical Health', desc: 'Sports science and fitness facility with cardiovascular equipment, body composition analyzers, and athletic training gear.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=600' },
  { icon: Laptop, title: 'Computer Lab', category: 'Health Informatics', desc: 'High-speed networked PC terminals with hospital information system demo software, statistical tools, and online nursing e-library access.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=compress&cs=tinysrgb&w=600' },
  { icon: Video, title: 'Audio Visual Lab', category: 'AV Technology', desc: 'Smart interactive displays, 4K digital projectors, 3D anatomical charts, and multimedia production tools for patient education and health seminars.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=compress&cs=tinysrgb&w=600' },
];

const campusAmenities = [
  { icon: HomeIcon, title: 'Hostel Facilities', desc: 'Separate, secure hostels for female and male students with 24/7 security, dining halls, and study rooms.', image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { icon: Bus, title: 'Transport Fleet', desc: 'Well-maintained fleet of college buses covering all major routes across Tiruchirappalli, Srirangam, and Mannachanallur.', image: 'https://images.pexels.com/photos/327345/pexels-photo-327345.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { icon: BookOpen, title: 'Digital Central Library', desc: 'Vast collection of nursing textbooks, national & international journals, and online medical research databases.', image: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { icon: Wifi, title: 'Smart Classrooms', desc: 'Air-conditioned digital classrooms with smart interactive boards and multimedia audiovisual equipment.', image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const defaultGalleryImages = [
  'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export default function Campus() {
  const [content, setContent] = useState<ContentMap>({});
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'campus').then(({ data }) => {
      if (data) {
        const map: ContentMap = {};
        data.forEach((item) => { map[item.section] = item; });
        setContent(map);

        const galleryItem = data.find((item) => item.section === 'gallery');
        if (galleryItem && galleryItem.extra_data && Array.isArray((galleryItem.extra_data as any).images)) {
          setGallery((galleryItem.extra_data as any).images);
        } else {
          setGallery(defaultGalleryImages);
        }
      }
    });

  }, []);

  const hero = content['hero'];

  return (
    <div className="page-enter">
      <SEO 
        title="Mahalakshmi College of Nursing | Campus Facilities - OSCE Simulation Labs & Hostel"
        description="Explore the state-of-the-art campus facilities, OSCE simulation laboratories, smart classrooms, hostels, and sports complex at Mahalakshmi College of Nursing, Trichy."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/campus"
        keywords={['Mahalakshmi College of Nursing', 'Nursing Simulation Labs Trichy', 'Mahalakshmi College Campus', 'Nursing Hostel Facilities Trichy', 'OSCE Nursing Suite']}
      />
      {/* Hero */}
      <section
        className="relative py-28 text-white overflow-hidden hero-bg-animate"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1600')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary-900/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="animate-fadeInDown text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">{hero?.subtitle ?? 'A World-Class Learning Environment'}</p>
          <h1 className="animate-fadeInUp delay-100 text-4xl md:text-5xl font-heading font-bold mb-4">{hero?.title ?? 'Our Campus'}</h1>
          <p className="animate-fadeInUp delay-200 text-gray-200 max-w-2xl mx-auto leading-relaxed">{hero?.content}</p>
          <div className="animate-fadeInUp delay-300 flex items-center justify-center gap-2 mt-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-green-300">Campus</span>
          </div>
        </div>
      </section>

      {/* AEO Direct Answer Summary Box */}
      <section className="py-8 bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 border border-green-200/80 shadow-xs">
            <h2 className="text-base sm:text-lg font-heading font-bold text-green-900 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              Campus Infrastructure & Clinical Facilities Overview
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              <strong>Mahalakshmi College of Nursing</strong> in Tiruchirappalli (Trichy), Tamil Nadu, features <strong>9 specialized nursing simulation laboratories</strong> designed to Indian Nursing Council (INC Code: 986) standards, including Foundation, Anatomy, OBG, Pediatric, and Community Health labs. The campus provides <strong>separate, 24/7 guarded secure hostels</strong> for female and male students, a dedicated college bus fleet serving central Tamil Nadu, a digital medical e-library, and daily clinical bedside postings at affiliated <strong>10+ bed multi-specialty hospitals</strong>.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link to="/courses/bsc-nursing" className="font-semibold text-green-700 hover:underline">Explore B.Sc. Nursing Labs →</Link>
              <span className="text-gray-300">|</span>
              <Link to="/admission" className="font-semibold text-green-700 hover:underline">Apply for 2026 Admission →</Link>
              <span className="text-gray-300">|</span>
              <Link to="/best-nursing-colleges-in-tamilnadu" className="font-semibold text-green-700 hover:underline">View Tamil Nadu College Comparison →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Specialized Nursing Laboratories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <p className="section-subtitle">Clinical Infrastructure</p>
              <h2 className="section-title">9 Specialized Nursing Simulation Laboratories</h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
                Our 10-acre campus houses 9 advanced clinical, diagnostic, and academic laboratories mapped to Indian Nursing Council (INC) curriculum standards for intensive pre-clinical training.
              </p>
            </div>
          </FadeIn>
          
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" staggerDelay={70} baseDelay={40}>
            {nursingLaboratories.map((lab) => (
              <div key={lab.title} className="card overflow-hidden group card-hover bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                <div className="h-44 overflow-hidden relative">
                  <img src={lab.image} alt={lab.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-wider shadow-sm">
                    {lab.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-700 transition-colors duration-300">
                      <lab.icon size={20} className="text-primary-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-gray-900 leading-snug">{lab.title}</h3>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">{lab.desc}</p>
                </div>
              </div>
            ))}
          </StaggerChildren>

          {/* Campus Amenities Subgrid */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-heading font-bold text-gray-900">Campus Facilities & Student Amenities</h3>
              <p className="text-gray-500 text-sm mt-1">Hostels, transport fleet, digital library, and smart learning spaces.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {campusAmenities.map((amenity) => (
                <div key={amenity.title} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="h-36 rounded-xl overflow-hidden mb-4">
                    <img src={amenity.image} alt={amenity.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <amenity.icon size={18} className="text-green-600" />
                    <h4 className="font-heading font-bold text-sm text-gray-900">{amenity.title}</h4>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{amenity.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left" duration={700}>
              <div>
              <p className="section-subtitle">Campus Life</p>
              <h2 className="section-title mb-6">A Campus That Inspires</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Spread across a lush green campus, Mahalakshmi College provides an environment that is both academically stimulating and personally enriching. Our campus is designed to foster creativity, collaboration, and professional growth.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                With dedicated spaces for academics, recreation, spiritual development, and community service, our students develop into well-rounded individuals ready for the demands of a healthcare career.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '10 Acres', label: 'Campus Area' },
                  { value: '9 Labs', label: 'Specialized Nursing Labs' },
                  { value: '500+', label: 'Hostel Capacity' },
                ].map((s, i) => (
                  <div key={s.label} className="bg-primary-50 rounded-xl p-4 text-center hover:bg-primary-700 hover:text-white transition-all duration-300 group" style={{ animation: `fadeInUp 0.5s ease ${200 + i * 100}ms both` }}>
                    <div className="text-xl font-heading font-bold text-primary-700 group-hover:text-white transition-colors">{s.value}</div>
                    <div className="text-xs text-gray-600 group-hover:text-primary-100 transition-colors mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={150} duration={700}>
              <div className="grid grid-cols-2 gap-4">
                {gallery.slice(0, 4).map((img, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden h-44 shadow-md hover:shadow-xl transition-shadow group" style={{ animation: `scaleIn 0.5s ease ${100 + i * 80}ms both` }}>
                    <img src={img} alt="Campus" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <p className="section-subtitle">Our Spaces</p>
              <h2 className="section-title">Campus Gallery</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group ${i === 0 ? 'md:col-span-2 h-72' : 'h-52'}`} style={{ animation: `fadeInUp 0.5s ease ${i * 80}ms both` }}>
                <img src={img} alt="Campus gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
