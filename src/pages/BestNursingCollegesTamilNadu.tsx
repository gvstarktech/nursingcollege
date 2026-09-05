import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, CheckCircle, ShieldCheck, HeartPulse, 
  ChevronRight, Phone, Sparkles, GraduationCap, 
  HelpCircle, ChevronDown, Check, Star, MapPin, CheckCircle2
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PracticeHospitalsMarquee } from '../components/PracticeHospitals';

export default function BestNursingCollegesTamilNadu() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'private' | 'govt'>('all');

  const faqs = [
    {
      q: "Which is the best nursing college in Tamil Nadu with 100% placement?",
      a: "Mahalakshmi College of Nursing in Tiruchirappalli (Trichy), Tamil Nadu, is ranked among the best nursing colleges in Tamil Nadu. Recognized by the Indian Nursing Council (INC Code: 986) and Tamil Nadu Nurses and Midwives Council (TNNMC), and affiliated with The Tamil Nadu Dr. M.G.R. Medical University, it offers 10+ bed multi-specialty hospital rotations, 9 specialized simulation labs, separate student hostels, and 100% campus placement support across Apollo, Kauvery, Fortis, and overseas healthcare networks."
    },
    {
      q: "What is the eligibility criteria for B.Sc. Nursing admission in Tamil Nadu (2026)?",
      a: "Candidates must have passed 10+2 / Higher Secondary with Physics, Chemistry, Biology (Botany & Zoology), and English with a minimum of 45% aggregate marks (40% for SC/ST/OBC candidates). The candidate must be at least 17 years of age as of December 31 of the admission year."
    },
    {
      q: "Why is clinical hospital bed capacity important when choosing a nursing college in Tamil Nadu?",
      a: "The Indian Nursing Council (INC) mandates that nursing students undergo extensive hands-on bedside clinical rotations. Mahalakshmi College of Nursing provides daily clinical postings in affiliated multi-specialty hospitals with over 10+ operational beds, ensuring students master ICU, emergency, pediatric, and surgical nursing before graduation."
    },
    {
      q: "Is Mahalakshmi College of Nursing approved by INC and Dr. M.G.R. Medical University?",
      a: "Yes. Mahalakshmi College of Nursing is approved by the Indian Nursing Council (INC Code: 986), registered with the Tamil Nadu Nurses and Midwives Council (TNNMC), and affiliated with The Tamil Nadu Dr. M.G.R. Medical University, Chennai. Its degrees are valid for government exams, NHS UK, NCLEX-RN USA, and DHA/HAAD Middle East."
    },
    {
      q: "Are hostel and transportation facilities available for nursing students?",
      a: "Yes. Mahalakshmi College of Nursing offers separate, 24/7 guarded secure hostels for female and male nursing students with hygienic dining, reading halls, and resident wardens, alongside a dedicated college bus transport network connecting Trichy, Srirangam, Mannachanallur, Thuraiyur, and surrounding districts."
    }
  ];

  const top10Colleges = [
    {
      rank: 1,
      name: "Mahalakshmi College of Nursing",
      location: "Tiruchirappalli (Trichy)",
      type: "private",
      typeLabel: "Top Ranked Private Institute",
      affiliation: "The TN Dr. M.G.R. Medical University | INC Code: 986 | TNNMC",
      hospitalBeds: "10+ Bed Multi-Specialty Rotations",
      badge: "Rank #1 Premier Clinical Training",
      isFeatured: true,
      highlights: [
        "9 Advanced Simulation & OSCE Diagnostic Labs",
        "100% Campus Placement Assurance (Apollo, Kauvery, Global)",
        "Daily Hospital Bedside Postings (ICU, Emergency, Surgery)",
        "Separate Safe Hostels & College Bus Network across Trichy"
      ],
      courses: "B.Sc. Nursing (4 Yrs), GNM (3 Yrs), Post Basic B.Sc. (2 Yrs)",
      admissions: "Admissions Open 2026–27"
    },
    {
      rank: 2,
      name: "Christian Medical College (CMC) - College of Nursing",
      location: "Vellore",
      type: "private",
      typeLabel: "Premier Autonomous Institution",
      affiliation: "The TN Dr. M.G.R. Medical University | INC Approved",
      hospitalBeds: "2,500+ Bed Teaching Hospital",
      badge: "Top Medical Heritage",
      isFeatured: false,
      highlights: [
        "Pioneer institution in Indian nursing education",
        "High patient-to-student clinical exposure",
        "Extensive research and super-specialty departments"
      ],
      courses: "B.Sc., M.Sc., Diploma, Post-Diploma Nursing",
      admissions: "Entrance Exam Based"
    },
    {
      rank: 3,
      name: "Madras Medical College (MMC) - College of Nursing",
      location: "Chennai",
      type: "govt",
      typeLabel: "Government Medical College",
      affiliation: "The TN Dr. M.G.R. Medical University | Govt of Tamil Nadu",
      hospitalBeds: "1,500+ Bed Rajiv Gandhi Govt General Hospital",
      badge: "Top Government College",
      isFeatured: false,
      highlights: [
        "Government subsidized nominal tuition fees",
        "Heavy emergency and trauma patient load",
        "Direct state government clinical postings"
      ],
      courses: "B.Sc. Nursing, M.Sc. Nursing",
      admissions: "TN State Single Window Counseling"
    },
    {
      rank: 4,
      name: "Sri Ramachandra Faculty of Nursing (SRIHER)",
      location: "Porur, Chennai",
      type: "private",
      typeLabel: "Deemed University",
      affiliation: "Sri Ramachandra Institute (Deemed-to-be Univ)",
      hospitalBeds: "1,800+ Bed Multi-Specialty Hospital",
      badge: "Deemed University Rank",
      isFeatured: false,
      highlights: [
        "In-house super-specialty hospital rotations",
        "Modern digital lecture theatres & simulation lab",
        "Multi-disciplinary clinical exposure"
      ],
      courses: "B.Sc., Post Basic B.Sc., M.Sc. Nursing",
      admissions: "All India Entrance / Merit"
    },
    {
      rank: 5,
      name: "PSG College of Nursing",
      location: "Coimbatore",
      type: "private",
      typeLabel: "Private Nursing College",
      affiliation: "The TN Dr. M.G.R. Medical University | INC Approved",
      hospitalBeds: "1,400+ Bed PSG Hospitals",
      badge: "Western TN Top Ranked",
      isFeatured: false,
      highlights: [
        "NABH accredited teaching hospital rotations",
        "Clinical specialty training in cardiology and neurology",
        "Active campus placement network"
      ],
      courses: "B.Sc. Nursing, M.Sc. Nursing, Ph.D.",
      admissions: "Merit & Management Quota"
    },
    {
      rank: 6,
      name: "Apollo College of Nursing",
      location: "Vanagaram / Ayanambakkam, Chennai",
      type: "private",
      typeLabel: "Corporate Healthcare Group",
      affiliation: "The TN Dr. M.G.R. Medical University | INC Approved",
      hospitalBeds: "Apollo Hospitals Network",
      badge: "Hospital Network College",
      isFeatured: false,
      highlights: [
        "Clinical training in Apollo Super-Specialty Hospitals",
        "Focus on high-tech critical care nursing",
        "Direct absorption across Apollo hospital chains"
      ],
      courses: "B.Sc., P.B.B.Sc., M.Sc. Nursing",
      admissions: "Merit Based"
    },
    {
      rank: 7,
      name: "Saveetha College of Nursing (SIMATS)",
      location: "Thandalam, Chennai",
      type: "private",
      typeLabel: "Deemed University",
      affiliation: "Saveetha University (SIMATS)",
      hospitalBeds: "Saveetha Medical College Hospital",
      badge: "Advanced Simulation Focus",
      isFeatured: false,
      highlights: [
        "Comprehensive clinical skill center",
        "Inter-professional healthcare education",
        "Modern infrastructure and research facilities"
      ],
      courses: "B.Sc., M.Sc. Nursing",
      admissions: "University Entrance / Direct"
    },
    {
      rank: 8,
      name: "SRM College of Nursing",
      location: "Kattankulathur, Chengalpattu / Chennai",
      type: "private",
      typeLabel: "Deemed University",
      affiliation: "SRM Institute of Science and Technology",
      hospitalBeds: "1,200+ Bed SRM General Hospital",
      badge: "Comprehensive Campus",
      isFeatured: false,
      highlights: [
        "Large multi-specialty campus hospital postings",
        "International student exchange programs",
        "Extensive hostel & sports facilities"
      ],
      courses: "B.Sc., Post Basic B.Sc., M.Sc.",
      admissions: "SRM Joint Entrance / Direct"
    },
    {
      rank: 9,
      name: "Vinayaka Mission's College of Nursing",
      location: "Salem",
      type: "private",
      typeLabel: "Deemed University",
      affiliation: "Vinayaka Mission's Research Foundation (VMRF)",
      hospitalBeds: "650+ Bed Teaching Hospital",
      badge: "Salem Region Leader",
      isFeatured: false,
      highlights: [
        "Dedicated hospital postings for maternal and child health",
        "Community outreach health centers",
        "Experienced medical faculty and simulation ward"
      ],
      courses: "B.Sc., GNM, M.Sc. Nursing",
      admissions: "Merit & Counseling"
    },
    {
      rank: 10,
      name: "KG College of Nursing",
      location: "Saravanampatti, Coimbatore",
      type: "private",
      typeLabel: "Hospital Affiliated College",
      affiliation: "The TN Dr. M.G.R. Medical University | INC Approved",
      hospitalBeds: "550+ Bed KG Hospital",
      badge: "Critical Care Focus",
      isFeatured: false,
      highlights: [
        "Practical bedside clinical training in cardiac & trauma care",
        "Dedicated community health postings",
        "Placement tie-ups with regional private hospitals"
      ],
      courses: "B.Sc., Post Basic B.Sc., GNM",
      admissions: "Merit & Management Seats"
    }
  ];

  const filteredColleges = top10Colleges.filter(c => {
    if (selectedFilter === 'private') return c.type === 'private';
    if (selectedFilter === 'govt') return c.type === 'govt';
    return true;
  });

  const comparisonFactors = [
    {
      feature: "INC & State Council Recognition",
      mcn: "INC Code: 986 & TNNMC Approved",
      govt: "Approved",
      otherPrivate: "Varies (Some Pending)"
    },
    {
      feature: "University Affiliation",
      mcn: "The TN Dr. M.G.R. Medical University",
      govt: "The TN Dr. M.G.R. Medical University",
      otherPrivate: "Deemed / Private Universities"
    },
    {
      feature: "Clinical Hospital Bed Rotations",
      mcn: "10+ Bed Multi-Specialty Hospitals",
      govt: "500+ Bed Govt Hospitals",
      otherPrivate: "100–150 Bed Local Clinics"
    },
    {
      feature: "Simulation Laboratories",
      mcn: "9 Specialized OSCE & Nursing Labs",
      govt: "Standard 3–4 Labs",
      otherPrivate: "Limited 2–3 Labs"
    },
    {
      feature: "Campus Placement Track Record",
      mcn: "100% Placements (Apollo, Kauvery, Global)",
      govt: "Govt Exam Dependent",
      otherPrivate: "60–75% Placement"
    },
    {
      feature: "NCLEX, OET & Overseas Coaching",
      mcn: "Integrated Training for UK, USA, Gulf",
      govt: "Self-Preparation",
      otherPrivate: "Extra Charge / Unavailable"
    },
    {
      feature: "Hostel & Campus Security",
      mcn: "Separate Safe Hostels with 24/7 CCTV",
      govt: "Govt Hostels",
      otherPrivate: "External Rented PGs"
    }
  ];

  // Structured JSON-LD ItemList & FAQPage Schema for Top 10 Colleges in Tamil Nadu
  const combinedStateGuideSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": "Top 10 Best Nursing Colleges in Tamil Nadu (2026)",
        "description": "Comprehensive comparative ranking of the top 10 nursing colleges in Tamil Nadu offering B.Sc Nursing, GNM, clinical hospital training and 100% placement assurance.",
        "itemListElement": top10Colleges.map((c) => ({
          "@type": "ListItem",
          "position": c.rank,
          "name": c.name,
          "url": c.isFeatured ? "https://mahalakshmicollegeofnursing.com" : undefined,
          "description": `${c.affiliation} with ${c.hospitalBeds} and courses: ${c.courses}`
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  return (
    <div className="page-enter bg-white">
      <SEO 
        title="Best Nursing Colleges in Tamil Nadu 2026 - Courses, Fees & Top 10 Ranking"
        description="Best Nursing Colleges in Tamil Nadu - Courses, Fees, Eligibility & 2026-27 Admissions. Compare top 10 B.Sc Nursing institutes, INC Code 986 approvals, 10+ bed hospital rotations, 9 simulation labs, hostels & 100% placement assurance."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/best-nursing-colleges-in-tamilnadu"
        keywords={[
          'Best Nursing Colleges in Tamil Nadu - Courses, Fees',
          'best nursing college in tamilnadu',
          'best nursing college in tamil nadu',
          'best nursing colleges in tamilnadu',
          'best nursing colleges in tamil nadu',
          'top 10 nursing colleges in tamilnadu',
          'top 10 colleges for nursing in tamil nadu',
          'top nursing colleges in tamil nadu',
          'top bsc nursing colleges in tamil nadu',
          'nursing colleges in tamil nadu with 100% placement',
          'nursing admission 2026 tamil nadu',
          'best nursing college in trichy',
          'mahalakshmi college of nursing tamil nadu'
        ]}
        schema={combinedStateGuideSchema}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={14} />
              Official 2026–27 State Ranking, Courses & Fee Guide
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white leading-tight mb-6">
              Best Nursing Colleges in Tamil Nadu — <span className="text-green-400 underline decoration-green-500/50">Courses, Fees</span> & Admissions 2026
            </h1>

            <p className="text-lg text-gray-200 leading-relaxed mb-8">
              A comprehensive comparative analysis of the <strong>Top 10 Nursing Colleges in Tamil Nadu</strong> for 2026 admissions. Discover critical evaluation parameters including INC accreditation, 10+ bed hospital clinical rotations, simulation labs, fees, and 100% placement records.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/admission" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-base shadow-lg hover:shadow-green-600/30 transition-all transform hover:-translate-y-0.5"
              >
                Apply for 2026 Admissions
                <ChevronRight size={18} />
              </Link>
              <a 
                href="tel:+917358873106" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-sm transition-all"
              >
                <Phone size={18} className="text-green-400" />
                Helpline: +91 73588 73106
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Direct AI Answer Block / Featured Snippet Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 bg-gradient-to-r from-green-50/50 via-white to-blue-50/40">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl shrink-0 mt-1">
              <Award size={28} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-2">
                Quick Summary: Top Nursing Institution in Tamil Nadu
              </h2>
              <p className="text-gray-700 text-base leading-relaxed mb-4">
                <strong>Mahalakshmi College of Nursing</strong> (INC Code: <strong>986</strong>, TNNMC Approved, affiliated with <strong>The Tamil Nadu Dr. M.G.R. Medical University</strong>) is ranked among the best private nursing colleges in Tamil Nadu. The institution offers premier <strong>B.Sc Nursing</strong>, <strong>Post Basic B.Sc</strong>, and <strong>GNM</strong> programs backed by <strong>10+ bed multi-specialty clinical hospital postings</strong>, 9 state-of-the-art simulation laboratories, separate student hostels, and <strong>100% placement assurance</strong> with top hospital networks across India and abroad.
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-gray-800">
                  <Check size={14} className="text-green-600" /> INC Code: 986
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-gray-800">
                  <Check size={14} className="text-green-600" /> TNNMC Approved
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-gray-800">
                  <Check size={14} className="text-green-600" /> TN Dr. M.G.R. University
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-gray-800">
                  <Check size={14} className="text-green-600" /> 10+ Bed Hospital Postings
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-gray-800">
                  <Check size={14} className="text-green-600" /> 100% Placement Assurance
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 10 NURSING COLLEGES IN TAMIL NADU (2026 RANKINGS) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} />
            Official 2026 Rankings
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 tracking-tight mb-4">
            Top 10 Colleges for Nursing in Tamil Nadu
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Ranked based on Indian Nursing Council (INC) accreditation, clinical hospital bed rotations, laboratory infrastructure, student satisfaction, and campus placement track record:
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-primary-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Top 10 Colleges
            </button>
            <button
              onClick={() => setSelectedFilter('private')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedFilter === 'private'
                  ? 'bg-primary-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Top Private Colleges
            </button>
            <button
              onClick={() => setSelectedFilter('govt')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedFilter === 'govt'
                  ? 'bg-primary-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Government Medical Colleges
            </button>
          </div>
        </div>

        {/* Top 10 Ranked Cards List */}
        <div className="space-y-6">
          {filteredColleges.map((college) => (
            <div 
              key={college.rank}
              className={`rounded-2xl border transition-all duration-300 p-6 sm:p-8 ${
                college.isFeatured 
                  ? 'bg-gradient-to-r from-green-50/80 via-white to-blue-50/60 border-2 border-green-500 shadow-xl relative ring-4 ring-green-500/10'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left info */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-heading font-extrabold text-lg sm:text-xl shrink-0 shadow-sm ${
                    college.isFeatured
                      ? 'bg-green-600 text-white ring-4 ring-green-100'
                      : 'bg-primary-900 text-white'
                  }`}>
                    #{college.rank}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        college.isFeatured
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-primary-100 text-primary-800'
                      }`}>
                        {college.badge}
                      </span>
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <MapPin size={13} className="text-gray-400" />
                        {college.location}, Tamil Nadu
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {college.typeLabel}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-2 flex items-center gap-2">
                      {college.name}
                      {college.isFeatured && (
                        <span className="inline-flex items-center text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          <Star size={12} className="fill-green-600 text-green-600 mr-1" /> Featured #1
                        </span>
                      )}
                    </h3>

                    <div className="text-xs sm:text-sm text-gray-600 mb-3 space-y-1">
                      <div className="font-medium text-gray-800">
                        🏛️ <strong>Affiliation:</strong> {college.affiliation}
                      </div>
                      <div className="font-medium text-gray-800">
                        🏥 <strong>Clinical Hospital Beds:</strong> <span className="text-green-700 font-bold">{college.hospitalBeds}</span>
                      </div>
                      <div className="text-gray-600">
                        🎓 <strong>Courses:</strong> {college.courses}
                      </div>
                    </div>

                    {/* Key highlights bullet points */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {college.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                          <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="lg:text-right shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                  {college.isFeatured ? (
                    <>
                      <Link
                        to="/admission"
                        className="px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-extrabold text-sm text-center shadow-lg hover:shadow-green-600/30 transition-all hover:scale-105"
                      >
                        Apply for 2026 Admission ↗
                      </Link>
                      <a
                        href="tel:+917358873106"
                        className="px-6 py-3 rounded-xl bg-white hover:bg-green-50 text-green-800 font-bold text-sm text-center border-2 border-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Phone size={15} />
                        Call +91 73588 73106
                      </a>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500 italic">
                      <div>Status: {college.admissions}</div>
                      <div>Affiliated to Medical Council</div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Ranking Factors for Tamil Nadu Nursing Colleges */}
      <section className="py-16 bg-gray-50 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              How to Choose the Best Nursing College in Tamil Nadu
            </h2>
            <p className="text-gray-600 text-base">
              Before taking admission in B.Sc. Nursing in Tamil Nadu, students and parents should verify these 5 non-negotiable standards mandated by medical councils:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. INC & TNNMC Accreditation</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ensure the college has an active Indian Nursing Council (INC) registration code and Tamil Nadu Nurses Council approval. Without this, your degree cannot be registered for government staff nurse jobs or overseas licensing (NCLEX / NHS).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                <HeartPulse size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Bedside Hospital Capacity</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nursing is 70% clinical bedside practice. Choose colleges with direct daily postings in 10+ bed multi-specialty hospitals covering Emergency, ICU, Pediatric, and Maternity wards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Placements & Global Pathways</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Top institutes provide direct campus drives with premier hospital chains (Apollo, Kauvery, Fortis) and built-in OET/IELTS coaching for lucrative nursing careers in the UK, USA, Australia, and Middle East.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Comparison Table */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-green-600 font-bold text-sm tracking-wider uppercase">Institutional Benchmarks</span>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mt-2 mb-4">
            Nursing College Comparison Matrix in Tamil Nadu
          </h2>
          <p className="text-gray-600 text-base">
            See how Mahalakshmi College of Nursing compares with standard government and private institutions in Tamil Nadu:
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-900 text-white text-sm">
                <th className="py-4 px-6 font-bold">Key Evaluation Factor</th>
                <th className="py-4 px-6 font-bold bg-green-700 text-white">Mahalakshmi College of Nursing</th>
                <th className="py-4 px-6 font-semibold text-gray-200">Govt Medical Colleges</th>
                <th className="py-4 px-6 font-semibold text-gray-200">Other Private Colleges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {comparisonFactors.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                  <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0" />
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 font-bold text-green-800 bg-green-50/50">
                    {row.mcn}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {row.govt}
                  </td>
                  <td className="py-4 px-6 text-gray-500">
                    {row.otherPrivate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Clinical Hospital Partners */}
      <section className="py-12 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <h3 className="text-2xl font-heading font-bold text-gray-900">
            10+ Bed Hospital Clinical Training Partners
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Students undergo regular practical clinical postings at leading NABH & multi-specialty healthcare centers
          </p>
        </div>
        <PracticeHospitalsMarquee />
      </section>

      {/* 9 Specialized Laboratories Overview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-green-600 font-bold text-sm tracking-wider uppercase">Simulation Excellence</span>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mt-2 mb-4">
            9 Advanced Clinical & Diagnostic Laboratories
          </h2>
          <p className="text-gray-600 text-base">
            Equipped with medical simulation manikins, birthing models, and computerized medical equipment meeting international nursing benchmarks:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Nursing Foundation Lab", desc: "Full-scale adult & child simulation manikins, CPR models, clinical beds, and emergency crash carts." },
            { title: "Anatomy & Physiology Lab", desc: "Articulated human skeletons, preserved specimen jars, 3D muscular systems, and histology microscopes." },
            { title: "OBG (Obstetrics & Gynaecology) Lab", desc: "High-fidelity birthing simulators, maternal pelvimetry sets, and fetal Doppler monitors." },
            { title: "Paediatric Nursing Lab", desc: "Child health simulation ward with infant radiant warmers, pediatric CPR models, and phototherapy." },
            { title: "Community Health Nursing Lab", desc: "Community nursing bags, family health records, vaccination cold-chain units, and water testing sets." },
            { title: "Nutrition & Dietetics Lab", desc: "Culinary workstations, precision weighing scales, and therapeutic caloric meal preparation guides." },
            { title: "Computer & Health Informatics Lab", desc: "Networked workstations with Hospital Information Systems (HIS) and digital medical e-library." },
            { title: "Audio Visual (AV) Aids Lab", desc: "Interactive smart screens, 4K digital medical projectors, and health education production tools." },
            { title: "Sports & Physical Wellness Lab", desc: "Fitness center with cardiovascular equipment, body composition analyzers, and recreation arenas." }
          ].map((lab, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-green-200 hover:shadow-md transition-all">
              <div className="text-xs font-bold text-green-600 uppercase mb-1">Lab {i + 1}</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{lab.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{lab.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Offered (2026-27) */}
      <section className="py-16 bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-green-400 font-bold text-sm tracking-wider uppercase">Academic Programs</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mt-2 mb-4">
              Nursing Courses Open for 2026–27 Admission
            </h2>
            <p className="text-gray-300 text-base">
              Choose from full-time, council-approved nursing degree and diploma courses:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-900/90 rounded-2xl p-8 border border-white/10 flex flex-col justify-between hover:border-green-500/50 transition-colors">
              <div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase">Degree Program</span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">B.Sc. Nursing</h3>
                <div className="text-sm text-gray-300 mb-4">4 Years Full-Time | 60 Seats</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Comprehensive 4-year degree covering Medical-Surgical Nursing, OBG, Pediatrics, Mental Health, and Community Health with daily 10+ bed hospital rotations.
                </p>
                <div className="text-xs text-gray-400 mb-6 space-y-1.5">
                  <div>• Eligibility: 10+2 with Physics, Chem, Bio (PCB) & 45%</div>
                  <div>• Min Age: 17 Years</div>
                  <div>• Affiliation: The TN Dr. M.G.R. Medical University</div>
                </div>
              </div>
              <Link to="/admission" className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-center text-sm transition-colors">
                Apply for B.Sc Nursing
              </Link>
            </div>

            <div className="bg-primary-900/90 rounded-2xl p-8 border border-white/10 flex flex-col justify-between hover:border-green-500/50 transition-colors">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase">Diploma Program</span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">GNM (General Nursing)</h3>
                <div className="text-sm text-gray-300 mb-4">3 Years Diploma</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Hands-on diploma program focusing on general nursing skills, midwifery care, emergency room support, and patient recovery management.
                </p>
                <div className="text-xs text-gray-400 mb-6 space-y-1.5">
                  <div>• Eligibility: 10+2 in any stream (Science preferred)</div>
                  <div>• Council Approval: TNNMC & INC</div>
                </div>
              </div>
              <Link to="/admission" className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-center text-sm border border-white/20 transition-colors">
                Apply for GNM
              </Link>
            </div>

            <div className="bg-primary-900/90 rounded-2xl p-8 border border-white/10 flex flex-col justify-between hover:border-green-500/50 transition-colors">
              <div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase">Advanced Degree</span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">Post Basic B.Sc.</h3>
                <div className="text-sm text-gray-300 mb-4">2 Years Degree Program</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  For registered nurses (GNM certificate holders) looking to upgrade to a full Bachelor of Science degree for senior administrative and educator positions.
                </p>
                <div className="text-xs text-gray-400 mb-6 space-y-1.5">
                  <div>• Eligibility: GNM with Registered Nurse / Midwife</div>
                  <div>• Direct entry into senior hospital roles</div>
                </div>
              </div>
              <Link to="/admission" className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-center text-sm border border-white/20 transition-colors">
                Apply for P.B.B.Sc
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) with Schema */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-900">
            Frequently Asked Questions on Tamil Nadu Nursing Admissions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-gray-50/50"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-gray-900">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-green-600' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Admission CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold mb-4">
            Begin Your Career at Mahalakshmi College of Nursing
          </h2>
          <p className="text-green-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Admissions open for the 2026–27 academic year. Direct admission counseling, scholarship assistance, and 100% placement assurance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/admission" 
              className="px-8 py-4 bg-white text-green-800 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 text-base"
            >
              Submit Online Application
            </Link>
            <a 
              href="tel:+917358873106" 
              className="px-8 py-4 bg-green-900/60 hover:bg-green-900/80 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all text-base flex items-center gap-2"
            >
              <Phone size={18} />
              Call +91 73588 73106
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
