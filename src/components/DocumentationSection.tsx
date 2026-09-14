import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  Plus, 
  Search, 
  Calendar, 
  Tag, 
  FileText, 
  Maximize2, 
  Edit3, 
  Trash2, 
  Sparkles,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import { DocumentationPhoto } from '../types';

interface DocumentationSectionProps {
  documentation: DocumentationPhoto[];
  isAdmin: boolean;
  onAddDoc: () => void;
  onEditDoc: (doc: DocumentationPhoto) => void;
  onDeleteDoc: (docId: string) => Promise<void>;
  onSelectPhotoDetail: (doc: DocumentationPhoto) => void;
}

const CATEGORY_TABS = [
  'Semua',
  'Akad & Serah Terima',
  'Progress Bangun',
  'Survey Lokasi',
  'Event & Pameran',
  'Site Visit Proyek',
  'Lainnya'
];

export const DocumentationSection: React.FC<DocumentationSectionProps> = ({
  documentation,
  isAdmin,
  onAddDoc,
  onEditDoc,
  onDeleteDoc,
  onSelectPhotoDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [docToDelete, setDocToDelete] = useState<DocumentationPhoto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered documentation list
  const filteredDocs = useMemo(() => {
    return documentation.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.title || '').toLowerCase().includes(query);
        const captionMatch = (item.caption || '').toLowerCase().includes(query);
        const catMatch = (item.category || '').toLowerCase().includes(query);
        if (!titleMatch && !captionMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [documentation, selectedCategory, searchQuery]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    try {
      setIsDeleting(true);
      await onDeleteDoc(docToDelete.id);
      setDocToDelete(null);
    } catch (err) {
      console.error('Gagal menghapus foto dokumentasi:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="documentation-section" className="space-y-6 pt-6 border-t border-slate-200/80">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>DOKUMENTASI KEGIATAN & PROYEK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B1E36] tracking-tight">
            Daftar Foto-foto Dokumentasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Bukti nyata progres pembangunan fisik, survei konsumen di lapangan, hingga momen serah terima kunci dan legalitas SHM bersama Sentra Properti.
          </p>
        </div>

        {/* Action button if admin */}
        {isAdmin && (
          <button
            onClick={onAddDoc}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Foto Dokumentasi</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul atau keterangan foto dokumentasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Counter info */}
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 self-end sm:self-auto">
            <span>Menampilkan:</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800">
              {filteredDocs.length} Foto
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0B1E36] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documentation Photos Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredDocs.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-0.5"
            >
              {/* Photo Area */}
              <div 
                onClick={() => onSelectPhotoDetail(item)}
                className="relative aspect-[16/11] bg-slate-900 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.photoUrl}
                  alt={item.title || 'Foto Dokumentasi'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-90 transition-opacity" />

                {/* Category Badge & Date Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  {item.category && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#0B1E36]/90 backdrop-blur-xs text-amber-300 border border-amber-400/30 text-[10px] font-bold tracking-wide">
                      {item.category}
                    </span>
                  )}
                  {item.date && (
                    <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-amber-400" />
                      <span>{formatDate(item.date)}</span>
                    </span>
                  )}
                </div>

                {/* Hover Preview Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/75 backdrop-blur-xs text-white rounded-xl text-xs font-bold border border-white/20 shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lihat Foto Penuh</span>
                  </span>
                </div>

                {/* Tampilan Tulisan "DOKUMENTASI" di Kanan Bawah Foto */}
                <div className="absolute bottom-2.5 right-2.5 pointer-events-none z-10">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0B1E36]/90 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                    DOKUMENTASI
                  </span>
                </div>
              </div>

              {/* Card Body: Title & Field Keterangan */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <div className="space-y-2">
                  {/* Judul Foto */}
                  <h3 
                    onClick={() => onSelectPhotoDetail(item)}
                    className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {item.title || 'Dokumentasi Kegiatan'}
                  </h3>

                  {/* FIELD KETERANGAN (Under Photo) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Keterangan:
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                          {item.caption || 'Tidak ada keterangan tambahan.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: Admin Controls or Public Info */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectPhotoDetail(item)}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
                  >
                    <span>Buka Detail & Zoom</span>
                  </button>

                  {/* Admin Edit & Delete Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDoc(item);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 rounded-lg text-xs font-bold transition-colors"
                        title="Edit Foto & Keterangan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocToDelete(item);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-bold transition-colors"
                        title="Hapus Foto Dokumentasi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-700">
            {searchQuery || selectedCategory !== 'Semua' 
              ? 'Tidak ada foto dokumentasi yang cocok dengan filter'
              : 'Belum ada foto dokumentasi yang ditambahkan'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'Semua'
              ? 'Silakan coba ubah kata kunci pencarian atau pilih tab kategori lain.'
              : 'Sebagai admin, Anda dapat menambahkan foto dokumentasi baru tanpa batasan jumlah.'}
          </p>
          {isAdmin && (
            <button
              onClick={onAddDoc}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Foto Pertama</span>
            </button>
          )}
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {docToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => !isDeleting && setDocToDelete(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 text-center space-y-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Hapus Foto Dokumentasi?
              </h4>
              <p className="text-xs text-slate-600">
                Apakah Anda yakin ingin menghapus foto <span className="font-bold text-slate-800">"{docToDelete.title}"</span>? Tindakan ini akan menghapus foto dari database dan tidak dapat dibatalkan.
              </p>

              {/* Preview image thumbnail */}
              {docToDelete.photoUrl && (
                <div className="w-full max-h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 mt-2">
                  <img
                    src={docToDelete.photoUrl}
                    alt="Preview"
                    className="w-full h-32 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Sekarang</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
