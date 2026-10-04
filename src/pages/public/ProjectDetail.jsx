import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiUsers, FiArrowRight, FiImage, FiYoutube } from 'react-icons/fi';
import api from '../../services/api';
import { getMediaUrl } from '../../utils/mediaUrl';
import Seo from '../../components/Seo';
// FIX 2: Sanitize HTML content to prevent stored XSS
import { sanitizeHtml } from '../../utils/sanitize';

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const idMatch = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/) || url.match(/embed\/([^?&]+)/);
  const videoId = idMatch?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url.replace('watch?v=', 'embed/');
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        let res;
        try {
          res = await api.get(`/projects/s/${slug}`);
        } catch {
          res = await api.get(`/projects/${slug}`);
        }
        setProject(res.data.data || res.data);
      } catch (err) {
        console.error('Error fetching project details:', err.response?.data || err.message);
        setError('Project not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return (
    <>
      <Seo title="Project" description="Loading project details from Sa-Sewa Foundation." />
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-sm text-neutral-500">Loading project...</div>
      </div>
    </>
  );

  if (error || !project) return (
    <>
      <Seo title="Project not found" description="The requested Sa-Sewa Foundation project could not be found." />
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">Project not found</h2>
        <p className="text-neutral-500 mb-8 max-w-sm">This project may have been moved or doesn't exist yet.</p>
        <Link to="/projects" className="btn-primary">
          <FiArrowLeft size={15} /> Back to Projects
        </Link>
      </div>
    </>
  );

  const images = project.images?.length ? project.images : [
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  ];
  const featuredImage = images[activeImg] || images[0];

  return (
    <div className="bg-white w-full overflow-hidden">
      <Seo
        title={project?.title || 'Project'}
        description={project?.description || 'Detailed view of a Sa-Sewa Foundation project.'}
      />

      {/* ── Hero Image ── */}
      <section className="relative h-[65vh] min-h-[420px] max-h-[720px] overflow-hidden bg-neutral-900">
        <img
          src={getMediaUrl(featuredImage)}
          alt={project.title}
          className="w-full h-full object-cover opacity-85 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-0 inset-x-0 pt-24 px-6 z-10">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md border border-white/15 rounded-full px-4 py-2"
            >
              <FiArrowLeft size={14} /> All Projects
            </Link>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 inset-x-0 pb-10 px-6 z-10">
          <div className="max-w-7xl mx-auto w-full">
            {project.projectType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20 mb-3">
                {project.projectType}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div className="bg-white px-6 py-4 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-700 mb-3">
              <FiImage /> Gallery
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border transition-all ${
                    activeImg === i ? 'border-primary-500 ring-2 ring-primary-200 opacity-100' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getMediaUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">About this initiative</h2>
              
              <div className="prose-article leading-relaxed text-neutral-700 text-base md:text-lg whitespace-pre-wrap">
                <p>{project.description}</p>
                {/* FIX 2: Sanitize raw HTML from project.content */}
                {project.content && (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.content) }} />
                )}
              </div>

              {/* Gallery grid */}
              {images.length > 1 && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">Project Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className="aspect-[4/3] rounded-2xl overflow-hidden hover:opacity-90 transition-opacity border border-neutral-100 shadow-sm"
                      >
                        <img src={getMediaUrl(img)} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {project.youtubeLink && (
                <div className="mt-12 rounded-3xl border border-neutral-100 p-6 bg-neutral-50">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-4">
                    <FiYoutube className="text-red-500" /> Project Video Footage
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                    <iframe
                      className="w-full h-full"
                      src={getYoutubeEmbedUrl(project.youtubeLink)}
                      title="Project Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              <div className="bg-neutral-50 rounded-3xl border border-neutral-100 p-7">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-6">Overview</h3>
                <div className="space-y-4">
                  {project.projectType && (
                    <div className="flex items-start gap-3">
                      <FiImage size={16} className="text-primary-600 mt-1 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Type</div>
                        <div className="text-sm text-neutral-700 font-medium mt-0.5">{project.projectType}</div>
                      </div>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <FiMapPin size={16} className="text-primary-600 mt-1 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Location</div>
                        <div className="text-sm text-neutral-700 font-medium mt-0.5">{project.location}</div>
                      </div>
                    </div>
                  )}
                  {(project.startDate || project.createdAt) && (
                    <div className="flex items-start gap-3">
                      <FiCalendar size={16} className="text-primary-600 mt-1 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Recorded Date</div>
                        <div className="text-sm text-neutral-700 font-medium mt-0.5">
                          {new Date(project.startDate || project.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  )}
                  {project.volunteers && (
                    <div className="flex items-start gap-3">
                      <FiUsers size={16} className="text-primary-600 mt-1 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Volunteers</div>
                        <div className="text-sm text-neutral-700 font-medium mt-0.5">{project.volunteers}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-primary-600 rounded-3xl p-7 text-white shadow-card">
                <h3 className="font-bold text-lg mb-2">Support this initiative</h3>
                <p className="text-sm text-primary-100 leading-relaxed mb-6">
                  Your contribution helps deliver practical local solutions directly to communities across Nepal.
                </p>
                <Link to="/donation" className="btn-white w-full justify-center">
                  Donate Now <FiArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Back link ── */}
      <div className="pb-16 px-6">
        <div className="max-w-7xl mx-auto border-t border-neutral-100 pt-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            <FiArrowLeft size={14} /> Back to all projects
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProjectDetail;
