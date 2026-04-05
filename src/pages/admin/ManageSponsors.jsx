import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiAward, FiShield, FiBriefcase, FiCheckCircle, FiLink, FiX, FiUpload, FiEdit3 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
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

  const fetchSponsors = async () => {
    try {
      const res = await api.get('/sponsors');
      setSponsors(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const resetForm = () => {
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
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('websiteUrl', form.websiteUrl);
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      let res;
      if (editingId) {
        res = await api.put(`/sponsors/${editingId}`, formData);
        setSponsors(sponsors.map(s => s._id === editingId ? res.data.data : s));
      } else {
        res = await api.post('/sponsors', formData);
        setSponsors([res.data.data, ...sponsors]);
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
    if(window.confirm("Permanently dissolve this corporate partnership record?")) {
        try {
            await api.delete(`/sponsors/${id}`);
            setSponsors(sponsors.filter(s => s._id !== id));
        } catch (err) {
            alert("Dissolution failed.");
        }
    }
  };

  if (loading) return <LogoLoader message="Loading supporters..." />;

  return (
    <div className="space-y-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 w-full md:w-auto">
            <div className="flex items-center gap-3 text-[10px] font-black text-primary-700 uppercase tracking-widest mb-3 px-4 py-1.5 bg-primary-50 rounded-full w-fit border border-primary-100">
                <FiAward /> Strategic Alliances
            </div>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 group-hover:text-primary-800 transition-colors duration-500">Supporters</h2>
          <p className="text-gray-400 font-medium mt-1">Manage supporter logos, names, and website links shown on the homepage.</p>
        </div>
        <button onClick={openCreate} className="relative z-10 bg-primary-950 text-white px-10 py-5 rounded-[2rem] font-bold shadow-2xl shadow-primary-950/20 hover:scale-105 active:scale-95 transition-all group flex items-center gap-3">
          <FiPlus className="group-hover:rotate-180 transition-transform duration-700" />
          Add Supporter
        </button>
        
        {/* Abstract background design */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-50 rounded-full blur-[100px] opacity-40 group-hover:bg-primary-100 transition-all duration-700"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sponsors.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="flex flex-col items-center gap-5 opacity-40">
                <FiBriefcase size={56} className="text-gray-300" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No active corporate affiliations.</p>
            </div>
          </div>
        ) : (
          sponsors.map(sponsor => (
            <div key={sponsor._id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-float hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                <div className="flex items-start justify-between mb-8 relative z-10 gap-4">
                    <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center text-primary-900 transition-all duration-500 shadow-sm border border-primary-100/50 overflow-hidden shrink-0">
                        {sponsor.logo ? (
                          <img src={getMediaUrl(sponsor.logo)} alt={sponsor.name} className="w-full h-full object-contain p-3" />
                        ) : (
                          <FiShield size={32} />
                        )}
                    </div>
                    <button 
                        onClick={() => handleDelete(sponsor._id)}
                        className="p-3 bg-gray-50 text-gray-300 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        title="Remove Affiliation"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
                
                <h4 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase group-hover:text-primary-800 transition-colors truncate">{sponsor.name}</h4>
                <div className="flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow"></span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supporter</span>
                </div>

                {sponsor.websiteUrl && (
                  <a href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors mb-7">
                    <FiLink size={14} /> Visit website
                  </a>
                )}
                
                <div className="pt-6 border-t border-gray-50 flex items-center justify-end mt-auto">
                    <div className="flex items-center gap-1 text-accent-green font-black text-[10px] uppercase tracking-tighter">
                        <FiCheckCircle /> Verified
                    </div>
                </div>
                
                {/* Subtle card background pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50/30 rounded-bl-[4rem] group-hover:bg-primary-100/40 transition-all"></div>
                <button onClick={() => openEdit(sponsor)} className="absolute bottom-6 right-6 p-3 rounded-xl bg-neutral-50 text-neutral-400 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                  <FiEdit3 size={16} />
                </button>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/45">
            <motion.form onSubmit={handleSave} initial={{ scale: 0.97, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 24 }} className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl p-8 relative max-h-[92vh] overflow-y-auto no-scrollbar">
              <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 transition-colors"><FiX size={22} /></button>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-neutral-900">{editingId ? 'Edit Supporter' : 'Add Supporter'}</h3>
                <p className="text-sm font-medium text-neutral-500 mt-1">Upload the logo and link it to the supporter website.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 ml-1">Supporter Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-semibold text-gray-900" placeholder="Organization or brand name" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 ml-1">Website URL</label>
                  <input value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-semibold text-gray-900" placeholder="https://example.org" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 ml-1">Logo</label>
                  <div className="relative aspect-video bg-gray-50 rounded-[1.75rem] border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                    {logoPreview ? <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-6" /> : <div className="text-gray-300"><FiUpload size={44} /></div>}
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end">
                <button type="submit" disabled={actionLoading} className="px-8 py-4 bg-primary-950 text-white rounded-2xl font-bold disabled:opacity-50">
                  {actionLoading ? 'Saving...' : (editingId ? 'Update Supporter' : 'Create Supporter')}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default ManageSponsors;
