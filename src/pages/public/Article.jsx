import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FiClock, FiUser, FiArrowLeft, FiShare2, FiYoutube, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaUrl';
import Seo from '../../components/Seo';

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const isId = /^[0-9a-fA-F]{24}$/.test(slug);
        const endpoint = isId ? `/blog/${slug}` : `/blog/s/${slug}`;
        const res = await api.get(endpoint);
        setPost(res.data.data);
      } catch (err) {
        console.error('Narrative retrieval failure:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

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
          <h2 className="text-4xl font-black text-neutral-900 mb-4 tracking-tighter">Article Not Found</h2>
          <p className="text-neutral-500 mb-8 max-w-md">
            The story you are looking for may have been archived or moved.
          </p>
          <Link to="/blog" className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-bold hover:scale-105 transition-all">
            Return to Blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white pb-24"
    >
      <Seo
        title={post?.title || 'Blog Article'}
        description={post?.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 160) : 'Read the latest Sa-Sewa Foundation story.'}
      />
      <header className="bg-white">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-700 mb-8 group transition-all text-sm font-medium">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>

          <p className="inline-flex items-center px-3 py-1 rounded-full bg-[#fff8f1] text-[10px] font-black uppercase tracking-[0.28em] text-primary-700 mb-6">
            Stories & Updates
          </p>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.04] mt-4 md:mt-8 mb-5 text-neutral-950 max-w-3xl"
          >
            {post.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-6 text-neutral-500 text-sm font-semibold tracking-wide pt-4">
            <span className="flex items-center gap-2">
              <FiUser className="text-primary-700" /> {post.author}
            </span>
            <span className="flex items-center gap-2">
              <FiClock className="text-primary-700" />
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      <section className="px-6 pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-[1.5rem] bg-neutral-50">
            <div className="relative aspect-[16/9] bg-neutral-100">
              <img
                src={getMediaUrl(post.image) || fallbackArticleImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 pt-10">
        <div className="px-0 py-0">
          <div className="max-w-none prose-article">
            <div
              className="whitespace-pre-wrap text-[17px] md:text-[18px] leading-8 text-neutral-700"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                  .replace(/_(.*?)_/g, '<i>$1</i>'),
              }}
            />
          </div>
        </div>

        {post.images && post.images.length > 0 && (
          <div className="mt-14 space-y-6">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary-700">
              <FiImage /> Related Photos
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-neutral-100 relative group">
                  <img
                    src={getMediaUrl(img)}
                    alt={`Field Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {post.youtubeLink && (
          <div className="mt-16 overflow-hidden rounded-[1.5rem] bg-neutral-50 p-0">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-neutral-600 mb-4">
              <FiYoutube className="text-red-500" /> Video
            </div>
            <div className="aspect-video overflow-hidden rounded-[1.25rem] bg-black">
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

        <footer className="mt-16 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-900 text-white flex items-center justify-center font-black text-lg">S</div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Published by</p>
              <p className="text-sm font-semibold text-gray-900">Sa-Sewa Foundation</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 rounded-full border border-[#eadfd4] font-semibold hover:border-primary-600 hover:text-primary-700 transition-all group">
            <FiShare2 className="group-hover:rotate-12 transition-transform" /> Share This Article
          </button>
        </footer>
      </article>
    </motion.div>
  );
};

export default Article;
