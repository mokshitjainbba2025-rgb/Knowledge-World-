import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingWhatsApp() {
  const phoneNumber = '919824197667'; // Replace with actual number
  const message = 'Hello Knowledge World, I am interested in your courses.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl glow-gold-hover transition-all"
    >
      <MessageSquare size={28} fill="white" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
        1
      </span>
    </motion.a>
  );
}
