import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Users, Target, BookOpen, ArrowRight, Star, Quote, Phone, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, collection, getDocs, query, orderBy, limit, onSnapshot, where } from '../firebase';
import { Course, Testimonial, Result } from '../types';
import { useSiteContent } from '../hooks/useSiteContent';

const highlights = [
  { title: 'ICSE', subtitle: 'Classes 6-10', icon: BookOpen },
  { title: 'CBSE', subtitle: 'Classes 6-10', icon: Target },
  { title: '11th & 12th', subtitle: 'Science & Commerce', icon: Users },
];

const reasons = [
  { title: 'Concept Clarity', description: 'We focus on deep understanding rather than rote learning.', icon: Target },
  { title: 'Small Batches', description: 'Personalized attention with limited students per batch.', icon: Users },
  { title: 'Personal Attention', description: 'Individual doubt-solving sessions for every student.', icon: CheckCircle2 },
  { title: 'Result Oriented', description: 'Proven track record of top results in Surat.', icon: Star },
];

const journeySteps = [
  { title: 'Doubt', description: 'Every question is welcomed and encouraged.', icon: MessageSquare, color: 'from-red-500 to-orange-500' },
  { title: 'Concept', description: 'Clear explanations with real-world examples.', icon: Target, color: 'from-orange-500 to-yellow-500' },
  { title: 'Practice', description: 'Rigorous practice with curated study material.', icon: BookOpen, color: 'from-yellow-500 to-green-500' },
  { title: 'Test', description: 'Regular assessments to track progress.', icon: CheckCircle2, color: 'from-green-500 to-blue-500' },
  { title: 'Result', description: 'Celebrating success and future leaders.', icon: Star, color: 'from-blue-500 to-primary' },
];

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const { content } = useSiteContent();

  useEffect(() => {
    const qT = query(collection(db, 'testimonials'), limit(3));
    const unsubscribeT = onSnapshot(qT, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    });

    const qR = query(collection(db, 'results'), where('isTopper', '==', true), limit(4));
    const unsubscribeR = onSnapshot(qR, (snapshot) => {
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result)));
    });

    return () => {
      unsubscribeT();
      unsubscribeR();
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 px-6">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex flex-col gap-6">
              {content?.logoUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-24 h-24 bg-white rounded-full p-1 flex items-center justify-center shadow-2xl border border-primary/20 glow-gold"
                >
                  <img src={content.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </motion.div>
              )}
              <div className="inline-flex items-center self-start gap-5 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-bold tracking-widest uppercase">
                <Star size={14} className="fill-primary" />
                Surat's Premier Coaching Institute
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-white">
              {content?.heroTitle || "Building Strong Foundations. Creating Future Leaders."}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
              {content?.heroSubtitle || "Expert coaching for ICSE, CBSE, and Classes 11 & 12. We focus on concept-based learning to ensure your child's success."}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-primary text-bg-dark px-10 py-4 rounded-full font-bold text-lg glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-2 group"
              >
                Book Free Demo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`tel:${content?.contactPhone || "+911234567890"}`}
                className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={20} /> Call Now
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-primary/20 glow-gold">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"
                alt="Students Learning"
                className="w-full h-[600px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-transparent to-transparent"></div>
            </div>
            {/* Stats Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 z-20 bg-bg-card border border-primary/20 p-6 rounded-2xl glow-gold"
            >
              <h4 className="text-primary font-display font-bold text-3xl">98%</h4>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Success Rate</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 z-20 bg-bg-card border border-primary/20 p-6 rounded-2xl glow-gold"
            >
              <h4 className="text-primary font-display font-bold text-3xl">15+</h4>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Expert Faculty</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 px-6 bg-bg-dark relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-bg-card border border-white/5 p-8 rounded-3xl group hover:border-primary/30 transition-all glow-gold-hover"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-bg-dark transition-all">
                <item.icon size={28} />
              </div>
              <h3 className="text-white font-display font-bold text-2xl mb-2">{item.title}</h3>
              <p className="text-gray-400 font-medium">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm">Our Excellence</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white">Why Choose Knowledge World?</h3>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-card/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl text-center hover:bg-bg-card transition-all group"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <reason.icon size={32} />
                </div>
                <h4 className="text-white font-display font-bold text-xl mb-4">{reason.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Journey Flow */}
      <section className="py-24 px-6 bg-bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm">The Process</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white">Student Journey Flow</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">Our structured approach ensures every student reaches their full potential through a continuous cycle of learning and growth.</p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 hidden lg:block"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className={`w-20 h-20 rounded-3xl bg-linear-to-br ${step.color} p-0.5 glow-gold-hover transition-all`}>
                    <div className="w-full h-full bg-bg-dark rounded-[22px] flex items-center justify-center text-white group-hover:bg-transparent transition-all">
                      <step.icon size={32} />
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                    <h4 className="text-white font-display font-bold text-xl">{step.title}</h4>
                    <p className="text-gray-400 text-sm px-4">{step.description}</p>
                  </div>
                  {/* Mobile Arrow */}
                  {index < journeySteps.length - 1 && (
                    <div className="lg:hidden mt-8 text-primary/30">
                      <ArrowRight size={24} className="rotate-90 sm:rotate-0" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm">Our Toppers</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white">Celebrating Success</h3>
            </div>
            <Link to="/results" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all group">
              View All Results <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {results.length > 0 ? results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-card border border-white/5 rounded-3xl overflow-hidden group hover:border-primary/30 transition-all"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={result.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=500'}
                    alt={result.studentName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-bg-dark font-bold px-3 py-1 rounded-full text-xs glow-gold">
                    {result.score}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-white font-display font-bold text-lg mb-1">{result.studentName}</h4>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">{result.board} - {result.year}</p>
                  <p className="text-gray-400 text-sm italic">"{result.achievement}"</p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12 bg-bg-card rounded-3xl border border-white/5">
                <p className="text-gray-500">Loading our star performers...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-24 px-6 bg-bg-card/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm">Testimonials</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white">What Parents & Students Say</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-bg-card border border-white/5 p-8 rounded-3xl relative group"
              >
                <Quote className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors" size={64} />
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-8 leading-relaxed relative z-10">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-primary text-xs font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Loading feedback from our community...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-linear-to-br from-primary to-primary-dark rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden glow-gold"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-bg-dark leading-tight">
              Ready to Start Your <br /> Success Journey?
            </h2>
            <p className="text-bg-dark/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Join Knowledge World today and experience the difference in learning. Book your free demo session now!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-bg-dark text-white px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl"
              >
                Book Free Demo
              </Link>
              <a
                href={`tel:${content?.contactPhone || "+911234567890"}`}
                className="w-full sm:w-auto bg-transparent border-2 border-bg-dark/20 text-bg-dark px-12 py-5 rounded-full font-bold text-xl hover:bg-bg-dark/10 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={24} /> Call Now
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
