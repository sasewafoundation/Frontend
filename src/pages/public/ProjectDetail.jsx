import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiUsers, FiArrowRight, FiImage, FiYoutube } from 'react-icons/fi';
import api from '../../services/api';
import { getMediaUrl } from '../../utils/mediaUrl';

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
        // Try by slug first, then by ID
        let res;
        try {
          res = await api.get(`/projects/s/${slug}`);
        } catch {
          res = await api.get(`/projects/${slug}`);
        }
        setProject(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        setError('Project not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-sm text-neutral-500">Loading project...</div></div>
  );

  if (error || !project) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="text-6xl mb-4">🌿</div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-3">Project not found</h2>
      <p className="text-neutral-500 mb-8 max-w-sm">This project may have been moved or doesn't exist yet.</p>
      <Link to="/projects" className="btn-primary">
        <FiArrowLeft size={15} /> Back to Projects
      </Link>
    </div>
  );

  const images = project.images?.length ? project.images : [
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  ];
  const featuredImage = images[activeImg] || images[0];

  return (
    <div className="bg-white w-full overflow-hidden">

      {/* ── Hero Image ── */}
      <section className="relative h-[70vh] min-h-[440px] max-h-[760px] overflow-hidden bg-neutral-900">
        <img
          src={getMediaUrl(featuredImage)}
          alt={project.title}
          className="w-full h-full object-cover opacity-80 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-900/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-0 inset-x-0 pt-24 px-6 z-10">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2"
            >
              <FiArrowLeft size={14} /> All Projects
            </Link>
          </div>
        </div>

      {/* ── Title overlay ── */}
        <div className="absolute bottom-0 inset-x-0 pb-10 px-6 z-10">
          <div className="max-w-7xl mx-auto w-full">
            {project.projectType && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.28em] backdrop-blur-sm border border-white/15 mb-4">
                {project.projectType}
              </span>
            )}
            {project.status && project.status !== 'Completed' && (
              <span className={`pill mb-4 inline-block ${
                project.status?.toLowerCase() === 'active'
                  ? 'bg-green-500/90 text-white border-0 backdrop-blur-sm'
                  : 'bg-primary-600/90 text-white border-0 backdrop-blur-sm'
              }`}>
                {project.status}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div className="bg-white px-6 py-6 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary-700 mb-4">
              <FiImage /> Gallery
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border transition-all ${
                  activeImg === i ? 'border-primary-500 opacity-100 ring-2 ring-primary-100' : 'border-neutral-200 opacity-70 hover:opacity-100'
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
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">About this project</h2>
              <div className="prose-article">
                <p>{project.description}</p>
                {project.content && <div dangerouslySetInnerHTML={{ __html: project.content }} />}
              </div>

              {/* Gallery grid */}
              {images.length > 1 && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-neutral-900 mb-5">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className="aspect-[4/3] rounded-2xl overflow-hidden hover:opacity-90 transition-opacity border border-neutral-100"
                      >
                        <img src={getMediaUrl(img)} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {project.youtubeLink && (
                <div className="mt-12 rounded-[2rem] border border-neutral-100 p-5 bg-neutral-50">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-neutral-600 mb-4">
                    <FiYoutube className="text-red-500" /> Project Video
                  </div>
                  <div className="aspect-video rounded-[1.5rem] overflow-hidden bg-black">
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
            <div className="space-y-5">
              <div className="bg-neutral-50 rounded-3xl border border-neutral-100 p-7">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5">Project Details</h3>
                <div className="space-y-4">
                  {project.projectType && (
                    <div className="flex items-start gap-3">
                      <FiImage size={16} className="text-primary-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Project Type</div>
                        <div className="text-sm text-neutral-700 font-medium mt-0.5">{project.projectType}</div>
                      </div>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <FiMapPin size={16} className="text-primary-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Location</div>
                        <div className="text-sm text-neutral-700 font-medium mt-0.5">{project.location}</div>
                      </div>
                    </div>
                  )}
                  {(project.startDate || project.createdAt) && (
                    <div className="flex items-start gap-3">
                      <FiCalendar size={16} className="text-primary-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Started</div>
                        <div className="text-sm text-neutral-700 font-medium mt-0.5">
                          {new Date(project.startDate || project.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  )}
                  {project.volunteers && (
                    <div className="flex items-start gap-3">
                      <FiUsers size={16} className="text-primary-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Volunteers</div>
                        <div className="text-sm text-neutral-700 font-medium mt-0.5">{project.volunteers}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-primary-600 rounded-3xl p-7 text-white">
                <h3 className="font-bold text-lg mb-2">Support this work</h3>
                <p className="text-sm text-primary-200 leading-relaxed mb-5">
                  Your donation helps us continue projects like this one across Nepal.
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
        <div className="max-w-7xl mx-auto border-t border-neutral-100 pt-10">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors group">
            <FiArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to all projects
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProjectDetail;
