import React, { useState } from 'react';
import { Logo } from './Logo';
import { 
  Building2, 
  MapPin, 
  Search, 
  Shield, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Database,
  Menu, 
  X,
  Sparkles,
  PhoneCall,
  Camera
} from 'lucide-react';

interface NavbarProps {
  currentView: 'cities' | 'projects' | 'all';
  onNavigate: (view: 'cities' | 'projects' | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenAddProject: () => void;
  onOpenAddCity: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenAddProject,
  onOpenAddCity,
  onOpenBackup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all">
      {/* Top Banner Notice for Admin & Status */}
      <div className="bg-gradient-to-r from-[#0B1E36] via-[#102a4c] to-[#0B1E36] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">Sentra Properti — Database Manajemen Properti</span>
          </div>

          <div className="flex items-center gap-4 text-slate-200">
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Aktif</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div 
            id="brand-logo-container"
            onClick={() => onNavigate('cities')}
            className="cursor-pointer group transition-transform active:scale-95"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-input-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari nama project, kota, kavling, ruko, kosan..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 sm:gap-2">
            <button
              id="nav-btn-cities"
              onClick={() => onNavigate('cities')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'cities'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-xs'
                  : 'text-slate-600 hover:text-[#0B1E36] hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Hierarki Kota</span>
            </button>

            <button
              id="nav-btn-all-projects"
              onClick={() => onNavigate('all')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'all'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-xs'
                  : 'text-slate-600 hover:text-[#0B1E36] hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Semua Proyek</span>
            </button>

            <button
              id="nav-btn-documentation"
              onClick={() => {
                const docEl = document.getElementById('documentation-section');
                if (docEl) {
                  docEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-[#0B1E36] hover:bg-slate-100 transition-all"
            >
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Foto Dokumentasi</span>
            </button>

            {/* Admin Management Buttons */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 pl-2 ml-2 border-l border-slate-200">
                <button
                  id="admin-add-project-btn"
                  onClick={onOpenAddProject}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Proyek</span>
                </button>

                <button
                  id="admin-add-city-btn"
                  onClick={onOpenAddCity}
                  className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
                  title="Tambah Kota Baru"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kota</span>
                </button>

                <button
                  id="admin-backup-btn"
                  onClick={onOpenBackup}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Database Backup & JSON Sync"
                >
                  <Database className="w-4 h-4" />
                </button>

                <button
                  id="admin-logout-btn"
                  onClick={onAdminLogout}
                  className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Keluar Mode Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                id="open-admin-login-btn"
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 ml-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 rounded-lg transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {isAdmin ? (
              <button
                onClick={onOpenAddProject}
                className="p-2 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs"
                title="Tambah Proyek"
              >
                <Plus className="w-4 h-4" />
              </button>
            ) : null}

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari project, kota, tanah, ruko..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                onNavigate('cities');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold ${
                currentView === 'cities' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Hierarki Kota</span>
            </button>

            <button
              onClick={() => {
                onNavigate('all');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold ${
                currentView === 'all' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Semua Proyek</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const docEl = document.getElementById('documentation-section');
                  if (docEl) docEl.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Foto Dokumentasi</span>
            </button>

            {isAdmin ? (
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => {
                    onOpenAddProject();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Proyek Baru</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAddCity();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-100 text-slate-800 rounded-lg text-sm font-semibold"
                >
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>+ Tambah Kota Baru</span>
                </button>

                <button
                  onClick={() => {
                    onOpenBackup();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Database JSON Sync & Backup</span>
                </button>

                <button
                  onClick={() => {
                    onAdminLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Admin</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAdminLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-100 text-slate-800 rounded-lg text-sm font-bold"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Admin Login (Edit Database)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
