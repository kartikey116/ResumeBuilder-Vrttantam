import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../utils/axiosinstance.js';
import { UserContext } from '../../context/userContext.jsx';
import { FiHeart, FiCopy, FiTrendingUp, FiArrowLeft, FiUsers, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

function TemplateGallery() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) || {};
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('trending');
  const [cloningId, setCloningId] = useState(null);
  const [likingId, setLikingId] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/templates?sort=${sort}&limit=24`);
      setTemplates(res.data.templates || []);
    } catch (error) {
      toast.error('Failed to load templates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [sort]);

  const handleClone = async (templateId) => {
    if (!user) {
      toast.error('Please log in to clone templates.');
      navigate('/login');
      return;
    }
    setCloningId(templateId);
    try {
      const res = await axiosInstance.post(`/api/templates/${templateId}/clone`);
      toast.success('Template cloned to your Dashboard!');
      navigate(`/resume/${res.data.resumeId}`);
    } catch (error) {
      toast.error('Failed to clone template.');
    } finally {
      setCloningId(null);
    }
  };

  const handleLike = async (templateId) => {
    if (!user) {
      toast.error('Please log in to like templates.');
      navigate('/login');
      return;
    }
    setLikingId(templateId);
    try {
      const res = await axiosInstance.post(`/api/templates/${templateId}/like`);
      // Optimistic update
      setTemplates(prev => prev.map(t => 
        t._id === templateId ? { ...t, likes: res.data.likes } : t
      ));
    } catch (error) {
      toast.error('Failed to like template.');
    } finally {
      setLikingId(null);
    }
  };

  const trendingTop3 = templates.slice(0, 3);
  const rest = templates.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f18] to-[#0a0a0c] text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-700/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-xl border border-white/10">
              <FiArrowLeft /> Dashboard
            </button>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                Community{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Gallery</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <FiUsers className="text-purple-400" />
                AI-anonymized templates from real professionals
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSort('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${sort === 'trending' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <FiTrendingUp /> Trending
            </button>
            <button
              onClick={() => setSort('newest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${sort === 'newest' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <FiStar /> Newest
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400">Loading community templates...</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="text-6xl">🎨</div>
            <h3 className="text-2xl font-bold text-gray-300">No templates yet!</h3>
            <p className="text-gray-500 max-w-md">Be the first to publish. Go to Dashboard, click "Publish" on any resume, and let AI anonymize and share your design.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Trending Podium Top 3 */}
            {sort === 'trending' && trendingTop3.length > 0 && (
              <section className="mb-12">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-300 mb-6">
                  <FiTrendingUp className="text-amber-400" /> Top Trending
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingTop3.map((template, i) => (
                    <TemplateCard
                      key={template._id}
                      template={template}
                      rank={i + 1}
                      onClone={handleClone}
                      onLike={handleLike}
                      cloningId={cloningId}
                      likingId={likingId}
                      featured
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Rest of the Gallery */}
            {rest.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-300 mb-6">All Templates</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {(sort === 'trending' ? rest : templates).map(template => (
                    <TemplateCard
                      key={template._id}
                      template={template}
                      onClone={handleClone}
                      onLike={handleLike}
                      cloningId={cloningId}
                      likingId={likingId}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- Template Card Component ---
function TemplateCard({ template, rank, onClone, onLike, cloningId, likingId, featured }) {
  const name = template.anonymizedData?.profileInfo?.fullName || 'Professional';
  const designation = template.anonymizedData?.profileInfo?.designation || 'Role';
  const skills = template.anonymizedData?.skills?.slice(0, 3) || [];
  const experience = template.anonymizedData?.workExperience?.length || 0;

  const rankColors = { 1: 'from-amber-500 to-yellow-400', 2: 'from-slate-400 to-slate-300', 3: 'from-amber-700 to-amber-600' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative bg-white/5 border rounded-2xl overflow-hidden transition-all ${featured ? 'border-white/15' : 'border-white/8'}`}
    >
      {/* Rank Badge */}
      {rank && (
        <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-gradient-to-r ${rankColors[rank] || 'from-purple-500 to-pink-500'} flex items-center justify-center text-xs font-black text-white shadow-lg`}>
          #{rank}
        </div>
      )}

      {/* Template Preview Panel */}
      <div className="h-40 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-b border-white/5 p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <div className="h-2 w-24 rounded-full bg-white/30 mb-2" />
          <div className="h-1.5 w-16 rounded-full bg-purple-400/50 mb-3" />
          <div className="space-y-1">
            <div className="h-1 w-full rounded-full bg-white/10" />
            <div className="h-1 w-4/5 rounded-full bg-white/10" />
            <div className="h-1 w-3/5 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="flex gap-1 relative z-10">
          {skills.map((s, i) => (
            <span key={i} className="bg-purple-600/40 text-purple-200 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-purple-500/30">
              {typeof s === 'string' ? s : s.name}
            </span>
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="mb-3">
          <p className="font-bold text-white text-sm leading-tight">{name}</p>
          <p className="text-gray-400 text-xs">{designation}</p>
          <p className="text-gray-600 text-[10px] mt-1">{experience} experience entries</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <FiCopy size={10} className="text-blue-400" /> {template.cloneCount} clones
          </span>
          <span className="text-gray-600">by {template.creatorName}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onLike(template._id)}
            disabled={likingId === template._id}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 text-pink-400 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
          >
            <FiHeart size={11}/> {template.likes}
          </button>
          <button
            onClick={() => onClone(template._id)}
            disabled={cloningId === template._id}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all"
          >
            <FiCopy size={11}/>
            {cloningId === template._id ? 'Cloning...' : 'Use Template'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default TemplateGallery;
