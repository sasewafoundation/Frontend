import React from 'react';
import { FiArrowRight, FiShield, FiBookOpen, FiUsers, FiMail, FiHeart } from 'react-icons/fi';
import Seo from '../../components/Seo';

const coordinatorEmail = 'sasewafoundation@gmail.com';

const Donation = () => {
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
          <span className="inline-block text-xs font-semibold text-primary-100 tracking-wide border border-primary-600 bg-primary-800/40 rounded-full px-4 py-1.5 mb-8">
            Transparent & Accountable
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
            Your donation<br />creates real impact.
          </h1>
          <p className="text-lg text-primary-100 font-normal leading-relaxed max-w-2xl mx-auto pt-8 border-t border-primary-700/40">
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
              <div className="text-4xl font-bold mb-2 text-primary-600">60%</div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Direct Community Aid</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Education materials, digital devices, livelihood support, medicines, food supplies,
                emergency relief kits, and construction of community facilities in rural areas.
              </p>
            </div>

            <div className="group bg-neutral-50 border border-neutral-100 p-8 rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-300 shadow-sm">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center mb-7 shadow-sm group-hover:scale-110 transition-transform">
                <FiBookOpen size={24} />
              </div>
              <div className="text-4xl font-bold mb-2 text-primary-600">25%</div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Education & Skills</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Empowering rural communities through scholarships, mentoring, and vocational skills for
                children and youth to shape their own futures.
              </p>
            </div>

            <div className="group bg-neutral-50 border border-neutral-100 p-8 rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-300 shadow-sm">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center mb-7 shadow-sm group-hover:scale-110 transition-transform">
                <FiShield size={24} />
              </div>
              <div className="text-4xl font-bold mb-2 text-primary-600">15%</div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Operations & Oversight</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Logistics, safety, and rigorous programme reporting so supporters receive verifiable,
                transparent receipts of all activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Want to Make a Contribution Section ── */}
      <section className="py-24 px-6 bg-neutral-50 border-t border-neutral-100" id="donate-form">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-14 border border-neutral-200 shadow-card text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold mb-6">
              <FiHeart className="text-primary-600" size={14} />
              <span>Direct Giving & Support</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-5 tracking-tight">
              Want to make a contribution?
            </h2>
            
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              We warmly welcome donations and project support. If you would like to make a contribution, please email us directly and our team will be delighted to coordinate with you.
            </p>

            <div className="flex justify-center">
              <a
                href={`mailto:${coordinatorEmail}?subject=Want%20to%20Make%20a%20Contribution%20-%20Sa-Sewa%20Foundation`}
                className="btn-primary text-base py-4 px-9 shadow-md inline-flex items-center gap-2.5"
              >
                <FiMail size={18} /> Please Email Us <FiArrowRight size={16} />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 pt-8 mt-8 border-t border-neutral-100">
              <span>• Typical response time: Within 24-48 hours</span>
              <span>• Registered & verified nonprofit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Direct Contact CTA ── */}
      <section className="py-24 px-6 bg-primary-900 text-white text-center relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Questions About Giving?</h2>
          <p className="text-primary-100 mb-8 text-base leading-relaxed">
            Reach out to our leadership directly. We are happy to provide audited financials, programme reports, and discuss specific community requirements.
          </p>
          <a
            href={`mailto:${coordinatorEmail}?subject=Donation%20Inquiry%20-%20Sa-Sewa%20Foundation`}
            className="btn-white px-8 py-4 text-base inline-flex items-center gap-2"
          >
            <FiMail size={18} /> Email Our Coordinator <FiArrowRight size={16} />
          </a>
        </div>
      </section>

    </div>
  );
};

export default Donation;
