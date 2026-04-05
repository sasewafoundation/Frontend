import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiUsers, FiMapPin, FiCheck } from 'react-icons/fi';
import api from '../../services/api';
import { getMediaUrl } from '../../utils/mediaUrl';

/* ── Animated counter ── */
const useCounter = (end, duration = 2200) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      let start = 0;
      const step = end / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(timer); }
        else setCount(Math.ceil(start));
      }, 16);
      observer.disconnect();
    }, { threshold: 0.15 });
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return { count, nodeRef };
};

/* ── Scroll-reveal hook ── */
const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs]       = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [pR, sR, bR] = await Promise.all([
          api.get('/projects'), api.get('/sponsors'), api.get('/blog')
        ]);
        setProjects(pR.data.data?.slice(0, 3) || []);
        setSponsors(sR.data.data || []);
        setBlogs(bR.data.data?.slice(0, 3) || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const c1 = useCounter(25);
  const c2 = useCounter(300);
  const c3 = useCounter(12);
  const c5 = useCounter(4800);

  const kpiReveal  = useReveal();
  const aboutReveal = useReveal();
  const projReveal  = useReveal();
  const blogReveal  = useReveal();

  return (
    <div className="w-full overflow-x-hidden">

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO — refined storytelling */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=85"
            alt="Rural community life in Nepal"
            className="w-full h-full object-cover object-center"
            onLoad={() => setHeroLoaded(true)}
            style={{ filter: 'brightness(0.8) saturate(0.9) blur(0.6px)' }}
          />
          {/* Subtle readability layer */}
          <div className="absolute inset-0 bg-black/18" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-20 lg:pt-32 lg:pb-24">
          <div
            className="max-w-3xl transition-all duration-700"
            style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)' }}
          >
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-[4.35rem] font-bold text-white leading-[1.05] tracking-tight mb-6">
              Standing with{' '}
              <span
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(135deg, #e4a62b 0%, #db5f1f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Nepalese communities
              </span>
              <br />
              through practical local action.
            </h1>

            <p className="text-lg text-white/80 font-normal leading-relaxed mb-10 max-w-2xl">
              We partner with villages, schools, and local families to support education,
              health, and community resilience where support is needed most.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Link to="/donation" className="btn-primary text-base px-8 py-4 shadow-[0_12px_28px_-12px_rgba(196,74,16,0.62)]">
                Support Our Work <FiArrowRight size={16} />
              </Link>
              <Link to="/projects" className="btn-ghost text-base px-8 py-4">
                See Our Impact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      </section>


      {/* ═══════════════════════════════════════════════ */}
      {/* KPI STATS                                      */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-white" ref={kpiReveal.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-neutral-100 rounded-3xl overflow-hidden shadow-[var(--shadow-soft)]">
            {[
              {
                hook: c1, suffix: '+', label: 'Projects',
                sub: 'Community-led initiatives',
                icon: <FiHeart size={20} />,
                color: 'text-primary-600',
                bg: 'bg-primary-50',
              },
              {
                hook: c2, suffix: '+', label: 'Volunteers',
                sub: 'Active throughout the year',
                icon: <FiUsers size={20} />,
                color: 'text-accent-gold',
                bg: 'bg-amber-50',
              },
              {
                hook: c3, suffix: '+', label: 'Villages',
                sub: 'Across rural Nepal',
                icon: <FiMapPin size={20} />,
                color: 'text-accent-teal',
                bg: 'bg-lime-50',
              },
              {
                hook: c5, suffix: '+', label: 'People Helped',
                sub: 'Across health, education, relief',
                icon: <FiHeart size={20} />,
                color: 'text-primary-700',
                bg: 'bg-primary-100',
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`bg-white p-8 lg:p-10 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] ${
                  kpiReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-11 h-11 ${s.bg} ${s.color} flex items-center justify-center rounded-2xl`}>
                  {s.icon}
                </div>
                <div ref={s.hook.nodeRef} className="text-[2.8rem] font-bold text-neutral-900 leading-none tracking-tight tabular-nums">
                  {s.hook.count.toLocaleString()}{s.suffix}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-neutral-800 mb-1">{s.label}</div>
                  <div className="text-[13px] text-neutral-400 leading-snug">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════ */}
      {/* ABOUT PREVIEW                                  */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-neutral-50" ref={aboutReveal.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image collage */}
            <div
              className={`relative transition-all duration-700 ${aboutReveal.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[var(--shadow-float)]">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80"
                  alt="Children learning at a Sa-Sewa programme"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Floating info card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-[var(--shadow-card)] p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shrink-0">
                    <FiCheck size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Independent & Transparent</div>
                    <div className="text-xs text-neutral-500 mt-0.5">100% volunteer-led · No hidden overhead</div>
                  </div>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-600/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent-teal/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Text */}
            <div
              className={`transition-all duration-700 delay-200 ${aboutReveal.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            >
              <span className="section-label">Who we are</span>
              <h2 className="section-title mb-6">
                Born from community.<br />Built for people.
              </h2>
              <p className="text-base text-neutral-600 leading-[1.85] mb-5">
                Sa-Sewa was founded by a group of Nepali changemakers who saw first-hand the gap between 
                international aid and real community needs. We don't operate from boardrooms — we work in 
                classrooms, clinics, and kitchens alongside the people we serve.
              </p>
              <p className="text-base text-neutral-600 leading-[1.85] mb-10">
                Our programmes focus on education, basic healthcare, and disaster relief in underserved 
                rural areas. Every effort is volunteer-led, community-driven, and transparently reported.
              </p>

              {/* Feature list */}
              <ul className="space-y-3 mb-10">
                {[
                  'Education & literacy for rural children',
                  'Free health camps across 12 villages',
                  'Disaster response & relief distribution',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                      <FiCheck size={11} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link to="/about" className="btn-primary">
                Our Story <FiArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════ */}
      {/* SPONSORS STRIP                                 */}
      {/* ═══════════════════════════════════════════════ */}
      {sponsors.length > 0 && (
        <section className="py-14 bg-white border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-10">
              Supported By
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
              {sponsors.map(s => (
                <a
                  key={s._id}
                  href={s.websiteUrl || '#'}
                  target={s.websiteUrl ? '_blank' : '_self'}
                  rel={s.websiteUrl ? 'noreferrer' : undefined}
                  className="group flex items-center justify-center h-20 min-w-36 px-6 rounded-2xl border border-neutral-100 bg-white shadow-sm hover:shadow-[var(--shadow-card)] transition-all duration-300"
                  aria-label={s.name}
                >
                  {s.logo ? (
                    <img src={getMediaUrl(s.logo)} alt={s.name} className="max-h-12 max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-sm font-semibold text-neutral-500 group-hover:text-primary-700 transition-colors">{s.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════ */}
      {/* FEATURED PROJECTS                              */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-white" ref={projReveal.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-14">
            <div
              className={`transition-all duration-600 ${projReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="section-label">Our Work</span>
              <h2 className="section-title">Initiatives making<br />a real difference.</h2>
            </div>
            <Link
              to="/projects"
              className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1.5 transition-colors shrink-0 group"
            >
              All projects <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj, i) => (
                <Link
                  to={`/projects/${proj.slug || proj._id}`}
                  key={proj._id}
                  className={`group card flex flex-col h-full transition-all duration-500 ${
                    projReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={proj.images?.[0] || `https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80`}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className={`absolute top-4 left-4 pill text-[10px] ${
                      proj.status?.toLowerCase() === 'completed'
                        ? 'bg-emerald-500/90 text-white border-0 backdrop-blur-sm'
                        : 'bg-primary-600/90 text-white border-0 backdrop-blur-sm'
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-base font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 flex-grow">
                      {proj.description}
                    </p>
                    <div className="mt-5 pt-5 border-t border-neutral-100 flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5 transition-all">
                      Learn more <FiArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-neutral-200">
              <p className="text-sm text-neutral-400">Projects loading…</p>
            </div>
          )}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════ */}
      {/* LATEST STORIES (BLOG)                         */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-neutral-50 border-t border-neutral-100" ref={blogReveal.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-14">
            <div
              className={`transition-all duration-600 ${blogReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="section-label">Stories & Updates</span>
              <h2 className="section-title">From the field.</h2>
            </div>
            <Link
              to="/blog"
              className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1.5 transition-colors shrink-0 group"
            >
              All articles <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post, i) => (
                <Link
                  to={`/blog/${post.slug || post._id}`}
                  key={post._id}
                  className={`group card flex flex-col h-full transition-all duration-500 ${
                    blogReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image
                        ? getMediaUrl(post.image)
                        : 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                      {new Date(post.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="text-[15px] font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2 flex-grow">
                      {post.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 mt-2">
                      {post.content?.substring(0, 120)}…
                    </p>
                    <div className="mt-5 pt-5 border-t border-neutral-100 flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5 transition-all">
                      Read article <FiArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-neutral-200 rounded-2xl">
              <p className="text-sm text-neutral-400">No articles yet — check back soon.</p>
            </div>
          )}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════ */}
      {/* DONATE CTA BANNER                             */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden bg-primary-950">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=60"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-primary-800/70" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-gold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-semibold text-primary-300 uppercase tracking-[0.18em] border border-primary-700 bg-primary-900/50 rounded-full px-4 py-1.5 mb-8">
            Transparent · Accountable · Impactful
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.08]">
            Your generosity<br />changes real lives.
          </h2>
          <p className="text-lg text-primary-200/80 font-normal mb-12 max-w-xl mx-auto leading-relaxed">
            Every rupee reaches our field programmes — no hidden fees, no corporate overhead.
            Just direct, measurable impact in Nepal's communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donation" className="btn-white text-base px-9 py-4">
              Donate Now <FiArrowRight size={16} />
            </Link>
              <Link to="/join-us" className="btn-ghost text-base px-9 py-4">
              Join Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
