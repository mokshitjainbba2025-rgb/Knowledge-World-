export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsappNumber: string;
  googleMapsUrl: string;
  logoUrl: string;
  vision: string;
  mission: string;
  philosophy: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'ICSE' | 'CBSE' | '11th & 12th Science' | '11th & 12th Commerce';
  subjects: string;
  teachingMethod: string;
  batchSize: string;
  outcomes: string;
  order: number;
}

export interface Faculty {
  id: string;
  name: string;
  qualification: string;
  experience: string;
  teachingStyle: string;
  photoUrl: string;
  order: number;
}

export interface Result {
  id: string;
  studentName: string;
  score: string;
  board: string;
  year: string;
  achievement: string;
  photoUrl: string;
  isTopper: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  videoUrl: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: 'Classroom' | 'Results' | 'Trips' | 'Events';
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  class: string;
  board: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  tags: string[];
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}
