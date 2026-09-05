import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Campus & Labs', path: '/campus' },
  { label: 'Fee Payment', path: '/fees' },
  { label: 'Events', path: '/events' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-xs py-2 px-4 hidden md:block border-b border-primary-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+917358873106" className="flex items-center gap-1.5 hover:text-green-300 transition-colors">
              <Phone size={12} /> +91 73588 73106
            </a>
            <a href="mailto:info@mahalakshmicollegeofnursing.com" className="flex items-center gap-1.5 hover:text-green-300 transition-colors">
              <Mail size={12} /> info@mahalakshmicollegeofnursing.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            {/* Hidden per request - preserved without removing */}
            <div className="hidden items-center gap-3">
              <span className="text-green-300 font-bold tracking-wide">🏆 Best Nursing College in Tamil Nadu</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-200 font-medium">INC Code: 986</span>
              <span className="text-gray-400">|</span>
              <span className="text-green-300 font-semibold">The TN Dr. M.G.R. Medical University</span>
            </div>
            <Link to="/admission" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold transition-colors">
              Apply for Admission
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-xl backdrop-blur-sm' : 'bg-white shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
              <img src="/mahalakshmi_nursing_logo.png" alt="Mahalakshmi College of Nursing" className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                    location.pathname === link.path
                      ? 'text-primary-700 bg-primary-50 font-semibold'
                      : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {location.pathname !== link.path && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                  )}
                </Link>
              ))}
              <Link
                to="/admission"
                className="ml-3 btn-primary text-sm py-2 px-4 animate-pulse-ring"
              >
                Admission 2026
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-700 bg-primary-50 font-semibold'
                    : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admission"
              className="block btn-primary text-sm py-2.5 text-center mt-2"
            >
              Apply for Admission
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
