import React, { useState, useEffect } from 'react';
import { City, Project } from '../types';
import { AlertTriangle, Trash2, X, Building, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DeleteCityWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: City | null;
  projects: Project[];
  onConfirmDelete: (cityId: string) => void;
}

export const DeleteCityWarningModal: React.FC<DeleteCityWarningModalProps> = ({
  isOpen,
  onClose,
  city,
  projects,
  onConfirmDelete,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setConfirmText('');
    setIsAgreed(false);
    setIsDeleting(false);
  }, [isOpen, city]);

  if (!isOpen || !city) return null;

  const cityProjects = projects.filter((p) => p.cityId === city.id);
  const hasProjects = cityProjects.length > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(city.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id="delete-city-warning-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Warning Accent */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                {hasProjects ? 'Peringatan: Kota Memiliki Proyek Aktif!' : 'Konfirmasi Hapus Kota'}
              </h3>
              <p className="text-[11px] text-rose-100 font-medium">
                Tindakan ini akan mempengaruhi database Firebase Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-rose-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Main Warning Box */}
          {hasProjects ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-bold text-sm text-amber-950 mb-1">
                  Kota &ldquo;{city.name}&rdquo; masih memiliki {cityProjects.length} proyek aktif!
                </p>
                <p>
                  Jika Anda menghapus kota ini, <strong>seluruh {cityProjects.length} proyek properti beserta semua foto galeri dan skema cicilan terkait</strong> akan ikut terhapus secara permanen dari database Firebase Firestore.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <p>
                Apakah Anda yakin ingin menghapus data kota <strong>&ldquo;{city.name}&rdquo; ({city.province})</strong>? Kota ini tidak memiliki proyek terkait.
              </p>
            </div>
          )}

          {/* List of Affected Projects */}
          {hasProjects && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-600" />
                  <span>Daftar Proyek yang Akan Terhapus ({cityProjects.length}):</span>
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                {cityProjects.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate">{p.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md flex-shrink-0 font-medium">
                        {p.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-extrabold text-amber-700 flex-shrink-0 ml-2">
                      {p.priceLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Checkbox / Confirmation */}
          {hasProjects && (
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded-md border-slate-300 focus:ring-rose-500 mt-0.5"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Saya memahami bahwa menghapus kota ini akan <strong>menghapus permanen {cityProjects.length} proyek properti</strong> beserta seluruh foto dari Firestore.
                </span>
              </label>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Ketik nama kota <span className="text-rose-600 font-black">&ldquo;{city.name}&rdquo;</span> untuk mengonfirmasi:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`Ketik ${city.name}`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isDeleting}
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              Batalkan (Aman)
            </button>
            <button
              type="button"
              disabled={
                isDeleting ||
                (hasProjects && (!isAgreed || confirmText.trim().toLowerCase() !== city.name.trim().toLowerCase()))
              }
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {isDeleting
                  ? 'Menghapus...'
                  : hasProjects
                  ? `Tetap Hapus Kota & ${cityProjects.length} Proyek`
                  : 'Hapus Kota'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
