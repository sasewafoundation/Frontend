import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBriefcase, FiUsers, FiCheckCircle } from 'react-icons/fi';
import Seo from '../../components/Seo';

const JoinUs = () => {
  const paths = [
    {
      title: 'Internship',
      description: 'For students and early-career professionals who want structured NGO experience, mentorship, and a real project portfolio.',
      bullets: ['3-6 month placements', 'Mentorship from the team', 'Portfolio-ready experience'],
      href: '/join-us/apply?role=internship',
      icon: <FiBriefcase size={22} />,
      accent: 'bg-primary-50 text-primary-700',
    },
    {
      title: 'Volunteer',
      description: 'For people who want to contribute time, skills, or field support on a flexible basis, remotely or on-site.',
      bullets: ['Remote or field support', 'Flexible commitment', 'Community-focused impact'],
      href: '/join-us/apply?role=volunteer',
      icon: <FiUsers size={22} />,
      accent: 'bg-amber-50 text-accent-gold',
    },
  ];

  return (
    <div className="bg-white w-full overflow-hidden">
      <Seo title="Join Us" description="Apply to volunteer or intern with Sa-Sewa Foundation and contribute to real community work." />
      <section className="relative pt-32 pb-20 px-6 bg-neutral-50 border-b border-neutral-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-label">Get Involved</span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-tight mb-6">
            Choose your way<br />to support the mission.
          </h1>
          <p className="text-lg text-neutral-500 font-normal leading-relaxed max-w-2xl mx-auto">
            Pick the path that fits you best. Internship and volunteer applications are kept separate so the process stays clear.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-7">
          {paths.map((item) => (
            <div key={item.title} className="group rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300">
              <div className={`w-12 h-12 ${item.accent} flex items-center justify-center rounded-2xl mb-6`}>
                {item.icon}
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">Apply for {item.title}</h2>
              <p className="text-neutral-500 leading-relaxed mb-6">{item.description}</p>
              <ul className="space-y-3 mb-8">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
                    <FiCheckCircle size={15} className="text-primary-600" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <Link to={item.href} className="btn-primary inline-flex">
                Apply for {item.title} <FiArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JoinUs;
