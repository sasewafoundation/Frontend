import React from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiFileText, FiLogOut, FiEdit, FiMail, FiAward } from 'react-icons/fi';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid size={20}/> },
    { name: 'Projects', path: '/admin/projects', icon: <FiFileText size={20}/> },
    { name: 'Volunteers', path: '/admin/volunteers', icon: <FiUsers size={20}/> },
    { name: 'Blog Manage', path: '/admin/blogs', icon: <FiEdit size={20}/> },
    { name: 'Supporters', path: '/admin/supporters', icon: <FiAward size={20}/> },
    { name: 'Messages', path: '/admin/messages', icon: <FiMail size={20}/> },
  ];

  const currentPage = navItems.find(i => i.path === location.pathname) || { name: 'Admin Portal' };

  return (
    <div className="admin-panel flex h-screen bg-neutral-50 overflow-hidden text-neutral-900">
      <aside className="w-72 bg-white border-r border-neutral-200 flex flex-col z-50">
        <div className="px-8 py-7 border-b border-neutral-100">
          <Link to="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Sa-Sewa Foundation"
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border border-primary-100'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-semibold">{item.name}</span>
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

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-semibold text-neutral-900">{currentPage.name}</h1>
          <div className="hidden lg:flex items-center bg-primary-50 px-4 py-2 rounded-full border border-primary-100 text-xs font-medium text-primary-700">
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
