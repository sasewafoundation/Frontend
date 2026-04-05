import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { FiTrash2, FiPlus, FiEdit3, FiEye, FiCheckCircle, FiClock, FiActivity, FiFileText, FiX, FiSave, FiBold, FiItalic, FiImage, FiMapPin, FiYoutube } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../../components/LogoLoader';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if editing
  const [newProject, setNewProject] = useState({ title: '', description: '', projectType: '', status: 'Active', location: '', youtubeLink: '' });
  
  // Media States
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  const [actionLoading, setActionLoading] = useState(false);
  const textareaRef = useRef(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Retrieval failure:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files]);
      const urls = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...urls]);
    }
  };

  const removeGalleryItem = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        const formData = new FormData();
        formData.append('title', newProject.title);
        formData.append('description', newProject.description);
        formData.append('projectType', newProject.projectType);
        formData.append('status', newProject.status);
        formData.append('location', newProject.location);
        formData.append('youtubeLink', newProject.youtubeLink);
        
        galleryFiles.forEach(file => {
            formData.append('images', file);
        });

        let res;
        if (editingId) {
          // Update existing project
          res = await api.put(`/projects/${editingId}`, formData);
          setProjects(projects.map(p => p._id === editingId ? res.data.data : p));
        } else {
          // Create new project
          res = await api.post('/projects', formData);
          setProjects([...projects, res.data.data]);
        }
        
        setIsModalOpen(false);
        setEditingId(null);
        resetForm();
    } catch (err) {
        const apiMessage = err.response?.data?.message;
        const fallbackMessage = err.message || 'Failed to save project. Please try again.';
        console.error('Project registration failure:', err.response?.data || err.message);
        alert(apiMessage || fallbackMessage);
    } finally {
        setActionLoading(false);
    }
  };

  const resetForm = () => {
      setNewProject({ title: '', description: '', projectType: '', status: 'Active', location: '', youtubeLink: '' });
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setEditingId(null);
  }

  const openEditModal = (project) => {
    setNewProject({
      title: project.title,
      description: project.description,
      projectType: project.projectType || '',
      status: project.status || 'Active',
      location: project.location || '',
      youtubeLink: project.youtubeLink || ''
    });
    setGalleryPreviews(project.images?.map(img => getMediaUrl(img)) || []);
    setEditingId(project._id);
    setGalleryFiles([]);
    setIsModalOpen(true);
  }

  const handleDelete = async (id) => {
    if(window.confirm("Destroy this record?")) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        alert("Fatal Error: Deletion failed.");
      }
    }
  }

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
    setNewProject({...newProject, description: newVal});
    
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
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-3 px-3 py-1.5 bg-primary-50 rounded-full w-fit">
            <FiActivity /> Operations Portfolio
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 leading-tight">Project Management</h2>
          <p className="text-neutral-500 text-sm mt-2">Track projects, update details, and manage media in one place.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 active:scale-95 transition-all group shrink-0"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" />
          Add Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
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
                    <td colSpan="5" className="px-6 py-20 text-center text-sm font-medium text-neutral-400">No projects found yet.</td>
                </tr>
              ) : (
                projects.map(proj => (
                  <tr key={proj._id} className="group hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">{proj.title}</span>
                        <span className="text-xs font-medium text-neutral-400 mt-1">Added {new Date(proj.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-sm font-medium text-neutral-600">{proj.projectType || 'General'}</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="flex items-center gap-2 text-sm font-medium text-neutral-600"><FiMapPin className="text-primary-600"/> {proj.location || 'Nepal'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 w-fit ${
                        proj.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${proj.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                         {proj.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      <button onClick={() => openEditModal(proj)} className="p-2.5 bg-neutral-100 text-neutral-500 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors"><FiEdit3 size={16} /></button>
                      <button onClick={() => handleDelete(proj._id)} className="p-2.5 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"><FiTrash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/45">
            <motion.div initial={{ scale: 0.97, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 24 }} className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-8 overflow-hidden relative max-h-[92vh] overflow-y-auto no-scrollbar">
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 transition-colors"><FiX size={22} /></button>
                
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-neutral-900">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
                    <p className="text-sm font-medium text-neutral-500 mt-1">{editingId ? 'Update project details and media.' : 'Fill in project details and upload supporting media.'}</p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <div>
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">Project Headline</label>
                                <input required placeholder="Enter Mission Title..." className="w-full px-8 py-6 bg-gray-50 border-none rounded-[2rem] text-xl font-bold text-gray-900 focus:bg-white focus:shadow-inner transition-all outline-none" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1">Project Type</label>
                                <select className="w-full px-8 py-5 bg-gray-50 rounded-3xl font-black italic text-gray-900 outline-none" value={newProject.projectType} onChange={e => setNewProject({...newProject, projectType: e.target.value})}>
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
                                    <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1">Localization</label>
                                    <div className="relative flex items-center">
                                        <FiMapPin className="absolute left-6 text-primary-600" size={20} />
                                        <input placeholder="e.g. Gorkha Frontier" className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-3xl font-bold text-gray-900 outline-none" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1">Status</label>
                                    <select className="w-full px-8 py-5 bg-gray-50 rounded-3xl font-black italic text-gray-900 outline-none" value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})}>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Upcoming">Upcoming</option>
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">Narrative</label>
                                <div className="absolute top-12 right-6 flex gap-2 bg-white/50 backdrop-blur p-2 rounded-2xl border border-white z-10 scale-90">
                                    <button type="button" onClick={() => wrapText('**', '**')} className="p-3 bg-white text-gray-900 rounded-xl hover:bg-primary-900 hover:text-white transition-all shadow-sm"><FiBold size={14}/></button>
                                    <button type="button" onClick={() => wrapText('_', '_')} className="p-3 bg-white text-gray-900 rounded-xl hover:bg-primary-900 hover:text-white transition-all shadow-sm"><FiItalic size={14}/></button>
                                </div>
                                <textarea ref={textareaRef} required placeholder="Detail objectives and territorial impact..." rows="10" className="w-full px-10 pt-24 pb-10 bg-gray-50 rounded-[3rem] text-lg font-medium text-gray-900 outline-none resize-none leading-relaxed transition-all focus:bg-white" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">Field Visuals (Batch Upload)</label>
                                <div className="grid grid-cols-2 gap-6">
                                     {galleryPreviews.map((url, i) => (
                                        <div key={i} className="relative aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden group shadow-lg">
                                            <img src={url} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeGalleryItem(i)} className="absolute top-4 right-4 bg-white/95 p-3 rounded-2xl text-red-500 scale-0 group-hover:scale-100 transition-all"><FiX size={16}/></button>
                                        </div>
                                    ))}
                                    <div className="relative aspect-square bg-primary-50 rounded-[2.5rem] border-4 border-dashed border-primary-100 flex flex-col items-center justify-center text-primary-200 hover:border-primary-600 hover:text-primary-600 transition-all cursor-pointer group">
                                         <FiImage size={40} className="mb-4" />
                                         <span className="text-[9px] font-black uppercase tracking-widest text-center px-4">Add Photos from Laptop</span>
                                         <input type="file" multiple onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">YouTube Footage Link</label>
                                <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-[2rem]">
                                    <FiYoutube className="text-red-500 ml-4" size={28} />
                                    <input placeholder="https://youtube.com/watch?v=..." className="w-full bg-transparent border-none outline-none font-bold text-gray-900 text-sm" value={newProject.youtubeLink} onChange={e => setNewProject({...newProject, youtubeLink: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-4 opacity-40 italic font-bold text-xs text-gray-300 uppercase">
                             <FiCheckCircle size={20} className="text-accent-green" /> Mongoose Payload Validated
                        </div>
                        <button type="submit" disabled={actionLoading} className="px-24 py-8 bg-primary-950 text-white rounded-[3rem] font-black text-3xl shadow-float hover:bg-primary-900 active:scale-95 transition-all disabled:opacity-50 italic">
                             {actionLoading ? <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : (editingId ? "Update Project" : "Finalize Project")}
                        </button>
                    </div>
                </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProjects;
