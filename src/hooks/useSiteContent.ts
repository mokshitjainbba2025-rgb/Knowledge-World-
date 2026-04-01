import { useState, useEffect } from 'react';
import { db, doc, onSnapshot } from '../firebase';
import { SiteContent } from '../types';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_content', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as SiteContent);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { content, loading };
}
