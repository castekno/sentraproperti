import React, { useState, useEffect, useMemo } from 'react';
import { City, Project, PropertyCategory, DocumentationPhoto } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { CityList } from './components/CityList';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminCityModal } from './components/AdminCityModal';
import { AdminProjectModal } from './components/AdminProjectModal';
import { DatabaseBackupModal } from './components/DatabaseBackupModal';
import { DocumentationSection } from './components/DocumentationSection';
import { AdminDocumentationModal } from './components/AdminDocumentationModal';
import { DocumentationLightboxModal } from './components/DocumentationLightboxModal';
import { Footer } from './components/Footer';
import { 
  Building2, 
  MapPin, 
  Filter, 
  Plus, 
  Sparkles, 
  ArrowLeft, 
  SlidersHorizontal,
  ChevronRight,
  Home,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';

export default function App() {
  // Data state
  const [cities, setCities] = useState<City[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documentation, setDocumentation] = useState<DocumentationPhoto[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Navigation & Filter state
  const [currentView, setCurrentView] = useState<'cities' | 'projects' | 'all'>('cities');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'default' | 'oldest' | 'price-asc' | 'price-desc'>('default');

  // Modals state
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Documentation Modals state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentationPhoto | null>(null);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<DocumentationPhoto | null>(null);

  // Project Deletion Confirmation Modal State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  // Toast Notification State
  const [toastNotification, setToastNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastNotification({ text, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Initialize data & real-time Firestore sync
  useEffect(() => {
    // Initial load from cache
    const loadedCities = storageService.getCities();
    const loadedProjects = storageService.getProjects();
    const loadedDocs = storageService.getDocumentation();
    setCities(loadedCities);
    setProjects(loadedProjects);
    setDocumentation(loadedDocs);
    setIsAdmin(storageService.isAdminLoggedIn());

    // Subscribe to Firestore updates in real-time
    const unsubscribe = storageService.subscribeToData((updatedCities, updatedProjects) => {
      setCities(updatedCities);
      setProjects(updatedProjects);
    });

    const unsubscribeDocs = storageService.subscribeToDocumentation((updatedDocs) => {
      setDocumentation(updatedDocs);
    });

    return () => {
      unsubscribe();
      unsubscribeDocs();
    };
  }, []);

  // Selected City Object
  const selectedCity = useMemo(() => {
    return cities.find((c) => c.id === selectedCityId) || null;
  }, [cities, selectedCityId]);

  // Unique project names available in current context (selected city or all)
  const availableProjectNames = useMemo<string[]>(() => {
    const contextProjects = currentView === 'cities' && selectedCityId
      ? projects.filter((p) => p.cityId === selectedCityId)
      : projects;
    const nameSet = new Set<string>();
    contextProjects.forEach((p) => {
      const trimmed = (p.name || '').trim();
      if (trimmed) nameSet.add(trimmed);
    });
    return Array.from(nameSet).sort((a, b) => a.localeCompare(b, 'id'));
  }, [projects, currentView, selectedCityId]);

  // Reset selectedProjectName if it's no longer available in the current city/project context
  useEffect(() => {
    if (selectedProjectName !== 'ALL' && !availableProjectNames.includes(selectedProjectName)) {
      setSelectedProjectName('ALL');
    }
  }, [availableProjectNames, selectedProjectName]);

  // Filtered Projects
  const displayedProjects = useMemo(() => {
    return projects.filter((proj) => {
      // City filter
      if (currentView === 'cities' && selectedCityId) {
        if (proj.cityId !== selectedCityId) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cityMatch = cities.find((c) => c.id === proj.cityId)?.name.toLowerCase().includes(q);
        const match =
          proj.name.toLowerCase().includes(q) ||
          proj.category.toLowerCase().includes(q) ||
          proj.address.toLowerCase().includes(q) ||
          proj.description.toLowerCase().includes(q) ||
          cityMatch;
        if (!match) return false;
      }

      // Project Name filter
      if (selectedProjectName !== 'ALL' && proj.name !== selectedProjectName) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && proj.category !== selectedCategory) {
        return false;
      }

      // Payment Scheme filter
      if (selectedScheme !== 'ALL' && !proj.paymentSchemes.includes(selectedScheme as any)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [projects, cities, currentView, selectedCityId, searchQuery, selectedProjectName, selectedCategory, selectedScheme, sortBy]);

  // Handlers for City
  const handleSelectCity = (cityId: string) => {
    setSelectedCityId(cityId);
    setCurrentView('cities');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSaveCity = async (city: City) => {
    try {
      const updatedOk = await storageService.saveCity(city);
      setCities(updatedOk);
      if (!selectedCityId) {
        setSelectedCityId(city.id);
      }
    } catch (err: any) {
      console.error("Gagal menyimpan kota:", err);
      throw err;
    }
  };

  const handleDeleteCity = async (cityId: string) => {
    try {
      const res = await storageService.deleteCity(cityId);
      setCities(res.cities);
      setProjects(res.projects);
      if (selectedCityId === cityId) {
        setSelectedCityId(null);
      }
    } catch (err: any) {
      console.error("Gagal menghapus kota:", err);
      alert("Gagal menghapus kota: " + (err?.message || "Terjadi kesalahan saat menghapus kota"));
    }
  };

  // Handlers for Project
  const handleSaveProject = async (project: Project) => {
    try {
      const updated = await storageService.saveProject(project);
      setProjects(updated);
      setSelectedCityId(project.cityId);
      
      // Smooth scroll to projects section so newly created project is instantly visible
      setTimeout(() => {
        const projSection = document.getElementById('projects-section');
        if (projSection) {
          projSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 400);
    } catch (err: any) {
      console.error("Gagal menyimpan proyek:", err);
      throw err;
    }
  };

  const handleRequestDeleteProject = (project: Project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    try {
      const projectName = projectToDelete.name;
      const updated = await storageService.deleteProject(projectToDelete.id);
      setProjects(updated);
      
      // Close detail modal if the deleted project was open
      if (selectedProjectForDetail?.id === projectToDelete.id) {
        setSelectedProjectForDetail(null);
      }

      setProjectToDelete(null);
      showToast(`Proyek "${projectName}" berhasil dihapus dari database.`);
    } catch (err: any) {
      console.error("Gagal menghapus proyek:", err);
      showToast(`Gagal menghapus proyek: ${err?.message || "Terjadi kesalahan"}`, 'error');
    } finally {
      setIsDeletingProject(false);
    }
  };

  // Handlers for Documentation Photos
  const handleSaveDoc = async (docPhoto: DocumentationPhoto) => {
    try {
      const updated = await storageService.saveDocumentationPhoto(docPhoto);
      setDocumentation(updated);
      showToast(editingDoc ? 'Foto dokumentasi berhasil diperbarui!' : 'Foto dokumentasi baru berhasil ditambahkan!');
    } catch (err: any) {
      console.error('Gagal menyimpan foto dokumentasi:', err);
      showToast('Gagal menyimpan foto dokumentasi: ' + (err?.message || 'Terjadi kesalahan'), 'error');
      throw err;
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      const updated = await storageService.deleteDocumentationPhoto(docId);
      setDocumentation(updated);
      showToast('Foto dokumentasi berhasil dihapus dari database.');
    } catch (err: any) {
      console.error('Gagal menghapus foto dokumentasi:', err);
      showToast('Gagal menghapus foto dokumentasi: ' + (err?.message || 'Terjadi kesalahan'), 'error');
      throw err;
    }
  };

  // Admin Auth Handlers
  const handleSuccessAdminLogin = () => {
    setIsAdmin(true);
    storageService.setAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    storageService.setAdminLoggedIn(false);
  };

  // Categories list
  const categoryFilters = [
    'ALL',
    'Rumah',
    'Ruko',
    'Kosan',
    'Tanah Kavling',
    'Tanah Kebun',
    'Tanah Tambang',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'all') setSelectedCityId(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        onOpenAddProject={() => {
          setEditingProject(null);
          setIsProjectModalOpen(true);
        }}
        onOpenAddCity={() => {
          setEditingCity(null);
          setIsCityModalOpen(true);
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        {/* LEVEL 1: CITIES HIERARCHY SECTION (Shown in 'cities' view) */}
        {currentView === 'cities' && (
          <CityList
            cities={cities}
            projects={projects}
            selectedCityId={selectedCityId}
            onSelectCity={handleSelectCity}
            isAdmin={isAdmin}
            onAddCity={() => {
              setEditingCity(null);
              setIsCityModalOpen(true);
            }}
            onEditCity={(c) => {
              setEditingCity(c);
              setIsCityModalOpen(true);
            }}
            onDeleteCity={handleDeleteCity}
          />
        )}

        {/* LEVEL 2: PROJECTS SECTION (Shown under selected city OR in 'all' view) */}
        <section id="projects-section" className="pt-2">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                <button
                  onClick={() => {
                    setCurrentView('cities');
                    setSelectedCityId(null);
                  }}
                  className="hover:text-amber-600 flex items-center gap-1"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Semua Kota</span>
                </button>
                {selectedCity && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-amber-700 font-bold">{selectedCity.name}</span>
                  </>
                )}
                {currentView === 'all' && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-amber-700 font-bold">Semua Proyek</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-1">
                <Building2 className="w-4 h-4" />
                <span>Lokasi & Nama Proyek Properti</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E36] tracking-tight">
                {selectedCity
                  ? `Daftar Proyek di ${selectedCity.name}`
                  : 'Daftar Semua Proyek Properti'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Menampilkan <strong className="text-[#0B1E36] font-bold">{displayedProjects.length}</strong> proyek properti yang siap dijual.
              </p>
            </div>

            {/* Top Controls: Add project button if admin */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Proyek di {selectedCity ? selectedCity.name : 'Database'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="py-4 space-y-3">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Kategori:</span>
              </span>
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0B1E36] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>

            {/* Filter controls row: Project Name, Payment Scheme, Reset & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                {/* Project Name filter */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Nama Proyek:</span>
                  </span>
                  <select
                    value={selectedProjectName}
                    onChange={(e) => setSelectedProjectName(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[220px] truncate"
                  >
                    <option value="ALL">Semua Nama Proyek ({availableProjectNames.length})</option>
                    {availableProjectNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment scheme filter */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Skema Bayar:</span>
                  <select
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="ALL">Semua Skema</option>
                    <option value="Cash">Cash Keras</option>
                    <option value="Cash Bertahap">Cash Bertahap (0%)</option>
                    <option value="Bank BSI">KPR Bank BSI</option>
                    <option value="Credit Developer">Credit Developer</option>
                  </select>
                </div>

                {/* Reset filter button if any active */}
                {(selectedProjectName !== 'ALL' || selectedCategory !== 'ALL' || selectedScheme !== 'ALL' || searchQuery.trim() !== '') && (
                  <button
                    onClick={() => {
                      setSelectedProjectName('ALL');
                      setSelectedCategory('ALL');
                      setSelectedScheme('ALL');
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition-colors border border-amber-200"
                    title="Reset semua filter"
                  >
                    <X className="w-3 h-3 text-amber-600" />
                    <span>Reset Filter</span>
                  </button>
                )}
              </div>

              {/* Price & Date Sort */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="default">Terbaru Ditambahkan</option>
                  <option value="oldest">Terlama Ditambahkan</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {displayedProjects.map((project) => {
              const projCity = cities.find((c) => c.id === project.cityId);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  city={projCity}
                  onSelect={(p) => setSelectedProjectForDetail(p)}
                  isAdmin={isAdmin}
                  onEdit={(p) => {
                    setEditingProject(p);
                    setIsProjectModalOpen(true);
                  }}
                  onDelete={handleRequestDeleteProject}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {displayedProjects.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Tidak ada proyek yang sesuai filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Coba ubah kata kunci pencarian, pilih kategori lain, atau tambahkan proyek baru jika Anda memiliki akses admin.
              </p>
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Proyek Baru</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Group Foto-foto Dokumentasi - Tepat setelah group Daftar Semua Proyek Properti */}
        <DocumentationSection
          documentation={documentation}
          isAdmin={isAdmin}
          onAddDoc={() => {
            setEditingDoc(null);
            setIsDocModalOpen(true);
          }}
          onEditDoc={(doc) => {
            setEditingDoc(doc);
            setIsDocModalOpen(true);
          }}
          onDeleteDoc={handleDeleteDoc}
          onSelectPhotoDetail={(doc) => setSelectedDocForDetail(doc)}
        />
      </main>

      {/* Modals Container */}
      <ProjectDetailModal
        project={selectedProjectForDetail}
        city={cities.find((c) => c.id === selectedProjectForDetail?.cityId)}
        isOpen={!!selectedProjectForDetail}
        onClose={() => setSelectedProjectForDetail(null)}
        isAdmin={isAdmin}
        onEdit={(p) => {
          setEditingProject(p);
          setIsProjectModalOpen(true);
        }}
        onDelete={handleRequestDeleteProject}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccessLogin={handleSuccessAdminLogin}
      />

      <AdminCityModal
        isOpen={isCityModalOpen}
        onClose={() => {
          setIsCityModalOpen(false);
          setEditingCity(null);
        }}
        onSaveCity={handleSaveCity}
        editingCity={editingCity}
      />

      <AdminProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSaveProject={handleSaveProject}
        editingProject={editingProject}
        cities={cities}
        selectedCityId={selectedCityId}
        existingProjects={projects}
      />

      <AdminDocumentationModal
        isOpen={isDocModalOpen}
        onClose={() => {
          setIsDocModalOpen(false);
          setEditingDoc(null);
        }}
        onSave={handleSaveDoc}
        editingDoc={editingDoc}
      />

      <DocumentationLightboxModal
        isOpen={!!selectedDocForDetail}
        onClose={() => setSelectedDocForDetail(null)}
        photo={selectedDocForDetail}
        allPhotos={documentation}
        onSelectPhoto={(photo) => setSelectedDocForDetail(photo)}
      />

      <DatabaseBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        cities={cities}
        projects={projects}
        documentation={documentation}
        onDataRefreshed={(newCities, newProjects, newDocs) => {
          setCities(newCities);
          setProjects(newProjects);
          if (newDocs) setDocumentation(newDocs);
        }}
      />

      {/* Dedicated In-App Project Deletion Confirmation Dialog */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-700 font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </div>
                <span>Hapus Proyek Properti?</span>
              </div>
              <button
                type="button"
                disabled={isDeletingProject}
                onClick={() => setProjectToDelete(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {projectToDelete.photos && projectToDelete.photos[0] ? (
                  <img
                    src={projectToDelete.photos[0]}
                    alt={projectToDelete.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">
                    {projectToDelete.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {projectToDelete.address}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-extrabold text-amber-600">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(projectToDelete.price)}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {projectToDelete.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Data proyek ini akan <strong>dihapus secara permanen</strong> dari database Firestore. Data yang sudah dihapus tidak dapat dipulihkan kembali.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeletingProject}
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeletingProject}
                onClick={handleConfirmDeleteProject}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeletingProject ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-bold ${
            toastNotification.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-700'
              : 'bg-[#0B1E36]/95 text-white border-slate-700'
          }`}>
            {toastNotification.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span>{toastNotification.text}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
