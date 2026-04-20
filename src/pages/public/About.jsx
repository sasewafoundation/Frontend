import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart } from 'react-icons/fi';
import Seo from '../../components/Seo';

const values = [
  {
    title: 'Service to Communities',
    text: 'We put people, especially the most vulnerable and disadvantaged, at the heart of everything we do.',
  },
  {
    title: 'Accountability',
    text: 'We act with honesty, transparency, and responsibility, and use resources wisely.',
  },
  {
    title: 'Solidarity and Inclusion',
    text: 'We ensure fairness and equal opportunities for all, especially the most vulnerable and marginalised.',
  },
  {
    title: 'Empathy and Compassion',
    text: 'We respond with urgency, respect, and empathy, protecting people’s dignity and well-being.',
  },
  {
    title: 'Wisdom through Learning',
    text: 'We combine local knowledge with new ideas to create practical solutions that last.',
  },
  {
    title: 'Action for Sustainability',
    text: 'We turn values into action by building livelihoods, protecting the environment, and fostering resilience.',
  },
];

const principles = [
  {
    title: 'Put communities first',
    text: 'We listen to people and let their voices guide our work. Real change happens when communities lead.',
  },
  {
    title: 'Include everyone',
    text: 'We focus on disadvantaged, excluded, and vulnerable groups so no one is left behind.',
  },
  {
    title: 'Act openly and responsibly',
    text: 'We use resources wisely, stay transparent, and take responsibility for results.',
  },
  {
    title: 'Strengthen local leadership and learning',
    text: 'We build local skills and knowledge while adapting with new ideas so solutions are practical and lasting.',
  },
  {
    title: 'Build lasting resilience',
    text: 'We support livelihoods, protect the environment, and prepare communities for future challenges.',
  },
  {
    title: 'Work together and honour service',
    text: 'We collaborate with government, partners, and communities, recognizing those who contribute to social change.',
  },
];

