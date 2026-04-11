import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Settings, BookOpen, Users, Award, 
  MessageSquare, Image as ImageIcon, FileText, LogOut, 
  Menu, X, Bell, User, ChevronRight, Plus, Trash2, Edit2, Save, Eye, EyeOff
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, doc, onSnapshot, collection, getDocs, query, where, limit } from '../firebase';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

// Admin Sub-pages
import AdminDashboard from './admin/Dashboard';
import AdminSiteContent from './admin/SiteContent';
import AdminCourses from './admin/Courses';
import AdminFaculty from './admin/Faculty';
import AdminResults from './admin/Results';
import AdminTestimonials from './admin/Testimonials';
import AdminGallery from './admin/Gallery';
import AdminInquiries from './admin/Inquiries';
import AdminBlog from './admin/Blog';

const sidebarLinks = [
  { name: 'Dashboard', path: '', icon: LayoutDashboard },
  { name: 'Site Content', path: 'site-content', icon: Settings },
  { name: 'Courses', path: 'courses', icon: BookOpen },
  { name: 'Faculty', path: 'faculty', icon: Users },
  { name: 'Results', path: 'results', icon: Award },
  { name: 'Testimonials', path: 'testimonials', icon: MessageSquare },
  { name: 'Gallery', path: 'gallery', icon: ImageIcon },
  { name: 'Blog', path: 'blog', icon: FileText },
  { name: 'Inquiries', path: 'inquiries', icon: Bell },
];

export default function AdminPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user is admin
        const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', firebaseUser.email)));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data() as UserProfile;
          if (userData.role === 'admin') {
            setUser(userData);
          } else {
            // Not an admin
            await signOut(auth);
            setUser(null);
          }
        } else if (firebaseUser.email === 'mokshit.jain.bba2025@atlasskilltech.university') {
          // Default admin
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Admin',
            email: firebaseUser.email,
            role: 'admin',
            createdAt: new Date().toISOString()
          });
        } else {
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-bg-card border border-primary/20 p-12 rounded-[40px] text-center space-y-8 glow-gold"
        >
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-bg-dark mx-auto glow-gold">
            <LayoutDashboard size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400">Please sign in with your administrator account to access the dashboard.</p>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-primary text-bg-dark py-4 rounded-2xl font-bold text-lg glow-gold hover:bg-primary-light transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>
          <Link to="/" className="block text-gray-500 hover:text-primary transition-colors text-sm font-bold">
            Back to Website
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-bg-card border-r border-white/5 flex flex-col fixed h-full z-40 transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-bg-dark font-bold">K</div>
              <span className="text-white font-display font-bold text-sm tracking-widest">ADMIN PANEL</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-primary transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === `/admin${link.path ? '/' + link.path : ''}`;
            return (
              <Link
                key={link.path}
                to={`/admin${link.path ? '/' + link.path : ''}`}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-primary text-bg-dark font-bold glow-gold" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <link.icon size={20} className={cn(isActive ? "text-bg-dark" : "text-primary group-hover:scale-110 transition-transform")} />
                {sidebarOpen && <span className="text-sm">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className={cn("flex items-center gap-4 p-2 rounded-xl bg-white/5", !sidebarOpen && "justify-center")}>
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
              {user.name[0]}
            </div>
            {sidebarOpen && (
              <div className="flex-grow overflow-hidden">
                <p className="text-white text-sm font-bold truncate">{user.name}</p>
                <p className="text-gray-500 text-[10px] truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full mt-4 flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all",
              !sidebarOpen && "justify-center"
            )}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={cn("flex-grow transition-all duration-300", sidebarOpen ? "ml-[280px]" : "ml-[80px]")}>
        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/site-content" element={<AdminSiteContent />} />
              <Route path="/courses" element={<AdminCourses />} />
              <Route path="/faculty" element={<AdminFaculty />} />
              <Route path="/results" element={<AdminResults />} />
              <Route path="/testimonials" element={<AdminTestimonials />} />
              <Route path="/gallery" element={<AdminGallery />} />
              <Route path="/blog" element={<AdminBlog />} />
              <Route path="/inquiries" element={<AdminInquiries />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
