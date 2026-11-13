import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Calendar, 
  Tag, 
  FileText, 
  Link as LinkIcon,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { DocumentationPhoto } from '../types';
import { compressImageFile } from '../utils/imageUtils';

interface AdminDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: DocumentationPhoto) => Promise<void>;
  editingDoc: DocumentationPhoto | null;
}

const CATEGORY_OPTIONS = [
  'Akad & Serah Terima',
  'Progress Bangun',
  'Survey Lokasi',
  'Kunjungan Konsumen',
  'Event & Pameran',
  'Site Visit Proyek',
  'Lainnya'
];

export const AdminDocumentationModal: React.FC<AdminDocumentationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDoc
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [category, setCategory] = useState('Akad & Serah Terima');
  const [date, setDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingDoc) {
      setTitle(editingDoc.title || '');
      setCaption(editingDoc.caption || '');
      setPhotoUrl(editingDoc.photoUrl || '');
      setCategory(editingDoc.category || 'Akad & Serah Terima');
      setDate(editingDoc.date || new Date().toISOString().split('T')[0]);
      setUrlInput(editingDoc.photoUrl || '');
    } else {
      setTitle('');
      setCaption('');
      setPhotoUrl('');
      setCategory('Akad & Serah Terima');
      setDate(new Date().toISOString().split('T')[0]);
      setUrlInput('');
    }
    setErrorMsg(null);
  }, [editingDoc, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const compressedBase64 = await compressImageFile(file, 1200, 1200, 0.75);
      setPhotoUrl(compressedBase64);
    } catch (err: unknown) {
      console.error('Upload foto dokumentasi error:', err);
      setErrorMsg('Gagal memproses foto. Silakan pilih file gambar lain.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMsg('Masukkan URL foto yang valid.');
      return;
    }
    setPhotoUrl(urlInput.trim());
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      setErrorMsg('Harap unggah atau masukkan foto dokumentasi terlebih dahulu.');
      return;
    }
    if (!caption.trim()) {
      setErrorMsg('Harap isi keterangan/deskripsi foto dokumentasi.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);

      const payload: DocumentationPhoto = {
        id: editingDoc?.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: title.trim() || 'Dokumentasi Proyek',
        caption: caption.trim(),
        photoUrl: photoUrl.trim(),
        category: category.trim() || 'Lainnya',
        date: date || new Date().toISOString().split('T')[0],
        createdAt: editingDoc?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan foto dokumentasi';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0B1E36] to-[#153258] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {editingDoc ? 'Edit Foto Dokumentasi' : 'Tambah Foto Dokumentasi'}
              </h3>
              <p className="text-[11px] text-slate-300">
                Dokumentasi foto kegiatan, progres pembangunan, & akad konsumen
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Foto Dokumentasi (Wajib)</span>
              </span>
              <div className="flex items-center gap-1 text-[11px] font-normal">
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`px-2 py-0.5 rounded ${inputMode === 'upload' ? 'bg-amber-500 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`px-2 py-0.5 rounded ${inputMode === 'url' ? 'bg-amber-500 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  Link URL
                </button>
              </div>
            </label>

            {/* Upload Mode */}
            {inputMode === 'upload' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  photoUrl 
                    ? 'border-amber-400 bg-amber-50/30' 
                    : 'border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-slate-100/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 text-amber-600">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span className="text-xs font-bold">Mengompres & memproses foto...</span>
                  </div>
                ) : photoUrl ? (
                  <div className="space-y-2">
                    <div className="relative aspect-video max-h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 mx-auto">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] text-amber-700 font-semibold flex items-center justify-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Klik untuk mengganti foto</span>
                    </p>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Klik atau seret foto ke sini</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP (Otomatis dikompres optimal)</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* URL Mode */
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                  >
                    Terapkan
                  </button>
                </div>

                {photoUrl && (
                  <div className="relative aspect-video max-h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 mx-auto">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Judul & Kategori Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Judul Foto / Kegiatan */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Judul / Nama Kegiatan</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Serah Terima Kunci Unit B3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Kategori / Tag */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Kategori / Tag</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal Kegiatan */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Tanggal Dokumentasi</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          {/* Keterangan / Deskripsi Foto (Prominent Requirement) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Keterangan Foto Dokumentasi (Wajib)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Ditampilkan di bawah foto
              </span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tuliskan keterangan detail mengenai foto ini (misal: prosesi serah terima unit blok B2 bersama konsumen dan tim legal Sentra Properti)..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{editingDoc ? 'Simpan Perubahan' : 'Tambahkan Foto'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
