import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, Clock, Users, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, collection, addDoc, doc, onSnapshot, OperationType, handleFirestoreError } from '../firebase';
import { SiteContent } from '../types';
import { cn } from '../lib/utils';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  phone: z.string().min(10, 'Invalid phone number'),
  class: z.string().min(1, 'Please select a class'),
  board: z.string().min(1, 'Please select a board'),
  message: z.string().optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;

export default function ContactPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_content', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as SiteContent);
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...data,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <MessageSquare size={14} />
            Get In Touch
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            Let's Start Your <span className="text-gradient-gold">Success Journey</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Have questions? We're here to help. Reach out to us for any inquiries about our courses, batches, or to book a free demo.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-bg-card border border-primary/10 p-10 rounded-[40px] space-y-10 glow-gold"
            >
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-bg-dark transition-all duration-500 shrink-0">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="text-white font-display font-bold text-xl mb-2">Our Location</h4>
                    <p className="text-gray-400 leading-relaxed">
                      {content?.contactAddress || "123, Knowledge Plaza, Adajan, Surat, Gujarat - 395009"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-bg-dark transition-all duration-500 shrink-0">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-white font-display font-bold text-xl mb-2">Call Us</h4>
                    <a href={`tel:${content?.contactPhone || "+911234567890"}`} className="text-gray-400 hover:text-primary transition-colors text-lg font-medium">
                      {content?.contactPhone || "+91 12345 67890"}
                    </a>
                    <p className="text-gray-500 text-sm mt-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-bg-dark transition-all duration-500 shrink-0">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="text-white font-display font-bold text-xl mb-2">Email Us</h4>
                    <a href={`mailto:${content?.contactEmail || "info@knowledgeworld.com"}`} className="text-gray-400 hover:text-primary transition-colors text-lg font-medium">
                      {content?.contactEmail || "info@knowledgeworld.com"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <h4 className="text-white font-display font-bold text-lg mb-6">Connect with Us</h4>
                <div className="flex items-center gap-4">
                  <a
                    href={`https://wa.me/${content?.whatsappNumber || "911234567890"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366]/10 text-[#25D366] px-6 py-3 rounded-2xl border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white transition-all font-bold"
                  >
                    <MessageSquare size={20} /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Map Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="h-80 rounded-[40px] overflow-hidden border border-primary/10 glow-gold"
            >
              <iframe
                src={content?.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.982246726884!2d72.793311!3d21.192848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e6986989771%3A0x67300f86a098f934!2sAdajan%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1711985000000!5m2!1sen!2sin"}
                className="w-full h-full grayscale invert opacity-80 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-700"
                loading="lazy"
              ></iframe>
            </motion.div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-bg-card border border-primary/10 p-10 md:p-12 rounded-[48px] glow-gold relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold text-white mb-2">Book Your Free Demo</h3>
                <p className="text-gray-400 mb-10">Fill out the form below and our counselor will get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-2">Full Name</label>
                      <input
                        {...register('name')}
                        placeholder="John Doe"
                        className={cn(
                          "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white focus:outline-none transition-all",
                          errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary"
                        )}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-2">Phone Number</label>
                      <input
                        {...register('phone')}
                        placeholder="+91 12345 67890"
                        className={cn(
                          "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white focus:outline-none transition-all",
                          errors.phone ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary"
                        )}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1 ml-2">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-2">Class</label>
                      <select
                        {...register('class')}
                        className={cn(
                          "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white focus:outline-none transition-all appearance-none",
                          errors.class ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary"
                        )}
                      >
                        <option value="" className="bg-bg-dark">Select Class</option>
                        <option value="6" className="bg-bg-dark">Class 6</option>
                        <option value="7" className="bg-bg-dark">Class 7</option>
                        <option value="8" className="bg-bg-dark">Class 8</option>
                        <option value="9" className="bg-bg-dark">Class 9</option>
                        <option value="10" className="bg-bg-dark">Class 10</option>
                        <option value="11" className="bg-bg-dark">Class 11</option>
                        <option value="12" className="bg-bg-dark">Class 12</option>
                      </select>
                      {errors.class && <p className="text-red-500 text-xs mt-1 ml-2">{errors.class.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-2">Board</label>
                      <select
                        {...register('board')}
                        className={cn(
                          "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white focus:outline-none transition-all appearance-none",
                          errors.board ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary"
                        )}
                      >
                        <option value="" className="bg-bg-dark">Select Board</option>
                        <option value="ICSE" className="bg-bg-dark">ICSE</option>
                        <option value="CBSE" className="bg-bg-dark">CBSE</option>
                        <option value="State Board" className="bg-bg-dark">State Board</option>
                        <option value="Other" className="bg-bg-dark">Other</option>
                      </select>
                      {errors.board && <p className="text-red-500 text-xs mt-1 ml-2">{errors.board.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-2">Message (Optional)</label>
                    <textarea
                      {...register('message')}
                      placeholder="Tell us about your requirements..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-bg-dark py-5 rounded-2xl font-bold text-xl glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-bg-dark border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Submit Inquiry <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-2 text-green-500 font-bold bg-green-500/10 py-4 rounded-2xl border border-green-500/20"
                    >
                      <CheckCircle2 size={20} /> Inquiry Submitted Successfully!
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
