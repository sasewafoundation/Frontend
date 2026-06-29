import React from 'react';
import { FiArrowRight, FiShield, FiBookOpen, FiUsers } from 'react-icons/fi';
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

            <div className="group bg-gray-50 border border-gray-100 p-8 rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-400 shadow-sm">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center mb-7 shadow-sm group-hover:scale-110 transition-transform">
                <FiUsers size={24} />
              </div>
              <div className="text-4xl font-bold mb-2 text-primary-600 group-hover:text-primary-700 transition-colors">60%</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-900 transition-colors">Direct Community Aid</h3>
              <p className="text-sm text-gray-500 leading-relaxed group-hover:text-neutral-700 transition-colors">
                Education materials, digital devices, livelihood support, medicines, food supplies,
                emergency relief kits, and construction and repair of community facilities in rural areas —
                delivered by our team on the ground.
              </p>
            </div>

            <div className="group bg-gray-50 border border-gray-100 p-8 rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-400 shadow-sm">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center mb-7 shadow-sm group-hover:scale-110 transition-transform">
                <FiBookOpen size={24} />
              </div>
              <div className="text-4xl font-bold mb-2 text-primary-600 group-hover:text-primary-700 transition-colors">25%</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-900 transition-colors">Education & Skills</h3>
              <p className="text-sm text-gray-500 leading-relaxed group-hover:text-neutral-700 transition-colors">
                Empowering rural communities through education, scholarships, and practical skills for
                children and youth so that they have a real chance to learn, grow, and shape their future.
              </p>
            </div>

            <div className="group bg-gray-50 border border-gray-100 p-8 rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-400 shadow-sm">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center mb-7 shadow-sm group-hover:scale-110 transition-transform">
                <FiShield size={24} />
              </div>
              <div className="text-4xl font-bold mb-2 text-primary-600 group-hover:text-primary-700 transition-colors">15%</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-900 transition-colors">Operations & Oversight</h3>
              <p className="text-sm text-gray-500 leading-relaxed group-hover:text-neutral-700 transition-colors">
                Logistics, safety, and programme management to make sure everything runs effectively —
                and that you receive accurate, verifiable reporting on how your donation was used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pledge types ── */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <span className="section-label block text-center">Ways to Give</span>
          <h2 className="section-title mb-6">Choose how you'd like to help</h2>
          <p className="text-base text-gray-500 max-w-xl mx-auto mb-14">
            Whether it's a one-time gesture or an ongoing commitment, every contribution makes a
            meaningful difference.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { title: 'One-time Gift', amount: 'Any amount', desc: 'A single donation used directly where it\'s needed most right now.' },
              { title: 'Monthly Pledge', amount: 'From NPR 500/mo', desc: 'Sustain a programme long-term. Monthly donors are the backbone of our work.' },
              { title: 'Corporate Giving', amount: 'Custom', desc: 'Partner with us as a sponsor and align your brand with meaningful community impact.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-card transition-all hover:-translate-y-0.5">
                <div className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">{item.amount}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-primary-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-700/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-yellow/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight mb-5">Ready to make a difference?</h2>
          <p className="text-lg text-primary-200 font-normal mb-10">
            Contact our team directly. We'll guide you through the process and make sure your donation
            goes exactly where it's needed.
          </p>
          <a
            href={`mailto:${coordinatorEmail}?subject=Donation%20Inquiry`}
            className="inline-flex items-center gap-3 bg-white text-primary-700 border border-primary-200 font-bold px-9 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all text-base"
          >
            Email Our Coordinator ({coordinatorEmail}) <FiArrowRight size={18} />
          </a>
        </div>
      </section>

    </div>
  );
};

export default Donation;
