import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, BookOpen, Star, ArrowRight, GripVertical } from 'lucide-react';
import { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, OperationType, handleFirestoreError } from '../../firebase';
import { Course } from '../../types';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';

const categories = ["ICSE", "CBSE", "11th & 12th Science", "11th & 12th Commerce"];

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Course>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'courses'), (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)).sort((a, b) => a.order - b.order));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: Course) => {
    try {
      // Sanitize data to remove 'id' before sending to Firestore
      const { id, ...sanitizedData } = data as any;
      const payload = { ...sanitizedData, order: Number(data.order) || courses.length + 1 };

      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), payload);
      } else {
        await addDoc(collection(db, 'courses'), payload);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'courses');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'courses');
      }
    }
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    reset(course);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingCourse(null);
    reset({ order: courses.length + 1 } as Course);
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
          <h1 className="text-3xl font-display font-bold text-white">Manage Courses</h1>
          <p className="text-gray-500">Add, edit, or remove academic programs.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-bold glow-gold hover:bg-primary-light transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading courses...</div>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-bg-card border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                  {course.order}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{course.title}</h3>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">{course.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEdit(course)}
                  className="p-3 bg-white/5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-3 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-bg-card rounded-3xl border border-white/5 text-gray-500">
            No courses found. Click "Add New Course" to get started.
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
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Course Title</label>
                    <input
                      {...register('title', { required: true })}
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

                <div className="space-y-2">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Subjects (Comma separated)</label>
                  <input
                    {...register('subjects')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Batch Size</label>
                    <input
                      {...register('batchSize')}
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
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Teaching Method</label>
                  <textarea
                    {...register('teachingMethod')}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Expected Outcomes</label>
                  <textarea
                    {...register('outcomes')}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-bg-dark py-4 rounded-xl font-bold text-lg glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
