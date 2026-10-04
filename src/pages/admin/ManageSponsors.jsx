import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiAward, FiShield, FiBriefcase, FiLink, FiX, FiUpload, FiEdit3 } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../../components/LogoLoader';

const ManageSponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', websiteUrl: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // FIX 16: Track object URLs to revoke on unmount and prevent memory leaks
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

  const fetchSponsors = async () => {
    try {
      const res = await api.get('/sponsors');
      setSponsors(res.data.data || []);
    } catch (err) {
      console.error('Failed to load sponsors:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const resetForm = () => {
    cleanupObjectUrls();
    setForm({ name: '', websiteUrl: '' });
    setLogoFile(null);
    setLogoPreview(null);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (sponsor) => {
    cleanupObjectUrls();
    setEditingId(sponsor._id);
    setForm({
      name: sponsor.name || '',
      websiteUrl: sponsor.websiteUrl || '',
    });
    setLogoPreview(sponsor.logo ? getMediaUrl(sponsor.logo) : null);
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(createPreviewUrl(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('websiteUrl', form.websiteUrl || '');
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      let res;
      if (editingId) {
        res = await api.put(`/sponsors/${editingId}`, formData);
        setSponsors((prev) => prev.map((s) => (s._id === editingId ? res.data.data : s)));
      } else {
        res = await api.post('/sponsors', formData);
        setSponsors((prev) => [res.data.data, ...prev]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save supporter');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this supporter record permanently?')) {
      try {
        await api.delete(`/sponsors/${id}`);
        setSponsors((prev) => prev.filter((s) => s._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Deletion failed.');
      }
    }
  };

  if (loading) return <LogoLoader message="Loading supporters..." />;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-3 px-3 py-1.5 bg-primary-50 rounded-full w-fit border border-primary-100">
            <FiAward /> Strategic Alliances
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900">Supporters & Partners</h2>
          <p className="text-neutral-500 text-sm mt-1">Manage partner logos, titles, and website links displayed across the public site.</p>
        </div>
        <button 
          onClick={openCreate} 
          className="bg-primary-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-2.5 shadow-sm"
        >
          <FiPlus />
          Add Supporter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-neutral-200">
            <div className="flex flex-col items-center gap-3 text-neutral-400">
              <FiBriefcase size={40} className="opacity-50" />
              <p className="text-sm font-medium">No supporters registered yet.</p>
            </div>
          </div>
        ) : (
          sponsors.map((sponsor) => (
            <div key={sponsor._id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col group relative">
              <div className="flex items-start justify-between mb-5 gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neutral-50 flex items-center justify-center p-3 border border-neutral-100 overflow-hidden shrink-0">
                  {sponsor.logo ? (
                    <img src={getMediaUrl(sponsor.logo)} alt={sponsor.name} className="w-full h-full object-contain" />
                  ) : (
                    <FiShield size={28} className="text-neutral-400" />
                  )}
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => openEdit(sponsor)} 
                    className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    title="Edit Supporter"
                  >
                    <FiEdit3 size={15} />
                  </button>
                  <button 
                    onClick={() => handleDelete(sponsor._id)} 
                    className="p-2 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete Supporter"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-neutral-900 mb-1 truncate">{sponsor.name}</h4>
              <span className="text-xs text-primary-600 font-semibold mb-4 block">Official Partner</span>

              {sponsor.websiteUrl && (
                <a 
                  href={sponsor.websiteUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-primary-600 transition-colors mt-auto pt-3 border-t border-neutral-100"
                >
                  <FiLink size={12} /> Visit website
                </a>
              )}
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm">
            <form onSubmit={handleSave} className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 md:p-8 relative max-h-[92vh] overflow-y-auto">
              <button 
                type="button" 
                onClick={() => { setIsModalOpen(false); resetForm(); }} 
                className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 transition-colors rounded-lg"
                aria-label="Close dialog"
              >
                <FiX size={22} />
              </button>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-900">{editingId ? 'Edit Supporter' : 'Add Supporter'}</h3>
                <p className="text-sm text-neutral-500 mt-1">Upload partner organization logo and web link.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="form-label">Supporter / Organization Name *</label>
                  <input 
                    required 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    className="form-input" 
                    placeholder="e.g. Kathmandu Care Foundation" 
                  />
                </div>

                <div>
                  <label className="form-label">Website URL (Optional)</label>
                  <input 
                    value={form.websiteUrl} 
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} 
                    className="form-input" 
                    placeholder="https://example.org" 
                  />
                </div>

                <div>
                  <label className="form-label">Brand / Organization Logo</label>
                  <div className="relative aspect-video bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 overflow-hidden flex items-center justify-center hover:border-primary-500 transition-all cursor-pointer">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-4" />
                    ) : (
                      <div className="text-center p-4 text-neutral-400">
                        <FiUpload size={32} className="mx-auto mb-2 opacity-60" />
                        <span className="text-xs">Click or drag logo file</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading} 
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingId ? 'Update Supporter' : 'Create Supporter'}
                </button>
              </div>
            </form>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default ManageSponsors;
