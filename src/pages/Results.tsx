import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Award, TrendingUp, Quote, Play, ArrowRight } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, where } from '../firebase';
import { Result, Testimonial } from '../types';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qR = query(collection(db, 'results'), orderBy('score', 'desc'));
    const unsubscribeR = onSnapshot(qR, (snapshot) => {
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result)));
    });

    const qT = query(collection(db, 'testimonials'), orderBy('rating', 'desc'));
    const unsubscribeT = onSnapshot(qT, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
      setLoading(false);
    });

    return () => {
      unsubscribeR();
      unsubscribeT();
    };
  }, []);

  const toppers = results.filter(r => r.isTopper);
  const otherResults = results.filter(r => !r.isTopper);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-bold tracking-widest uppercase"
          >
            <Award size={14} />
            Our Hall of Fame
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            Our Results Speak <span className="text-gradient-gold">Louder Than Words</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Consistently producing top scorers and inspiring improvement stories across all boards.
          </motion.p>
        </div>

        {/* Toppers Section */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-display font-bold text-white">Our Star Performers</h2>
            <div className="flex-grow h-px bg-primary/20"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              </div>
            ) : toppers.length > 0 ? (
              toppers.map((topper, index) => (
                <motion.div
                  key={topper.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-card border border-primary/20 rounded-[40px] overflow-hidden group hover:border-primary/50 transition-all glow-gold"
                >
                  <div className="h-72 overflow-hidden relative">
                    <img
                      src={topper.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=500'}
                      alt={topper.studentName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-bg-dark font-bold px-4 py-1.5 rounded-full text-sm glow-gold">
                      {topper.score}
                    </div>
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-display font-bold text-white mb-1">{topper.studentName}</h3>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">{topper.board} - {topper.year}</p>
                    <p className="text-gray-400 text-sm italic leading-relaxed">"{topper.achievement}"</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-bg-card rounded-3xl border border-white/5">
                <p className="text-gray-500">Toppers list will be updated soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Improvement Stories & Other Results */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-display font-bold text-white">Consistent Excellence</h2>
            <div className="flex-grow h-px bg-primary/20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-bg-card/50 border border-white/5 p-6 rounded-3xl flex items-center gap-6 hover:bg-bg-card transition-all"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-primary/20">
                  <img
                    src={result.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=500'}
                    alt={result.studentName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold">{result.studentName}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-sm">{result.score}</span>
                    <span className="text-gray-500 text-xs">• {result.board}</span>
                  </div>
                  <p className="text-gray-400 text-xs italic">"{result.achievement}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Testimonials & Feedback */}
        <div className="bg-bg-card border border-primary/10 rounded-[48px] p-12 md:p-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm">Voices of Success</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white">What Our Community Says</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {testimonial.videoUrl ? (
                  <div className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer border border-primary/20 glow-gold">
                    <img
                      src={`https://img.youtube.com/vi/${testimonial.videoUrl.split('v=')[1]}/maxresdefault.jpg`}
                      alt="Video Testimonial"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-bg-dark/40 flex items-center justify-center group-hover:bg-bg-dark/20 transition-all">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-bg-dark glow-gold group-hover:scale-110 transition-transform">
                        <Play size={32} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 p-10 rounded-3xl relative group border border-white/5 hover:border-primary/20 transition-all">
                    <Quote className="absolute top-6 right-8 text-primary/10" size={64} />
                    <p className="text-gray-300 italic text-lg leading-relaxed mb-8 relative z-10">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                        <p className="text-primary text-sm font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center space-y-8"
        >
          <h3 className="text-3xl font-display font-bold text-white">Want to See Your Name Here?</h3>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Join Knowledge World and start your journey towards academic excellence today. Your success story begins here.
          </p>
          <button className="bg-primary text-bg-dark px-12 py-4 rounded-full font-bold text-xl glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-2 mx-auto group">
            Start Your Journey <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
