import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  FiUserCheck, 
  FiUserX, 
  FiMail, 
  FiPhone, 
  FiBriefcase, 
  FiGlobe, 
  FiTrash2, 
  FiX, 
  FiFileText, 
  FiEye, 
  FiClock, 
  FiExternalLink, 
  FiDownload 
} from 'react-icons/fi';
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
    if (!window.confirm('Delete this volunteer record permanently?')) return;

    try {
      await api.delete(`/volunteers/${id}`);
      setVolunteers((current) => current.filter((volunteer) => volunteer._id !== id));
      setSelectedVolunteer(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Record deletion failed.');
    }
  };

  const getCvUrl = (item) => {
    if (!item) return null;
    const cvPath = item.cvFile || item.cv || item.resume;
    if (!cvPath) return null;
    return getMediaUrl(cvPath);
  };

  const handleOpenCv = async (e, volunteer) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const cvUrl = getCvUrl(volunteer);
    if (!cvUrl) {
      alert('No CV was uploaded for this applicant.');
      return;
    }

    // If it's a Cloudinary / remote URL, it's permanently stored and accessible
    if (/^https?:\/\//i.test(cvUrl) && !cvUrl.includes('/uploads/')) {
      window.open(cvUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // For local /uploads/ files, check if the file is reachable on server
    try {
      const res = await fetch(cvUrl, { method: 'HEAD' });
      if (res.ok) {
        window.open(cvUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert(
          `The CV file (${volunteer.cvOriginalName || 'Resume'}) is not accessible on the server.\n\nThis application was submitted under an earlier session that stored files on temporary server disk. All new applications are uploaded permanently to Cloudinary cloud storage.`
        );
      }
    } catch {
      window.open(cvUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: '—', time: '' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: '—', time: '' };
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      full: d.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
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
            <p className="text-neutral-500 text-sm mt-2 max-w-md">Review applicant profiles, check submission timestamps, update engagement status, and review CVs.</p>
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
                <th className="px-4 py-3.5 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Applicant</th>
                <th className="px-4 py-3.5 text-xs font-semibold text-neutral-500 border-b border-neutral-100 whitespace-nowrap">Submitted At</th>
                <th className="px-4 py-3.5 text-xs font-semibold text-neutral-500 border-b border-neutral-100">Role & Skills</th>
                <th className="px-4 py-3.5 text-xs font-semibold text-neutral-500 border-b border-neutral-100 whitespace-nowrap">Resume / CV</th>
                <th className="px-4 py-3.5 text-xs font-semibold text-neutral-500 border-b border-neutral-100 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 text-xs font-semibold text-neutral-500 border-b border-neutral-100 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center text-sm font-medium text-neutral-400">
                    <div className="flex flex-col items-center gap-3">
                      <FiGlobe size={40} className="opacity-40" />
                      <p>No volunteer applications in queue.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                volunteers.map((volunteer) => {
                  const { date, time } = formatDateTime(volunteer.createdAt);
                  const cvLink = getCvUrl(volunteer);

                  return (
                    <tr
                      key={volunteer._id}
                      className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedVolunteer(volunteer)}
                    >
                      {/* Applicant Name & Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {volunteer.name?.charAt(0) || 'V'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-neutral-900 truncate max-w-[140px] sm:max-w-[170px]" title={volunteer.name}>
                              {volunteer.name}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-neutral-500 truncate max-w-[140px] sm:max-w-[170px] mt-0.5" title={volunteer.email}>
                              <FiMail size={11} className="shrink-0" /> {volunteer.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Submitted At (Date & Time) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-neutral-800">{date}</span>
                          {time && (
                            <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1 mt-0.5">
                              <FiClock size={10} className="text-neutral-400" />
                              {time}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role & Skills (Combined Type + Availability + Skills) */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold">
                              {volunteer.applicationType || 'Volunteer'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-600 font-medium">
                              <FiGlobe size={11} className="text-primary-600" />
                              {volunteer.availability || 'Hybrid'}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500 truncate max-w-[160px] lg:max-w-[220px] block" title={volunteer.skills}>
                            {volunteer.skills || 'General Support'}
                          </span>
                        </div>
                      </td>

                      {/* CV / Resume Direct Action */}
                      <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {cvLink ? (
                          <button
                            type="button"
                            onClick={(e) => handleOpenCv(e, volunteer)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800 border border-primary-200 text-xs font-semibold transition-colors"
                            title="Open CV in new tab"
                          >
                            <FiFileText size={12} />
                            <span>View CV</span>
                            <FiExternalLink size={10} className="opacity-70" />
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-400 italic">No CV</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          volunteer.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                          volunteer.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            volunteer.status === 'approved' ? 'bg-emerald-500' :
                            volunteer.status === 'pending' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`} />
                          <span className="capitalize">{volunteer.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedVolunteer(volunteer)}
                            className="p-1.5 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                            title="View Application Details"
                          >
                            <FiEye size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(volunteer._id)}
                            className="p-1.5 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
                            title="Delete Application"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Details Dialog Modal ── */}
      <AnimatePresence>
        {selectedVolunteer && (() => {
          const formatted = formatDateTime(selectedVolunteer.createdAt);
          const modalCvLink = getCvUrl(selectedVolunteer);

          return (
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
                  {/* Status */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Status</div>
                    <div className="text-sm font-semibold capitalize text-neutral-900">{selectedVolunteer.status}</div>
                  </div>

                  {/* Submitted Date & Time */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <FiClock size={12} className="text-neutral-500" /> Submitted At
                    </div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {formatted.full !== '—' ? formatted.full : 'Timestamp not recorded'}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Availability</div>
                    <div className="text-sm font-semibold text-neutral-900">{selectedVolunteer.availability || 'Hybrid'}</div>
                  </div>

                  {/* Email */}
                  <div className="rounded-xl border border-neutral-200 p-4">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Email</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-700 break-all">
                      <FiMail className="text-primary-600 shrink-0" />
                      <a href={`mailto:${selectedVolunteer.email}`} className="hover:underline text-neutral-900">
                        {selectedVolunteer.email}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="rounded-xl border border-neutral-200 p-4">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Phone</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <FiPhone className="text-primary-600 shrink-0" />
                      <a href={`tel:${selectedVolunteer.phone}`} className="hover:underline text-neutral-900">
                        {selectedVolunteer.phone || 'No Data'}
                      </a>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Skills & Profession</div>
                    <div className="text-sm font-medium text-neutral-700">{selectedVolunteer.skills}</div>
                  </div>
                </div>

                {/* Motivation / Message */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 mb-6">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Statement / Motivation</div>
                  <p className="text-sm leading-relaxed text-neutral-600 whitespace-pre-wrap">
                    {selectedVolunteer.message || 'No personal statement provided.'}
                  </p>
                </div>

                {/* CV / Resume Section */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-5 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                        <FiFileText size={20} />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">Resume / CV Document</div>
                        <p className="text-sm font-semibold text-neutral-900 break-all">
                          {selectedVolunteer.cvOriginalName || (modalCvLink ? 'Attached CV Document' : 'No CV Uploaded')}
                        </p>
                        <span className="text-xs text-neutral-500">
                          {modalCvLink ? 'Click below to review or download the applicant CV' : 'No document file was submitted with this application'}
                        </span>
                      </div>
                    </div>

                    {modalCvLink ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleOpenCv(e, selectedVolunteer)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600 text-white font-semibold text-xs hover:bg-primary-700 transition-colors shadow-sm"
                        >
                          <FiExternalLink size={13} />
                          <span>Open CV</span>
                        </button>
                        <a
                          href={modalCvLink}
                          download={selectedVolunteer.cvOriginalName || `${selectedVolunteer.name || 'Volunteer'}-CV`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors shadow-xs"
                        >
                          <FiDownload size={13} />
                          <span>Download</span>
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">No CV available</span>
                    )}
                  </div>
                </div>

                {/* Status Action Buttons */}
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
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default ManageVolunteers;
