import React, { useState } from 'react';
import { FiArrowRight, FiShield, FiBookOpen, FiUsers, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import Seo from '../../components/Seo';

const coordinatorEmail = 'sasewafoundation@gmail.com';

const Donation = () => {
  // FIX 7: Form state for direct donation pledge submission
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/donations', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        amount: Number(formData.amount),
        message: formData.message.trim(),
      });

      setStatus({
        type: 'success',
        message: 'Thank you for your generosity! Your donation pledge has been recorded. Our team will contact you with verification details.',
      });
      setFormData({ name: '', email: '', amount: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Unable to submit your donation pledge right now. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white w-full overflow-hidden">
      <Seo title="Donate" description="Support Sa-Sewa Foundation and help fund community projects across Nepal." />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 bg-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900/95 to-primary-800/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold text-primary-300 uppercase tracking-widest border border-primary-600 bg-primary-800/40 rounded-full px-4 py-1.5 mb-8">
            Transparent & Accountable
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
            Your donation<br />creates real impact.
          </h1>
          <p className="text-lg text-primary-200 font-normal leading-relaxed max-w-2xl mx-auto pt-8 border-t border-primary-700/40">
            Every rupee donated to Sa-Sewa Foundation goes directly to our field programmes in rural Nepal.
            No overhead. No waste. Just results you can see.
          </p>
        </div>
      </section>

      {/* ── How funds are used ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label block text-center">Fund Allocation</span>
            <h2 className="section-title">Where your money goes</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            <div className="group bg-neutral-50 border border-neutral-100 p-8 rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-300 shadow-sm">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center mb-7 shadow-sm group-hover:scale-110 transition-transform">
                <FiUsers size={24} />
              </div>
              <div className="text-4xl font-bold mb-2 text-primary-600 group-hover:text-primary-700 transition-colors">60%</div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900 group-hover:text-primary-900 transition-colors">Direct Community Aid</h3>
              <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-700 transition-colors">
                Education materials, digital devices, livelihood support, medicines, food supplies,
                emergency relief kits, and construction of community facilities in rural areas.
              </p>
            </div>

            <div className="group bg-neutral-50 border border-neutral-100 p-8 rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-300 shadow-sm">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center mb-7 shadow-sm group-hover:scale-110 transition-transform">
                <FiBookOpen size={24} />
              </div>
              <div className="text-4xl font-bold mb-2 text-primary-600 group-hover:text-primary-700 transition-colors">25%</div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900 group-hover:text-primary-900 transition-colors">Education & Skills</h3>
              <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-700 transition-colors">
                Empowering rural communities through scholarships, mentoring, and vocational skills for
                children and youth to shape their own futures.
              </p>
            </div>

            <div className="group bg-neutral-50 border border-neutral-100 p-8 rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-300 shadow-sm">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center mb-7 shadow-sm group-hover:scale-110 transition-transform">
                <FiShield size={24} />
              </div>
              <div className="text-4xl font-bold mb-2 text-primary-600 group-hover:text-primary-700 transition-colors">15%</div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900 group-hover:text-primary-900 transition-colors">Operations & Oversight</h3>
              <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-700 transition-colors">
                Logistics, safety, and rigorous programme reporting so supporters receive verifiable,
                transparent receipts of all activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FIX 7: Direct Donation Pledge & Bank Details Section ── */}
      <section className="py-24 px-6 bg-neutral-50 border-t border-neutral-100" id="donate-form">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label block text-center">Pledge Your Support</span>
            <h2 className="section-title mb-4">Make a Contribution</h2>
            <p className="text-neutral-500 max-w-lg mx-auto text-base">
              Submit your donation inquiry below or transfer directly to our registered nonprofit account.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
            
            {/* Left: Bank Details & Transparency */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
                <div className="flex items-center gap-3 text-xs font-bold text-primary-700 uppercase tracking-widest mb-4">
                  <FiDollarSign size={18} /> Official Bank Transfer
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Bank Account Details</h3>
                <dl className="space-y-4 text-sm text-neutral-600">
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <dt className="font-semibold text-neutral-800">Account Name</dt>
                    <dd className="text-right font-medium">Sa-Sewa Foundation Nepal</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <dt className="font-semibold text-neutral-800">Bank</dt>
                    <dd className="text-right font-medium">Nabil Bank Ltd.</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <dt className="font-semibold text-neutral-800">Branch</dt>
                    <dd className="text-right font-medium">Kathmandu, Nepal</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <dt className="font-semibold text-neutral-800">SWIFT / BIC</dt>
                    <dd className="text-right font-medium">NARBNPKA</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="font-semibold text-neutral-800">Currency</dt>
                    <dd className="text-right font-medium">NPR / USD / EUR</dd>
                  </div>
                </dl>
                
                <div className="mt-6 p-4 rounded-2xl bg-primary-50 text-xs font-medium text-primary-800 leading-relaxed border border-primary-100">
                  After transfer, please share your voucher or deposit slip with{' '}
                  <a href={`mailto:${coordinatorEmail}`} className="underline font-semibold">{coordinatorEmail}</a>{' '}
                  to receive your official tax-deductible receipt.
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
                <h4 className="text-base font-bold text-neutral-900 mb-2">Need a custom wire transfer?</h4>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                  For international grants, corporate partnerships, or equipment donations, contact our finance coordinator directly.
                </p>
                <a
                  href={`mailto:${coordinatorEmail}?subject=Donation%20Inquiry`}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5"
                >
                  Contact coordinator <FiArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right: Pledge Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-neutral-200 shadow-sm">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Donation Pledge Form</h3>
              <p className="text-sm text-neutral-500 mb-8">
                Record your philanthropic pledge. We will send you instructions and a confirmation receipt.
              </p>

              {status.message && (
                <div className={`p-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-3 ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {status.type === 'success' && <FiCheckCircle className="shrink-0" size={18} />}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Pledged Amount (USD / NPR) *</label>
                    <input
                      type="number"
                      name="amount"
                      required
                      min="1"
                      placeholder="e.g. 50"
                      value={formData.amount}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Message or Specific Project Allocation (Optional)</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Specify if you wish to allocate funds to a particular school, health post, or community program…"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-4 text-base font-bold shadow-md disabled:opacity-70"
                >
                  {submitting ? 'Submitting Pledge...' : 'Submit Donation Pledge'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ── Direct Contact CTA ── */}
      <section className="py-24 px-6 bg-primary-900 text-white text-center relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Questions About Giving?</h2>
          <p className="text-primary-200 mb-8 text-base">
            Reach out to our leadership directly. We are happy to provide audited financials and programme reports.
          </p>
          <a
            href={`mailto:${coordinatorEmail}?subject=Donation%20Inquiry`}
            className="btn-white px-8 py-4 text-base inline-flex"
          >
            Email Coordinator ({coordinatorEmail}) <FiArrowRight size={16} />
          </a>
        </div>
      </section>

    </div>
  );
};

export default Donation;
