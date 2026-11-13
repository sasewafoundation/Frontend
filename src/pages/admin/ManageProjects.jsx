import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import {
  FiTrash2,
  FiPlus,
  FiEdit3,
  FiActivity,
  FiX,
  FiBold,
  FiItalic,
  FiImage,
  FiMapPin,
  FiYoutube,
  FiCalendar,
  FiGlobe,
  FiLink,
  FiLayers,
} from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../../components/LogoLoader';
import ProjectLocationsManager from '../../components/admin/ProjectLocationsManager';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProjectForLocations, setSelectedProjectForLocations] = useState(null);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    summary: '',
    projectType: '',
    status: 'Active',
    location: '',
    youtubeLink: '',
    startDate: '',
    slug: '',
    mapEnabled: false,
    regionName: '',
  });

  // Media States
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [actionLoading, setActionLoading] = useState(false);
  const textareaRef = useRef(null);
  const objectUrlsRef = useRef([]);

  const createPreviewUrl = (file) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    return url;
  };

  const cleanupObjectUrls = () => {
    objectUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignored
      }
    });
    objectUrlsRef.current = [];
  };

  useEffect(() => {
    return () => {
      cleanupObjectUrls();
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data || []);
    } catch (err) {
      console.error('Retrieval failure:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      const urls = files.map((file) => createPreviewUrl(file));
      setGalleryPreviews((prev) => [...prev, ...urls]);
    }
  };

  const removeGalleryItem = (index) => {
    const targetUrl = galleryPreviews[index];
    if (targetUrl && (targetUrl.startsWith('http') || targetUrl.includes('/uploads/'))) {
      setRemovedImages((prev) => [...prev, targetUrl]);
    }

    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    const existingCount = galleryPreviews.length - galleryFiles.length;
    if (index >= existingCount) {
      const fileIndex = index - existingCount;
      setGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newProject.title);
      formData.append('description', newProject.description);
      formData.append('summary', newProject.summary || '');
      formData.append('projectType', newProject.projectType || '');
      formData.append('status', newProject.status || 'Active');
      formData.append('location', newProject.location || '');
      formData.append('youtubeLink', newProject.youtubeLink || '');

      if (newProject.startDate) {
        formData.append('startDate', newProject.startDate);
      }
      if (newProject.slug) {
        formData.append('slug', newProject.slug.trim());
      }

      // Map Settings
      formData.append('mapEnabled', Boolean(newProject.mapEnabled));
      formData.append('regionName', newProject.regionName || '');

      if (removedImages.length > 0) {
        formData.append('removedImages', JSON.stringify(removedImages));
      }

      galleryFiles.forEach((file) => {
        formData.append('images', file);
      });

      let res;
      if (editingId) {
        res = await api.put(`/projects/${editingId}`, formData);
        setProjects((prev) => prev.map((p) => (p._id === editingId ? res.data.data : p)));
      } else {
        res = await api.post('/projects', formData);
        setProjects((prev) => [res.data.data, ...prev]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      const fallbackMessage = err.message || 'Failed to save project. Please try again.';
      alert(apiMessage || fallbackMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    cleanupObjectUrls();
    setNewProject({
      title: '',
      description: '',
      summary: '',
      projectType: '',
      status: 'Active',
      location: '',
      youtubeLink: '',
      startDate: '',
      slug: '',
      mapEnabled: false,
      regionName: '',
    });
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setRemovedImages([]);
    setEditingId(null);
  };

  const openEditModal = (project) => {
    cleanupObjectUrls();
    setNewProject({
      title: project.title || '',
      description: project.description || '',
      summary: project.summary || '',
      projectType: project.projectType || '',
      status: project.status || 'Active',
      location: project.location || '',
      youtubeLink: project.youtubeLink || '',
      startDate: project.startDate ? project.startDate.slice(0, 10) : '',
      slug: project.slug || '',
      mapEnabled: Boolean(project.mapSettings?.mapEnabled),
      regionName: project.mapSettings?.regionName || '',
    });
    setGalleryPreviews(project.images?.map((img) => getMediaUrl(img)) || []);
    setEditingId(project._id);
    setGalleryFiles([]);
    setRemovedImages([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project record permanently?')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Deletion failed.');
      }
    }
  };

  const wrapText = (tagOpen, tagClose = tagOpen) => {
    const tex = textareaRef.current;
    if (!tex) return;
    const start = tex.selectionStart;
    const end = tex.selectionEnd;
    const text = tex.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newVal = `${before}${tagOpen}${selection}${tagClose}${after}`;
    setNewProject({ ...newProject, description: newVal });

    setTimeout(() => {
      tex.focus();
      tex.setSelectionRange(start + tagOpen.length, end + tagOpen.length);
    }, 10);
  };

  if (loading) return <LogoLoader message="Loading projects..." />;

  // If a project is selected for location management, render the Locations view
  if (selectedProjectForLocations) {
    return (
      <ProjectLocationsManager
        project={selectedProjectForLocations}
        onClose={() => setSelectedProjectForLocations(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-3 px-3 py-1.5 bg-primary-50 rounded-full w-fit border border-primary-100">
            <FiActivity /> Operations Portfolio
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 leading-tight">Project Management</h2>
          <p className="text-neutral-500 text-sm mt-2">
            Track projects, configure interactive maps, manage field locations, and update media.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="relative z-10 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 active:scale-95 transition-all group shrink-0 shadow-sm"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" />
          Add Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-neutral-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-neutral-700 bg-neutral-100/90 border-b border-neutral-300 uppercase tracking-wider">
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Interactive Map</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-sm font-semibold text-neutral-500">
                    No projects found yet. Click &quot;Add Project&quot; to create one.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className="group hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                          {proj.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mt-1">
                          <span>Added {new Date(proj.createdAt).toLocaleDateString()}</span>
                          {proj.slug && (
                            <span className="font-mono text-[11px] font-semibold text-neutral-700 bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded">
                              /{proj.slug}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 border border-neutral-300 rounded-lg shadow-xs">
                        {proj.projectType || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                        <FiMapPin className="text-primary-600" /> {proj.location || 'Nepal'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {proj.mapSettings?.mapEnabled ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
                          <FiGlobe size={13} className="text-emerald-700" />
                          <span>{proj.mapSettings?.regionName || 'Map Active'}</span>
                        </div>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 text-xs text-neutral-600 font-semibold bg-neutral-100 border border-neutral-300 rounded-full">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 w-fit shadow-xs ${
                          proj.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            proj.status === 'Active' ? 'bg-emerald-600 animate-pulse' : 'bg-neutral-500'
                          }`}
                        />
                        {proj.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      {/* Manage Locations Button */}
                      <button
                        onClick={() => setSelectedProjectForLocations(proj)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 border border-primary-300 font-bold text-xs transition-all shadow-xs"
                        title="Manage Locations for this project"
                      >
                        <FiLayers size={14} /> Locations
                      </button>

                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-2.5 bg-white text-neutral-700 rounded-xl hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-300 shadow-xs transition-colors"
                        title="Edit Project"
                      >
                        <FiEdit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(proj._id)}
                        className="p-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300 shadow-xs transition-colors"
                        title="Delete Project"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 transition-colors rounded-lg"
                aria-label="Close dialog"
              >
                <FiX size={22} />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-neutral-900">
                  {editingId ? 'Edit Project' : 'Add New Project'}
                </h3>
                <p className="text-sm font-medium text-neutral-500 mt-1">
                  {editingId
                    ? 'Update project narrative, map settings, and supporting photos.'
                    : 'Fill in project details, configure map settings, and upload field media.'}
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        placeholder="Enter project title..."
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-base font-bold shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">URL Slug</label>
                        <div className="relative">
                          <FiLink className="absolute left-3.5 top-3 text-neutral-500" size={14} />
                          <input
                            placeholder="e.g. rural-school-support"
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-mono font-semibold text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            value={newProject.slug}
                            onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Start Date</label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3.5 top-3 text-neutral-500" size={14} />
                          <input
                            type="date"
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            value={newProject.startDate}
                            onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Project Type</label>
                        <select
                          className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                          value={newProject.projectType}
                          onChange={(e) => setNewProject({ ...newProject, projectType: e.target.value })}
                        >
                          <option value="">Select type</option>
                          <option value="Education">Education</option>
                          <option value="Health">Health</option>
                          <option value="Livelihood">Livelihood</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Community">Community</option>
                          <option value="Emergency Relief">Emergency Relief</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Location</label>
                        <input
                          placeholder="e.g. Nuwakot, Nepal"
                          className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                          value={newProject.location}
                          onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Status</label>
                        <select
                          className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                          value={newProject.status}
                          onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Upcoming">Upcoming</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        Short Summary / About (Displays on map panel)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief overview summary of this project..."
                        className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                        value={newProject.summary}
                        onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                      />
                    </div>

                    {/* Project Map Section */}
                    <div className="p-5 bg-gradient-to-r from-primary-50/80 to-amber-50/60 border border-primary-300 rounded-2xl space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 bg-white text-primary-600 rounded-xl border border-primary-200 shadow-xs">
                            <FiGlobe size={18} />
                          </span>
                          <div>
                            <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wide">Interactive Project Map</h4>
                            <p className="text-[11px] text-neutral-600 font-medium mt-0.5">
                              Allow visitors to explore pinned project locations on maps subdomain.
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newProject.mapEnabled}
                            onChange={(e) => setNewProject({ ...newProject, mapEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 shadow-xs" />
                        </label>
                      </div>

                      {newProject.mapEnabled && (
                        <div className="pt-3 border-t border-primary-200/80 space-y-1.5">
                          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                            Region / District Name (for boundary highlight)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Nuwakot"
                            value={newProject.regionName}
                            onChange={(e) => setNewProject({ ...newProject, regionName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-primary-300 rounded-xl text-xs font-bold text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          />
                          <p className="text-[11px] font-semibold text-primary-800 mt-1">
                            Public URL: /projects/{newProject.slug || 'project-slug'}/map
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">Narrative Description *</label>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => wrapText('**', '**')}
                            className="p-1.5 px-2 bg-white border border-neutral-300 text-neutral-800 rounded-lg text-xs font-bold hover:bg-neutral-100 transition-all shadow-xs"
                            title="Bold"
                          >
                            <FiBold size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => wrapText('_', '_')}
                            className="p-1.5 px-2 bg-white border border-neutral-300 text-neutral-800 rounded-lg text-xs font-bold hover:bg-neutral-100 transition-all shadow-xs"
                            title="Italic"
                          >
                            <FiItalic size={13} />
                          </button>
                        </div>
                      </div>
                      <textarea
                        ref={textareaRef}
                        required
                        placeholder="Detail objectives, community background, and territorial impact..."
                        rows={6}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 leading-relaxed resize-none shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        Field Visuals (Gallery Photos)
                      </label>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {galleryPreviews.map((url, i) => (
                          <div
                            key={i}
                            className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden group border border-neutral-300 shadow-xs"
                          >
                            <img src={url} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeGalleryItem(i)}
                              className="absolute top-2 right-2 bg-white/95 p-1.5 rounded-lg text-red-600 shadow-sm hover:bg-red-50 transition-all"
                              aria-label="Remove photo"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                        <div className="relative aspect-square bg-primary-50/80 rounded-xl border-2 border-dashed border-primary-300 flex flex-col items-center justify-center text-primary-700 hover:bg-primary-100 transition-all cursor-pointer shadow-xs">
                          <FiImage size={28} className="mb-1" />
                          <span className="text-[11px] font-bold text-center px-2">Select Photos</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        YouTube Field Footage (Optional)
                      </label>
                      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-neutral-300 shadow-xs focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                        <FiYoutube className="text-red-500 shrink-0" size={20} />
                        <input
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full bg-transparent border-none outline-none text-xs font-medium text-neutral-900"
                          value={newProject.youtubeLink}
                          onChange={(e) => setNewProject({ ...newProject, youtubeLink: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-800 text-xs font-bold hover:bg-neutral-100 hover:text-neutral-900 shadow-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-8 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 active:scale-95 transition-all shadow-sm hover:shadow disabled:opacity-50"
                  >
                    {actionLoading ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProjects;
