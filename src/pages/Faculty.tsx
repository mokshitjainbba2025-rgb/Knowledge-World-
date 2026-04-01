import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Star, GraduationCap, Briefcase, Target, ArrowRight } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy } from '../firebase';
import { Faculty } from '../types';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'faculty'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFaculty(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faculty)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
            <Users size={14} />
            Our Expert Mentors
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            Learn from the <span className="text-gradient-gold">Best Minds</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Our faculty members are not just teachers, but mentors dedicated to guiding students with passion and expertise.
          </motion.p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading faculty profiles...</p>
            </div>
          ) : faculty.length > 0 ? (
            faculty.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-card border border-white/5 rounded-[40px] overflow-hidden group hover:border-primary/30 transition-all glow-gold-hover"
              >
                <div className="h-80 overflow-hidden relative">
                  <img
                    src={teacher.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500'}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-display font-bold text-white mb-1">{teacher.name}</h3>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">{teacher.qualification}</p>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary">
                        <Briefcase size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Experience</span>
                      </div>
                      <p className="text-gray-300 text-sm font-medium">{teacher.experience}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary">
                        <Target size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Style</span>
                      </div>
                      <p className="text-gray-300 text-sm font-medium">{teacher.teachingStyle}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-primary text-primary" />
                      ))}
                      <span className="text-gray-500 text-xs ml-2">Highly Rated</span>
                    </div>
                    <button className="w-full bg-white/5 hover:bg-primary hover:text-bg-dark text-white py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn">
                      View Profile <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-white/5">
              <p className="text-gray-500">No faculty profiles available yet.</p>
            </div>
          )}
        </div>

        {/* Join Us CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 bg-linear-to-br from-primary/10 to-transparent border border-primary/20 rounded-[40px] p-12 flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          <div className="space-y-4 text-center lg:text-left">
            <h3 className="text-3xl font-display font-bold text-white">Passionate about Teaching?</h3>
            <p className="text-gray-400 max-w-xl text-lg">
              We are always looking for expert educators to join our mission of creating future leaders. If you have the passion, we have the platform.
            </p>
          </div>
          <button className="bg-primary text-bg-dark px-10 py-4 rounded-full font-bold text-lg glow-gold hover:bg-primary-light transition-all whitespace-nowrap">
            Join Our Faculty
          </button>
        </motion.div>
      </div>
    </div>
  );
}
