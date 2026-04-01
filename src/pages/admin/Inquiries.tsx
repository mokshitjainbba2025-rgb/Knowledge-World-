import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Trash2, CheckCircle2, X, Phone, User, BookOpen, Clock, MessageSquare, Filter } from 'lucide-react';
import { db, collection, onSnapshot, updateDoc, deleteDoc, doc, OperationType, handleFirestoreError, query, orderBy } from '../../firebase';
import { Inquiry } from '../../types';
import { cn } from '../../lib/utils';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'inquiries');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this inquiry?')) {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'inquiries');
      }
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Inquiries</h1>
          <p className="text-gray-500">Manage student inquiries and form submissions.</p>
        </div>
        <div className="flex bg-bg-card border border-white/5 p-1 rounded-xl">
          {['all', 'new', 'contacted', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                filter === f ? "bg-primary text-bg-dark glow-gold" : "text-gray-500 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading inquiries...</div>
        ) : filteredInquiries.length > 0 ? (
          filteredInquiries.map((inquiry) => (
            <motion.div
              key={inquiry.id}
              layout
              className={cn(
                "bg-bg-card border p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all",
                inquiry.status === 'new' ? "border-primary/30 glow-gold" : "border-white/5"
              )}
            >
              <div className="flex items-start gap-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  inquiry.status === 'new' ? "bg-primary/20 text-primary" : "bg-white/5 text-gray-500"
                )}>
                  <User size={24} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-bold text-lg">{inquiry.name}</h3>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                      inquiry.status === 'new' ? "bg-primary text-bg-dark" : "bg-white/10 text-gray-400"
                    )}>
                      {inquiry.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Phone size={12} className="text-primary" /> {inquiry.phone}</span>
                    <span className="flex items-center gap-1.5"><BookOpen size={12} className="text-primary" /> {inquiry.class}th • {inquiry.board}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {new Date(inquiry.createdAt).toLocaleString()}</span>
                  </div>
                  {inquiry.message && (
                    <p className="text-gray-400 text-sm mt-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <MessageSquare size={14} className="inline mr-2 text-primary" />
                      {inquiry.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {inquiry.status !== 'contacted' && (
                  <button
                    onClick={() => updateStatus(inquiry.id, 'contacted')}
                    className="p-3 bg-white/5 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                    title="Mark as Contacted"
                  >
                    <Phone size={18} />
                  </button>
                )}
                {inquiry.status !== 'closed' && (
                  <button
                    onClick={() => updateStatus(inquiry.id, 'closed')}
                    className="p-3 bg-white/5 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all"
                    title="Mark as Closed"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(inquiry.id)}
                  className="p-3 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-bg-card rounded-3xl border border-white/5 text-gray-500">
            No inquiries found for this filter.
          </div>
        )}
      </div>
    </motion.div>
  );
}
