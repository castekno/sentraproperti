import { 
  doc, 
  getDoc,
  setDoc, 
  deleteDoc,
  onSnapshot, 
  collection,
  getDocs,
  Unsubscribe 
} from 'firebase/firestore';
import { 
  db, 
  PROPERTY_COLLECTION, 
  DATABASE_DOC_ID, 
  FIREBASE_DB_NAME, 
  FIRESTORE_DATABASE_ID 
} from '../lib/firebase';
import { City, Project, DocumentationPhoto } from '../types';
import { INITIAL_CITIES, INITIAL_PROJECTS, INITIAL_DOCUMENTATION } from '../data/initialData';
import { idbGet, idbSet, idbClear } from '../utils/idbStorage';

const CITIES_KEY = 'sentra_properti_cities_v2';
const PROJECTS_KEY = 'sentra_properti_projects_v2';
const DOCS_KEY = 'sentra_properti_docs_v2';
const INITIALIZED_FLAG_KEY = 'sentra_properti_initialized_v2';
const DOCS_INITIALIZED_KEY = 'sentra_properti_docs_initialized_v2';
const ADMIN_AUTH_KEY = 'sentra_properti_admin_auth_v1';
const CITIES_DOC_ID = 'cities_list';
const CITIES_COLLECTION = 'dbcities';
export const DOCS_COLLECTION = 'dbdocumentation';

// Maximum size (bytes) for storing an individual item in synchronous localStorage (~400KB limit)
// Anything larger will be exclusively stored in IndexedDB and in-memory cache to prevent QuotaExceededError
const MAX_LOCALSTORAGE_ITEM_LENGTH = 400 * 1024;

/**
 * Safely writes to localStorage, handling storage quota limits gracefully
 * without logging unhandled errors or crashing.
 */
function safeSetLocalStorage(key: string, value: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  
  // If string payload is too big, skip localStorage to protect the 5MB browser quota
  if (value.length > MAX_LOCALSTORAGE_ITEM_LENGTH) {
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch {
    // If quota exceeded, free up bloated caches to keep critical auth/flags intact
    try {
      localStorage.removeItem(PROJECTS_KEY);
      localStorage.removeItem(DOCS_KEY);
    } catch {
      // Ignore
    }
  }
}

export interface FirestoreMainDoc {
  cities: City[];
  projects: Project[];
  updatedAt: number;
  firebaseName: string;
  firestoreDatabase: string;
  collectionId: string;
  documentId: string;
}

// Deep sanitation to remove undefined or invalid values before writing to Firestore
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// In-memory cache for fast, reliable synchronous access
let memoryCities: City[] | null = null;
let memoryProjects: Project[] | null = null;
let memoryDocs: DocumentationPhoto[] | null = null;

// Clean up any oversized historical localStorage items from previous sessions to unblock quota
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const rawProjects = localStorage.getItem(PROJECTS_KEY);
    if (rawProjects && rawProjects.length > MAX_LOCALSTORAGE_ITEM_LENGTH) {
      localStorage.removeItem(PROJECTS_KEY);
    }
    const rawDocs = localStorage.getItem(DOCS_KEY);
    if (rawDocs && rawDocs.length > MAX_LOCALSTORAGE_ITEM_LENGTH) {
      localStorage.removeItem(DOCS_KEY);
    }
  } catch {
    // Ignore
  }

  // Pre-fetch persistent data from IndexedDB into memory caches in the background
  Promise.all([
    idbGet<City[]>(CITIES_KEY),
    idbGet<Project[]>(PROJECTS_KEY),
    idbGet<DocumentationPhoto[]>(DOCS_KEY),
  ]).then(([idbCities, idbProjects, idbDocs]) => {
    if (idbCities && idbCities.length > 0 && memoryCities === null) {
      memoryCities = sortCitiesByFirstAdded(idbCities);
    }
    if (idbProjects && idbProjects.length > 0 && memoryProjects === null) {
      memoryProjects = idbProjects;
    }
    if (idbDocs && idbDocs.length > 0 && memoryDocs === null) {
      memoryDocs = idbDocs;
    }
  }).catch(() => {
    // Background prefetch note
  });
}

// Sort cities chronologically: from first added to latest
export function sortCitiesByFirstAdded(cities: City[]): City[] {
  return [...cities].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined && a.order !== b.order) {
      return a.order - b.order;
    }
    const timeA = a.createdAt || 0;
    const timeB = b.createdAt || 0;
    return timeA - timeB;
  });
}

