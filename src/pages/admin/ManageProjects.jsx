import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { FiTrash2, FiPlus, FiEdit3, FiActivity, FiX, FiBold, FiItalic, FiImage, FiMapPin, FiYoutube } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../../components/LogoLoader';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    projectType: '',
    status: 'Active',
    location: '',
    youtubeLink: ''
  });
  
  // Media States
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  // FIX 9: Track existing gallery image URLs that were deleted in the modal
  const [removedImages, setRemovedImages] = useState([]);
  
  const [actionLoading, setActionLoading] = useState(false);
  const textareaRef = useRef(null);

  // FIX 16: Track generated object URLs for preview cleanup
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

  // FIX 9: Immediately reflect gallery item removal and record existing image for backend deletion
  const removeGalleryItem = (index) => {
    const targetUrl = galleryPreviews[index];
    // If it's an existing server URL (starts with http or contains uploads/cloudinary)
    if (targetUrl && (targetUrl.startsWith('http') || targetUrl.includes('/uploads/'))) {
      setRemovedImages((prev) => [...prev, targetUrl]);
    }

    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    // Also remove from newly attached files if index was among newly added
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
      formData.append('projectType', newProject.projectType || '');
      formData.append('status', newProject.status || 'Active');
      formData.append('location', newProject.location || '');
      formData.append('youtubeLink', newProject.youtubeLink || '');
      
      // FIX 9: Pass removed images list to backend
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
      projectType: '',
      status: 'Active',
      location: '',
      youtubeLink: ''
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
      projectType: project.projectType || '',
      status: project.status || 'Active',
      location: project.location || '',
      youtubeLink: project.youtubeLink || ''
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

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-3 px-3 py-1.5 bg-primary-50 rounded-full w-fit border border-primary-100">
            <FiActivity /> Operations Portfolio
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 leading-tight">Project Management</h2>
          <p className="text-neutral-500 text-sm mt-2">Track projects, update field details, and manage gallery media.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="relative z-10 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 active:scale-95 transition-all group shrink-0 shadow-sm"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" />
          Add Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold text-neutral-500 bg-neutral-50">
                <th className="px-6 py-4 border-b border-neutral-100">Project</th>
                <th className="px-6 py-4 border-b border-neutral-100">Type</th>
                <th className="px-6 py-4 border-b border-neutral-100">Location</th>
                <th className="px-6 py-4 border-b border-neutral-100">Status</th>
                <th className="px-6 py-4 border-b border-neutral-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-sm font-medium text-neutral-400">
                    No projects found yet. Click "Add Project" to create one.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className="group hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                          {proj.title}
                        </span>
                        <span className="text-xs font-medium text-neutral-400 mt-1">
                          Added {new Date(proj.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-neutral-600">{proj.projectType || 'General'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                        <FiMapPin className="text-primary-600"/> {proj.location || 'Nepal'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 w-fit ${
                        proj.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${proj.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`}></div>
                        {proj.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      <button 
                        onClick={() => openEditModal(proj)} 
                        className="p-2.5 bg-neutral-100 text-neutral-600 rounded-lg hover:text-primary-700 hover:bg-primary-50 transition-colors"
                        title="Edit Project"
                      >
                        <FiEdit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(proj._id)} 
                        className="p-2.5 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
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

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden relative max-h-[92vh] overflow-y-auto">
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }} 
                className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 transition-colors rounded-lg"
                aria-label="Close dialog"
              >
                <FiX size={22} />
              </button>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-neutral-900">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
                <p className="text-sm font-medium text-neutral-500 mt-1">
                  {editingId ? 'Update project narrative, status, and supporting photos.' : 'Fill in project details and upload field media.'}
                </p>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="form-label">Project Title *</label>
                      <input 
                        required 
                        placeholder="Enter project title..." 
                        className="form-input text-lg font-semibold" 
                        value={newProject.title} 
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="form-label">Project Type</label>
                        <select 
                          className="form-input appearance-none" 
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
                        <label className="form-label">Location</label>
                        <input 
                          placeholder="e.g. Kathmandu" 
                          className="form-input" 
                          value={newProject.location} 
                          onChange={(e) => setNewProject({ ...newProject, location: e.target.value })} 
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Status</label>
                        <select 
                          className="form-input appearance-none" 
                          value={newProject.status} 
                          onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Upcoming">Upcoming</option>
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="form-label mb-0">Narrative Description *</label>
                        <div className="flex gap-1.5">
                          <button 
                            type="button" 
                            onClick={() => wrapText('**', '**')} 
                            className="p-1.5 px-2 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-primary-50 hover:text-primary-700 transition-all"
                            title="Bold"
                          >
                            <FiBold size={13} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => wrapText('_', '_')} 
                            className="p-1.5 px-2 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-primary-50 hover:text-primary-700 transition-all"
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
                        rows={8} 
                        className="form-input leading-relaxed resize-none" 
                        value={newProject.description} 
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="form-label">Field Visuals (Gallery Photos)</label>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {galleryPreviews.map((url, i) => (
                          <div key={i} className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden group border border-neutral-200">
                            <img src={url} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeGalleryItem(i)} 
                              className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg text-red-600 shadow-sm transition-all"
                              aria-label="Remove photo"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                        <div className="relative aspect-square bg-primary-50 rounded-xl border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-700 hover:bg-primary-100 transition-all cursor-pointer">
                          <FiImage size={28} className="mb-1" />
                          <span className="text-[11px] font-semibold text-center px-2">Select Photos</span>
                          <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">YouTube Field Footage (Optional)</label>
                      <div className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-xl border border-transparent focus-within:border-primary-400 focus-within:bg-white transition-all">
                        <FiYoutube className="text-red-500 shrink-0" size={20} />
                        <input 
                          placeholder="https://youtube.com/watch?v=..." 
                          className="w-full bg-transparent border-none outline-none text-sm text-neutral-900" 
                          value={newProject.youtubeLink} 
                          onChange={(e) => setNewProject({ ...newProject, youtubeLink: e.target.value })} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* FIX 20: Cleaned footer without vibe-coded artifacts */}
                <div className="pt-6 border-t border-neutral-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                    className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={actionLoading} 
                    className="px-8 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-50"
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
