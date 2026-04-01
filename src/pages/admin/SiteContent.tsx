import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Settings, Phone, Mail, MapPin, MessageSquare, Globe, Image as ImageIcon, Target, TrendingUp, BookOpen } from 'lucide-react';
import { db, doc, onSnapshot, setDoc, OperationType, handleFirestoreError } from '../../firebase';
import { SiteContent } from '../../types';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';

export default function AdminSiteContent() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SiteContent>();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_content', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        reset(snapshot.data() as SiteContent);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [reset]);

  const onSubmit = async (data: SiteContent) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'site_content', 'settings'), data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'site_content/settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Site Content</h1>
          <p className="text-gray-500">Manage global text, contact info, and site settings.</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="bg-primary text-bg-dark px-8 py-3 rounded-xl font-bold glow-gold hover:bg-primary-light transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <div className="w-5 h-5 border-2 border-bg-dark border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-center font-bold"
        >
          Settings updated successfully!
        </motion.div>
      )}

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-bg-card border border-white/5 p-8 rounded-[32px] space-y-6">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Globe size={20} className="text-primary" /> Hero Section
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hero Title</label>
              <input
                {...register('heroTitle')}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hero Subtitle</label>
              <textarea
                {...register('heroSubtitle')}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Logo URL</label>
              <input
                {...register('logoUrl')}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-bg-card border border-white/5 p-8 rounded-[32px] space-y-6">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Phone size={20} className="text-primary" /> Contact Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Phone Number</label>
                <input
                  {...register('contactPhone')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">WhatsApp Number</label>
                <input
                  {...register('whatsappNumber')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Email Address</label>
              <input
                {...register('contactEmail')}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Office Address</label>
              <textarea
                {...register('contactAddress')}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Google Maps Embed URL</label>
              <input
                {...register('googleMapsUrl')}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* About Section Content */}
        <div className="bg-bg-card border border-white/5 p-8 rounded-[32px] space-y-6 lg:col-span-2">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-primary" /> About Us Content
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Target size={14} className="text-primary" /> Vision
              </label>
              <textarea
                {...register('vision')}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" /> Mission
              </label>
              <textarea
                {...register('mission')}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Settings size={14} className="text-primary" /> Philosophy
              </label>
              <textarea
                {...register('philosophy')}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
