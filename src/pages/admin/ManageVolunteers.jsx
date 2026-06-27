import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiUserCheck, FiUserX, FiMail, FiPhone, FiBriefcase, FiGlobe, FiTrash2, FiX, FiFileText, FiEye } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../../components/LogoLoader';

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const fetchVolunteers = async () => {
    try {
      const res = await api.get('/volunteers');
      setVolunteers(res.data.data || []);
    } catch (err) {
      console.error('Failed to load volunteers data.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const apiStatus = newStatus.toLowerCase();
    try {
      await api.put(`/volunteers/${id}`, { status: apiStatus });
      setVolunteers((current) => current.map((volunteer) => volunteer._id === id ? { ...volunteer, status: apiStatus } : volunteer));
      setSelectedVolunteer((current) => current && current._id === id ? { ...current, status: apiStatus } : current);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating record status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Destroy this volunteer record permanently?')) return;

    try {
      await api.delete(`/volunteers/${id}`);
      setVolunteers((current) => current.filter((volunteer) => volunteer._id !== id));
      setSelectedVolunteer(null);
    } catch (err) {
      alert('Record deletion failed.');
    }
  };

  if (loading) return <LogoLoader message="Loading volunteers..." />;

  return (
    <div className="space-y-8 relative">
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          <div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold mb-3 w-fit">
              <FiBriefcase /> Talent Pipeline
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900">Volunteer Applications</h2>
            <p className="text-neutral-500 text-sm mt-2 max-w-md">Review applicant profiles, update status, and access uploaded CVs.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-50 px-5 py-3 rounded-xl border border-neutral-100">
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-neutral-900 leading-none">{volunteers.length}</span>
              <span className="text-xs font-medium text-neutral-500 mt-1">Total submissions</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-primary-600 shadow-sm">
              <FiUserCheck size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Identity & Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Application Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Skillset & Availability</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <FiGlobe size={48} className="text-gray-400" />
                      <p className="text-sm font-medium text-gray-400">No active applications in queue.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                volunteers.map((volunteer) => (
                  <tr
                    key={volunteer._id}
                    className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedVolunteer(volunteer)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center font-semibold text-primary-800 text-lg group-hover:scale-105 group-hover:bg-primary-700 group-hover:text-white transition-all duration-300">
                          {volunteer.name?.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-base font-semibold text-gray-900 truncate">{volunteer.name}</span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 group-hover:text-primary-600 transition-colors truncate mt-1">
                            <FiMail size={12} /> {volunteer.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
                        {volunteer.applicationType || 'Volunteer'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col space-y-2">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-xs font-semibold w-fit border border-primary-100">
                          <FiGlobe /> {volunteer.availability || 'Hybrid'}
                        </span>
                        <span className="text-sm font-medium text-gray-600 line-clamp-1">{volunteer.skills || 'General Support'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        volunteer.status === 'approved' ? 'bg-lime-100 text-accent-teal' :
                        volunteer.status === 'pending' ? 'bg-amber-100 text-accent-gold' :
                        'bg-red-50 text-red-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${volunteer.status === 'approved' ? 'bg-accent-teal' : volunteer.status === 'pending' ? 'bg-accent-gold' : 'bg-red-500'} animate-pulse`} />
                        <span className="capitalize">{volunteer.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedVolunteer(volunteer)}
                        className="p-2.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-white transition-all shadow-sm"
                        title="View Profile"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(volunteer._id)}
                        className="p-2.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all active:scale-95"
                        title="Delete Record"
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

      <AnimatePresence>
        {selectedVolunteer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedVolunteer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden relative max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="absolute top-5 right-5 p-2.5 text-gray-400 hover:bg-gray-100 rounded-full transition-all z-20"
              >
                <FiX size={24} />
              </button>

              <div className="p-8 md:p-10">
                <div className="flex items-start gap-4 mb-8 pr-12">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-800 flex items-center justify-center font-black text-2xl shrink-0">
                    {selectedVolunteer.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-neutral-900 leading-tight">{selectedVolunteer.name}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{selectedVolunteer.applicationType || 'Volunteer'} application</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Status</div>
                    <div className="text-sm font-semibold capitalize text-neutral-900">{selectedVolunteer.status}</div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Availability</div>
                    <div className="text-sm font-semibold text-neutral-900">{selectedVolunteer.availability || 'Hybrid'}</div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:col-span-2">
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Skills</div>
                    <div className="text-sm font-medium text-neutral-700">{selectedVolunteer.skills || 'General Humanitarian Support'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Email</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 break-all">
                      <FiMail className="text-primary-600 shrink-0" />
                      {selectedVolunteer.email}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Phone</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      <FiPhone className="text-primary-600 shrink-0" />
                      {selectedVolunteer.phone || 'No Data'}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mb-6">
                  <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Personal Statement</div>
                  <p className="text-sm leading-7 text-neutral-600">{selectedVolunteer.message || 'No personal statement provided.'}</p>
                </div>

                <div className="rounded-2xl border border-neutral-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">CV</div>
                    <p className="text-sm text-neutral-600">Open the uploaded CV in a new tab.</p>
                  </div>
                  {selectedVolunteer.cvFile ? (
                    <a
                      href={getMediaUrl(selectedVolunteer.cvFile)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-950 text-white font-semibold hover:bg-primary-900 transition-colors"
                    >
                      <FiFileText />
                      Open CV
                    </a>
                  ) : (
                    <span className="text-sm text-neutral-400">No CV uploaded</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  {selectedVolunteer.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(selectedVolunteer._id, 'approved')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-teal text-white font-semibold"
                    >
                      <FiUserCheck /> Approve
                    </button>
                  )}
                  {selectedVolunteer.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(selectedVolunteer._id, 'rejected')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50"
                    >
                      <FiUserX /> Reject
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageVolunteers;
