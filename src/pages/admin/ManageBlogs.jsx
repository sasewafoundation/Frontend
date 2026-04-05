import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { FiEdit3, FiEye, FiTrash2, FiPlus, FiClock, FiFileText, FiX, FiSave, FiYoutube, FiImage, FiLink, FiBold, FiItalic } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../../components/LogoLoader';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if editing
  const [newBlog, setNewBlog] = useState({ title: '', content: '', author: 'Admin', youtubeLink: '', published: true });
  
  // Media States
  const [headerImage, setHeaderImage] = useState(null);
  const [headerPreview, setHeaderPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  const [actionLoading, setActionLoading] = useState(false);
  const textareaRef = useRef(null);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blog');
      setBlogs(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Retrieval failure:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleHeaderChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderImage(file);
      setHeaderPreview(URL.createObjectURL(file));
    }
  };

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        const formData = new FormData();
        formData.append('title', newBlog.title);
        formData.append('content', newBlog.content);
        formData.append('author', newBlog.author);
        formData.append('youtubeLink', newBlog.youtubeLink);
        formData.append('published', newBlog.published);
        
        if (headerImage) {
            formData.append('image', headerImage);
        }
        
        galleryFiles.forEach(file => {
            formData.append('images', file);
        });

        let res;
        if (editingId) {
          // Update existing blog
          res = await api.put(`/blog/${editingId}`, formData);
          setBlogs(blogs.map(b => b._id === editingId ? res.data.data : b));
        } else {
          // Create new blog
          res = await api.post('/blog', formData);
          setBlogs([...blogs, res.data.data]);
        }
        
        setIsModalOpen(false);
        setEditingId(null);
        resetForm();
    } catch (err) {
        const apiMessage = err.response?.data?.message;
        const fallbackMessage = err.message || 'Failed to save blog post. Please try again.';
        console.error('Publication failure:', err.response?.data || err.message);
        alert(apiMessage || fallbackMessage);
    } finally {
        setActionLoading(false);
    }
  };

  const resetForm = () => {
    setNewBlog({ title: '', content: '', author: 'Admin', youtubeLink: '', published: true });
    setHeaderImage(null);
    setHeaderPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setEditingId(null);
  }

  const openEditModal = (blog) => {
    setNewBlog({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      youtubeLink: blog.youtubeLink || '',
      published: blog.published
    });
    setHeaderPreview(getMediaUrl(blog.image) || null);
    setGalleryPreviews(blog.images?.map(img => getMediaUrl(img)) || []);
    setEditingId(blog._id);
    setHeaderImage(null);
    setGalleryFiles([]);
    setIsModalOpen(true);
  }

  const handleDelete = async (id) => {
    if(window.confirm("Destroy this blog record? This will permanently remove the post.")) {
      try {
        await api.delete(`/blog/${id}`);
        setBlogs(blogs.filter(b => b._id !== id));
      } catch (err) {
        alert("Deletion sequence failed.");
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
    setNewBlog({...newBlog, content: newVal});
    
    setTimeout(() => {
        tex.focus();
        tex.setSelectionRange(start + tagOpen.length, end + tagOpen.length);
    }, 10);
  };

  if (loading) return <LogoLoader message="Loading blog entries..." />;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="relative z-10 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold mb-3 w-fit border border-primary-100">
                <FiFileText /> Operational Chronicles
            </div>
          <h2 className="text-2xl font-semibold text-neutral-900">Blog Management</h2>
          <p className="text-neutral-500 text-sm mt-2">Create and maintain foundation updates and field stories.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 bg-primary-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:scale-[1.01] active:scale-95 transition-all group flex items-center gap-2.5 hover:bg-primary-700"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" />
          New Blog Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map(post => (
          <div key={post._id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-[var(--shadow-card)] transition-all duration-300 flex flex-col h-full group">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                  <span className="text-xs font-medium text-neutral-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-300" />
              </div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-4 leading-snug group-hover:text-primary-700 transition-colors">{post.title}</h4>
              <p className="text-sm text-neutral-500 line-clamp-3 mb-6 leading-relaxed">{post.content.substring(0, 110)}...</p>
              
              <div className="pt-5 border-t border-neutral-100 flex items-center justify-between mt-auto">
                  <div className="flex gap-2">
                       <button onClick={() => openEditModal(post)} className="p-2.5 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"><FiEdit3 size={16} /></button>
                  </div>
                  <button onClick={() => handleDelete(post._id)} className="p-2.5 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"><FiTrash2 size={16}/></button>
              </div>
          </div>
        ))}
      </div>

      {/* Editor Modal v4 (Multi-Media Support) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/45">
            <motion.div initial={{ scale: 0.97, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 24 }} className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl p-8 overflow-hidden relative max-h-[92vh] overflow-y-auto no-scrollbar">
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 rounded-lg transition-colors"><FiX size={22} /></button>
                
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-neutral-900">{editingId ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
                    <p className="text-sm font-medium text-neutral-500 mt-1">{editingId ? 'Update your story from the field.' : 'Write and publish a new story from the field.'}</p>
                </div>
                
                <form onSubmit={handleCreate} className="space-y-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">Headline</label>
                                <input required placeholder="Enter Catchy Headline..." className="w-full px-10 py-7 bg-gray-50 border-none rounded-[2rem] text-2xl font-black text-gray-900 focus:bg-white focus:shadow-inner transition-all outline-none italic" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">Main Narrative</label>
                                <div className="absolute top-12 right-6 flex gap-2 bg-white/60 backdrop-blur p-2 rounded-2xl border border-white z-10 scale-90">
                                    <button type="button" onClick={() => wrapText('**', '**')} className="p-3 bg-white text-gray-900 rounded-xl hover:bg-primary-900 hover:text-white transition-all shadow-sm"><FiBold size={14}/></button>
                                    <button type="button" onClick={() => wrapText('_', '_')} className="p-3 bg-white text-gray-900 rounded-xl hover:bg-primary-900 hover:text-white transition-all shadow-sm"><FiItalic size={14}/></button>
                                </div>
                                <textarea ref={textareaRef} required placeholder="Detail the field impact..." rows="12" className="w-full px-10 pt-24 pb-10 bg-gray-50 rounded-[3.5rem] text-lg font-medium text-gray-900 outline-none resize-none leading-relaxed transition-all focus:bg-white" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">YouTube Coverage Link</label>
                                <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem]">
                                    <FiYoutube className="text-red-500 ml-4" size={28} />
                                    <input placeholder="https://youtube.com/watch?v=..." className="w-full bg-transparent border-none outline-none font-bold text-gray-900 text-sm" value={newBlog.youtubeLink} onChange={e => setNewBlog({...newBlog, youtubeLink: e.target.value})} />
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded-3xl px-6 py-5 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Publish</p>
                                <p className="text-xs text-gray-500 mt-1">Turn off to save as draft.</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setNewBlog({ ...newBlog, published: !newBlog.published })}
                                className={`w-14 h-8 rounded-full p-1 transition-colors ${newBlog.published ? 'bg-primary-600' : 'bg-gray-300'}`}
                                aria-label="Toggle publish"
                              >
                                <span className={`block w-6 h-6 rounded-full bg-white transition-transform ${newBlog.published ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">Primary Header ( Hero Image )</label>
                                <div className="relative aspect-video bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 hover:border-primary-900 transition-all overflow-hidden group flex items-center justify-center">
                                    {headerPreview ? <img src={headerPreview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /> : <div className="text-gray-300 opacity-50"><FiImage size={48}/></div>}
                                    <input type="file" onChange={handleHeaderChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 ml-1 italic">Field Gallery ( In-Between Photos )</label>
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {galleryPreviews.map((url, i) => (
                                        <div key={i} className="relative aspect-square bg-gray-100 rounded-[2rem] overflow-hidden group shadow-lg">
                                            <img src={url} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeGalleryItem(i)} className="absolute top-4 right-4 bg-white/95 p-3 rounded-2xl text-red-500 scale-0 group-hover:scale-100 transition-all"><FiX size={16}/></button>
                                        </div>
                                    ))}
                                    <div className="relative aspect-square bg-primary-50 rounded-[2rem] border-4 border-dashed border-primary-50 flex flex-col items-center justify-center text-primary-200 hover:border-primary-600 hover:text-primary-600 transition-all cursor-pointer group shadow-inner">
                                        <FiPlus size={40} className="group-hover:rotate-90 transition-transform" />
                                        <span className="text-[9px] font-black uppercase text-center px-4 mt-2">Batch Select Photos</span>
                                        <input type="file" multiple onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-10 bg-primary-950 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
                                 <h4 className="text-[10px] font-black uppercase text-primary-400 tracking-[0.4em] italic mb-4">Official Signature</h4>
                                 <div className="flex items-center gap-4 relative z-10">
                                     <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black italic shadow-inner">A</div>
                                   <span className="text-xl font-black italic tracking-tighter uppercase">Admin</span>
                                 </div>
                                 <FiFileText size={100} className="absolute -bottom-10 -right-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 border-t border-gray-50 flex justify-end">
                        <button type="submit" disabled={actionLoading} className="w-full lg:w-auto px-24 py-9 bg-primary-950 text-white rounded-[3rem] font-black text-3xl shadow-float hover:bg-primary-900 active:scale-95 transition-all disabled:opacity-50 italic">
                         {actionLoading ? <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : (editingId ? 'Update Blog' : (newBlog.published ? 'Publish' : 'Save Draft'))}
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

export default ManageBlogs;
