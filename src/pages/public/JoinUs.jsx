import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBriefcase, FiUsers, FiCheckCircle } from 'react-icons/fi';
import Seo from '../../components/Seo';

const JoinUs = () => {
  const paths = [
    {
      title: 'Internship',
      description: 'For students and early-career professionals who want to grow their skills while making a real difference in community life across Nepal.',
      bullets: ['Office-based, remote, or field-based work', 'Practical learning with real responsibility', 'Support from the Sa Sewa team'],
      href: '/join-us/apply?role=internship',
      icon: <FiBriefcase size={22} />,
      accent: 'bg-primary-50 text-primary-700',
    },
    {
      title: 'Volunteer',
      description: 'For people who want to contribute their time, energy, and skills through community service, field visits, or flexible remote support.',
      bullets: ['Flexible commitment', 'Field visits and community engagement', 'Meaningful support for local needs'],
      href: '/join-us/apply?role=volunteer',
      icon: <FiUsers size={22} />,
      accent: 'bg-amber-50 text-accent-gold',
    },
  ];

  const focusAreas = [
    'Community service and social development',
    'Humanitarian response and local support',
    'Education and learning initiatives',
    'Livelihood and public health activities',
  ];

  const contributionAreas = [
    'Proposal writing and documentation',
    'Fundraising and supporter engagement',
    'Marketing, communications, and outreach',
    'Linking with partners and community supporters',
  ];

  return (
    <div className="bg-white w-full overflow-hidden">
      <Seo title="Join Us" description="Apply to volunteer or intern with Sa-Sewa Foundation and contribute to real community work." />
      <section className="relative pt-32 pb-20 px-6 bg-neutral-50 border-b border-neutral-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/80 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center">
          <span className="section-label">Join Us</span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-tight mb-6">
            Join with us as an intern or volunteer to serve communities in Nepal.
          </h1>
          <p className="text-lg text-neutral-500 font-normal leading-relaxed max-w-3xl mx-auto">
            Sa Sewa Foundation warmly welcomes national and international volunteers to join our internship program and contribute to meaningful work in communities across Nepal.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          <div className="rounded-[2rem] border border-neutral-100 bg-neutral-50 p-8 lg:p-10 shadow-[var(--shadow-card)]">
            <span className="section-label">Why join</span>
            <h2 className="section-title mb-6">Grow your skills while serving communities.</h2>
            <div className="space-y-5 text-base text-neutral-600 leading-[1.9]">
              <p>
                Sa Sewa Foundation warmly welcomes national and international volunteers to join our internship program, an opportunity to grow your skills while making a real difference in the lives of communities.
              </p>
              <p>
                Depending on your interests and strengths, you may engage in office-based work, field activities, remote assignments, or field visits that deepen your understanding of local needs and solutions.
              </p>
              <p>
                We offer a wide range of roles, shaped by each participant’s background and passion. Those interested in community service, social development, humanitarian response, education, livelihood, or public health are encouraged to reach out to us.
              </p>
              <p>
                We are especially seeking international interns and volunteers to support key areas such as proposal writing, fundraising, marketing, linking with various supporters, and communications, roles that directly help us expand our reach and strengthen our impact.
              </p>
              <p>
                If you are driven to grow, serve, and contribute to meaningful change, we would love to hear from you.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-[var(--shadow-card)]">
              <h3 className="text-2xl font-bold text-neutral-900 mb-5">What you can do</h3>
              <ul className="space-y-3">
                {focusAreas.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm md:text-base text-neutral-700 leading-7">
                    <FiCheckCircle size={16} className="text-primary-600 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-neutral-100 bg-gradient-to-br from-primary-50 to-white p-8 shadow-[var(--shadow-card)]">
              <h3 className="text-2xl font-bold text-neutral-900 mb-5">Priority support areas</h3>
              <ul className="space-y-3">
                {contributionAreas.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm md:text-base text-neutral-700 leading-7">
                    <FiCheckCircle size={16} className="text-emerald-600 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-neutral-50">
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
