import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, Users, Star, ArrowRight, Camera } from 'lucide-react';
import { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, OperationType, handleFirestoreError } from '../../firebase';
import { Faculty } from '../../types';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Faculty>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'faculty'), (snapshot) => {
      setFaculty(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faculty)).sort((a, b) => a.order - b.order));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: Faculty) => {
    try {
      // Sanitize data to remove 'id' before sending to Firestore
      const { id, ...sanitizedData } = data as any;
      const payload = { ...sanitizedData, order: Number(data.order) || faculty.length + 1 };

      if (editingFaculty) {
        await updateDoc(doc(db, 'faculty', editingFaculty.id), payload);
      } else {
        await addDoc(collection(db, 'faculty'), payload);
      }
      setIsModalOpen(false);
      setEditingFaculty(null);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'faculty');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await deleteDoc(doc(db, 'faculty', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'faculty');
      }
    }
  };

  const openEdit = (teacher: Faculty) => {
    setEditingFaculty(teacher);
    reset(teacher);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingFaculty(null);
    reset({ order: faculty.length + 1 } as Faculty);
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
          <h1 className="text-3xl font-display font-bold text-white">Manage Faculty</h1>
          <p className="text-gray-500">Add, edit, or remove teacher profiles.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-bold glow-gold hover:bg-primary-light transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New Faculty
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-gray-500">Loading faculty...</div>
        ) : faculty.length > 0 ? (
          faculty.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-bg-card border border-white/5 rounded-3xl overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={teacher.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500'}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => openEdit(teacher)}
                    className="p-2 bg-bg-dark/80 text-white hover:text-primary rounded-lg backdrop-blur-md transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="p-2 bg-bg-dark/80 text-white hover:text-red-500 rounded-lg backdrop-blur-md transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold text-lg">{teacher.name}</h3>
                <p className="text-primary text-xs font-bold uppercase tracking-widest">{teacher.qualification}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Exp: {teacher.experience}</span>
                  <span>Order: {teacher.order}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-white/5 text-gray-500">
            No faculty found. Click "Add New Faculty" to get started.
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
                  {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Full Name</label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Qualification</label>
                    <input
                      {...register('qualification')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Experience</label>
                    <input
                      {...register('experience')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Display Order</label>
                    <input
                      type="number"
                      {...register('order')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Photo URL</label>
                  <input
                    {...register('photoUrl')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Teaching Style</label>
                  <textarea
                    {...register('teachingStyle')}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-bg-dark py-4 rounded-xl font-bold text-lg glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingFaculty ? 'Update Faculty' : 'Create Faculty'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
