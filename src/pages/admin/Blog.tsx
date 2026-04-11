import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, FileText, Calendar, User, Tag, Image as ImageIcon } from 'lucide-react';
import { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, OperationType, handleFirestoreError, query, orderBy } from '../../firebase';
import { BlogPost } from '../../types';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BlogPost>();

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: BlogPost) => {
    try {
      // Sanitize data to remove 'id' before sending to Firestore
      const { id, ...sanitizedData } = data as any;
      const tags = typeof data.tags === 'string' ? (data.tags as string).split(',').map(t => t.trim()) : data.tags;
      const payload = {
        ...sanitizedData,
        tags,
        publishedAt: editingPost ? editingPost.publishedAt : new Date().toISOString()
      };
      if (editingPost) {
        await updateDoc(doc(db, 'blog', editingPost.id), payload);
      } else {
        await addDoc(collection(db, 'blog'), payload);
      }
      setIsModalOpen(false);
      setEditingPost(null);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'blog');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blog', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'blog');
      }
    }
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    reset({ ...post, tags: post.tags.join(', ') } as any);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingPost(null);
    reset({ author: 'Admin', tags: '' } as any);
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
          <h1 className="text-3xl font-display font-bold text-white">Manage Blog</h1>
          <p className="text-gray-500">Write and publish academic articles and updates.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-bold glow-gold hover:bg-primary-light transition-all flex items-center gap-2"
        >
          <Plus size={20} /> New Blog Post
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-bg-card border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500'}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{post.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><User size={12} className="text-primary" /> {post.author}</span>
                    <span className="flex items-center gap-1.5"><Tag size={12} className="text-primary" /> {post.tags.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEdit(post)}
                  className="p-3 bg-white/5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-3 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-bg-card rounded-3xl border border-white/5 text-gray-500">
            No blog posts found. Click "New Blog Post" to get started.
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
              className="relative w-full max-w-4xl bg-bg-card border border-primary/20 rounded-[40px] p-10 glow-gold overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-white">
                  {editingPost ? 'Edit Post' : 'New Blog Post'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Post Title</label>
                    <input
                      {...register('title', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Author Name</label>
                    <input
                      {...register('author')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Image URL</label>
                    <input
                      {...register('imageUrl')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tags (Comma separated)</label>
                    <input
                      {...register('tags')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Content (Markdown supported)</label>
                  <textarea
                    {...register('content', { required: true })}
                    rows={12}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-primary transition-all resize-none font-mono text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-bg-dark py-4 rounded-xl font-bold text-lg glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingPost ? 'Update Post' : 'Publish Post'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
