import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { FiEdit3, FiTrash2, FiPlus, FiFileText, FiX, FiYoutube, FiImage, FiBold, FiItalic, FiCheckCircle, FiEyeOff } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../../components/LogoLoader';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  // FIX 15: New blog posts default to draft (published: false)
  const [newBlog, setNewBlog] = useState({ title: '', content: '', author: 'Admin', youtubeLink: '', published: false });
  
  // Media States
  const [headerImage, setHeaderImage] = useState(null);
  const [headerPreview, setHeaderPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  const [actionLoading, setActionLoading] = useState(false);
  const textareaRef = useRef(null);

  // FIX 16: Track all generated object URLs to clean up and prevent browser memory leaks
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

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blog');
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error('Retrieval failure:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleHeaderChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeaderImage(file);
      setHeaderPreview(createPreviewUrl(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      const urls = files.map((file) => createPreviewUrl(file));
      setGalleryPreviews((prev) => [...prev, ...urls]);
    }
  };

  const removeGalleryItem = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('content', newBlog.content);
      formData.append('author', newBlog.author || 'Admin');
      formData.append('youtubeLink', newBlog.youtubeLink || '');
      formData.append('published', String(newBlog.published));
      
      if (headerImage) {
        formData.append('image', headerImage);
      }
      
      // FIX 4: Gallery files appended under 'images' handled by backend upload.fields
      galleryFiles.forEach((file) => {
        formData.append('images', file);
      });

      let res;
      if (editingId) {
        res = await api.put(`/blog/${editingId}`, formData);
        setBlogs((prev) => prev.map((b) => (b._id === editingId ? res.data.data : b)));
      } else {
        res = await api.post('/blog', formData);
        setBlogs((prev) => [res.data.data, ...prev]);
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      const fallbackMessage = err.message || 'Failed to save blog post. Please try again.';
      alert(apiMessage || fallbackMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // FIX 15: Quick toggle publish status directly from list view
  const handleTogglePublish = async (post) => {
    const nextStatus = !post.published;
    try {
      const formData = new FormData();
      formData.append('published', String(nextStatus));
      const res = await api.put(`/blog/${post._id}`, formData);
      setBlogs((prev) => prev.map((b) => (b._id === post._id ? res.data.data : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update publication status.');
    }
  };

  const resetForm = () => {
    cleanupObjectUrls();
    // FIX 15: Default to draft (published: false)
    setNewBlog({ title: '', content: '', author: 'Admin', youtubeLink: '', published: false });
    setHeaderImage(null);
    setHeaderPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setEditingId(null);
  };

  const openEditModal = (blog) => {
    cleanupObjectUrls();
    setNewBlog({
      title: blog.title || '',
      content: blog.content || '',
      author: blog.author || 'Admin',
      youtubeLink: blog.youtubeLink || '',
      published: Boolean(blog.published)
    });
    setHeaderPreview(blog.image ? getMediaUrl(blog.image) : null);
    setGalleryPreviews(blog.images?.map((img) => getMediaUrl(img)) || []);
    setEditingId(blog._id);
    setHeaderImage(null);
    setGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog post permanently?')) {
      try {
        await api.delete(`/blog/${id}`);
        setBlogs((prev) => prev.filter((b) => b._id !== id));
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
    setNewBlog({ ...newBlog, content: newVal });
    
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
          <p className="text-neutral-500 text-sm mt-2">Create and maintain foundation updates, field stories, and news.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="relative z-10 bg-primary-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary-700 active:scale-95 transition-all group flex items-center gap-2.5 shadow-sm"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" />
          New Blog Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-neutral-200 text-neutral-400 text-sm">
            No articles found. Click "New Blog Post" to draft your first story.
          </div>
        ) : (
          blogs.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col h-full group">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                <span className="text-xs font-medium text-neutral-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                {/* FIX 15: Status pill and toggle button */}
                <button
                  onClick={() => handleTogglePublish(post)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    post.published 
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                  title={post.published ? 'Click to switch to Draft' : 'Click to Publish'}
                >
                  {post.published ? <FiCheckCircle size={12} /> : <FiEyeOff size={12} />}
                  {post.published ? 'Published' : 'Draft'}
                </button>
              </div>
              
              <h4 className="text-lg font-semibold text-neutral-900 mb-3 leading-snug group-hover:text-primary-700 transition-colors">
                {post.title}
              </h4>
              <p className="text-sm text-neutral-500 line-clamp-3 mb-6 leading-relaxed">
                {post.content?.substring(0, 120)}...
              </p>
              
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(post)} 
                    className="p-2.5 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    title="Edit Post"
                  >
                    <FiEdit3 size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => handleDelete(post._id)} 
                  className="p-2.5 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete Post"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden relative max-h-[92vh] overflow-y-auto">
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }} 
                className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <FiX size={22} />
              </button>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-neutral-900">{editingId ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {editingId ? 'Update your story details and associated field images.' : 'Draft or publish a new story from the field.'}
                </p>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label className="form-label">Headline *</label>
                      <input 
                        required 
                        placeholder="Enter article title..." 
                        className="form-input text-lg font-semibold" 
                        value={newBlog.title} 
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} 
                      />
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="form-label mb-0">Main Content *</label>
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
                        placeholder="Write article content here..." 
                        rows={10} 
                        className="form-input leading-relaxed resize-none" 
                        value={newBlog.content} 
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} 
                      />
                    </div>

                    <div>
                      <label className="form-label">YouTube Video Link (Optional)</label>
                      <div className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-xl border border-transparent focus-within:border-primary-400 focus-within:bg-white transition-all">
                        <FiYoutube className="text-red-500 shrink-0" size={20} />
                        <input 
                          placeholder="https://youtube.com/watch?v=..." 
                          className="w-full bg-transparent border-none outline-none text-sm text-neutral-900" 
                          value={newBlog.youtubeLink} 
                          onChange={(e) => setNewBlog({ ...newBlog, youtubeLink: e.target.value })} 
                        />
                      </div>
                    </div>

                    {/* FIX 15: Publish vs Draft Switch */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Publish to Website</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {newBlog.published ? 'Visible to all public visitors.' : 'Saved as private draft (admin-only).'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewBlog({ ...newBlog, published: !newBlog.published })}
                        className={`w-14 h-8 rounded-full p-1 transition-colors ${newBlog.published ? 'bg-primary-600' : 'bg-neutral-300'}`}
                        aria-label="Toggle publication"
                      >
                        <span className={`block w-6 h-6 rounded-full bg-white transition-transform ${newBlog.published ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="form-label">Cover Header Photo</label>
                      <div className="relative aspect-video bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-primary-500 transition-all overflow-hidden flex items-center justify-center group">
                        {headerPreview ? (
                          <img src={headerPreview} alt="Cover preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4 text-neutral-400">
                            <FiImage size={32} className="mx-auto mb-2 opacity-60" />
                            <span className="text-xs">Select cover image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleHeaderChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Field Gallery Images</label>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {galleryPreviews.map((url, i) => (
                          <div key={i} className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden group border border-neutral-200">
                            <img src={url} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeGalleryItem(i)} 
                              className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg text-red-600 shadow-sm transition-all"
                              aria-label="Remove image"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                        <div className="relative aspect-square bg-primary-50 rounded-xl border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-700 hover:bg-primary-100 transition-all cursor-pointer">
                          <FiPlus size={24} className="mb-1" />
                          <span className="text-[11px] font-semibold">Add Photos</span>
                          <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Author Name</label>
                      <input 
                        className="form-input text-sm" 
                        value={newBlog.author} 
                        onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

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
                    {actionLoading ? 'Saving...' : editingId ? 'Update Post' : (newBlog.published ? 'Publish Post' : 'Save as Draft')}
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

export default ManageBlogs;
