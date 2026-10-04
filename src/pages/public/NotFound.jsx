import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import Seo from '../../components/Seo';

/**
 * FIX 8: 404 Not Found Page
 */
const NotFound = () => {
  return (
    <div className="min-h-[80vh] bg-white flex items-center justify-center px-6 py-24">
      <Seo title="Page Not Found" description="The page you are looking for does not exist." />
      
      <div className="max-w-xl text-center">
        <span className="inline-block text-xs font-bold text-primary-600 uppercase tracking-widest px-4 py-1.5 bg-primary-50 rounded-full border border-primary-100 mb-6">
          404 Error
        </span>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight mb-4">
          Page Not Found
        </h1>
        
        <p className="text-base text-neutral-500 leading-relaxed mb-10 max-w-md mx-auto">
          The page or resource you are looking for may have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-primary px-8 py-3.5"
          >
            <FiHome size={16} />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline px-8 py-3.5"
          >
            <FiArrowLeft size={16} />
            Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
