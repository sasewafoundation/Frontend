import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiEye, FiArrowRight, FiCheck, FiHeart } from 'react-icons/fi';
import Seo from '../../components/Seo';

const About = () => {
  return (
    <div className="bg-white w-full overflow-hidden">
      <Seo title="About Us" description="Learn about Sa-Sewa Foundation, our mission, and the communities we serve across Nepal." />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-28 px-6 bg-white overflow-hidden border-b border-neutral-100">
        {/* Light background orbs using brand blue */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none opacity-80" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-100/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <span className="pill-primary mb-7">Our Foundation</span>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight mb-6 leading-tight">
                About{' '}
                <span className="text-primary-600">Sa-Sewa</span><br />
                Foundation
              </h1>
              <p className="text-lg text-neutral-500 font-normal leading-relaxed max-w-lg mb-8">
                A volunteer-driven non-profit based in Lalitpur, Nepal. Since 2018, our 
                teams have worked directly with rural communities — no middlemen, no barriers, 
                just real people doing the work.
              </p>
              <div className="flex flex-wrap gap-6">
                {[
                  { value: '2018', label: 'Founded' },
                  { value: 'Lalitpur', label: 'Headquarters' },
                  { value: 'Nepal', label: 'Focus Region' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{item.value}</div>
                    <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative">
              <div className="aspect-[5/4] rounded-3xl overflow-hidden shadow-[var(--shadow-float)]">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80"
                  alt="Sa-Sewa Foundation community work"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Corner badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl border border-neutral-100 shadow-[var(--shadow-card)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                    <FiHeart size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Community First</div>
                    <div className="text-xs text-neutral-400">Always. Without exception.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-24 px-6 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-label block text-center">Our Story</span>
            <h2 className="section-title mb-8">Why Sa-Sewa exists.</h2>
            <div className="space-y-5 text-base text-neutral-600 leading-[1.85] text-left">
              <p>
                Sa-Sewa began in 2018 when a small group of Nepali volunteers — students, doctors, 
                engineers, and teachers — decided that caring about their country wasn't enough. 
                They chose to <em>act</em>. Starting with a single health camp in a remote village 
                in Sindhupalchok, they discovered something powerful: communities didn't just 
                need resources, they needed <strong>to be seen and heard</strong>.
              </p>
              <p>
                We've grown since then, but our core belief hasn't changed. Every programme we run 
                is co-designed with the communities we serve. We don't impose solutions — we listen, 
                learn, and then build together. That's what makes our impact last.
              </p>
              <p>
                Today, Sa-Sewa operates across 12 rural villages, has trained over 300 volunteers, 
                and completed 25+ community projects. But the numbers are secondary. What matters 
                are the children who can read, the families who received care, and the communities 
                who now have the tools to grow independently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="relative group">
              <div className="absolute inset-0 bg-primary-50 rounded-3xl -rotate-1 scale-[1.02] transition-transform duration-500 group-hover:-rotate-2" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[var(--shadow-card)]">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                  alt="Students learning in a Sa-Sewa programme"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>

            <div>
              <div className="w-11 h-11 bg-primary-50 text-primary-600 flex items-center justify-center rounded-2xl mb-6">
                <FiTarget size={22} />
              </div>
              <span className="section-label">Our Mission</span>
              <h2 className="text-4xl font-bold text-neutral-900 tracking-tight mb-5 leading-tight">
                Accountable action,<br />lasting change.
              </h2>
              <div className="w-14 h-0.5 bg-primary-600 rounded-full mb-7" />
              <p className="text-base text-neutral-600 leading-[1.85] mb-5">
                We believe every person has the right to basic dignity, quality education, and access to
                healthcare. Sa-Sewa cuts through the noise — we go straight to the families who need
                help, led by volunteers who genuinely care.
              </p>
              <p className="text-base text-neutral-600 leading-[1.85] mb-8">
                By working from within the community rather than outside it, we ensure our support is
                culturally relevant, immediately effective, and long-lasting.
              </p>
              <ul className="space-y-3">
                {[
                  'Direct community involvement in every project',
                  'Full transparency in fund allocation',
                  'Measurable, reported community outcomes',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                      <FiCheck size={11} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-24 px-6 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="lg:order-last relative group">
              <div className="absolute inset-0 bg-lime-50 rounded-3xl rotate-1 scale-[1.02] transition-transform duration-500 group-hover:rotate-2 opacity-70" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[var(--shadow-card)]">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                  alt="Community infrastructure projects"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>

            <div>
              <div className="w-11 h-11 bg-amber-50 text-accent-gold flex items-center justify-center rounded-2xl mb-6">
                <FiEye size={22} />
              </div>
              <span className="section-label">Our Vision</span>
              <h2 className="text-4xl font-bold text-neutral-900 tracking-tight mb-5 leading-tight">
                Communities that<br />thrive independently.
              </h2>
              <div className="w-14 h-0.5 bg-accent-gold rounded-full mb-7" />
              <p className="text-base text-neutral-600 leading-[1.85] mb-5">
                Our ultimate goal is simple: for the communities we serve to no longer need us. We
                build self-reliance, not dependency. Every school built, every skill taught, every
                health camp held is a step toward that independence.
              </p>
              <p className="text-base text-neutral-600 leading-[1.85]">
                We envision a Nepal where geography is never a barrier to opportunity — and we're
                working hard every day to make that real.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Closing quote ── */}
      <section className="py-28 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-0.5 bg-primary-200 rounded-full mx-auto mb-12" />
          <blockquote className="text-2xl md:text-3xl font-semibold text-neutral-800 leading-[1.5] mb-8 italic">
            "We don't just deliver aid. We build the tools communities need
            so they can eventually build it themselves."
          </blockquote>
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-12">
            — Executive Board, Sa-Sewa Foundation
          </p>
          <Link to="/join-us" className="btn-primary">
            Join Our Team <FiArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;
