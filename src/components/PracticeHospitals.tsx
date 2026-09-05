import React from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { FadeIn, StaggerChildren } from './Animate';

export interface PracticeHospital {
  id: string;
  name: string;
  location: string;
  fullName: string;
  tag: string;
  logo: React.ReactNode;
  gradient: string;
  accentColor: string;
  borderColor: string;
}

export const practiceHospitals: PracticeHospital[] = [
  {
    id: 'rathna-hospital',
    name: 'Rathna Hospital',
    location: 'Trichy',
    fullName: 'Rathna Hospital (NABH Accredited)',
    tag: 'NABH Accredited Clinical Partner',
    gradient: 'from-blue-950 via-primary-900 to-indigo-950',
    accentColor: 'text-green-400',
    borderColor: 'border-green-500/40',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#rathna_grad)" />
        <path d="M20 7L24.5 16H34.5L26.5 22L29.5 31.5L20 25.5L10.5 31.5L13.5 22L5.5 16H15.5L20 7Z" fill="#10B981" opacity="0.3" />
        <path d="M20 10V30M10 20H30" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <circle cx="20" cy="20" r="14" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
        <defs>
          <linearGradient id="rathna_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#004B87" />
            <stop offset="1" stopColor="#00A651" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'gh-srirangam',
    name: 'Government Hospital',
    location: 'Srirangam, Trichy',
    fullName: 'Government Hospital, Srirangam',
    tag: 'Government Multi-Specialty',
    gradient: 'from-emerald-900/90 via-emerald-800/80 to-teal-950',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#gh_grad)" />
        <path d="M20 6L32 12V14H8V12L20 6Z" fill="#F59E0B" />
        <path d="M11 16H13.5V26H11V16ZM16.5 16H19V26H16.5V16ZM22 16H24.5V26H22V16ZM27.5 16H30V26H27.5V16Z" fill="#FFFFFF" />
        <rect x="8" y="27" width="24" height="3.5" rx="1" fill="#F59E0B" />
        <path d="M20 17.5V24.5M16.5 21H23.5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="gh_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#064E3B" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'retna-global',
    name: 'Retna Global Hospital',
    location: 'Trichy',
    fullName: 'Retna Global Hospital Trichy',
    tag: 'Super Specialty Hospital',
    gradient: 'from-sky-950 via-blue-900/80 to-slate-950',
    accentColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#retna_grad)" />
        <circle cx="20" cy="20" r="12" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" />
        <ellipse cx="20" cy="20" rx="12" ry="5" stroke="#0EA5E9" strokeWidth="1.2" />
        <path d="M20 11V29M11 20H29" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13 20H16.5L18 16L21 24L22.5 20H26" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="retna_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F172A" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'silverline',
    name: 'Silverline Hospital',
    location: 'Trichy',
    fullName: 'Silverline Hospital Trichy',
    tag: 'Specialty Care Center',
    gradient: 'from-indigo-950 via-slate-900 to-indigo-900/80',
    accentColor: 'text-indigo-300',
    borderColor: 'border-indigo-400/30',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#silver_grad)" />
        <path d="M7 22C13 22 14 11 20 11C26 11 27 29 33 29" stroke="url(#silver_line)" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 12V20M16 16H24" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="20" cy="16" r="8" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="2 2" />
        <defs>
          <linearGradient id="silver_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E1B4B" />
            <stop offset="1" stopColor="#312E81" />
          </linearGradient>
          <linearGradient id="silver_line" x1="7" y1="11" x2="33" y2="29" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E0E7FF" />
            <stop offset="0.5" stopColor="#818CF8" />
            <stop offset="1" stopColor="#C7D2FE" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'friends-blood-bank',
    name: 'Friends Blood Bank',
    location: 'Trichy',
    fullName: 'Friends Blood Bank Trichy',
    tag: 'Blood Transfusion Center',
    gradient: 'from-red-950 via-rose-950 to-rose-900/90',
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#fbb_grad)" />
        <path d="M20 8C20 8 10 18.5 10 24.5C10 29.5 14.5 33.5 20 33.5C25.5 33.5 30 29.5 30 24.5C30 18.5 20 8 20 8Z" fill="url(#drop_grad)" />
        <path d="M20 17.5V26.5M15.5 22H24.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="fbb_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#450A0A" />
            <stop offset="1" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="drop_grad" x1="10" y1="8" x2="30" y2="33.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EF4444" />
            <stop offset="1" stopColor="#B91C1C" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'gvn-hospital',
    name: 'GVN Hospital',
    location: 'Trichy',
    fullName: 'GVN Hospital, Trichy',
    tag: 'Multi-Specialty Hospital',
    gradient: 'from-emerald-950 via-blue-950 to-blue-900/90',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/30',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#gvn_grad)" />
        <path d="M20 6L32 10.5V21C32 28 26.5 33 20 34.5C13.5 33 8 28 8 21V10.5L20 6Z" fill="none" stroke="#6EE7B7" strokeWidth="1.8" />
        <text x="20" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">GVN</text>
        <path d="M20 10V14.5M17.5 12.2H22.5" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="gvn_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#065F46" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'gvn-riverside',
    name: 'GVN Riverside Hospital',
    location: 'Trichy',
    fullName: 'GVN Riverside Hospital, Trichy',
    tag: 'Riverside Healthcare Center',
    gradient: 'from-teal-950 via-cyan-950 to-slate-950',
    accentColor: 'text-teal-300',
    borderColor: 'border-teal-400/30',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#gvn_r_grad)" />
        <path d="M7 27C11.5 24 15.5 29 19.5 26C23.5 23 27.5 28 32 25" stroke="#2DD4BF" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M7 31C11.5 28 15.5 33 19.5 30C23.5 27 27.5 32 32 29" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M20 8V17M15.5 12.5H24.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <text x="20" y="22" textAnchor="middle" fill="#5EEAD4" fontSize="8" fontWeight="800" fontFamily="sans-serif">GVN</text>
        <defs>
          <linearGradient id="gvn_r_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#134E4A" />
            <stop offset="1" stopColor="#0F766E" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'suham-hospital',
    name: 'Suham Hospital',
    location: 'Thiruvanaikoil, Trichy',
    fullName: 'Suham Hospital in Thiruvanaikoil, Trichy',
    tag: 'General & Specialty Care',
    gradient: 'from-amber-950 via-orange-950 to-amber-900/80',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#suham_grad)" />
        <path d="M20 9C22.5 14.5 26.5 16.5 29.5 16.5C26.5 21 22.5 23 20 28.5C17.5 23 13.5 21 10.5 16.5C13.5 16.5 17.5 14.5 20 9Z" fill="url(#suham_petal)" opacity="0.9" />
        <path d="M20 13.5V22M16 17.8H24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="suham_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#78350F" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="suham_petal" x1="10.5" y1="9" x2="29.5" y2="28.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#FCD34D" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'pugazhini-hospital',
    name: 'Pugazhini Hospital',
    location: 'No 1 Tollgate, Trichy',
    fullName: 'Pugazhini Hospital in No 1 Tollgate, Trichy',
    tag: 'Trauma & Emergency Care',
    gradient: 'from-purple-950 via-violet-950 to-purple-900/80',
    accentColor: 'text-purple-300',
    borderColor: 'border-purple-400/30',
    logo: (
      <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#pugazh_grad)" />
        <path d="M20 7.5L31 12.5V22C31 28 26 32.5 20 34C14 32.5 9 28 9 22V12.5L20 7.5Z" fill="#5B21B6" stroke="#A78BFA" strokeWidth="1.5" />
        <path d="M20 13.5L21.5 17.5H25.5L22.2 20L23.5 24L20 21.5L16.5 24L17.8 20L14.5 17.5H18.5L20 13.5Z" fill="#FBBF24" />
        <path d="M20 17.5V23.5M17 20.5H23" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="pugazh_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2E1065" />
            <stop offset="1" stopColor="#6B21A8" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
];

export function PracticeHospitalsMarquee() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-primary-950 via-slate-900 to-primary-950 border-y border-white/10 backdrop-blur-md py-6 z-20">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <span className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          Official Practice Hospital Partners & Clinical Postings
        </span>
      </div>
      
      <div className="marquee-track flex gap-6 text-white items-center py-2">
        {/* Render items twice to build continuous loop */}
        {[...practiceHospitals, ...practiceHospitals].map((h, index) => (
          <div 
            key={`${h.id}-marquee-${index}`} 
            className="flex items-center gap-3.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-green-400/40 rounded-2xl px-5 py-3 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 group whitespace-nowrap"
          >
            <div className="shadow-md group-hover:scale-110 transition-transform duration-300">
              {h.logo}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold tracking-wide text-white group-hover:text-green-300 transition-colors">
                {h.name}
              </span>
              <span className="text-[11px] font-medium text-gray-300 flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-green-400" />
                {h.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PracticeHospitalsGrid() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-primary-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-green-400 font-semibold text-xs uppercase tracking-widest mb-3 inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              Clinical Affiliations & Ward Duty
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mb-4">
              Practice Hospital Partners
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our nursing students receive intensive hands-on clinical postings, ICU rotations, maternal care practice, and emergency ward training exclusively at these premier medical institutions.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={100} baseDelay={100}>
          {practiceHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className={`relative bg-gradient-to-br ${hospital.gradient} border ${hospital.borderColor} rounded-3xl p-6 hover:-translate-y-2 transition-all duration-300 group shadow-xl hover:shadow-2xl flex flex-col justify-between`}
            >
              <div>
                {/* Logo & Tag */}
                <div className="flex items-start justify-between mb-5">
                  <div className="p-2 rounded-2xl bg-black/30 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    {hospital.logo}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 ${hospital.accentColor}`}>
                    {hospital.tag}
                  </span>
                </div>

                {/* Hospital Name & Location */}
                <h3 className="font-heading font-bold text-lg text-white group-hover:text-green-300 transition-colors mb-2">
                  {hospital.fullName}
                </h3>
              </div>

              {/* Bottom detail badge */}
              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-gray-300">
                <span className="flex items-center gap-1.5 font-medium text-gray-300">
                  <MapPin size={12} className={hospital.accentColor} />
                  {hospital.location}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-green-400">
                  <CheckCircle2 size={12} /> Practice Partner
                </span>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
