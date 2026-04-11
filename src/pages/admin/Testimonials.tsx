import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, MessageSquare, Star, Play } from 'lucide-react';
import { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, OperationType, handleFirestoreError } from '../../firebase';
import { Testimonial } from '../../types';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Testimonial>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: Testimonial) => {
    try {
      // Sanitize data to remove 'id' before sending to Firestore
      const { id, ...sanitizedData } = data as any;
      const payload = {
        ...sanitizedData,
        rating: Number(data.rating) || 5
      };
      if (editingTestimonial) {
        await updateDoc(doc(db, 'testimonials', editingTestimonial.id), payload);
      } else {
        await addDoc(collection(db, 'testimonials'), payload);
      }
      setIsModalOpen(false);
      setEditingTestimonial(null);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'testimonials');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'testimonials');
      }
    }
  };

  const openEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    reset(t);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingTestimonial(null);
    reset({ rating: 5 } as Testimonial);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Testimonials</h1>
          <p className="text-gray-500">Manage student and parent feedback.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-bold glow-gold hover:bg-primary-light transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-gray-500">Loading testimonials...</div>
        ) : testimonials.length > 0 ? (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-bg-card border border-white/5 p-8 rounded-[32px] group hover:border-primary/30 transition-all relative flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{t.name}</h4>
                    <p className="text-primary text-[10px] uppercase font-bold tracking-widest">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-2 text-gray-500 hover:text-primary transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="text-gray-400 text-sm italic mb-6 line-clamp-4 flex-grow">"{t.content}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={cn(i < (t.rating || 5) ? "fill-primary text-primary" : "text-gray-700")} />
                  ))}
                </div>
                {t.videoUrl && <Play size={14} className="text-primary" />}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-white/5 text-gray-500">
            No testimonials found. Click "Add Testimonial" to get started.
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-dark/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-bg-card border border-primary/20 rounded-[40px] p-10 glow-gold overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-white">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Name</label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Role (e.g. Student, Parent)</label>
                    <input
                      {...register('role')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      {...register('rating')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Video URL (Optional)</label>
                    <input
                      {...register('videoUrl')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Testimonial Content</label>
                  <textarea
                    {...register('content', { required: true })}
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-bg-dark py-4 rounded-xl font-bold text-lg glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
