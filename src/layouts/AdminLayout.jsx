import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiFileText, FiLogOut, FiEdit, FiMail, FiAward, FiDollarSign, FiMenu, FiX } from 'react-icons/fi';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  // FIX 21: Mobile sidebar drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // FIX 6: Include Donations in admin navigation
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid size={20}/> },
    { name: 'Projects', path: '/admin/projects', icon: <FiFileText size={20}/> },
    { name: 'Volunteers', path: '/admin/volunteers', icon: <FiUsers size={20}/> },
    { name: 'Blog Manage', path: '/admin/blogs', icon: <FiEdit size={20}/> },
    { name: 'Donations', path: '/admin/donations', icon: <FiDollarSign size={20}/> },
    { name: 'Supporters', path: '/admin/supporters', icon: <FiAward size={20}/> },
    { name: 'Messages', path: '/admin/messages', icon: <FiMail size={20}/> },
  ];

  const currentPage = navItems.find(i => i.path === location.pathname) || { name: 'Admin Portal' };

  return (
    <div className="admin-panel flex h-screen bg-neutral-50 overflow-hidden text-neutral-900">
      
      {/* FIX 21: Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: Fixed desktop sidebar + Mobile off-canvas drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-8 py-7 border-b border-neutral-100 flex items-center justify-between">
          <Link to="/" className="inline-block" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/logo.png"
              alt="Sa-Sewa Foundation"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 text-neutral-500 hover:text-neutral-800 rounded-lg"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border border-primary-100 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-white border border-neutral-200 text-red-600 font-semibold text-sm hover:bg-red-50 hover:border-red-100 transition-colors"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main viewport */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* FIX 21: Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Open navigation sidebar"
            >
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-neutral-900 truncate">
              {currentPage.name}
            </h1>
          </div>
          
          <div className="flex items-center bg-primary-50 px-4 py-2 rounded-full border border-primary-100 text-xs font-medium text-primary-700">
            Admin Panel
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
