import React, { useState } from 'react';
import api from '../../services/api';
import Seo from '../../components/Seo';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', text: '' });

    try {
      await api.post('/messages', formData);
      setStatus({ type: 'success', text: 'Thank you for reaching out. Our team will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Unable to send your message right now.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <Seo title="Contact" description="Get in touch with Sa-Sewa Foundation for questions, partnerships, or support." />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Get in Touch</h2>
          <p className="mt-4 text-lg leading-8 text-gray-500 font-light">
            Whether you have questions about programs or ways to partner, our team is ready to answer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Details */}
          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Contact Information</h3>
            
            <dl className="space-y-6 text-gray-600">
              <div className="flex gap-x-4">
                <dt className="flex-none w-6 text-primary-600">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </dt>
                <dd className="col-span-1">Tarakeshwor -7<br />Kathmandu<br />Nepal</dd>
              </div>
              <div className="flex gap-x-4 pt-4 border-t border-gray-200">
                <dt className="flex-none w-6 text-primary-600">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.08-7.074-6.974l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </dt>
                <dd><a className="hover:text-primary-600 transition-colors" href="tel:+9779840186494">+977 9840186494</a></dd>
              </div>
              <div className="flex gap-x-4 pt-4 border-t border-gray-200">
                <dt className="flex-none w-6 text-primary-600">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </dt>
                <dd><a className="hover:text-primary-600 transition-colors" href="mailto:sasewafoundation@gmail.com">sasewafoundation@gmail.com</a></dd>
              </div>
            </dl>
          </div>

          {/* Form */}
          <div className="bg-white p-10 rounded-3xl shadow-card border border-gray-100">
            {status.text && (
              <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {status.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                <input 
                  type="text" 
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input 
                  type="email" 
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                <textarea 
                  rows={4} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-primary-600 text-white font-semibold py-4 rounded-xl hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md disabled:opacity-70"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