export const storageService = {
  // Local cache helpers
  getLocalCities(): City[] {
    if (memoryCities !== null) {
      return sortCitiesByFirstAdded(memoryCities);
    }
    try {
      const data = localStorage.getItem(CITIES_KEY);
      const isInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY);
      if (!data) {
        if (!isInitialized) {
          memoryCities = sortCitiesByFirstAdded(INITIAL_CITIES);
          return memoryCities;
        }
        memoryCities = [];
        return [];
      }
      const parsed = JSON.parse(data);
      memoryCities = Array.isArray(parsed) ? sortCitiesByFirstAdded(parsed) : sortCitiesByFirstAdded(INITIAL_CITIES);
      return memoryCities;
    } catch {
      memoryCities = sortCitiesByFirstAdded(INITIAL_CITIES);
      return memoryCities;
    }
  },

  setLocalCities(cities: City[]): void {
    const sorted = sortCitiesByFirstAdded(cities);
    memoryCities = [...sorted];
    // Persist to IndexedDB (asynchronous, high capacity)
    idbSet(CITIES_KEY, sorted).catch(() => {});
    // Persist to localStorage safely
    safeSetLocalStorage(CITIES_KEY, JSON.stringify(sorted));
    safeSetLocalStorage(INITIALIZED_FLAG_KEY, 'true');
  },

  getLocalProjects(): Project[] {
    if (memoryProjects !== null) {
      return memoryProjects;
    }
    try {
      const data = localStorage.getItem(PROJECTS_KEY);
      const isInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY);
      if (!data) {
        if (!isInitialized) {
          memoryProjects = INITIAL_PROJECTS;
          return INITIAL_PROJECTS;
        }
        memoryProjects = [];
        return [];
      }
      const parsed = JSON.parse(data);
      memoryProjects = Array.isArray(parsed) ? parsed : INITIAL_PROJECTS;
      return memoryProjects;
    } catch {
      memoryProjects = INITIAL_PROJECTS;
      return memoryProjects;
    }
  },

  setLocalProjects(projects: Project[]): void {
    memoryProjects = [...projects];
    // Persist full project data (including all HD photos & schemes) to IndexedDB
    idbSet(PROJECTS_KEY, projects).catch(() => {});
    // Persist to localStorage safely without throwing QuotaExceededError
    safeSetLocalStorage(PROJECTS_KEY, JSON.stringify(projects));
    safeSetLocalStorage(INITIALIZED_FLAG_KEY, 'true');
  },

  getLocalDocumentation(): DocumentationPhoto[] {
    if (memoryDocs !== null) {
      return memoryDocs;
    }
    try {
      const data = localStorage.getItem(DOCS_KEY);
      const isInitialized = localStorage.getItem(DOCS_INITIALIZED_KEY);
      if (!data) {
        if (!isInitialized) {
          memoryDocs = INITIAL_DOCUMENTATION;
          return INITIAL_DOCUMENTATION;
        }
        memoryDocs = [];
        return [];
      }
      const parsed = JSON.parse(data);
      memoryDocs = Array.isArray(parsed) ? parsed : INITIAL_DOCUMENTATION;
      return memoryDocs;
    } catch {
      memoryDocs = INITIAL_DOCUMENTATION;
      return memoryDocs;
    }
  },

  setLocalDocumentation(docs: DocumentationPhoto[]): void {
    memoryDocs = [...docs];
    // Persist full documentation photos to IndexedDB (high capacity, never exceeds quota)
    idbSet(DOCS_KEY, docs).catch(() => {});
    // Persist to localStorage safely without throwing QuotaExceededError
    safeSetLocalStorage(DOCS_KEY, JSON.stringify(docs));
    safeSetLocalStorage(DOCS_INITIALIZED_KEY, 'true');
  },

  // Synchronous getters
  getCities(): City[] {
    return this.getLocalCities();
  },

  getProjects(): Project[] {
    return this.getLocalProjects();
  },

  getDocumentation(): DocumentationPhoto[] {
    return this.getLocalDocumentation();
  },

  // Real-time Firestore Listener for Collection: dbproperti (Multi-doc per project)
  subscribeToData(
    onUpdate: (cities: City[], projects: Project[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const propertyColRef = collection(db, PROPERTY_COLLECTION);
    const citiesDocRef = doc(db, CITIES_COLLECTION, CITIES_DOC_ID);

    let citiesListenerUnsub: Unsubscribe | null = null;

    // Listen to collection: each project is an individual doc
    const colUnsub = onSnapshot(
      propertyColRef,
      async (colSnapshot) => {
        const individualProjects: Project[] = [];
        let legacyMasterProjects: Project[] | null = null;
        let remoteCitiesFromDoc: City[] | null = null;

        colSnapshot.forEach((docSnap) => {
          const docId = docSnap.id;
          const data = docSnap.data();

          if (docId === DATABASE_DOC_ID) {
            // Legacy master summary doc
            if (Array.isArray(data.cities) && data.cities.length > 0) {
              remoteCitiesFromDoc = sortCitiesByFirstAdded(data.cities);
            }
            if (Array.isArray(data.projects)) {
              legacyMasterProjects = data.projects;
            }
          } else if (docId === 'cities_metadata' || docId === CITIES_DOC_ID) {
            if (Array.isArray(data.cities) && data.cities.length > 0) {
              remoteCitiesFromDoc = sortCitiesByFirstAdded(data.cities);
            }
          } else if (data && (data.name || data.price !== undefined)) {
            // Individual project document
            const p = data as Project;
            individualProjects.push({
              ...p,
              id: p.id || docId
            });
          }
        });

        // Determine final projects list:
        // 1. If individual project docs exist, they are the single source of truth.
        // 2. If NO individual docs exist but legacy master doc has projects, migrate them to individual docs once.
        let finalProjects: Project[] = [];

        if (individualProjects.length > 0) {
          finalProjects = individualProjects;
        } else if (legacyMasterProjects && legacyMasterProjects.length > 0) {
          // One-time migration of legacy projects into individual docs
          for (const legP of legacyMasterProjects) {
            if (legP && legP.id) {
              try {
                const sRef = doc(db, PROPERTY_COLLECTION, legP.id);
                await setDoc(sRef, sanitizeForFirestore(legP));
              } catch (mErr) {
                console.warn('Migration legacy proj note:', mErr);
              }
            }
          }
          finalProjects = legacyMasterProjects;
        } else if (colSnapshot.empty && !localStorage.getItem(INITIALIZED_FLAG_KEY)) {
          // Only seed initial data if brand new database
          await this.migrateAllDataToFirestore();
          return;
        }

        const currentCities = remoteCitiesFromDoc || this.getLocalCities();
        this.setLocalCities(currentCities);
        this.setLocalProjects(finalProjects);
        onUpdate(currentCities, finalProjects);
      },
      (err) => {
        console.warn('Firestore property collection subscription error:', err.message);
        if (onError) onError(err);
      }
    );

    // Also listen to cities list doc
    citiesListenerUnsub = onSnapshot(
      citiesDocRef,
      (citySnap) => {
        if (citySnap.exists()) {
          const cData = citySnap.data();
          if (Array.isArray(cData.cities)) {
            const sorted = sortCitiesByFirstAdded(cData.cities);
            this.setLocalCities(sorted);
            onUpdate(sorted, this.getLocalProjects());
          }
        }
      },
      (cErr) => {
        console.warn('Firestore cities subscription note:', cErr.message);
      }
    );

    return () => {
      colUnsub();
      if (citiesListenerUnsub) citiesListenerUnsub();
    };
  },

  // Seed / migrate data if Firestore documents are missing
  async migrateAllDataToFirestore(): Promise<{ cities: City[]; projects: Project[] }> {
    try {
      let currentCities = this.getLocalCities();
      let currentProjects = this.getLocalProjects();

      if (currentCities.length === 0) currentCities = sortCitiesByFirstAdded(INITIAL_CITIES);
      if (currentProjects.length === 0) currentProjects = INITIAL_PROJECTS;

      // 1. Write individual project documents
      for (const p of currentProjects) {
        try {
          const singleRef = doc(db, PROPERTY_COLLECTION, p.id);
          await setDoc(singleRef, sanitizeForFirestore(p));
        } catch (singleErr) {
          console.warn('Seed single project note:', singleErr);
        }
      }

      // 2. Write cities collection doc
      try {
        const citiesDocRef = doc(db, CITIES_COLLECTION, CITIES_DOC_ID);
        await setDoc(citiesDocRef, sanitizeForFirestore({ cities: currentCities, updatedAt: Date.now() }));
      } catch (cErr) {
        console.warn('Seed cities doc note:', cErr);
      }

      // 3. Write master summary doc
      try {
        const mainDocRef = doc(db, PROPERTY_COLLECTION, DATABASE_DOC_ID);
        const payload: FirestoreMainDoc = {
          cities: currentCities,
          projects: currentProjects,
          updatedAt: Date.now(),
          firebaseName: FIREBASE_DB_NAME,
          firestoreDatabase: FIRESTORE_DATABASE_ID,
          collectionId: PROPERTY_COLLECTION,
          documentId: DATABASE_DOC_ID
        };
        await setDoc(mainDocRef, sanitizeForFirestore(payload));
      } catch (mErr) {
        console.warn('Seed master doc note:', mErr);
      }

      this.setLocalCities(currentCities);
      this.setLocalProjects(currentProjects);

      return { cities: currentCities, projects: currentProjects };
    } catch (e) {
      console.error('Failed to migrate data to Firestore:', e);
      return { cities: this.getLocalCities(), projects: this.getLocalProjects() };
    }
  },

  // Direct helper to save complete state to Firestore
  async syncToFirestore(cities: City[], projects: Project[]): Promise<void> {
    const sortedCities = sortCitiesByFirstAdded(cities);
    
    // Save cities doc
    try {
      const citiesDocRef = doc(db, CITIES_COLLECTION, CITIES_DOC_ID);
      await setDoc(citiesDocRef, sanitizeForFirestore({ cities: sortedCities, updatedAt: Date.now() }));
    } catch (cErr) {
      console.warn('sync cities doc note:', cErr);
    }

    // Try to save master doc (safe catch if too large)
    try {
      const mainDocRef = doc(db, PROPERTY_COLLECTION, DATABASE_DOC_ID);
      const payload: FirestoreMainDoc = {
        cities: sortedCities,
        projects,
        updatedAt: Date.now(),
        firebaseName: FIREBASE_DB_NAME,
        firestoreDatabase: FIRESTORE_DATABASE_ID,
        collectionId: PROPERTY_COLLECTION,
        documentId: DATABASE_DOC_ID
      };
      await setDoc(mainDocRef, sanitizeForFirestore(payload));
    } catch (mErr: unknown) {
      console.warn('Master document update note (exceeded single doc limit, individual docs used):', mErr);
    }
  },

  // Cities CRUD with Firestore (Chronological order preserved: first added first)
  async saveCity(city: City): Promise<City[]> {
    const cities = this.getLocalCities();
    const cityWithMeta: City = {
      ...city,
      createdAt: city.createdAt || Date.now(),
      order: city.order || (cities.length + 1)
    };

    const existingIndex = cities.findIndex((c) => c.id === city.id);
    let updated: City[];
    if (existingIndex >= 0) {
      updated = [...cities];
      updated[existingIndex] = cityWithMeta;
    } else {
      updated = [...cities, cityWithMeta];
    }

    const sortedCities = sortCitiesByFirstAdded(updated);
    this.setLocalCities(sortedCities);
    const projects = this.getLocalProjects();

    try {
      await this.syncToFirestore(sortedCities, projects);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Firestore saveCity sync error:', msg);
      throw new Error(`Gagal menyimpan data kota ke database: ${msg}`);
    }
    return sortedCities;
  },

  async deleteCity(cityId: string): Promise<{ cities: City[]; projects: Project[] }> {
    const cities = this.getLocalCities().filter((c) => c.id !== cityId);
    const projects = this.getLocalProjects().filter((p) => p.cityId !== cityId);

    const sortedCities = sortCitiesByFirstAdded(cities);
    this.setLocalCities(sortedCities);
    this.setLocalProjects(projects);

    try {
      await this.syncToFirestore(sortedCities, projects);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Firestore deleteCity sync error:', msg);
      throw new Error(`Gagal menghapus kota dari database: ${msg}`);
    }
    return { cities: sortedCities, projects };
  },

  // Projects CRUD with Firestore: Dedicated Document per Project
  async saveProject(project: Project): Promise<Project[]> {
    const projectWithMeta: Project = {
      ...project,
      createdAt: project.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    const projects = this.getLocalProjects();
    const existingIndex = projects.findIndex((p) => p.id === projectWithMeta.id);
    let updated: Project[];
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = projectWithMeta;
    } else {
      updated = [projectWithMeta, ...projects];
    }

    // Save to local cache first
    this.setLocalProjects(updated);
    const cities = this.getLocalCities();

    // 1. Write individual project document directly to Firestore (atomic & reliable)
    try {
      const singleDocRef = doc(db, PROPERTY_COLLECTION, projectWithMeta.id);
      await setDoc(singleDocRef, sanitizeForFirestore(projectWithMeta));
    } catch (singleErr: unknown) {
      const msg = singleErr instanceof Error ? singleErr.message : String(singleErr);
      console.error('Firestore single project write error:', msg);
      throw new Error(`Gagal menyimpan data proyek ke database: ${msg}`);
    }

    // 2. Also sync to master summary doc and cities in background
    try {
      await this.syncToFirestore(cities, updated);
    } catch (syncErr) {
      console.warn('Background master doc sync note:', syncErr);
    }

    return updated;
  },

  async deleteProject(projectId: string): Promise<Project[]> {
    const currentProjects = this.getLocalProjects();
    const updatedProjects = currentProjects.filter((p) => p.id !== projectId);
    
    this.setLocalProjects(updatedProjects);
    const cities = this.getLocalCities();

    // 1. Delete single project document from Firestore dbproperti
    try {
      const singleDocRef = doc(db, PROPERTY_COLLECTION, projectId);
      await deleteDoc(singleDocRef);
    } catch (singleErr: unknown) {
      const msg = singleErr instanceof Error ? singleErr.message : String(singleErr);
      console.warn('Single project doc delete note:', msg);
    }

    // 2. Sync to cities & master doc in background
    try {
      await this.syncToFirestore(cities, updatedProjects);
    } catch (err) {
      console.warn('Master doc delete sync note:', err);
    }

    return updatedProjects;
  },

  // Real-time Firestore Listener for Collection: dbdocumentation (Multi-doc per photo)
  subscribeToDocumentation(
    onUpdate: (docs: DocumentationPhoto[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const docsColRef = collection(db, DOCS_COLLECTION);

    const unsub = onSnapshot(
      docsColRef,
      async (colSnapshot) => {
        const individualDocs: DocumentationPhoto[] = [];

        colSnapshot.forEach((docSnap) => {
          const docId = docSnap.id;
          const data = docSnap.data();

          if (docId === 'documentation_list' || docId === 'master_docs') {
            if (Array.isArray(data.photos) && data.photos.length > 0) {
              data.photos.forEach((p: DocumentationPhoto) => {
                if (p && p.id && !individualDocs.some((d) => d.id === p.id)) {
                  individualDocs.push(p);
                }
              });
            }
          } else if (data && (data.photoUrl || data.caption !== undefined || data.title !== undefined)) {
            const p = data as DocumentationPhoto;
            individualDocs.push({
              ...p,
              id: p.id || docId,
            });
          }
        });

        // Sort documentation photos: newest first
        individualDocs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        // If collection is completely empty and never initialized before, seed initial documentation
        if (colSnapshot.empty && !localStorage.getItem(DOCS_INITIALIZED_KEY)) {
          for (const initDoc of INITIAL_DOCUMENTATION) {
            try {
              const singleDocRef = doc(db, DOCS_COLLECTION, initDoc.id);
              await setDoc(singleDocRef, sanitizeForFirestore(initDoc));
            } catch (err) {
              console.warn('Seed doc item note:', err);
            }
          }
          this.setLocalDocumentation(INITIAL_DOCUMENTATION);
          onUpdate(INITIAL_DOCUMENTATION);
          return;
        }

        this.setLocalDocumentation(individualDocs);
        onUpdate(individualDocs);
      },
      (err) => {
        console.warn('Firestore documentation collection subscription note:', err.message);
        if (onError) onError(err);
      }
    );

    return unsub;
  },

  // Save / Update a documentation photo (saves to Firestore doc: dbdocumentation/{docId})
  async saveDocumentationPhoto(docPhoto: DocumentationPhoto): Promise<DocumentationPhoto[]> {
    const current = this.getLocalDocumentation();
    const existingIdx = current.findIndex((d) => d.id === docPhoto.id);

    let updatedDocs: DocumentationPhoto[];
    const payload: DocumentationPhoto = {
      ...docPhoto,
      updatedAt: Date.now(),
      createdAt: docPhoto.createdAt || Date.now(),
    };

    if (existingIdx >= 0) {
      updatedDocs = [...current];
      updatedDocs[existingIdx] = payload;
    } else {
      updatedDocs = [payload, ...current];
    }

    // Sort newest first
    updatedDocs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Update in-memory & local cache
    this.setLocalDocumentation(updatedDocs);

    // Write to Firestore as individual document
    try {
      const singleDocRef = doc(db, DOCS_COLLECTION, payload.id);
      await setDoc(singleDocRef, sanitizeForFirestore(payload));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Error saving documentation photo to Firestore:', msg);
    }

    return updatedDocs;
  },

  // Delete a documentation photo
  async deleteDocumentationPhoto(photoId: string): Promise<DocumentationPhoto[]> {
    const current = this.getLocalDocumentation();
    const updatedDocs = current.filter((d) => d.id !== photoId);

    // Update local cache
    this.setLocalDocumentation(updatedDocs);

    // Delete from Firestore
    try {
      const singleDocRef = doc(db, DOCS_COLLECTION, photoId);
      await deleteDoc(singleDocRef);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Error deleting documentation photo from Firestore:', msg);
    }

    return updatedDocs;
  },

  // Reset to default (Seed fresh initial data to Firestore)
  async resetToDefault(): Promise<{ cities: City[]; projects: Project[]; documentation?: DocumentationPhoto[] }> {
    try {
      localStorage.removeItem(CITIES_KEY);
      localStorage.removeItem(PROJECTS_KEY);
      localStorage.removeItem(DOCS_KEY);
      localStorage.removeItem(INITIALIZED_FLAG_KEY);
      localStorage.removeItem(DOCS_INITIALIZED_KEY);
    } catch {
      // Ignore
    }
    await idbClear();
    memoryCities = [...INITIAL_CITIES];
    memoryProjects = [...INITIAL_PROJECTS];
    memoryDocs = [...INITIAL_DOCUMENTATION];

    this.setLocalCities(INITIAL_CITIES);
    this.setLocalProjects(INITIAL_PROJECTS);
    this.setLocalDocumentation(INITIAL_DOCUMENTATION);

    try {
      await this.migrateAllDataToFirestore();
      for (const d of INITIAL_DOCUMENTATION) {
        try {
          const docRef = doc(db, DOCS_COLLECTION, d.id);
          await setDoc(docRef, sanitizeForFirestore(d));
        } catch (e) {
          console.warn('Reset doc item note:', e);
        }
      }
    } catch (err) {
      console.error('Firestore resetToDefault sync failed:', err);
    }
    return { cities: INITIAL_CITIES, projects: INITIAL_PROJECTS, documentation: INITIAL_DOCUMENTATION };
  },

  // Export database
  exportDatabase(): string {
    const payload = {
      version: '2.1',
      firebaseName: FIREBASE_DB_NAME,
      firestoreDatabase: FIRESTORE_DATABASE_ID,
      collectionId: PROPERTY_COLLECTION,
      documentId: DATABASE_DOC_ID,
      docsCollectionId: DOCS_COLLECTION,
      firestorePath: `${PROPERTY_COLLECTION}/${DATABASE_DOC_ID}`,
      exportedAt: new Date().toISOString(),
      cities: this.getLocalCities(),
      projects: this.getLocalProjects(),
      documentation: this.getLocalDocumentation(),
    };
    return JSON.stringify(payload, null, 2);
  },

  // Import database directly to Firestore
  async importDatabase(jsonStr: string): Promise<{ success: boolean; cities?: City[]; projects?: Project[]; documentation?: DocumentationPhoto[]; error?: string }> {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.cities || !Array.isArray(data.cities) || !data.projects || !Array.isArray(data.projects)) {
        return { success: false, error: 'Format file JSON tidak valid (harus memuat array kota dan proyek).' };
      }

      this.setLocalCities(data.cities);
      this.setLocalProjects(data.projects);

      if (Array.isArray(data.documentation)) {
        this.setLocalDocumentation(data.documentation);
        for (const docItem of data.documentation) {
          try {
            const singleDocRef = doc(db, DOCS_COLLECTION, docItem.id);
            await setDoc(singleDocRef, sanitizeForFirestore(docItem));
          } catch (e) {
            console.warn('Import single documentation doc error:', e);
          }
        }
      }

      // Save each project
      for (const p of data.projects) {
        try {
          const singleDocRef = doc(db, PROPERTY_COLLECTION, p.id);
          await setDoc(singleDocRef, sanitizeForFirestore(p));
        } catch (e) {
          console.warn('Import single project doc error:', e);
        }
      }

      await this.syncToFirestore(data.cities, data.projects);

      return { success: true, cities: data.cities, projects: data.projects, documentation: data.documentation };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal parsing data JSON';
      return { success: false, error: msg };
    }
  },

  // Admin Auth State
  isAdminLoggedIn(): boolean {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  },

  setAdminLoggedIn(val: boolean): void {
    if (val) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  },
};
