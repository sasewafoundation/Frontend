import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiFileText, FiUsers, FiEdit3, FiArrowRight, FiSmile, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LogoLoader from '../../components/LogoLoader';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    volunteers: 0,
    blogs: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, volRes, blogRes, msgRes] = await Promise.allSettled([
          api.get('/projects'),
          api.get('/volunteers'),
          api.get('/blog'),
          api.get('/messages'),
        ]);

        setStats({
          projects: projRes.status === 'fulfilled' ? (projRes.value.data.data?.length || 0) : 0,
          volunteers: volRes.status === 'fulfilled' ? (volRes.value.data.data?.length || 0) : 0,
          blogs: blogRes.status === 'fulfilled' ? (blogRes.value.data.data?.length || 0) : 0,
          messages: msgRes.status === 'fulfilled' ? (msgRes.value.data.data?.length || 0) : 0,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Foundation Projects', value: stats.projects, icon: <FiFileText size={20}/>, color: 'bg-primary-900', link: '/admin/projects' },
    { label: 'New Volunteers', value: stats.volunteers, icon: <FiUsers size={20}/>, color: 'bg-primary-900', link: '/admin/volunteers' },
    { label: 'Stories Manage', value: stats.blogs, icon: <FiEdit3 size={20}/>, color: 'bg-primary-900', link: '/admin/blogs' },
    { label: 'Contact Messages', value: stats.messages, icon: <FiMail size={20}/>, color: 'bg-primary-900', link: '/admin/messages' },
  ];

  if (loading) return <LogoLoader message="Loading dashboard data..." />;

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
      
      <section className="bg-white p-7 rounded-2xl border border-neutral-200 flex items-center justify-between">
        <div className="max-w-xl">
          <h2 className="text-sm font-semibold text-primary-700 mb-1">Administrator Console</h2>
          <h3 className="text-2xl font-semibold text-neutral-900 mb-2">Operational Overview</h3>
          <p className="text-neutral-500 leading-relaxed text-sm">
            Track the core operations at a glance: projects, volunteers, and blog updates.
          </p>
        </div>
        <FiSmile size={46} className="text-primary-100" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link} 
            className="group bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-primary-200 hover:shadow-[var(--shadow-card)] transition-all duration-300 overflow-hidden relative"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
              {stat.icon}
            </div>
            <div className="text-3xl font-semibold text-neutral-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-neutral-500">{stat.label}</div>
            
            <div className="absolute top-6 right-6 text-primary-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <FiArrowRight size={20} />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
