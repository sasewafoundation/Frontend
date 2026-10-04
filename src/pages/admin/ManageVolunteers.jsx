import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiUserCheck, FiUserX, FiMail, FiPhone, FiBriefcase, FiGlobe, FiTrash2, FiX, FiFileText, FiEye } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
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
      console.error('Failed to load volunteers data:', err.response?.data || err.message);
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
      setVolunteers((current) => current.map((volunteer) => (volunteer._id === id ? { ...volunteer, status: apiStatus } : volunteer)));
      setSelectedVolunteer((current) => (current && current._id === id ? { ...current, status: apiStatus } : current));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating record status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this volunteer record and CV file permanently?')) return;

    try {
      await api.delete(`/volunteers/${id}`);
      setVolunteers((current) => current.filter((volunteer) => volunteer._id !== id));
      setSelectedVolunteer(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Record deletion failed.');
    }
  };

  if (loading) return <LogoLoader message="Loading volunteers..." />;

  return (
    <div className="space-y-8 relative">
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          <div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold mb-3 w-fit border border-primary-100">
              <FiBriefcase /> Talent Pipeline
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900">Volunteer Applications</h2>
            <p className="text-neutral-500 text-sm mt-2 max-w-md">Review applicant profiles, update engagement status, and access uploaded CVs.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-50 px-5 py-3 rounded-xl border border-neutral-100">
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-neutral-900 leading-none">{volunteers.length}</span>
              <span className="text-xs font-medium text-neutral-500 mt-1">Total Submissions</span>
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
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Applicant</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Skills & Availability</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 border-b border-neutral-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-sm font-medium text-neutral-400">
                    <div className="flex flex-col items-center gap-3">
                      <FiGlobe size={40} className="opacity-40" />
                      <p>No volunteer applications in queue.</p>
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
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {volunteer.name?.charAt(0) || 'V'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-neutral-900 truncate">{volunteer.name}</span>
                          <span className="flex items-center gap-1.5 text-xs text-neutral-500 truncate mt-0.5">
                            <FiMail size={12} /> {volunteer.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
                        {volunteer.applicationType || 'Volunteer'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                          <FiGlobe size={12} className="text-primary-600" /> {volunteer.availability || 'Hybrid'}
                        </span>
                        <span className="text-xs text-neutral-500 truncate max-w-xs">{volunteer.skills || 'General Support'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        volunteer.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        volunteer.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          volunteer.status === 'approved' ? 'bg-emerald-500' :
                          volunteer.status === 'pending' ? 'bg-amber-500 animate-pulse' :
                          'bg-red-500'
                        }`} />
                        <span className="capitalize">{volunteer.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedVolunteer(volunteer)}
                        className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                        title="View Application"
                      >
                        <FiEye size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(volunteer._id)}
                        className="p-2 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Delete Application"
                      >
                        <FiTrash2 size={15} />
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
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedVolunteer(null)}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 relative max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <FiX size={22} />
              </button>

              <div className="flex items-center gap-4 mb-6 pr-8">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl shrink-0">
                  {selectedVolunteer.name?.charAt(0) || 'V'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-neutral-900 truncate">{selectedVolunteer.name}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{selectedVolunteer.applicationType || 'Volunteer'} Application</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Status</div>
                  <div className="text-sm font-semibold capitalize text-neutral-900">{selectedVolunteer.status}</div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Availability</div>
                  <div className="text-sm font-semibold text-neutral-900">{selectedVolunteer.availability || 'Hybrid'}</div>
                </div>
                <div className="rounded-xl border border-neutral-200 p-4">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Email</div>
                  <div className="flex items-center gap-2 text-sm text-neutral-700 break-all">
                    <FiMail className="text-primary-600 shrink-0" />
                    {selectedVolunteer.email}
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-200 p-4">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Phone</div>
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <FiPhone className="text-primary-600 shrink-0" />
                    {selectedVolunteer.phone || 'No Data'}
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:col-span-2">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Skills & Profession</div>
                  <div className="text-sm font-medium text-neutral-700">{selectedVolunteer.skills}</div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 mb-6">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Statement / Motivation</div>
                <p className="text-sm leading-relaxed text-neutral-600 whitespace-pre-wrap">
                  {selectedVolunteer.message || 'No personal statement provided.'}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 p-4 flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">Resume / CV</div>
                  <p className="text-xs text-neutral-500">
                    {selectedVolunteer.cvOriginalName || 'Attached curriculum vitae'}
                  </p>
                </div>
                {selectedVolunteer.cvFile ? (
                  <a
                    href={getMediaUrl(selectedVolunteer.cvFile)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold text-xs hover:bg-primary-700 transition-colors shadow-sm"
                  >
                    <FiFileText />
                    Open CV
                  </a>
                ) : (
                  <span className="text-xs text-neutral-400">No CV file uploaded</span>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100">
                {selectedVolunteer.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(selectedVolunteer._id, 'approved')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <FiUserCheck /> Approve
                  </button>
                )}
                {selectedVolunteer.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(selectedVolunteer._id, 'rejected')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors"
                  >
                    <FiUserX /> Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageVolunteers;
