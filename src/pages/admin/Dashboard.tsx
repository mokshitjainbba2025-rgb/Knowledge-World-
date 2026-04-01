import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, Award, Bell, TrendingUp, 
  ArrowUpRight, Calendar, MessageSquare, Image as ImageIcon, FileText, Plus
} from 'lucide-react';
import { db, collection, getDocs, query, orderBy, limit, onSnapshot } from '../../firebase';
import { Inquiry, Course, Result, Faculty } from '../../types';
import { cn } from '../../lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    inquiries: 0,
    courses: 0,
    results: 0,
    faculty: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [inqSnap, courseSnap, resultSnap, facultySnap] = await Promise.all([
        getDocs(collection(db, 'inquiries')),
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'results')),
        getDocs(collection(db, 'faculty')),
      ]);

      setStats({
        inquiries: inqSnap.size,
        courses: courseSnap.size,
        results: resultSnap.size,
        faculty: facultySnap.size,
      });
    };

    fetchData();

    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statCards = [
    { name: 'Total Inquiries', value: stats.inquiries, icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Active Courses', value: stats.courses, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Student Results', value: stats.results, icon: Award, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Expert Faculty', value: stats.faculty, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="bg-bg-card border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
          <Calendar size={18} className="text-primary" />
          <span className="text-white text-sm font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-bg-card border border-white/5 p-6 rounded-3xl glow-gold-hover group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.name}</h3>
            <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-bg-card border border-white/5 rounded-[32px] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Bell size={20} className="text-primary" /> Recent Inquiries
            </h3>
            <Link to="/admin/inquiries" className="text-primary text-xs font-bold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading inquiries...</div>
            ) : recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      {inquiry.name[0]}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{inquiry.name}</h4>
                      <p className="text-gray-500 text-xs">{inquiry.class}th • {inquiry.board}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs font-bold">{inquiry.phone}</p>
                    <p className="text-gray-600 text-[10px]">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">No recent inquiries found.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-bg-card border border-white/5 rounded-[32px] p-8 space-y-6">
            <h3 className="text-xl font-display font-bold text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/courses" className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group">
                <Plus size={24} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Add Course</span>
              </Link>
              <Link to="/admin/gallery" className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group">
                <ImageIcon size={24} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Upload Media</span>
              </Link>
              <Link to="/admin/results" className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group">
                <Award size={24} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Add Result</span>
              </Link>
              <Link to="/admin/blog" className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group">
                <FileText size={24} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">New Post</span>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-linear-to-br from-primary/10 to-transparent border border-primary/20 rounded-[32px] p-8 space-y-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Database Connection</span>
                <span className="text-green-500 font-bold">Online</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Auth Service</span>
                <span className="text-green-500 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Storage Usage</span>
                <span className="text-white font-bold">12%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-primary h-full w-[12%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

