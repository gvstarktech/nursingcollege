import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Clock, Award, Users, BookOpen, ArrowRight, ShieldCheck, Stethoscope, FlaskConical, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '../components/Animate';
import { SEO } from '../components/SEO';

interface LaboratoryInfo {
  title: string;
  image: string;
  description: string;
  labs: string[];
}

interface CourseData {
  slug: string;
  name: string;
  seoTitle: string;
  seoDesc: string;
  duration: string;
  seats: string;
  icon: any;
  overview: string;
  eligibility: string;
  curriculum: string[];
  laboratories?: LaboratoryInfo;
  careerScope: string;
  jobs: string[];
  keywords: string[];
}

const coursesMap: Record<string, CourseData> = {
  'bsc-nursing': {
    slug: 'bsc-nursing',
    name: 'Bachelor of Science in Nursing (B.Sc Nursing)',
    seoTitle: 'B.Sc Nursing Course in Tamil Nadu (2026) | Mahalakshmi College of Nursing',
    seoDesc: 'Top B.Sc Nursing 4-year degree in Tamil Nadu at Mahalakshmi College of Nursing. INC Code: 986, MGR University, 10+ bed hospital rotations & 100% placements. Admissions 2026–27.',
    duration: '4 Years Degree Program',
    seats: '60 Seats',
    icon: Stethoscope,
    overview: 'B.Sc Nursing is a four-year professional degree combining theoretical study and intensive bedside clinical training at affiliated 10+ bed multi-specialty hospitals to prepare students for leadership careers across global healthcare networks.',
    eligibility: 'Pass in 10+2 / Higher Secondary (HSC) with Physics, Chemistry, Biology (Botany & Zoology), and English with a minimum of 45% aggregate marks (40% for SC/ST/OBC). Minimum age: 17 years.',
    curriculum: [
      'Anatomy & Physiology',
      'Nutrition & Biochemistry',
      'Nursing Foundation',
      'Psychology & Microbiology',
      'Medical-Surgical Nursing',
      'Child Health Nursing (Pediatrics)',
      'Mental Health Nursing (Psychiatric)',
      'Obstetric & Gynecological Nursing',
      'Community Health Nursing',
      'Nursing Research & Bio-Statistics',
      'Nursing Management & Ethics',
    ],
    laboratories: {
      title: 'Advanced Nursing Foundation & OSCE Simulation Suite',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      description: 'Equipped with high-fidelity patient manikins, intensive care bed units, injection simulators, and CPR stations replicating real-world hospital environments.',
      labs: [
        'Advanced Nursing Foundation Lab',
        'Maternal & Child Health (MCH) Lab',
        'Anatomy & Physiology Specimen Lab',
        'Nutrition & Dietetics Laboratory',
        'Community Health Nursing Simulation Ward',
        'OSCE Evaluation Stations',
      ],
    },
    careerScope: 'The course empowers students to make independent clinical nursing decisions, uphold evidence-based patient practices, and lead specialized hospital departments. Graduates are registered with TNNMC/INC and qualify for global migration via NCLEX-RN and NHS UK OET pathways.',
    jobs: [
      'Registered Staff Nurse (ICU, Emergency, Surgery)',
      'Clinical Nurse Specialist',
      'Nursing Superintendent / Supervisor',
      'Nurse Educator / Academic Tutor',
      'Public & Community Health Nurse Officer',
      'Overseas Registered Nurse (UK, USA, Gulf, Canada, Australia)',
    ],
    keywords: ['best nursing college in tamilnadu', 'BSc Nursing College Trichy', 'Best Nursing College Tamil Nadu', 'INC Code 986 BSc Nursing', 'BSc Nursing Admission 2026 Tamil Nadu'],
  },
  'gnm-nursing': {
    slug: 'gnm-nursing',
    name: 'General Nursing and Midwifery (GNM)',
    seoTitle: 'GNM Nursing Admission in Tamil Nadu (2026) | Mahalakshmi College of Nursing',
    seoDesc: 'General Nursing and Midwifery (GNM) 3-year diploma in Tamil Nadu at Mahalakshmi College of Nursing. INC Code: 986, 10+ bed hospital postings & 100% placement assurance.',
    duration: '3 Years Diploma Program',
    seats: '40 Seats',
    icon: Stethoscope,
    overview: 'General Nursing and Midwifery (GNM) is a comprehensive three-year diploma program designed to train students in fundamental patient bedside nursing care, maternity support, pediatric care, and emergency room procedures.',
    eligibility: 'Pass in 10+2 / Higher Secondary in any stream (Science PCB preferred) with English and minimum 40% aggregate marks.',
    curriculum: [
      'Bio-Sciences (Anatomy & Physiology)',
      'Behavioral Sciences (Psychology & Sociology)',
      'Nursing Foundations & First Aid',
      'Community Health Nursing',
      'Medical-Surgical Nursing (Adult Health)',
      'Mental Health & Psychiatric Nursing',
      'Child Health Nursing',
      'Midwifery & Gynaecological Nursing',
      'Community Health Nursing II',
      'Nursing Administration & Ward Management',
    ],
    laboratories: {
      title: 'Clinical Midwifery & Bedside Nursing Lab',
      image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800',
      description: 'Hands-on training facilities equipped with delivery manikins, pediatric incubators, and sterile surgical preparation stations.',
      labs: [
        'Obstetrics & Midwifery Lab',
        'Fundamental Nursing Skills Lab',
        'Community Health Practical Ward',
        'Pediatric Health Training Unit'
      ],
    },
    careerScope: 'GNM diploma holders play an essential role in acute and community healthcare settings, working as staff nurses in private hospitals, government healthcare centres, and rehabilitation clinics.',
    jobs: [
      'Staff Nurse (Maternity & Emergency Wards)',
      'Community Health Worker',
      'Home Healthcare Specialist',
      'Industrial Clinic Nurse',
      'Rehabilitation Staff Nurse',
    ],
    keywords: ['GNM Nursing Admission Tamil Nadu', 'GNM Course Trichy', 'Best GNM College Tamil Nadu', 'INC Approved GNM Nursing'],
  },
  'post-basic-bsc-nursing': {
    slug: 'post-basic-bsc-nursing',
    name: 'Post Basic B.Sc. Nursing (P.B.B.Sc)',
    seoTitle: 'Post Basic B.Sc Nursing in Tamil Nadu (2026) | Mahalakshmi College of Nursing',
    seoDesc: 'Post Basic B.Sc Nursing (P.B.B.Sc) 2-year degree in Tamil Nadu at Mahalakshmi College of Nursing. Upgrade your GNM diploma to a full Bachelor of Science degree.',
    duration: '2 Years Degree Program',
    seats: '30 Seats',
    icon: Stethoscope,
    overview: 'Post Basic B.Sc Nursing is a 2-year undergraduate degree specifically tailored for registered nurses (GNM diploma holders) to upgrade their clinical skills, leadership abilities, and academic qualifications to a full Bachelor of Science degree.',
    eligibility: 'Must hold a Diploma in General Nursing and Midwifery (GNM) and be a Registered Nurse & Registered Midwife (RN/RM) with State Nursing Council.',
    curriculum: [
      'Nursing Foundation & Advanced Concepts',
      'Nutrition & Dietetics in Critical Care',
      'Biochemistry & Biophysics',
      'Psychology & Mental Health Nursing',
      'Maternal Nursing Practice',
      'Child Health Nursing Practice',
      'Microbiology in Clinical Pathology',
      'Medical & Surgical Nursing Leadership',
      'Sociology & Community Health',
      'Nursing Research & Statistics',
      'Administration & Management of Nursing Services',
    ],
    laboratories: {
      title: 'Advanced Diagnostic & Clinical Informatics Labs',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      description: 'Equipped with HMIS hospital informatics terminals, OSCE research stations, and advanced clinical simulation setups.',
      labs: [
        'Health Informatics & HMIS Lab',
        'OSCE Advanced Simulation Ward',
        'Medical-Surgical High Dependency Lab',
        'Nursing Research & Statistical Center'
      ],
    },
    careerScope: 'Graduates can step directly into managerial, teaching, and specialized clinical nurse positions in multi-specialty hospitals and nursing colleges worldwide.',
    jobs: [
      'Nurse Manager / Ward In-Charge',
      'Nursing Tutor / Clinical Instructor',
      'Chief Nursing Officer (CNO)',
      'Quality & Infection Control Nurse',
      'International Hospital Specialist',
    ],
    keywords: ['Post Basic BSc Nursing Tamil Nadu', 'PB BSc Nursing College Trichy', 'GNM to BSc Nursing Upgrade', 'INC Approved Post Basic BSc'],
  },
};

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>();
  const course = slug ? (coursesMap[slug] || Object.values(coursesMap).find(c => c.slug.includes(slug) || slug.includes(c.slug))) : undefined;

  const courseSchema = course ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "name": course.name,
        "description": course.overview,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "Mahalakshmi College of Nursing",
          "url": "https://mahalakshmicollegeofnursing.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Trichy–Salem Highway, Thodayur Post, Melpathu Village, Mannachanallur Taluk",
            "addressLocality": "Tiruchirappalli",
            "addressRegion": "Tamil Nadu",
            "postalCode": "621105",
            "addressCountry": "IN"
          }
        },
        "educationalCredentialAwarded": course.name,
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "Full-Time On-Campus",
          "duration": course.duration,
          "courseWorkload": "Clinical simulation labs, hospital ward rotations & classroom theory"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://mahalakshmicollegeofnursing.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Nursing Courses",
            "item": "https://mahalakshmicollegeofnursing.com/courses"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": course.name,
            "item": `https://mahalakshmicollegeofnursing.com/courses/${course.slug}`
          }
        ]
      }
    ]
  } : undefined;

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <SEO title="Mahalakshmi College of Nursing | Course Not Found" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-6">The requested nursing course page does not exist.</p>
          <Link to="/courses" className="btn-primary text-sm px-6 py-2.5">Back to Nursing Courses</Link>
        </div>
      </div>
    );
  }

  const IconComp = course.icon;
  const otherCourses = Object.values(coursesMap).filter((c) => c.slug !== course.slug);

  return (
    <div className="page-enter">
      <SEO 
        title={course.seoTitle}
        description={course.seoDesc}
        keywords={course.keywords}
        canonicalUrl={`https://mahalakshmicollegeofnursing.com/courses/${course.slug}`}
        schema={courseSchema}
      />
      {/* Course Hero banner */}
      <section
        className="relative py-28 text-white overflow-hidden hero-bg-animate bg-primary-700"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary-900/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4 animate-fadeInDown">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <IconComp size={20} className="text-green-300" />
            </div>
            <span className="text-green-300 font-semibold text-xs tracking-wider uppercase">Nursing Academic Division</span>
          </div>
          <h1 className="animate-fadeInUp delay-100 text-3xl md:text-5xl font-heading font-bold mb-4">{course.name}</h1>
          <p className="animate-fadeInUp delay-200 text-gray-200 max-w-2xl text-sm leading-relaxed mb-6">
            Study {course.name} at Mahalakshmi College of Nursing. Gain real hospital clinical postings, OSCE lab simulations, and 100% placement support.
          </p>
          <div className="animate-fadeInUp delay-300 flex items-center gap-2 text-xs text-gray-300">
            <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/courses" className="hover:text-green-300 transition-colors">Courses</Link>
            <ChevronRight size={12} />
            <span className="text-green-300">{course.name}</span>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Content column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Course Overview Card */}
              <FadeIn direction="up">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <BookOpen size={18} className="text-green-500" />
                    Course Overview
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{course.overview}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <div className="bg-primary-50/50 p-4 rounded-xl text-center border border-primary-50">
                      <div className="text-primary-700 font-bold font-heading text-lg">{course.duration}</div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Duration</div>
                    </div>
                    <div className="bg-green-50/50 p-4 rounded-xl text-center border border-green-50">
                      <div className="text-green-600 font-bold font-heading text-lg">{course.seats} Seats</div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Annual Intake</div>
                    </div>
                    <div className="bg-orange-50/50 p-4 rounded-xl text-center border border-orange-50 col-span-2 sm:col-span-1">
                      <div className="text-orange-600 font-bold font-heading text-lg flex items-center justify-center gap-1">
                        <Award size={16} /> Accredited
                      </div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Recognition</div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Eligibility & Qualifications */}
              <FadeIn direction="up" delay={50}>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-500" />
                    Eligibility Criteria
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{course.eligibility}</p>
                </div>
              </FadeIn>

              {/* Core Curriculum */}
              <FadeIn direction="up" delay={100}>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <Clock size={18} className="text-green-500" />
                    What You Will Learn (Curriculum)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {course.curriculum.map((subject, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-700 font-medium">
                        <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Laboratory & Practical Training Section */}
              {course.laboratories && (
                <FadeIn direction="up" delay={120}>
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 overflow-hidden">
                    <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900 mb-2 pb-2 border-b border-gray-50 flex items-center gap-2">
                      <FlaskConical size={20} className="text-green-500" />
                      Laboratory & Practical Training Facilities
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {course.laboratories.description}
                    </p>

                    {/* Lab Image & Facilities Container */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      <div className="md:col-span-5 relative group overflow-hidden rounded-2xl shadow-md border border-gray-100">
                        <img
                          src={course.laboratories.image}
                          alt={`${course.name} Laboratory`}
                          className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white px-2.5 py-1 rounded-full mb-1.5 inline-block shadow">
                              Specialized Practical Lab
                            </span>
                            <h3 className="text-white font-bold text-sm leading-snug">
                              {course.laboratories.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <h3 className="text-gray-900 font-bold font-heading text-sm">
                            Laboratories Included ({course.laboratories.labs.length}):
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {course.laboratories.labs.map((labName, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5 p-2.5 bg-green-50/50 rounded-xl border border-green-100 hover:border-green-300 transition-colors"
                            >
                              <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
                                {idx + 1}
                              </div>
                              <span className="text-xs text-gray-800 font-medium leading-tight">
                                {labName}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Career Scope & Placements */}
              <FadeIn direction="up" delay={150}>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <Users size={18} className="text-green-500" />
                    Career Scope & Employment Sectors
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{course.careerScope}</p>

                  <h3 className="text-gray-900 font-bold font-heading text-sm mb-3">Common Job Profiles:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.jobs.map((job, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {job}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

            </div>

            {/* Right Sidebar column */}
            <div className="space-y-6">

              {/* Call to action card */}
              <div className="bg-gradient-to-br from-primary-800 to-primary-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                <h3 className="font-heading font-bold text-lg mb-3">Admission Open 2026-27</h3>
                <p className="text-xs text-primary-200 leading-relaxed mb-6">
                  Secure your seat in {course.name} at Mahalakshmi College. Get trained by experienced medical educators.
                </p>
                <div className="space-y-3">
                  <Link to="/admission" className="btn-green w-full text-center block text-xs font-semibold py-2.5">
                    Apply Online Now
                  </Link>
                  <Link to="/contact" className="w-full text-center block text-xs font-semibold py-2.5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">
                    Talk to Admissions Expert
                  </Link>
                </div>
              </div>

              {otherCourses.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-heading font-bold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-50">
                    Other Health Science Courses
                  </h3>
                  <div className="space-y-3">
                    {otherCourses.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/courses/${c.slug}`}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-green-50/50 transition-colors border border-transparent hover:border-green-100"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-gray-800 truncate group-hover:text-primary-700 transition-colors">
                            {c.name.split(' (')[0]}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{c.duration}</div>
                        </div>
                        <ArrowRight size={14} className="text-gray-400 group-hover:text-primary-700 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
