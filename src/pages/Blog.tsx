import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy } from '../firebase';
import { BlogPost } from '../types';
import ReactMarkdown from 'react-markdown';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <BookOpen size={14} />
            Knowledge Hub
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            Insights, Tips & <span className="text-gradient-gold">Academic Updates</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Stay updated with the latest educational trends, study tips, and announcements from Knowledge World.
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-20 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search articles or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-card border border-white/10 rounded-full py-4 pl-16 pr-8 text-white focus:outline-none focus:border-primary transition-all glow-gold-hover"
          />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading articles...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-card border border-white/5 rounded-[40px] overflow-hidden group hover:border-primary/30 transition-all glow-gold-hover flex flex-col h-full"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-primary text-bg-dark text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full glow-gold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow space-y-6">
                  <div className="flex items-center gap-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-primary" />
                      {post.author}
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <div className="text-gray-400 text-sm line-clamp-3 markdown-body">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-auto">
                    <button className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all group/btn">
                      Read Full Article <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-white/5">
              <p className="text-gray-500">No articles found matching your search.</p>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 bg-linear-to-br from-primary/10 to-transparent border border-primary/20 rounded-[40px] p-12 text-center space-y-8"
        >
          <h3 className="text-3xl font-display font-bold text-white">Never Miss an Update</h3>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Subscribe to our newsletter to receive the latest study tips, exam strategies, and academic news directly in your inbox.
          </p>
          <form className="max-w-md mx-auto relative">
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-8 text-white focus:outline-none focus:border-primary transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-bg-dark px-8 py-2.5 rounded-full font-bold text-sm glow-gold hover:bg-primary-light transition-all">
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
