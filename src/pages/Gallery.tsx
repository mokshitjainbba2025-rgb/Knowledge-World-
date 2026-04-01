import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Play, Image as ImageIcon, Filter, Maximize2, X } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy } from '../firebase';
import { GalleryItem } from '../types';
import { cn } from '../lib/utils';

const categories = ["All", "Classroom", "Results", "Trips", "Events"];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-bold tracking-widest uppercase"
          >
            <Camera size={14} />
            Life @ Knowledge World
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            Capturing Our <span className="text-gradient-gold">Best Moments</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Explore the vibrant life at Knowledge World, from classroom learning to fun-filled trips and celebrations.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 border flex items-center gap-2",
                activeCategory === cat
                  ? "bg-primary text-bg-dark border-primary glow-gold"
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-primary/50 hover:text-white"
              )}
            >
              {cat === "All" ? <Filter size={14} /> : null}
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading gallery...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-square rounded-[32px] overflow-hidden border border-white/5 cursor-pointer glow-gold-hover"
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-bg-dark/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-bg-dark mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      {item.type === 'video' ? <Play size={24} fill="currentColor" /> : <Maximize2 size={24} />}
                    </div>
                    <h4 className="text-white font-display font-bold text-xl mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                      {item.title || item.category}
                    </h4>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform delay-100">
                      {item.category}
                    </p>
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute top-4 right-4 bg-primary text-bg-dark p-2 rounded-full glow-gold">
                      <Play size={14} fill="currentColor" />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-white/5">
                <ImageIcon className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-500">No moments captured in this category yet.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-bg-dark/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
              onClick={() => setSelectedItem(null)}
            >
              <button
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                onClick={() => setSelectedItem(null)}
              >
                <X size={40} />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full max-h-full rounded-3xl overflow-hidden border border-primary/20 glow-gold"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedItem.type === 'video' ? (
                  <div className="aspect-video bg-black">
                    <iframe
                      src={selectedItem.url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="w-full h-auto max-h-[80vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="bg-bg-card p-8 border-t border-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white mb-1">
                        {selectedItem.title || selectedItem.category}
                      </h3>
                      <p className="text-primary text-xs font-bold uppercase tracking-widest">
                        {selectedItem.category} • {new Date(selectedItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-full text-sm font-bold transition-all"
                    >
                      View Original
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
