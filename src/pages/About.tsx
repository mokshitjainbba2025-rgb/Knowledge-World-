import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Users, BookOpen, CheckCircle2, Star, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { db, doc, onSnapshot } from '../firebase';
import { SiteContent } from '../types';

export default function AboutPage() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_content', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as SiteContent);
      }
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
            <Star size={14} />
            Our Legacy of Excellence
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            Empowering Students <br /> <span className="text-gradient-gold">Since 2010</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Knowledge World is more than just a coaching institute; it's a place where dreams are nurtured and future leaders are born.
          </motion.p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-card border border-primary/10 p-12 rounded-[48px] relative overflow-hidden group hover:border-primary/30 transition-all glow-gold-hover"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all"></div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-bg-dark transition-all">
              <Target size={32} />
            </div>
            <h3 className="text-3xl font-display font-bold text-white mb-6">Our Vision</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {content?.vision || "To be the leading educational institution in Surat, recognized for our commitment to excellence, innovation in teaching, and the holistic development of our students."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-card border border-primary/10 p-12 rounded-[48px] relative overflow-hidden group hover:border-primary/30 transition-all glow-gold-hover"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all"></div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-bg-dark transition-all">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-3xl font-display font-bold text-white mb-6">Our Mission</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {content?.mission || "To provide high-quality, concept-based education that empowers students to achieve their academic goals and prepares them for the challenges of the future."}
            </p>
          </motion.div>
        </div>

        {/* Teaching Philosophy */}
        <div className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden border border-primary/20 glow-gold">
                <img
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1000"
                  alt="Teaching Philosophy"
                  className="w-full h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-[60px]"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm">Our Philosophy</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                Concept-Based <br /> <span className="text-gradient-gold">Learning Approach</span>
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                {content?.philosophy || "We believe that true education goes beyond textbooks. Our teaching philosophy is centered around building strong conceptual foundations, encouraging critical thinking, and fostering a love for learning."}
              </p>
              <ul className="space-y-4">
                {[
                  "In-depth explanation of every topic",
                  "Interactive classroom environment",
                  "Regular doubt-clearing sessions",
                  "Personalized feedback and tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="text-primary" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Core Values */}
        <div className="py-24 bg-bg-card border border-primary/10 rounded-[64px] px-12 md:px-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm">Our Core Values</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white">The Pillars of Our Success</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Integrity", desc: "We maintain the highest standards of honesty and ethical behavior in all our interactions.", icon: Award },
              { title: "Excellence", desc: "We strive for excellence in everything we do, from teaching to student support.", icon: Star },
              { title: "Innovation", desc: "We continuously adapt and innovate our teaching methods to provide the best learning experience.", icon: BookOpen }
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-6 group"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-primary mx-auto group-hover:bg-primary group-hover:text-bg-dark transition-all duration-500">
                  <value.icon size={36} />
                </div>
                <h4 className="text-white font-display font-bold text-2xl">{value.title}</h4>
                <p className="text-gray-400 leading-relaxed">{value.desc}</p>
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
          <h3 className="text-3xl font-display font-bold text-white">Ready to Experience the Difference?</h3>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Join Knowledge World and start your journey towards academic excellence today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto bg-primary text-bg-dark px-12 py-4 rounded-full font-bold text-xl glow-gold hover:bg-primary-light transition-all">
              Book Free Demo
            </button>
            <button className="w-full sm:w-auto text-white font-bold flex items-center gap-2 hover:text-primary transition-colors group">
              Contact Us <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
