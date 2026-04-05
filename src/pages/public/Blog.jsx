import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import Seo from '../../components/Seo';

const Blog = () => {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog')
      .then(r => setPosts(r.data.data || []))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-sm text-neutral-500">Loading blog entries...</div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <Seo title="Blog" description="Read stories, updates, and reports from Sa-Sewa Foundation." />

      {/* ── Header ── */}
      <section className="pt-32 pb-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <span className="section-label">Stories & Updates</span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-5">
              Sa-Sewa Chronicles
            </h1>
            <p className="text-lg text-gray-500 font-normal leading-relaxed">
              First-hand stories of change, transparency, and progress from the communities we serve
              across Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-400">No articles published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="group card flex flex-col h-full"
                >
                  {/* Image */}
                  <Link to={`/blog/${post.slug || post._id}`} className="block relative aspect-[16/10] overflow-hidden">
                    <img
                      src={getMediaUrl(post.image) || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Read →
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1.5">
                        <FiClock size={12} />
                        {new Date(post.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {post.author && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span className="flex items-center gap-1.5">
                            <FiUser size={12} />
                            {post.author}
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug || post._id}`}>{post.title}</Link>
                    </h2>

                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-grow">
                      {post.content?.substring(0, 150)}...
                    </p>

                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <Link
                        to={`/blog/${post.slug || post._id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5 transition-all"
                      >
                        Read article <FiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
