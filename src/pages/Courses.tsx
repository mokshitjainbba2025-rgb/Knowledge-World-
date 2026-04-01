import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users, Target, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy } from '../firebase';
import { Course } from '../types';
import { cn } from '../lib/utils';

const categories = ["ICSE", "CBSE", "11th & 12th Science", "11th & 12th Commerce"];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredCourses = courses.filter(c => c.category === activeCategory);

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
            Our Academic Programs
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            Choose Your <span className="text-gradient-gold">Path to Success</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            We offer specialized coaching for various boards and competitive exams, tailored to help students excel in their academic journey.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 border",
                activeCategory === cat
                  ? "bg-primary text-bg-dark border-primary glow-gold"
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-primary/50 hover:text-white"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading courses...</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-card border border-white/5 rounded-[32px] p-8 md:p-10 hover:border-primary/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all"></div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-display font-bold text-white group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                          <Star size={14} className="fill-primary" />
                          {course.category}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <BookOpen size={16} />
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Subjects</p>
                            <p className="text-gray-200 text-sm font-medium">{course.subjects}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <Users size={16} />
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Batch Size</p>
                            <p className="text-gray-200 text-sm font-medium">{course.batchSize}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <Target size={16} />
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Method</p>
                            <p className="text-gray-200 text-sm font-medium">{course.teachingMethod}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Outcomes</p>
                            <p className="text-gray-200 text-sm font-medium">{course.outcomes}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <button className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all group/btn">
                        Learn More <ArrowRight size={18} />
                      </button>
                      <button className="bg-primary text-bg-dark px-6 py-2 rounded-full font-bold text-xs glow-gold hover:bg-primary-light transition-all">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-white/5">
                <p className="text-gray-500">No courses available for this category yet.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Extra Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-linear-to-br from-bg-card to-bg-dark border border-primary/20 rounded-[40px] p-12 text-center"
        >
          <h3 className="text-3xl font-display font-bold text-white mb-6">Need a Custom Study Plan?</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            Every student is unique. We offer personalized consultations to help you choose the right course and batch that fits your learning style and goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto bg-primary text-bg-dark px-10 py-4 rounded-full font-bold text-lg glow-gold hover:bg-primary-light transition-all">
              Schedule Consultation
            </button>
            <a href="tel:+911234567890" className="w-full sm:w-auto text-white font-bold flex items-center gap-2 hover:text-primary transition-colors">
              <Users size={20} className="text-primary" /> Talk to Academic Counselor
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
