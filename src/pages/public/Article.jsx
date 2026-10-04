import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FiClock, FiUser, FiArrowLeft, FiShare2, FiYoutube, FiImage, FiCheck } from 'react-icons/fi';
import { getMediaUrl } from '../../utils/mediaUrl';
import Seo from '../../components/Seo';
// FIX 2: Import sanitizeHtml utility to prevent stored XSS
import { sanitizeHtml } from '../../utils/sanitize';

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
  // FIX 19: Share state confirmation
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

  // FIX 19: Web Share API or Clipboard copy with feedback
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
    return (
      <>
        <Seo title="Blog Article" description="Loading the latest Sa-Sewa Foundation story." />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-sm text-neutral-500">Loading article...</div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Seo title="Article not found" description="The requested Sa-Sewa Foundation story could not be found." />
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4 tracking-tight">Article Not Found</h2>
          <p className="text-neutral-500 mb-8 max-w-md">
            The story you are looking for may have been archived or moved.
          </p>
          <Link to="/blog" className="btn-primary">
            Return to Blog
          </Link>
        </div>
      </>
    );
  }

  // FIX 2: Apply markdown-style formatting and sanitize with DOMPurify
  const formattedContent = (post.content || '')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/_(.*?)_/g, '<i>$1</i>');
  const safeContent = sanitizeHtml(formattedContent);

  return (
    <div className="min-h-screen bg-white pb-24">
      <Seo
        title={post?.title || 'Blog Article'}
        description={post?.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 160) : 'Read the latest Sa-Sewa Foundation story.'}
      />
      <header className="bg-white">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-700 mb-8 group transition-all text-sm font-medium">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>

          <p className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-[10px] font-bold uppercase tracking-widest text-primary-700 mb-6 border border-primary-100">
            Stories & Updates
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mt-4 mb-5 text-neutral-950 max-w-3xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-neutral-500 text-sm font-semibold tracking-wide pt-4">
            <span className="flex items-center gap-2">
              <FiUser className="text-primary-700" /> {post.author || 'Sa-Sewa Team'}
            </span>
            <span className="flex items-center gap-2">
              <FiClock className="text-primary-700" />
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      <section className="px-6 pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl bg-neutral-50 border border-neutral-100 shadow-sm">
            <div className="relative aspect-[16/9] bg-neutral-100">
              <img
                src={getMediaUrl(post.image) || fallbackArticleImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 pt-10">
        <div className="max-w-none prose-article">
          {/* FIX 2: Render purified HTML */}
          <div
            className="whitespace-pre-wrap text-[17px] md:text-[18px] leading-8 text-neutral-700"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </div>

        {post.images && post.images.length > 0 && (
          <div className="mt-14 space-y-6">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary-700">
              <FiImage /> Field Gallery
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 relative group border border-neutral-100 shadow-sm">
                  <img
                    src={getMediaUrl(img)}
                    alt={`Field Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {post.youtubeLink && (
          <div className="mt-16 overflow-hidden rounded-2xl bg-neutral-50 p-6 border border-neutral-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-600 mb-4">
              <FiYoutube className="text-red-500" /> Video Field Documentation
            </div>
            <div className="aspect-video overflow-hidden rounded-xl bg-black">
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

        <footer className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-lg">
              S
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Published by</p>
              <p className="text-sm font-semibold text-neutral-900">Sa-Sewa Foundation</p>
            </div>
          </div>

          {/* FIX 19: Working Share button with feedback */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2.5 px-6 py-3 bg-white text-neutral-800 rounded-full border border-neutral-200 text-sm font-semibold hover:border-primary-600 hover:text-primary-700 transition-all shadow-sm"
          >
            {shareCopied ? (
              <>
                <FiCheck className="text-emerald-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <FiShare2 />
                <span>Share This Article</span>
              </>
            )}
          </button>
        </footer>
      </article>
    </div>
  );
};

export default Article;
