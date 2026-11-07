import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import {
  FiMapPin,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiX,
  FiCheck,
  FiImage,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiTag,
  FiLayers,
} from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../LogoLoader';
import LocationPicker from './LocationPicker';

const DEFAULT_SCHOOL_DETAILS = [
  { label: 'Students', value: '' },
  { label: 'Principal', value: '' },
  { label: 'Contact', value: '' },
];

const ProjectLocationsManager = ({ project, onClose }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    type: 'School',
    summary: '',
    progressPercent: 0,
    lat: null,
    lng: null,
  });

  const [details, setDetails] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  // Media
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [directPhotoUrl, setDirectPhotoUrl] = useState('');

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

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${project._id}/locations`);
      setLocations(res.data.data || []);
    } catch (err) {
      console.error('Failed to load project locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?._id) {
      fetchLocations();
    }
  }, [project?._id]);

  const resetForm = (initialType = 'School') => {
    cleanupObjectUrls();
    setFormData({
      name: '',
      area: '',
      type: initialType,
      summary: '',
      progressPercent: 0,
      lat: null,
      lng: null,
    });
    setDetails(initialType === 'School' ? [...DEFAULT_SCHOOL_DETAILS] : []);
    setMilestones([]);
    setNewMilestoneTitle('');
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setRemovedPhotos([]);
    setDirectPhotoUrl('');
    setEditingId(null);
    setFeedback({ type: '', message: '' });
  };

  const openAddModal = () => {
    resetForm('School');
    setIsModalOpen(true);
  };

  const openEditModal = (loc) => {
    cleanupObjectUrls();
    setEditingId(loc._id);
    setFormData({
      name: loc.name || '',
      area: loc.area || '',
      type: loc.type || 'Location',
      summary: loc.summary || '',
      progressPercent: loc.progressPercent != null ? loc.progressPercent : 0,
      lat: loc.lat != null ? loc.lat : null,
      lng: loc.lng != null ? loc.lng : null,
    });

    setDetails(
      Array.isArray(loc.details) && loc.details.length > 0
        ? loc.details.map((d) => ({ label: d.label || '', value: d.value || '' }))
        : loc.type === 'School'
        ? [...DEFAULT_SCHOOL_DETAILS]
        : []
    );

    setMilestones(
      Array.isArray(loc.milestones)
        ? loc.milestones.map((m) => ({
            title: m.title || '',
            done: Boolean(m.done),
            completedOn: m.completedOn ? m.completedOn.slice(0, 10) : '',
          }))
        : []
    );

    const existingPhotos = (loc.photos || []).map((img) => getMediaUrl(img));
    setPhotoPreviews(existingPhotos);
    setPhotoFiles([]);
    setRemovedPhotos([]);
    setDirectPhotoUrl('');
    setFeedback({ type: '', message: '' });
    setIsModalOpen(true);
  };

  // Type change pre-suggestions
  const handleTypeChange = (newType) => {
    setFormData((prev) => ({ ...prev, type: newType }));
    if (newType === 'School' && details.length === 0) {
      setDetails([...DEFAULT_SCHOOL_DETAILS]);
    }
  };

  // Details row handlers
  const handleAddDetailRow = () => {
    setDetails((prev) => [...prev, { label: '', value: '' }]);
  };

  const handleUpdateDetailRow = (index, field, value) => {
    setDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveDetailRow = (index) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // Photo handlers
  const handlePhotoFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setPhotoFiles((prev) => [...prev, ...files]);
      const urls = files.map((file) => createPreviewUrl(file));
      setPhotoPreviews((prev) => [...prev, ...urls]);
    }
  };

  const handleAddDirectPhotoUrl = () => {
    if (!directPhotoUrl.trim()) return;
    setPhotoPreviews((prev) => [...prev, directPhotoUrl.trim()]);
    setDirectPhotoUrl('');
  };

  const removePhotoItem = (index) => {
    const targetUrl = photoPreviews[index];
    if (targetUrl && (targetUrl.startsWith('http') || targetUrl.includes('/uploads/'))) {
      setRemovedPhotos((prev) => [...prev, targetUrl]);
    }

    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));

    const existingCount = photoPreviews.length - photoFiles.length;
    if (index >= existingCount) {
      const fileIndex = index - existingCount;
      setPhotoFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  // Milestone handlers
  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones((prev) => [
      ...prev,
      {
        title: newMilestoneTitle.trim(),
        done: false,
        completedOn: '',
      },
    ]);
    setNewMilestoneTitle('');
  };

  const handleToggleMilestone = (index) => {
    setMilestones((prev) =>
      prev.map((m, i) => {
        if (i !== index) return m;
        const newDone = !m.done;
        return {
          ...m,
          done: newDone,
          completedOn: newDone && !m.completedOn ? new Date().toISOString().slice(0, 10) : m.completedOn,
        };
      })
    );
  };

  const handleMilestoneDateChange = (index, dateVal) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, completedOn: dateVal } : m))
    );
  };

  const handleRemoveMilestone = (index) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'Location name is required.' });
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('area', formData.area.trim());
      payload.append('type', formData.type.trim() || 'Location');
      payload.append('summary', formData.summary.trim());
      payload.append('progressPercent', formData.progressPercent);

      if (formData.lat !== null && formData.lat !== undefined && formData.lat !== '') {
        payload.append('lat', formData.lat);
      } else {
        payload.append('lat', '');
      }

      if (formData.lng !== null && formData.lng !== undefined && formData.lng !== '') {
        payload.append('lng', formData.lng);
      } else {
        payload.append('lng', '');
      }

      // Filter non-empty details
      const validDetails = details.filter((d) => d.label.trim() && d.value.trim());
      payload.append('details', JSON.stringify(validDetails));

      payload.append('milestones', JSON.stringify(milestones));

      if (removedPhotos.length > 0) {
        payload.append('removedPhotos', JSON.stringify(removedPhotos));
      }

      const directUrls = photoPreviews.filter(
        (url) => !url.startsWith('blob:') && !removedPhotos.includes(url)
      );
      if (directUrls.length > 0) {
        payload.append('photos', JSON.stringify(directUrls));
      }

      photoFiles.forEach((file) => {
        payload.append('photos', file);
      });

      let res;
      if (editingId) {
        res = await api.put(`/locations/${editingId}`, payload);
        setLocations((prev) =>
          prev.map((loc) => (loc._id === editingId ? res.data.data : loc))
        );
      } else {
        res = await api.post(`/projects/${project._id}/locations`, payload);
        setLocations((prev) => [res.data.data, ...prev]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Save failed:', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save location.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (loc) => {
    if (window.confirm(`Delete "${loc.name}" from this project? This action cannot be undone.`)) {
      try {
        await api.delete(`/locations/${loc._id}`);
        setLocations((prev) => prev.filter((item) => item._id !== loc._id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete location.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-300 mb-1.5 uppercase tracking-wider">
            <FiLayers /> Project Locations
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-tight">
            {project?.title}
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">
            Manage field pins, community sites, work progress, and project-specific metrics.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 active:scale-95 transition-all shadow-sm"
          >
            <FiPlus size={16} /> Add Location
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            title="Return to Projects List"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Locations Table */}
      {loading ? (
        <LogoLoader message="Loading project locations..." />
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-neutral-700 bg-neutral-100/90 border-b border-neutral-300 uppercase tracking-wider">
                  <th className="px-6 py-4">Location & Area</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Coordinates</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {locations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-sm font-semibold text-neutral-500">
                      No locations created for this project yet. Click &quot;Add Location&quot; to place your first site!
                    </td>
                  </tr>
                ) : (
                  locations.map((loc) => {
                    const hasCoordinates =
                      loc.lat != null &&
                      loc.lng != null &&
                      !Number.isNaN(Number(loc.lat)) &&
                      !Number.isNaN(Number(loc.lng));

                    return (
                      <tr key={loc._id} className="group hover:bg-neutral-50/80 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                              {loc.name}
                            </span>
                            <span className="text-xs font-medium text-neutral-600 mt-0.5">
                              {loc.area || 'Area not specified'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-neutral-800 border border-neutral-300 shadow-xs">
                            <FiTag size={12} className="text-primary-600" />
                            {loc.type || 'Location'}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {hasCoordinates ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
                              <FiMapPin size={13} className="text-emerald-700" />
                              {Number(loc.lat).toFixed(4)}, {Number(loc.lng).toFixed(4)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                              <FiAlertCircle size={13} className="text-amber-800" />
                              No location yet
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          {loc.details && loc.details.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {loc.details.slice(0, 3).map((d, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] bg-white border border-neutral-300 text-neutral-800 px-2 py-0.5 rounded-md font-medium shadow-xs"
                                >
                                  <strong className="text-neutral-900">{d.label}:</strong> {d.value}
                                </span>
                              ))}
                              {loc.details.length > 3 && (
                                <span className="text-[11px] text-neutral-500 font-semibold self-center">
                                  +{loc.details.length - 3} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400 font-medium">—</span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="w-32">
                            <div className="flex justify-between items-center text-xs font-bold mb-1">
                              <span
                                className={
                                  loc.progressPercent === 100
                                    ? 'text-emerald-700'
                                    : loc.progressPercent > 0
                                    ? 'text-primary-700'
                                    : 'text-neutral-600'
                                }
                              >
                                {loc.progressPercent || 0}%
                              </span>
                              <span className="text-[11px] text-neutral-500 font-medium">
                                {loc.milestones?.filter((m) => m.done).length || 0}/
                                {loc.milestones?.length || 0}
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  loc.progressPercent === 100
                                    ? 'bg-emerald-500'
                                    : loc.progressPercent > 0
                                    ? 'bg-primary-600'
                                    : 'bg-neutral-400'
                                }`}
                                style={{ width: `${Math.min(100, loc.progressPercent || 0)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(loc)}
                            className="p-2.5 bg-white text-neutral-700 rounded-xl hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-300 shadow-xs transition-colors"
                            title="Edit Location"
                          >
                            <FiEdit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(loc)}
                            className="p-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300 shadow-xs transition-colors"
                            title="Delete Location"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Location Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden relative max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-5 mb-6 border-b border-neutral-100">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {editingId ? 'Edit Location' : `Add Location for "${project.title}"`}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Configure site name, coordinates, custom details, progress, and photos.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {feedback.message && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                    feedback.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {feedback.type === 'error' ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
                  <span>{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Location / Facility Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shree Mangala Devi School"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Type Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. School, Clinic, Well"
                      value={formData.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold shadow-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Area / Village / Locality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chaap (Bore)"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold shadow-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Summary (Overview Quote)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of this location and work being delivered..."
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium resize-none shadow-xs"
                    />
                  </div>
                </div>

                {/* Dynamic Details Editor */}
                <div className="p-5 bg-neutral-50/90 border border-neutral-300 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">
                        Custom Details & Metrics
                      </h4>
                      <p className="text-xs text-neutral-600 font-medium">
                        Add project-specific key/value pairs (e.g. Students, Principal, Contact, Water Source, Capacity).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddDetailRow}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-800 shadow-xs transition-colors"
                    >
                      <FiPlus size={13} /> Add Field
                    </button>
                  </div>

                  {details.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic py-2">
                      No custom details added yet. Click &quot;Add Field&quot; to insert label/value rows.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Label (e.g. Students)"
                            value={detail.label}
                            onChange={(e) => handleUpdateDetailRow(idx, 'label', e.target.value)}
                            className="w-1/3 px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-xs"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 185 or +977-984...)"
                            value={detail.value}
                            onChange={(e) => handleUpdateDetailRow(idx, 'value', e.target.value)}
                            className="flex-1 px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDetailRow(idx)}
                            className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove field"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress Percentage Slider */}
                <div className="p-5 bg-neutral-50/90 border border-neutral-300 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Work Progress Percentage
                    </label>
                    <span className="text-sm font-extrabold text-primary-700 bg-white border border-primary-300 px-3.5 py-1 rounded-full shadow-xs">
                      {formData.progressPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.progressPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, progressPercent: Number(e.target.value) })
                    }
                    className="w-full h-2.5 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-600 font-semibold">
                    <span>0% (Planning)</span>
                    <span>50% (In Progress)</span>
                    <span>100% (Completed)</span>
                  </div>
                </div>

                {/* Milestones Editor */}
                <div className="p-5 bg-white border border-neutral-300 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">
                        Milestones Checklist
                      </h4>
                      <p className="text-xs text-neutral-600 font-medium">
                        Track progress milestones with optional completion dates.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-neutral-800 bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-lg">
                      {milestones.filter((m) => m.done).length}/{milestones.length} Done
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Groundbreaking & foundation completed"
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMilestone();
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="px-5 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                    >
                      Add Milestone
                    </button>
                  </div>

                  {milestones.length > 0 && (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {milestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
                            milestone.done
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-xs'
                              : 'bg-neutral-50/80 border-neutral-300 text-neutral-800 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <button
                              type="button"
                              onClick={() => handleToggleMilestone(idx)}
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                                milestone.done
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'bg-white border-neutral-400 text-transparent hover:border-neutral-600'
                              }`}
                            >
                              <FiCheck size={14} />
                            </button>
                            <span
                              className={`text-xs ${
                                milestone.done ? 'line-through text-neutral-500' : 'text-neutral-900 font-bold'
                              }`}
                            >
                              {milestone.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-neutral-300 text-xs shadow-xs">
                              <FiCalendar size={13} className="text-neutral-500" />
                              <input
                                type="date"
                                value={milestone.completedOn || ''}
                                onChange={(e) => handleMilestoneDateChange(idx, e.target.value)}
                                className="text-xs font-semibold text-neutral-800 bg-transparent focus:outline-none"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMilestone(idx)}
                              className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete milestone"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Picker */}
                <div className="p-5 bg-white border border-neutral-300 rounded-2xl space-y-3 shadow-xs">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <FiMapPin className="text-primary-600" /> Geographic Location Picker
                    </h4>
                    <p className="text-xs text-neutral-600 font-medium">
                      Click anywhere on the map or drag the pin to set site coordinates.
                    </p>
                  </div>

                  <LocationPicker
                    lat={formData.lat}
                    lng={formData.lng}
                    onChange={(newLat, newLng) =>
                      setFormData((prev) => ({ ...prev, lat: newLat, lng: newLng }))
                    }
                  />
                </div>

                {/* Photos */}
                <div className="p-5 bg-white border border-neutral-300 rounded-2xl space-y-4 shadow-xs">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <FiImage className="text-primary-600" /> Site Photos
                    </h4>
                    <p className="text-xs text-neutral-600 font-medium">
                      Upload photos or paste image URLs to showcase this location.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 hover:border-primary-500 rounded-xl cursor-pointer bg-neutral-50 hover:bg-primary-50/50 transition-colors text-xs font-bold text-neutral-700 hover:text-primary-700 shadow-xs">
                      <FiImage size={16} />
                      Choose Image Files
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoFilesChange}
                        className="hidden"
                      />
                    </label>

                    <div className="flex gap-2 sm:w-1/2">
                      <input
                        type="url"
                        placeholder="Or paste image URL"
                        value={directPhotoUrl}
                        onChange={(e) => setDirectPhotoUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddDirectPhotoUrl}
                        className="px-3.5 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {photoPreviews.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden aspect-video border border-neutral-300 bg-neutral-100 shadow-xs"
                        >
                          <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhotoItem(idx)}
                            className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                            title="Remove image"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={actionLoading}
                    className="px-6 py-2.5 border border-neutral-300 bg-white text-neutral-800 rounded-xl font-bold text-xs hover:bg-neutral-100 hover:text-neutral-900 shadow-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-7 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-xs hover:bg-primary-700 active:scale-95 transition-all shadow-sm hover:shadow flex items-center gap-2"
                  >
                    {actionLoading && (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {editingId ? 'Save Changes' : 'Create Location'}
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

export default ProjectLocationsManager;
