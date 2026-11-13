import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import {
  FiMapPin,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiX,
  FiCheck,
  FiUsers,
  FiPhone,
  FiUser,
  FiImage,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
} from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import LogoLoader from '../../components/LogoLoader';
import LocationPicker from '../../components/admin/LocationPicker';

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    studentCount: '',
    principalName: '',
    contact: '',
    summary: '',
    progressPercent: 0,
    lat: null,
    lng: null,
  });

  // Media state
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

  const fetchSchools = async () => {
    try {
      const res = await api.get('/schools');
      setSchools(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch schools:', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load schools.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const resetForm = () => {
    cleanupObjectUrls();
    setFormData({
      name: '',
      area: '',
      studentCount: '',
      principalName: '',
      contact: '',
      summary: '',
      progressPercent: 0,
      lat: null,
      lng: null,
    });
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setRemovedPhotos([]);
    setDirectPhotoUrl('');
    setEditingId(null);
    setFeedback({ type: '', message: '' });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (school) => {
    cleanupObjectUrls();
    setEditingId(school._id);
    setFormData({
      name: school.name || '',
      area: school.area || '',
      studentCount: school.studentCount != null ? school.studentCount : '',
      principalName: school.principalName || '',
      contact: school.contact || '',
      summary: school.summary || '',
      lat: school.lat != null ? school.lat : null,
      lng: school.lng != null ? school.lng : null,
    });

    const existingPhotos = (school.photos || []).map((img) => getMediaUrl(img));
    setPhotoPreviews(existingPhotos);
    setPhotoFiles([]);
    setRemovedPhotos([]);
    setDirectPhotoUrl('');
    setFeedback({ type: '', message: '' });
    setIsModalOpen(true);
  };

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

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'School name is required.' });
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('area', formData.area.trim());
      payload.append('principalName', formData.principalName.trim());
      payload.append('contact', formData.contact.trim());
      payload.append('summary', formData.summary.trim());
      payload.append('progressPercent', 0);

      if (formData.studentCount !== '' && formData.studentCount !== null) {
        payload.append('studentCount', formData.studentCount);
      } else {
        payload.append('studentCount', '');
      }

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

      payload.append('milestones', JSON.stringify([]));

      if (removedPhotos.length > 0) {
        payload.append('removedPhotos', JSON.stringify(removedPhotos));
      }

      // Append direct photo URLs that are not uploaded files
      const directUrls = photoPreviews.filter(
        (url) => !url.startsWith('blob:') && !removedPhotos.includes(url)
      );
      if (directUrls.length > 0) {
        payload.append('photos', JSON.stringify(directUrls));
      }

      // Append new file uploads
      photoFiles.forEach((file) => {
        payload.append('photos', file);
      });

      let res;
      if (editingId) {
        res = await api.put(`/schools/${editingId}`, payload);
        setSchools((prev) =>
          prev.map((s) => (s._id === editingId ? res.data.data : s))
        );
      } else {
        res = await api.post('/schools', payload);
        setSchools((prev) => [res.data.data, ...prev]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Save failed:', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save school record.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (school) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${school.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await api.delete(`/schools/${school._id}`);
        setSchools((prev) => prev.filter((s) => s._id !== school._id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete school record.');
      }
    }
  };

  if (loading) return <LogoLoader message="Loading schools..." />;

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-3 px-3 py-1.5 bg-primary-50 rounded-full w-fit border border-primary-100">
            <FiBookOpen /> Education Infrastructure
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 leading-tight">
            School Management
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            Manage supported schools, coordinates, and contact details.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 active:scale-95 transition-all group shrink-0 shadow-sm"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" />
          Add School
        </button>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold text-neutral-500 bg-neutral-50">
                <th className="px-6 py-4 border-b border-neutral-100">School & Area</th>
                <th className="px-6 py-4 border-b border-neutral-100">Location</th>
                <th className="px-6 py-4 border-b border-neutral-100">Students</th>
                <th className="px-6 py-4 border-b border-neutral-100 text-right whitespace-nowrap min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {schools.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-16 text-center text-sm font-medium text-neutral-400"
                  >
                    No schools registered yet. Click &quot;Add School&quot; to create one.
                  </td>
                </tr>
              ) : (
                schools.map((school) => {
                  const hasCoordinates =
                    school.lat != null &&
                    school.lng != null &&
                    !Number.isNaN(Number(school.lat)) &&
                    !Number.isNaN(Number(school.lng));

                  return (
                    <tr
                      key={school._id}
                      className="group hover:bg-neutral-50 transition-colors"
                    >
                      {/* Name & Area */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                            {school.name}
                          </span>
                          <span className="text-xs font-medium text-neutral-500 mt-0.5">
                            {school.area || 'Area not specified'}
                          </span>
                        </div>
                      </td>

                      {/* Location status */}
                      <td className="px-6 py-5">
                        {hasCoordinates ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <FiMapPin size={13} />
                            {Number(school.lat).toFixed(4)}, {Number(school.lng).toFixed(4)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <FiAlertCircle size={13} />
                            No location yet
                          </span>
                        )}
                      </td>

                      {/* Students */}
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                          <FiUsers size={14} className="text-neutral-400" />
                          {school.studentCount != null ? `${school.studentCount} students` : '—'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(school)}
                            className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:text-primary-700 hover:bg-primary-50 transition-colors"
                            title="Edit School"
                          >
                            <FiEdit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(school)}
                            className="p-2 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete School"
                          >
                            <FiTrash2 size={15} />
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

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden relative max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-5 mb-6 border-b border-neutral-100">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {editingId ? 'Edit School Details' : 'Register New School'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    All fields will be publicly visible on the interactive map card.
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
                  {feedback.type === 'error' ? (
                    <FiAlertCircle size={18} />
                  ) : (
                    <FiCheckCircle size={18} />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-2">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shree Mangala Devi School"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-2">
                      Area / Village / Locality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chaap (Bore)"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-2">
                      Student Count
                    </label>
                    <div className="relative">
                      <FiUsers className="absolute left-3.5 top-3 text-neutral-400" size={16} />
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 185"
                        value={formData.studentCount}
                        onChange={(e) =>
                          setFormData({ ...formData, studentCount: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-2">
                      Principal Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-3 text-neutral-400" size={16} />
                      <input
                        type="text"
                        placeholder="e.g. Ram Bahadur Thapa"
                        value={formData.principalName}
                        onChange={(e) =>
                          setFormData({ ...formData, principalName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-2">
                      Contact Number (Tap-to-call on public card)
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-3 text-neutral-400" size={16} />
                      <input
                        type="text"
                        placeholder="e.g. +977-9841234567"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-2">
                      Summary (Overview line for the school)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of the school and the foundation's support..."
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium resize-none"
                    />
                  </div>
                </div>

                {/* Location Picker */}
                <div className="p-5 bg-white border border-neutral-200 rounded-2xl space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <FiMapPin className="text-primary-600" /> Geographic Location Picker
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Click anywhere on the map or drag the pin. This locates schools on the public map.
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

                {/* Photos / Cloudinary Upload */}
                <div className="p-5 bg-white border border-neutral-200 rounded-2xl space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <FiImage className="text-primary-600" /> School Photos (Cloudinary Upload)
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Upload school photos or paste an image URL. Shown on the school detail card.
                    </p>
                  </div>

                  {/* Photo file input */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 hover:border-primary-500 rounded-xl cursor-pointer bg-neutral-50 hover:bg-primary-50/50 transition-colors text-xs font-semibold text-neutral-600 hover:text-primary-700">
                      <FiImage size={16} />
                      Choose Image Files to Upload
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
                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddDirectPhotoUrl}
                        className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors shrink-0"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Photo Previews */}
                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {photoPreviews.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden aspect-video border border-neutral-200 bg-neutral-100"
                        >
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhotoItem(idx)}
                            className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 text-white rounded-lg opacity-90 hover:opacity-100 transition-opacity shadow-sm"
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
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={actionLoading}
                    className="px-5 py-2.5 border border-neutral-200 text-neutral-600 rounded-xl font-semibold text-xs hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-xs hover:bg-primary-700 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                  >
                    {actionLoading && (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {editingId ? 'Save Changes' : 'Create School'}
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

export default ManageSchools;
