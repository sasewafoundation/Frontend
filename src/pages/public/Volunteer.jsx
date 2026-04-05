import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiBriefcase, FiHeart, FiAward, FiPaperclip, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';
import Seo from '../../components/Seo';

const getRoleMeta = (role) => {
  if (role === 'internship') {
    return {
      badge: 'Internship Application',
      title: 'Apply for an internship',
      intro: 'Structured NGO experience for students and early-career professionals.',
      cta: 'Submit Internship Application',
      applicationType: 'Internship',
    };
  }

  return {
    badge: 'Volunteer Application',
    title: 'Apply as a volunteer',
    intro: 'Flexible support for people who want to contribute time, skills, or field help.',
    cta: 'Submit Volunteer Application',
    applicationType: 'Volunteer',
  };
};

const Volunteer = () => {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') || 'volunteer').toLowerCase();
  const roleMeta = useMemo(() => getRoleMeta(role), [role]);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', skills: '', availability: 'Hybrid', message: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleChange = (field) => (e) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', text: 'Submitting your application…' });
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('skills', formData.skills);
      payload.append('applicationType', roleMeta.applicationType);
      payload.append('availability', formData.availability);
      payload.append('message', formData.message);

      if (cvFile) {
        payload.append('cvFile', cvFile);
      }

      await api.post('/volunteers', payload);
      setStatus({ type: 'success', text: 'Thank you! We\'ll be in touch soon.' });
      setFormData({ name: '', email: '', phone: '', skills: '', availability: 'Hybrid', message: '' });
      setCvFile(null);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Something went wrong. Please try again.' });
    }
  };

  const highlights = role === 'internship' ? [
    {
      icon: <FiBriefcase size={22} />,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      title: 'Professional Experience',
      desc: 'Build a real portfolio through guided work in communications, programmes, operations, or digital support.',
    },
    {
      icon: <FiAward size={22} />,
      iconBg: 'bg-amber-50',
      iconColor: 'text-accent-gold',
      title: 'Mentorship & Growth',
      desc: 'Get feedback, support, and exposure to how an NGO operates in the field.',
    },
    {
      icon: <FiHeart size={22} />,
      iconBg: 'bg-lime-50',
      iconColor: 'text-accent-teal',
      title: 'Community Impact',
      desc: 'Contribute to work that directly supports rural families and local initiatives.',
    },
  ] : [
    {
      icon: <FiHeart size={22} />,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      title: 'Field & Community Support',
      desc: 'Help directly with community outreach, relief work, education, or event support.',
    },
    {
      icon: <FiBriefcase size={22} />,
      iconBg: 'bg-lime-50',
      iconColor: 'text-accent-teal',
      title: 'Remote & Hybrid Skills',
      desc: 'Share professional skills such as design, development, research, or coordination.',
    },
    {
      icon: <FiAward size={22} />,
      iconBg: 'bg-amber-50',
      iconColor: 'text-accent-gold',
      title: 'Certificates & Recognition',
      desc: 'We verify your contribution and support your long-term engagement with the foundation.',
    },
  ];

  return (
    <div className="bg-white w-full overflow-hidden">
      <Seo title={roleMeta.title} description={roleMeta.intro} />

      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-neutral-50 border-b border-neutral-100">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=70"
            alt=""
            className="w-full h-full object-cover object-center opacity-[0.06]"
          />
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/60 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-100/50 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="pill-primary mb-7">{roleMeta.badge}</span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight mb-6 leading-tight">
            {roleMeta.title}
          </h1>
          <p className="text-lg text-neutral-500 font-normal leading-relaxed max-w-2xl mx-auto">
            {roleMeta.intro}
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link to="/join-us" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors">
              <span>Choose a different path</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label block text-center">What to expect</span>
            <h2 className="section-title">How this application works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((roleItem, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl border border-neutral-100 p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${roleItem.iconBg} ${roleItem.iconColor} flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  {roleItem.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 leading-snug">{roleItem.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{roleItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white" id="apply">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label block text-center">Application Form</span>
            <h2 className="text-4xl font-bold text-neutral-900 tracking-tight mb-4">
              Submit your {roleMeta.applicationType.toLowerCase()} application.
            </h2>
            <p className="text-neutral-500 text-base max-w-md mx-auto leading-relaxed">
              Fill out the form below and our coordinator will review your profile shortly.
            </p>
          </div>

          <div className="bg-neutral-50 rounded-3xl border border-neutral-100 p-8 md:p-12 shadow-[var(--shadow-soft)]">
            {status.text && (
              <div className={`p-4 rounded-2xl mb-8 text-sm font-semibold flex items-center gap-3 ${
                status.type === 'error'   ? 'bg-red-50 text-red-700 border border-red-100' :
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                'bg-primary-50 text-primary-700 border border-primary-100'
              }`}>
                {status.type === 'success' && <FiCheckCircle size={18} />}
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text" required className="form-input"
                    placeholder="Your full name"
                    value={formData.name} onChange={handleChange('name')}
                  />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email" required className="form-input"
                    placeholder="you@example.com"
                    value={formData.email} onChange={handleChange('email')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel" className="form-input"
                    placeholder="+977 98XXXXXXXX"
                    value={formData.phone} onChange={handleChange('phone')}
                  />
                </div>
                <div>
                  <label className="form-label">Your Skillset / Profession *</label>
                  <input
                    type="text" required className="form-input"
                    placeholder="e.g. Medical Student, Web Developer"
                    value={formData.skills} onChange={handleChange('skills')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Availability</label>
                  <select
                    className="form-input appearance-none cursor-pointer"
                    value={formData.availability} onChange={handleChange('availability')}
                  >
                    <option value="Remote">Remote / Virtual</option>
                    <option value="On-Site">On-Site / Field</option>
                    <option value="Hybrid">Hybrid — Both</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">CV / Resume (Optional)</label>
                  <div className="form-input flex items-center gap-3 cursor-pointer relative border border-dashed border-neutral-300 bg-white">
                    <FiPaperclip className="text-neutral-400 shrink-0" size={16} />
                    <span className="text-sm text-neutral-400 truncate">
                      {cvFile ? cvFile.name : 'Upload PDF or DOCX…'}
                    </span>
                    <input
                      type="file" accept=".pdf,.doc,.docx"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => setCvFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">Why do you want to apply?</label>
                <textarea
                  rows={4}
                  className="form-input resize-none"
                  placeholder="Tell us about your motivations, any relevant experience, or the kind of role you're looking for…"
                  value={formData.message} onChange={handleChange('message')}
                />
              </div>

              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold text-base hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
              >
                {status.type === 'loading' ? (
                  <>
                    Submitting
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  <>{roleMeta.cta} <FiArrowRight size={15} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;
