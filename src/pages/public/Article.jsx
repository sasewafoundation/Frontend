import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FiClock, FiUser, FiArrowLeft, FiShare2, FiYoutube, FiImage, FiCheck, FiBookOpen } from 'react-icons/fi';
import { getMediaUrl } from '../../utils/mediaUrl';
import Seo from '../../components/Seo';
import { sanitizeHtml } from '../../utils/sanitize';

import LogoLoader from '../../components/LogoLoader';

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const idMatch = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/) || url.match(/embed\/([^?&]+)/);
  const videoId = idMatch?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url.replace('watch?v=', 'embed/');
};

const fallbackArticleImage = 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=80';

const Article = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const isId = /^[0-9a-fA-F]{24}$/.test(slug);
        const endpoint = isId ? `/blog/${slug}` : `/blog/s/${slug}`;
        const res = await api.get(endpoint);
        setPost(res.data.data);
      } catch (err) {
        console.error('Narrative retrieval failure:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const readingTime = useMemo(() => {
    if (!post?.content) return 2;
    const wordCount = post.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [post?.content]);

  const handleShare = async () => {
    const shareData = {
      title: post?.title || 'Sa-Sewa Foundation Story',
      text: post?.title,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  if (loading) {
    return <LogoLoader message="Loading story..." />;
  }

  if (!post) {
    return (
      <>
        <Seo title="Article not found" description="The requested Sa-Sewa Foundation story could not be found." />
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 pt-24 text-center">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">404</span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">Article Not Found</h2>
          <p className="text-neutral-500 mb-8 max-w-md text-base leading-relaxed">
            The story you are looking for may have been archived, renamed, or moved.
          </p>
          <Link to="/blog" className="btn-primary">
            <FiArrowLeft size={16} /> Return to All Stories
          </Link>
        </div>
      </>
    );
  }

  // Format markdown-like bold/italic and sanitize
  const formattedContent = (post.content || '')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/_(.*?)_/g, '<i>$1</i>');
  const safeContent = sanitizeHtml(formattedContent);

  return (
    <div className="min-h-screen bg-white pb-24">
      <Seo
        title={post.title || 'Blog Article'}
        description={post.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 160) : 'Read the latest Sa-Sewa Foundation story.'}
      />

      {/* ── Article Header: Wide layout with reduced margins ── */}
      <header className="pt-28 md:pt-36 pb-6 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Clean back link on left, plain text label on right (No capsule, No pulse effect) */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-[#c44a10] transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" size={16} />
              <span>Back to Blog</span>
            </Link>

            <span className="text-xs font-bold uppercase tracking-wider text-[#c44a10]">
              Community Story
            </span>
          </div>

          {/* Article Title: Styled in signature Sa-Sewa logo terracotta color (#c44a10) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#c44a10] tracking-tight leading-[1.2] mb-6">
            {post.title}
          </h1>

          {/* Authentic, human editorial byline (No AI-style pill chips or icon overload) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 text-sm text-neutral-500">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span>By <strong className="font-semibold text-neutral-900">{post.author || 'Sa-Sewa Team'}</strong></span>
              <span className="text-neutral-300">·</span>
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <span className="text-neutral-300">·</span>
              <span>{readingTime} min read</span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#c44a10] transition-colors"
              aria-label="Share story"
            >
              {shareCopied ? (
                <>
                  <FiCheck className="text-emerald-600" size={14} />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <FiShare2 size={14} />
                  <span>Share Story</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ── Featured Image: Wide container reducing left/right whitespace ── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
        <div className="max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-100 border border-neutral-200 shadow-xs">
            <div className="relative aspect-[16/9] w-full">
              <img
                src={getMediaUrl(post.image) || fallbackArticleImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Content: Generous reading container with reduced margins ── */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12">
        <div className="prose-article max-w-4xl">
          <div
            className="text-[17px] md:text-[18px] leading-[1.85] text-neutral-800 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </div>

        {/* ── Photo Gallery (if available) ── */}
        {post.images && post.images.length > 0 && (
          <div className="mt-16 pt-10 border-t border-neutral-100 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600">
              <FiImage size={15} /> Field Documentation Gallery
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 relative group border border-neutral-200/80 shadow-xs">
                  <img
                    src={getMediaUrl(img)}
                    alt={`Field Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Embedded Video (if available) ── */}
        {post.youtubeLink && (
          <div className="mt-16 overflow-hidden rounded-3xl bg-neutral-50 p-6 md:p-8 border border-neutral-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-700 mb-4">
              <FiYoutube className="text-red-600" size={18} /> Video Field Documentation
            </div>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-sm">
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbedUrl(post.youtubeLink)}
                title="Field Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ── Natural Editorial Sign-off ── */}
        <footer className="mt-14 pt-8 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-neutral-600">
            Published by <span className="font-semibold text-neutral-900">Sa-Sewa Foundation Nepal</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-700 rounded-lg border border-neutral-300 text-sm font-semibold hover:border-[#c44a10] hover:text-[#c44a10] transition-colors"
            >
              {shareCopied ? (
                <>
                  <FiCheck className="text-emerald-600" size={15} />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <FiShare2 size={15} />
                  <span>Share Story</span>
                </>
              )}
            </button>

            <Link
              to="/blog"
              className="btn-primary text-sm py-2 px-5"
            >
              <FiArrowLeft size={15} /> All Stories
            </Link>
          </div>
        </footer>

      </article>
    </div>
  );
};

export default Article;
