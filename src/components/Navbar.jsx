import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const location = useLocation();

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/(ne|de|en)/);
    if (match?.[1]) setCurrentLang(match[1].toUpperCase());
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Home',      path: '/' },
    { name: 'Projects',  path: '/projects' },
    { name: 'Blog',      path: '/blog' },
    { name: 'Join Us',   path: '/join-us' },
    { name: 'Our Team',  path: '/team' },
    { name: 'About Us',  path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleLang = (code) => {
    document.cookie = `googtrans=/en/${code}; path=/`;
    document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname}`;
    window.location.reload();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-neutral-200 shadow-[0_2px_14px_rgba(15,23,42,0.05)]">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="shrink-0 z-50">
          <img
            src="/logo.png"
            alt="Sa-Sewa Foundation"
            className="h-11 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors duration-200 py-0.5 ${
                  active
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-primary-700'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary-600 rounded-full transform origin-left transition-transform duration-200 ${
                  active ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdown(p => !p)}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-primary-700 transition-colors bg-primary-50 hover:bg-primary-100 px-3.5 py-2 rounded-full"
            >
              <FiGlobe size={14} />
              {currentLang}
            </button>
            <div className={`absolute right-0 mt-2.5 w-40 bg-white rounded-xl shadow-[var(--shadow-card)] border border-neutral-200 overflow-hidden transition-all duration-150 origin-top-right ${
              langDropdown ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
            }`}>
              {[
                { code: 'en', label: 'English' },
                { code: 'ne', label: 'Nepali' },
                { code: 'de', label: 'German' },
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => { handleLang(l.code); setLangDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                    currentLang.toLowerCase() === l.code
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/donation"
            className="text-sm font-semibold bg-primary-600 text-white px-4 py-2.5 rounded-full shadow-sm hover:bg-primary-700 hover:-translate-y-px transition-all active:scale-95"
          >
            Donate Now
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden z-50 p-2.5 text-neutral-700 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors"
          onClick={() => setIsOpen(p => !p)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`fixed inset-0 bg-white z-40 flex flex-col lg:hidden transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}>
        <div className="flex-1 overflow-y-auto pt-24 px-6 pb-8 space-y-1">
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3.5 text-lg font-semibold rounded-xl transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="px-6 pb-10 pt-6 border-t border-gray-100 space-y-3">
          <Link
            to="/donation"
            onClick={() => setIsOpen(false)}
            className="btn-primary w-full justify-center py-3.5"
          >
            Donate Now
          </Link>
          <div className="flex justify-center gap-5 pt-3">
            {['en', 'ne', 'de'].map(code => (
              <button
                key={code}
                onClick={() => { handleLang(code); setIsOpen(false); }}
                className={`text-sm font-semibold transition-colors ${
                  currentLang.toLowerCase() === code ? 'text-primary-600' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
