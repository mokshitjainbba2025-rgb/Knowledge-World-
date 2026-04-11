import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, Award, Star, CheckCircle2 } from 'lucide-react';
import { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, OperationType, handleFirestoreError } from '../../firebase';
import { Result } from '../../types';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';

export default function AdminResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Result>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'results'), (snapshot) => {
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: Result) => {
    try {
      // Sanitize data to remove 'id' before sending to Firestore
      const { id, ...sanitizedData } = data as any;
      const payload = { ...sanitizedData, isTopper: Boolean(data.isTopper) };

      if (editingResult) {
        await updateDoc(doc(db, 'results', editingResult.id), payload);
      } else {
        await addDoc(collection(db, 'results'), payload);
      }
      setIsModalOpen(false);
      setEditingResult(null);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'results');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await deleteDoc(doc(db, 'results', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'results');
      }
    }
  };

  const openEdit = (result: Result) => {
    setEditingResult(result);
    reset(result);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingResult(null);
    reset({ isTopper: false } as Result);
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
          <h1 className="text-3xl font-display font-bold text-white">Manage Results</h1>
          <p className="text-gray-500">Upload student achievements and toppers.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-bold glow-gold hover:bg-primary-light transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New Result
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-gray-500">Loading results...</div>
        ) : results.length > 0 ? (
          results.map((result) => (
            <div
              key={result.id}
              className="bg-bg-card border border-white/5 rounded-3xl overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={result.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=500'}
                  alt={result.studentName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => openEdit(result)}
                    className="p-2 bg-bg-dark/80 text-white hover:text-primary rounded-lg backdrop-blur-md transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="p-2 bg-bg-dark/80 text-white hover:text-red-500 rounded-lg backdrop-blur-md transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {result.isTopper && (
                  <div className="absolute top-4 left-4 bg-primary text-bg-dark p-2 rounded-full glow-gold">
                    <Star size={16} fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-lg">{result.studentName}</h3>
                  <span className="text-primary font-bold">{result.score}</span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{result.board} • {result.year}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-white/5 text-gray-500">
            No results found. Click "Add New Result" to get started.
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
                  {editingResult ? 'Edit Result' : 'Add New Result'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Student Name</label>
                    <input
                      {...register('studentName', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Score / Percentage</label>
                    <input
                      {...register('score', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Board (ICSE/CBSE/etc)</label>
                    <input
                      {...register('board')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Year</label>
                    <input
                      {...register('year')}
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
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Achievement / Story</label>
                  <textarea
                    {...register('achievement')}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <input
                    type="checkbox"
                    id="isTopper"
                    {...register('isTopper')}
                    className="w-5 h-5 accent-primary"
                  />
                  <label htmlFor="isTopper" className="text-white font-bold text-sm cursor-pointer">Mark as Star Performer (Topper)</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-bg-dark py-4 rounded-xl font-bold text-lg glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingResult ? 'Update Result' : 'Create Result'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
