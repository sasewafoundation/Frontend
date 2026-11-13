import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiImage,
  FiYoutube,
  FiBookOpen,
} from 'react-icons/fi';
import api from '../../services/api';
import { getMediaUrl } from '../../utils/mediaUrl';
import Seo from '../../components/Seo';
import { renderMarkdown } from '../../utils/markdown.js';

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
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        let res;
        try {
          res = await api.get(`/projects/s/${slug}?_t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
          });
        } catch {
          res = await api.get(`/projects/${slug}?_t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
          });
        }
        const projectData = res.data.data || res.data;
        if (!projectData) {
          setError('Project not found.');
          return;
        }
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project details:', err.response?.data || err.message);
        setError('Project not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Seo title="Project" description="Loading project details from Sa-Sewa Foundation." />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-sm font-medium text-neutral-500">Loading project details...</div>
        </div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Seo title="Project not found" description="The requested Sa-Sewa Foundation project could not be found." />
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
          <div className="text-6xl mb-4">🌿</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">Project not found</h2>
          <p className="text-neutral-500 mb-8 max-w-sm">This project may have been moved or does not exist yet.</p>
          <Link to="/projects" className="btn-primary">
            <FiArrowLeft size={15} /> Back to Projects
          </Link>
        </div>
      </>
    );
  }

  const images = project.images && project.images.length > 0 ? project.images : [];
  const featuredImage = images[activeImg] || images[0];
  const mapSlug = project.slug || (slug && slug !== 'undefined' ? slug : 'scholarship-and-school-support');
  const mapUrl = `/projects/${mapSlug}/map`;
  const isMapEnabled = project.mapSettings?.mapEnabled !== false;

  return (
    <div className="bg-white w-full overflow-hidden">
      <Seo
        title={project.title || 'Project'}
        description={
          project.summary ||
          (project.description ? project.description.slice(0, 160) : 'Sa-Sewa Foundation project.')
        }
      />

      {/* ── Hero ── */}
      {featuredImage ? (
        <section className="relative h-[60vh] min-h-[400px] max-h-[640px] overflow-hidden bg-neutral-900">
          <img
            src={getMediaUrl(featuredImage)}
            alt={project.title}
            className="w-full h-full object-cover opacity-85 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-900/40 to-transparent" />

          {/* Back button */}
          <div className="absolute top-0 inset-x-0 pt-24 px-6 z-10">
            <div className="max-w-7xl mx-auto">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
              >
                <FiArrowLeft size={14} /> All Projects
              </Link>
            </div>
          </div>

          {/* Title & Metadata overlay */}
          <div className="absolute bottom-0 inset-x-0 pb-10 px-6 z-10">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {project.projectType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20">
                    {project.projectType}
                  </span>
                )}
                {project.status && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-semibold backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {project.status}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
                {project.title}
              </h1>
              {project.location && (
                <p className="text-white/80 text-sm md:text-base mt-2 flex items-center gap-2 font-medium">
                  <FiMapPin className="text-primary-400" />
                  {project.location}
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="pt-32 pb-16 px-6 bg-neutral-900 text-white">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6"
            >
              <FiArrowLeft size={14} /> All Projects
            </Link>
            {project.projectType && (
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
                {project.projectType}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              {project.title}
            </h1>
            {project.location && (
              <p className="text-white/70 text-sm md:text-base mt-2 flex items-center gap-2 font-medium">
                <FiMapPin className="text-primary-400" />
                {project.location}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Gallery Thumbnail strip (only if multiple images) ── */}
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
                    activeImg === i
                      ? 'border-primary-500 ring-2 ring-primary-200 opacity-100'
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getMediaUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Simple Interactive Map Notice */}
          {isMapEnabled && (
            <div className="mb-12 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-primary-50 text-primary-600 rounded-xl border border-primary-200">
                  <FiMapPin size={20} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Interactive Map Available</h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    View field locations for {project.mapSettings?.regionName || project.location || 'this project'} on the map.
                  </p>
                </div>
              </div>
              <Link
                to={mapUrl}
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-xs shrink-0"
              >
                Open Project Map <FiArrowRight size={14} />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left Column: Description, Gallery, Video */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  About this initiative
                </h2>

                <div
                  className="prose-article leading-relaxed text-neutral-700 font-normal space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(project.description || project.content || ''),
                  }}
                />
              </div>

              {/* Gallery Grid (only if multiple images) */}
              {images.length > 1 && (
                <div>
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

              {/* Video Player (only if youtubeLink configured in admin) */}
              {project.youtubeLink && (
                <div className="rounded-3xl border border-neutral-100 p-6 bg-neutral-50">
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

            {/* Right Column: Project Overview (matching admin fields) */}
            <div>
              <div className="bg-neutral-50 rounded-3xl border border-neutral-200/80 p-7 space-y-5">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-4">
                  Project Overview
                </h3>

                {project.projectType && (
                  <div className="flex items-start gap-3">
                    <FiBookOpen size={16} className="text-primary-600 mt-1 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Type</div>
                      <div className="text-sm text-neutral-900 font-semibold mt-0.5">
                        {project.projectType}
                      </div>
                    </div>
                  </div>
                )}

                {project.location && (
                  <div className="flex items-start gap-3">
                    <FiMapPin size={16} className="text-primary-600 mt-1 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Location</div>
                      <div className="text-sm text-neutral-900 font-semibold mt-0.5">
                        {project.location}
                      </div>
                    </div>
                  </div>
                )}

                {(project.startDate || project.createdAt) && (
                  <div className="flex items-start gap-3">
                    <FiCalendar size={16} className="text-primary-600 mt-1 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Start Date</div>
                      <div className="text-sm text-neutral-900 font-semibold mt-0.5">
                        {new Date(project.startDate || project.createdAt).toLocaleDateString(undefined, {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {project.status && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 animate-pulse" />
                    <div>
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Status</div>
                      <div className="text-sm text-emerald-800 font-semibold mt-0.5">
                        {project.status}
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Button inside sidebar */}
                {isMapEnabled && (
                  <div className="pt-4 border-t border-neutral-200">
                    <Link
                      to={mapUrl}
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-neutral-800 hover:text-primary-700 hover:border-primary-300 rounded-xl border border-neutral-300 font-bold text-xs shadow-xs transition-all"
                    >
                      <FiMapPin size={14} className="text-primary-600" />
                      View on Interactive Map
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Back link ── */}
      <div className="pb-16 px-6">
        <div className="max-w-7xl mx-auto border-t border-neutral-100 pt-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <FiArrowLeft size={14} /> Back to all projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
