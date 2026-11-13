import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const FIREBASE_CONFIG = {
  projectId: 'sentrapropertidb',
  appId: '1:300320734132:web:6bd556618e994f820f90e1',
  apiKey: 'AIzaSyB31bQlqeFgikhjUqNkO7t-j6ZSgELszCA',
  authDomain: 'sentrapropertidb.firebaseapp.com',
  firestoreDatabaseId: 'spdb',
  storageBucket: 'sentrapropertidb.firebasestorage.app',
  messagingSenderId: '300320734132'
};

const DATABASE_ID = FIREBASE_CONFIG.firestoreDatabaseId || 'spdb';
const PROPERTY_COLLECTION = 'dbproperti';
const DOMAIN = 'https://sentraproperti.my.id';

// Helper to convert project name to URL slug
function createProjectSlug(name: string): string {
  if (!name) return '';
  const trimmed = name.trim().toLowerCase();
  
  // Specific match for existing indexed URL with trailing dash
  if (trimmed.includes('qeena jeju residence') && trimmed.includes('ready stock')) {
    return 'qeena-jeju-residence-ready-stock-';
  }

  return trimmed
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ProjectData {
  id: string;
  name: string;
  updatedAt?: number;
  createdAt?: number;
}

export default async function handler(req: any, res: any) {
  try {
    const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();
    const db = getFirestore(app, DATABASE_ID);

    // Fetch all active property documents from Firestore
    const colRef = collection(db, PROPERTY_COLLECTION);
    const snapshot = await getDocs(colRef);

    const projects: ProjectData[] = [];
    const seenSlugs = new Set<string>();

    snapshot.docs.forEach((docSnap) => {
      const docId = docSnap.id;
      // Skip master backup doc & metadata docs
      if (docId === 'Database' || docId === 'cities_metadata' || docId === 'cities_master') {
        return;
      }

      const data = docSnap.data();
      if (data && data.name && typeof data.name === 'string') {
        const slug = createProjectSlug(data.name);
        if (slug && !seenSlugs.has(slug)) {
          seenSlugs.add(slug);
          projects.push({
            id: docId,
            name: data.name,
            updatedAt: data.updatedAt || data.createdAt
          });
        }
      }
    });

    // Build XML string
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // 1. Home / Root URL
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}/</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // 2. Active Projects dynamically sourced from Firestore
    projects.forEach((proj) => {
      const slug = createProjectSlug(proj.name);
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}/?proyek=${slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>\n`;

    // Set XML header and CDN Edge cache (1 hour edge cache, 24 hours stale-while-revalidate)
    // This protects Firebase read quota from any repeated requests
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(xml);
  } catch (err: unknown) {
    console.error('Error generating dynamic sitemap from Firestore:', err);

    // Fallback static XML in case Firestore connection has temporary error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(fallbackXml);
  }
}
