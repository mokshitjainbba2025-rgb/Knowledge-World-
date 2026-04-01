import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

export default function Footer() {
  const { content } = useSiteContent();

  return (
    <footer className="bg-bg-card border-t border-primary/10 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            {content?.logoUrl ? (
              <img src={content.logoUrl} alt="Logo" className="w-10 h-10 object-contain glow-gold" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center glow-gold">
                <span className="text-bg-dark font-display font-bold text-xl">K</span>
              </div>
            )}
            <div>
              <h1 className="text-white font-display font-bold text-lg leading-tight tracking-wider">
                KNOWLEDGE WORLD
              </h1>
              <p className="text-primary text-[10px] uppercase tracking-[0.2em] font-medium">
                Educational Classes
              </p>
            </div>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Building Strong Foundations. Creating Future Leaders. We are dedicated to providing high-quality education for ICSE, CBSE, and Classes 11 & 12 students in Surat.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-bg-dark transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-bg-dark transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-bg-dark transition-all">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-display font-bold text-lg mb-6 border-l-4 border-primary pl-4">Quick Links</h3>
          <ul className="space-y-4">
            {['Home', 'Courses', 'Faculty', 'Results', 'Gallery', 'About Us', 'Blog', 'Contact'].map((item) => (
              <li key={item}>
                <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-display font-bold text-lg mb-6 border-l-4 border-primary pl-4">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary shrink-0" size={18} />
              <span className="text-gray-400 text-sm">
                {content?.contactAddress || "123, Knowledge Plaza, Adajan, Surat, Gujarat - 395009"}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-primary shrink-0" size={18} />
              <a href={`tel:${content?.contactPhone || "+911234567890"}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                {content?.contactPhone || "+91 12345 67890"}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary shrink-0" size={18} />
              <a href={`mailto:${content?.contactEmail || "info@knowledgeworld.com"}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                {content?.contactEmail || "info@knowledgeworld.com"}
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-display font-bold text-lg mb-6 border-l-4 border-primary pl-4">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">Subscribe to get the latest updates on batches and results.</p>
          <form className="relative">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-bg-dark glow-gold hover:bg-primary-light transition-all">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-xs text-center">
          © {new Date().getFullYear()} Knowledge World Educational Classes. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="text-gray-500 hover:text-primary text-xs transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-gray-500 hover:text-primary text-xs transition-colors">Terms & Conditions</Link>
          <Link to="/admin" className="text-gray-500 hover:text-primary text-xs transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
