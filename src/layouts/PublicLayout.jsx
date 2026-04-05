import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      <Navbar />
      <main className="flex-grow"> {/* Hero sections control their own top padding to sit under the fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