const About = () => {
  return (
    <div className="bg-white w-full overflow-hidden">
      <Seo title="About Us" description="Sa Sewa Foundation Nepal is a not-for-profit organization working to improve the well-being of communities through education, health, livelihoods, and resilience." />

      <section className="relative pt-32 pb-20 px-6 bg-white overflow-hidden border-b border-neutral-100">
        <div className="absolute top-0 right-0 w-[560px] h-[560px] bg-primary-50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none opacity-80" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-amber-50 rounded-full blur-3xl -translate-x-1/4 translate-y-1/3 pointer-events-none opacity-80" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <span className="pill-primary mb-7">Sa Sewa Foundation</span>
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight mb-6 leading-tight">
              Sa Sewa Foundation
            </h1>
            <div className="space-y-5 text-base md:text-lg text-neutral-600 leading-[1.9] max-w-3xl">
              <p>
                Sa Sewa Foundation Nepal is a not-for-profit organization working to improve the well-being of communities by using resources wisely, promoting fairness, and encouraging collaboration. It is registered under Nepal’s Company Act 2063 and follows the guidelines of the Social Welfare Council (SWC), along with local government and tax regulations, ensuring accountability and transparency.
              </p>
              <p>
                Operating within Nepal’s legal framework, the Foundation supports community development and social welfare initiatives in partnership with authorities and stakeholders. Guided by its mission, Sa Sewa works closely with communities to advance education, health, livelihoods, and resilience helping people live better, grow stronger, and find more opportunities through its programs and services.
              </p>
            </div>

          </div>

          <div className="relative">
            <div className="aspect-[5/4] rounded-[2rem] overflow-hidden shadow-[var(--shadow-float)]">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
                alt="Sa Sewa Foundation community work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-3xl border border-neutral-100 shadow-[var(--shadow-card)] px-6 py-5 max-w-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shrink-0">
                  <FiHeart size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900 mb-1">Community-led</div>
                  <div className="text-sm text-neutral-500 leading-6">Programs designed with communities, partners, and local stakeholders.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="section-label block text-center">Vision · Mission · Goal</span>
            <h2 className="section-title mb-6">The direction behind the work.</h2>
            <p className="text-base md:text-lg text-neutral-600 leading-[1.9] max-w-3xl mx-auto">
              These three commitments shape how Sa Sewa serves communities across Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                tag: 'Vision',
                title: 'A compassionate society where everyone is included and empowered to thrive.',
                text: 'We imagine a Nepal where dignity, opportunity, and belonging are available to every person and every community.',
                accent: 'from-primary-50 via-white to-white',
                tagClass: 'bg-primary-600 text-white shadow-[0_10px_20px_-10px_rgba(195,76,16,0.55)]',
              },
              {
                tag: 'Mission',
                title: 'Partner with communities in advancing education, health, resilience, and livelihoods.',
                text: 'We work alongside communities to build practical, lasting change through shared effort and trusted partnerships.',
                accent: 'from-amber-50 via-white to-white',
                tagClass: 'bg-amber-500 text-white shadow-[0_10px_20px_-10px_rgba(217,119,6,0.55)]',
              },
              {
                tag: 'Goal',
                title: 'Enhance well-being, resilience, and opportunities through integrated programs and services.',
                text: 'We focus on connected support that helps people live better, grow stronger, and access more opportunities.',
                accent: 'from-lime-50 via-white to-white',
                tagClass: 'bg-emerald-600 text-white shadow-[0_10px_20px_-10px_rgba(5,150,105,0.45)]',
              },
            ].map((item) => (
              <div key={item.tag} className={`relative overflow-hidden rounded-[2rem] border border-neutral-100 bg-gradient-to-br ${item.accent} p-9 lg:p-10 min-h-[320px] flex flex-col shadow-[var(--shadow-card)]`}>
                <div className="absolute top-0 right-0 w-44 h-44 bg-white/40 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] mb-8 w-fit ${item.tagClass}`}>
                  {item.tag}
                </div>
                <h3 className="text-2xl lg:text-[1.9rem] font-bold text-neutral-900 tracking-tight leading-tight mb-5 max-w-[18ch]">
                  {item.title}
                </h3>
                <p className="text-base text-neutral-600 leading-8 max-w-[34ch]">
                  {item.text}
                </p>
                <div className="mt-auto pt-10">
                  <div className="h-px w-16 bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="section-label block text-center">Sa Sewa Core Values</span>
            <h2 className="section-title mb-6">Values that shape how we serve.</h2>
            <p className="text-base text-neutral-600 leading-[1.9]">
              These values guide decisions, partnerships, and the way the Foundation engages with communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {values.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-neutral-100 bg-neutral-50 p-7 shadow-[var(--shadow-card)]">
                <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-primary-600 via-amber-500 to-emerald-600 mb-6" />
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 mb-4">
                  Guiding value
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 leading-tight">{item.title}</h3>
                <p className="text-base text-neutral-600 leading-7">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="section-label block text-center">Our Principles</span>
            <h2 className="section-title mb-6">How we work every day.</h2>
            <p className="text-base text-neutral-600 leading-[1.9]">
              Our principles turn the Foundation’s values into practical commitments.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl pl-0 md:pl-10">
            <div className="absolute left-5 top-2 bottom-2 hidden md:block w-px bg-neutral-200" />
            {principles.map((item, index) => (
              <div key={item.title} className={`relative mb-5 md:mb-6 rounded-[2rem] border border-neutral-100 bg-white p-7 shadow-[var(--shadow-card)] ${index === principles.length - 1 ? 'mb-0' : ''}`}>
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-semibold shadow-[0_10px_20px_-10px_rgba(196,74,16,0.45)]">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="absolute left-1/2 top-11 hidden md:block h-[calc(100%+1.5rem)] w-px -translate-x-1/2 bg-neutral-200" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{item.title}</h3>
                    <p className="text-base text-neutral-600 leading-7">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-0.5 bg-primary-200 rounded-full mx-auto mb-10" />
          <blockquote className="text-2xl md:text-3xl font-semibold text-neutral-800 leading-[1.6] mb-8 italic">
            “Working with communities through service, accountability, and inclusion is how lasting change takes root.”
          </blockquote>
          <Link to="/join-us" className="btn-primary">
            Join Our Team <FiArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
