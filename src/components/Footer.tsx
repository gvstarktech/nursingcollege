import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Youtube, Instagram } from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Nursing Courses', path: '/courses' },
  { label: 'Campus & 9 Simulation Labs', path: '/campus' },
  { label: 'Events & Gallery', path: '/events' },
  { label: 'Admissions 2026-27', path: '/admission' },
  { label: 'Blog & Articles', path: '/blog' },
  { label: 'Contact Campus', path: '/contact' },
];

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/mahalakshmicollegeofnursing',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@mahalakshmicollegeofnursing',
  },
];

const nursingCourses = [
  { label: 'B.Sc. Nursing (4 Years Degree)', path: '/courses/bsc-nursing' },
  { label: 'General Nursing & Midwifery (GNM)', path: '/courses/gnm-nursing' },
  { label: 'Post Basic B.Sc. Nursing', path: '/courses/post-basic-bsc-nursing' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/mahalakshmi_nursing_logo.png" alt="Mahalakshmi College of Nursing" className="h-16 w-auto object-contain bg-white rounded-xl p-1.5 shadow-md" />
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ name, icon: Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-9 h-9 rounded-full bg-primary-700 hover:bg-green-500 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-5 text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-green-500 rounded"></span>
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-green-400 text-sm flex items-center gap-2 group transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-2 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-5 text-white relative inline-block">
              Nursing Programs
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-green-500 rounded"></span>
            </h3>
            <ul className="space-y-2.5">
              {nursingCourses.map((course) => (
                <li key={course.path}>
                  <Link
                    to={course.path}
                    className="text-gray-300 hover:text-green-400 text-sm flex items-center gap-2 group transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-2 transition-all"></span>
                    {course.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-5 text-white relative inline-block">
              Contact Info
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-green-500 rounded"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  Trichy-Salem Highway, Thodayur Post, Melpathu village, Mannachanallur Taluk, Trichy - 621213.
                </p>
              </div>
              <div className="flex gap-3">
                <Phone size={18} className="text-green-400 flex-shrink-0" />
                <a href="tel:+917358873106" className="text-gray-300 hover:text-green-400 text-sm transition-colors">
                  +91 73588 73106
                </a>
              </div>
              <div className="flex gap-3">
                <Mail size={18} className="text-green-400 flex-shrink-0" />
                <a href="mailto:info@mahalakshmicollegeofnursing.com" className="text-gray-300 hover:text-green-400 text-sm transition-colors break-all">
                  info@mahalakshmicollegeofnursing.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Directory Profiles & Institutional Citations */}
        <div className="border-t border-primary-800/70 pt-6 pb-2 mb-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400 text-center">
            <span className="font-semibold text-gray-300">Verified Institutional Profiles:</span>
            <a href="https://www.crunchbase.com/organization/mahalakshmi-college-of-nursing" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Crunchbase</a>
            <span className="text-gray-600">•</span>
            <a href="https://www.justdial.com/Trichy/Mahalakshmi-College-Of-Nursing-Thuraiyur/0431PX431-X431-230812124111-T9N4_BZDET" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">JustDial Official</a>
            <span className="text-gray-600">•</span>
            <a href="https://www.tamilnaducolleges.org/nursing-colleges-in-trichy-district/mahalakshmi-college-of-nursing/2900" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">TamilNaduColleges.org</a>
            <span className="text-gray-600">•</span>
            <a href="https://mynursingadmission.com/college/mahalakshmi-college-of-nursing-trichy/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">MyNursingAdmission</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-800 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-gray-400 text-sm text-center">
            &copy; 2026 Mahalakshmi College Of Nursing | Developed By <a href="https://github.com/vijayakumarjith" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 text-white font-semibold transition-colors underline decoration-dotted">Jitheeswaran</a>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
