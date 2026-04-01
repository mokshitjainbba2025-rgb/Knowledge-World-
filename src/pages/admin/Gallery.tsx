import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, ImageIcon, Play, Camera, Filter } from 'lucide-react';
import { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, OperationType, handleFirestoreError } from '../../firebase';
import { GalleryItem } from '../../types';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';

const categories = ["Classroom", "Results", "Trips", "Events"];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GalleryItem>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: GalleryItem) => {
    try {
      const payload = {
        ...data,
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString()
      };
      if (editingItem) {
        await updateDoc(doc(db, 'gallery', editingItem.id), payload);
      } else {
        await addDoc(collection(db, 'gallery'), payload);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'gallery');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'gallery', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'gallery');
      }
    }
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    reset(item);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingItem(null);
    reset({ type: 'image', category: 'Classroom' } as GalleryItem);
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
          <h1 className="text-3xl font-display font-bold text-white">Manage Gallery</h1>
          <p className="text-gray-500">Upload photos and videos of institute life.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-bold glow-gold hover:bg-primary-light transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add Media
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-gray-500">Loading gallery...</div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-bg-card border border-white/5 rounded-3xl overflow-hidden group hover:border-primary/30 transition-all aspect-square relative"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-bg-dark/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-3 bg-primary text-bg-dark rounded-xl glow-gold transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-500 text-white rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-white font-bold text-sm truncate w-full text-center">{item.title || item.category}</p>
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{item.category}</p>
              </div>
              {item.type === 'video' && (
                <div className="absolute top-4 right-4 bg-primary text-bg-dark p-1.5 rounded-full glow-gold">
                  <Play size={12} fill="currentColor" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-white/5 text-gray-500">
            No media found. Click "Add Media" to get started.
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
                  {editingItem ? 'Edit Media' : 'Add New Media'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Title (Optional)</label>
                    <input
                      {...register('title')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Category</label>
                    <select
                      {...register('category', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      {categories.map(cat => <option key={cat} value={cat} className="bg-bg-dark">{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Media Type</label>
                    <select
                      {...register('type', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="image" className="bg-bg-dark">Image</option>
                      <option value="video" className="bg-bg-dark">Video (YouTube URL)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Media URL</label>
                    <input
                      {...register('url', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-bg-dark py-4 rounded-xl font-bold text-lg glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingItem ? 'Update Media' : 'Add Media'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
