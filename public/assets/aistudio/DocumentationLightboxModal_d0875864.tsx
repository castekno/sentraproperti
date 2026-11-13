import React, { useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Tag, 
  FileText,
  Building2,
  Sparkles
} from 'lucide-react';
import { DocumentationPhoto } from '../types';

interface DocumentationLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: DocumentationPhoto | null;
  allPhotos: DocumentationPhoto[];
  onSelectPhoto: (photo: DocumentationPhoto) => void;
}

export const DocumentationLightboxModal: React.FC<DocumentationLightboxModalProps> = ({
  isOpen,
  onClose,
  photo,
  allPhotos,
  onSelectPhoto,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photo, allPhotos]);

  if (!isOpen || !photo) return null;

  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
  const totalCount = allPhotos.length;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectPhoto(allPhotos[currentIndex - 1]);
    } else if (allPhotos.length > 0) {
      onSelectPhoto(allPhotos[allPhotos.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allPhotos.length - 1) {
      onSelectPhoto(allPhotos[currentIndex + 1]);
    } else if (allPhotos.length > 0) {
      onSelectPhoto(allPhotos[0]);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0B1E36] text-white rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/70 bg-[#0B1E36]/90">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              Dokumentasi Kegiatan #{currentIndex + 1} dari {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Photo Area */}
        <div className="relative flex-1 bg-black/60 flex items-center justify-center min-h-[280px] sm:min-h-[420px] max-h-[60vh] overflow-hidden group">
          <img
            src={photo.photoUrl}
            alt={photo.title || 'Dokumentasi'}
            className="w-full h-full object-contain max-h-[58vh] select-none"
          />

          {/* Navigation Arrows */}
          {totalCount > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-500 text-white flex items-center justify-center backdrop-blur-xs border border-white/10 transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
                title="Foto Sebelumnya (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-500 text-white flex items-center justify-center backdrop-blur-xs border border-white/10 transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
                title="Foto Berikutnya (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Tampilan Tulisan "DOKUMENTASI" di Kanan Bawah Foto */}
          <div className="absolute bottom-3 right-3 pointer-events-none z-10">
            <span className="px-2.5 py-1 rounded-md bg-[#0B1E36]/90 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[11px] font-black tracking-wider uppercase shadow-md">
              DOKUMENTASI
            </span>
          </div>
        </div>

        {/* Caption & Metadata Footer (Field Keterangan) */}
        <div className="p-5 sm:p-6 bg-[#0E2442] border-t border-slate-700/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {photo.title || 'Dokumentasi Properti'}
            </h4>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {photo.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[11px]">
                  <Tag className="w-3 h-3" />
                  <span>{photo.category}</span>
                </span>
              )}
              {photo.date && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{formatDate(photo.date)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Prominent Keterangan Field */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  Keterangan Dokumentasi:
                </p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {photo.caption || 'Tidak ada keterangan tambahan.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
