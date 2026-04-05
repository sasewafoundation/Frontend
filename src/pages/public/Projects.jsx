import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import api from '../../services/api';
import { getMediaUrl } from '../../utils/mediaUrl';

const defaultImages = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then(r => setProjects(r.data.data || []))
      .catch(err => console.error('Error fetching projects:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white w-full overflow-hidden">

      {/* ── Page Hero ── */}
      <section className="relative pt-32 pb-20 px-6 bg-neutral-50 border-b border-neutral-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl text-left">
            <span className="section-label">Our Initiatives</span>
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-tight mb-6">
              Projects that<br />
              <span className="text-primary-600">move communities</span><br />
              forward.
            </h1>
            <p className="text-lg text-neutral-500 font-normal leading-relaxed max-w-xl">
              Each project begins with listening. We identify gaps, co-design solutions with local 
              leaders, and deliver measurable outcomes — not just promises.
            </p>
          </div>
        </div>
      </section>

      {/* ── Projects Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-32 flex justify-center"><div className="text-sm text-neutral-500">Loading projects...</div></div>
          ) : projects.length === 0 ? (
            <div className="text-center py-32 rounded-3xl border border-dashed border-neutral-200 bg-neutral-50">
              <p className="text-neutral-400 text-sm">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {projects.map((proj, i) => (
                <Link
                  key={proj._id}
                  to={`/projects/${proj.slug || proj._id}`}
                  className="group card flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img
                      src={getMediaUrl(proj.images?.[0]) || defaultImages[i % defaultImages.length]}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {proj.projectType && (
                      <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-[0.22em] text-neutral-700 border border-white/60">
                        {proj.projectType}
                      </span>
                    )}
                    {/* Status tag */}
                    <span className={`absolute top-4 left-4 pill text-[10px] ${
                      proj.status?.toLowerCase() === 'completed'
                        ? 'bg-emerald-500/90 text-white border-0 backdrop-blur-sm'
                        : proj.status?.toLowerCase() === 'ongoing'
                        ? 'bg-primary-600/90 text-white border-0 backdrop-blur-sm'
                        : 'bg-white/90 text-neutral-700 border border-neutral-200/60 backdrop-blur-sm'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-7 flex flex-col flex-grow">
                    {proj.location && (
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium mb-3">
                        <FiMapPin size={11} />
                        {proj.location}
                      </div>
                    )}
                    <h3 className="text-base font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-[13px] text-neutral-500 leading-relaxed line-clamp-3 flex-grow">
                      {proj.description}
                    </p>
                    <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-1.5 text-[13px] font-semibold text-primary-600 group-hover:gap-2.5 transition-all">
                      View details <FiArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Projects;
