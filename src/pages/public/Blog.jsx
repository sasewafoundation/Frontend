import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiArrowRight, FiSearch, FiX } from 'react-icons/fi';
import { getMediaUrl } from '../../utils/mediaUrl';
import Seo from '../../components/Seo';
import LogoLoader from '../../components/LogoLoader';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/blog')
      .then((r) => setPosts(r.data.data || []))
      .catch((e) => console.error('Failed to load articles:', e))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase().trim();
    return posts.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.content && p.content.toLowerCase().includes(query)) ||
        (p.author && p.author.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  const getReadingTime = (content) => {
    if (!content) return 2;
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (loading) {
    return <LogoLoader message="Loading blog stories..." />;
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <Seo title="Stories & Updates" description="Read field stories, project updates, and chronicles from Sa-Sewa Foundation Nepal." />

      {/* ── Header: Clean & Simple ── */}
      <header className="pt-28 md:pt-36 pb-10 border-b border-neutral-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#c44a10] tracking-tight mb-3">
                Stories & Field Updates
              </h1>
              <p className="text-base text-neutral-600 max-w-xl leading-relaxed">
                First-hand accounts of community empowerment, transparent action, and grassroots work across Nepal.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full md:w-80 shrink-0">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={17} />
              <input
                type="text"
                placeholder="Search stories by title, topic…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-[#c44a10] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label="Clear search"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Stories Listing: Uniform Grid ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200">
            <p className="text-base font-medium text-neutral-600">No stories published yet.</p>
            <p className="text-sm text-neutral-400 mt-1">Please check back soon for updates from our field teams.</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 max-w-md mx-auto">
            <p className="text-base font-semibold text-neutral-800 mb-2">No matching stories found</p>
            <p className="text-sm text-neutral-500 mb-5">
              No articles match &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:border-[#c44a10] hover:text-[#c44a10] transition-colors"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post._id}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-[#c44a10]/40 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Article Image */}
                <Link
                  to={`/blog/${post.slug || post._id}`}
                  className="block relative aspect-[16/10] overflow-hidden bg-neutral-100"
                >
                  <img
                    src={getMediaUrl(post.image) || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>

                {/* Article Body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span>{getReadingTime(post.content)} min read</span>
                  </div>

                  <h2 className="text-lg font-bold text-neutral-900 group-hover:text-[#c44a10] transition-colors leading-snug mb-3 line-clamp-2">
                    <Link to={`/blog/${post.slug || post._id}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-neutral-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {post.content?.replace(/<[^>]*>/g, '').substring(0, 140)}...
                  </p>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-600 font-medium">
                      {post.author || 'Sa-Sewa Team'}
                    </span>
                    <Link
                      to={`/blog/${post.slug || post._id}`}
                      className="font-semibold text-[#c44a10] inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
                    >
                      Read story <FiArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
