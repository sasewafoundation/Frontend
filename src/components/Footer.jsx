import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiLinkedin } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 border-t border-primary-800 text-primary-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Logo & Info */}
          <div className="md:col-span-1 border-b border-primary-800 pb-8 md:border-0 md:pb-0">
            <div className="bg-white inline-flex p-3 rounded-2xl mb-6 shadow-sm">
              <Link to="/">
                <img src="/logo.png" alt="Sa-Sewa Foundation Logo" className="h-10 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-sm leading-relaxed mb-6 font-light text-primary-200">
              Empowering communities and inspiring sustainable development around the globe.
            </p>
            <div className="flex space-x-5">
              <a href="https://www.instagram.com/sasewafoundation/?hl=en" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-800 hover:bg-white hover:text-primary-600 transition-colors" aria-label="Instagram"><FiInstagram size={18} /></a>
              <a href="https://www.linkedin.com/company/sa-sewa-foundation" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-800 hover:bg-white hover:text-primary-600 transition-colors" aria-label="LinkedIn"><FiLinkedin size={18} /></a>
              <a href="https://www.tiktok.com/@sasewafoundation" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-800 hover:bg-white hover:text-primary-600 transition-colors" aria-label="TikTok"><SiTiktok size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="pl-0 md:pl-10">
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="text-sm hover:text-white transition-colors">Projects</Link></li>
              <li><Link to="/join-us" className="text-sm hover:text-white transition-colors">Join Us</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-white transition-colors">Blogs</Link></li>
              <li><Link to="/team" className="text-sm hover:text-white transition-colors">Team</Link></li>
            </ul>
          </div>

          {/* Legal/Policies */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Organization</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Financial Transparency</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm font-light text-primary-200">
              <li className="flex items-start">
                <span className="leading-relaxed text-white">Tarakeshwor-7<br/>Kathmandu<br/>Nepal</span>
              </li>
              <li className="pt-2">
                <a href="mailto:contact@sa-sewa.org" className="hover:text-white transition-colors font-medium">contact@sa-sewa.org</a>
              </li>
              <li>
                <a href="tel:+9779840186494" className="hover:text-white transition-colors font-medium">+977 9840186494</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-primary-800 mt-20 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs font-light tracking-wide text-primary-300">
          <p>&copy; {currentYear} Sa-Sewa Foundation. All rights reserved. Registered Nonprofit Organization.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
