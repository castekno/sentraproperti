import React, { useState } from 'react';
import { Project, City } from '../types';
import { 
  X, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Maximize2, 
  Layers, 
  Bed, 
  Bath, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Car, 
  Compass, 
  CreditCard, 
  PhoneCall, 
  Share2, 
  Printer, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Building,
  Building2,
  Boxes,
  Info,
  FileImage,
  ZoomIn,
  Eye,
  Download,
  Trash2,
  Copy,
  Check,
  Users
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  city?: City;
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  city,
  isOpen,
  onClose,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMapUrl, setCopiedMapUrl] = useState(false);

  if (!isOpen || !project) return null;

  // Format currency IDR
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Only display photos that actually exist (do not pad with sample dummy images)
  const rawPhotos = (project.photos || []).map((p) => p.trim()).filter(Boolean);
  const photosList = rawPhotos.length > 0 
    ? rawPhotos 
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  const safeIndex = activePhotoIndex < photosList.length ? activePhotoIndex : 0;
  const currentPhotoUrl = photosList[safeIndex] || photosList[0];

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photosList.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photosList.length) % photosList.length);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMapUrl = () => {
    const mapLink = project.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(project.name + ' ' + project.address)}`;
    navigator.clipboard.writeText(mapLink);
    setCopiedMapUrl(true);
    setTimeout(() => setCopiedMapUrl(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp Contact text generator
  const waMessage = encodeURIComponent(
    `Halo Tim Sentra Properti, saya tertarik dan ingin konsultasi / survey lokasi untuk:\n\n` +
    `*Nama Project*: ${project.name}\n` +
    (project.groupSales ? `*Group Sales*: ${project.groupSales}\n` : '') +
    `*Kategori*: ${project.category}\n` +
    `*Kota*: ${city ? city.name : '-'}\n` +
    `*Harga*: ${formatRupiah(project.price)}\n` +
    `*Skema Minat*: ${project.paymentSchemes.join(', ')}\n\n` +
    `Mohon informasi ketersediaan unit, jadwal survey, dan pricelist lengkapnya. Terima kasih.`
  );

  const hasBsiPhoto = project.paymentSchemes.includes('Bank BSI') && !!project.bsiSchemePhoto;
  const hasCashBertahapPhoto = project.paymentSchemes.includes('Cash Bertahap') && !!project.cashBertahapSchemePhoto;
  const hasCreditDeveloperPhoto = project.paymentSchemes.includes('Credit Developer') && !!project.creditDeveloperSchemePhoto;

  return (
    <div 
      id="project-detail-modal" 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 transition-all"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 sm:px-8 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-lg border border-amber-200 flex-shrink-0">
              {project.category}
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#0B1E36] truncate">
              {project.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(project);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </button>
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(project);
                    }}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-rose-200"
                    title="Hapus Proyek"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Salin Link Brosur"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:block p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Cetak Brosur Properti"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              title="Tutup Detail"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8">
          {copiedLink && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Link properti berhasil disalin ke clipboard!</span>
            </div>
          )}

          {/* 1. FOTO UTAMA PROJECT GALLERY SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm sm:text-base font-extrabold text-[#0B1E36]">
                  Foto Utama Project
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Foto {activePhotoIndex + 1} dari {photosList.length}
              </span>
            </div>

            {/* Main Active Photo Frame */}
            <div className="relative h-64 sm:h-96 md:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900 group shadow-md">
              <img
                src={currentPhotoUrl}
                alt={`${project.name} - Foto ${activePhotoIndex + 1}`}
                referrerPolicy="no-referrer"
                onClick={() => setLightboxImage({ url: currentPhotoUrl, caption: `${project.name} - Foto ${activePhotoIndex + 1}` })}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
              />

              {/* Navigation arrows */}
              {photosList.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-600 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-95"
                    title="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-600 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-95"
                    title="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Overlay Bar without caption text */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 text-white flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-slate-200">
                  {project.name} • #{activePhotoIndex + 1}
                </span>
                <span className="text-[11px] text-amber-300 font-semibold">
                  Klik foto untuk perbesar (HD)
                </span>
              </div>
            </div>

            {/* Group Sales di Bawah Frame Foto Utama */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-medium text-slate-400 block leading-tight">
                Group Sales: <span className={project.groupSales ? "text-slate-600 font-semibold" : "text-slate-400 font-normal"}>{project.groupSales || '-'}</span>
              </span>
            </div>

            {/* Photos Thumbnail Row */}
            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {photosList.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative flex-shrink-0 h-14 w-20 sm:h-18 sm:w-24 rounded-xl overflow-hidden border-2 transition-all ${
                    activePhotoIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-300 ring-offset-1 scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] font-bold text-white px-1.5 py-0.2 rounded">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. PRICE & PRIMARY OVERVIEW GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-br from-slate-50 to-amber-50/40 p-6 rounded-2xl border border-amber-100">
            {/* Price Column */}
            <div className="md:col-span-2 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
                <Building className="w-4 h-4" />
                <span>PENAWARAN HARGA TERBAIK SENTRA PROPERTI</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#0B1E36]">
                {formatRupiah(project.price)}
              </div>

              {/* Unit Availability Highlight Banner */}
              {(project.totalUnits !== undefined || project.availableUnits !== undefined) && (
                <div className="inline-flex flex-wrap items-center gap-2.5 p-2 bg-white/90 rounded-xl border border-amber-200/80 shadow-xs text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Boxes className="w-4 h-4 text-amber-600" />
                    <span>Total: <strong className="text-[#0B1E36]">{project.totalUnits ?? '-'} Unit</strong></span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">Sisa: </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                      (project.availableUnits ?? 0) === 0
                        ? 'bg-rose-100 text-rose-700'
                        : (project.availableUnits ?? 0) <= 3
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {project.availableUnits !== undefined ? `${project.availableUnits} Unit Tersedia` : '-'}
                    </span>
                  </div>
                  {project.totalUnits && project.availableUnits !== undefined && (
                    <div className="text-[11px] text-slate-500 hidden sm:inline">
                      ({Math.round(((project.totalUnits - project.availableUnits) / project.totalUnits) * 100)}% Terjual)
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-slate-500">
                *Harga sewaktu-waktu dapat berubah sesuai ketersediaan unit dan skema diskon promo yang berlaku.
              </p>

              {/* Location Tag */}
              <div className="flex items-start gap-2 pt-1 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B1E36]">{project.address}</span>
                  {city && <span className="text-slate-500"> — {city.name}, {city.province}</span>}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col justify-center gap-2.5">
              <a
                href={`https://wa.me/6281234567890?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hubungi Marketing (WA)</span>
              </a>

              {isAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(project);
                  }}
                  className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kelola & Edit Project</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. SKEMA PENJUALAN (CASH, CASH BERTAHAP, BANK BSI) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-extrabold text-[#0B1E36]">
                Pilihan Skema Penjualan
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Cash Keras */}
              <div className={`p-4 rounded-2xl border transition-all ${
                project.paymentSchemes.includes('Cash')
                  ? 'bg-blue-50/60 border-blue-200 ring-1 ring-blue-300'
                  : 'bg-slate-50 border-slate-200 opacity-40'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-blue-900 text-sm">1. Cash Keras</span>
                  {project.paymentSchemes.includes('Cash') && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Tersedia
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pelunasan langsung dalam waktu 14-30 hari. Berhak mendapatkan potongan harga diskon spesial & bonus kelengkapan interior/AJB gratis.
                </p>
              </div>

              {/* Cash Bertahap */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                project.paymentSchemes.includes('Cash Bertahap')
                  ? 'bg-amber-50/70 border-amber-200 ring-1 ring-amber-300'
                  : 'bg-slate-50 border-slate-200 opacity-40'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-amber-900 text-sm">2. Cash Bertahap</span>
                    {project.paymentSchemes.includes('Cash Bertahap') && (
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Tersedia
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cicilan langsung inhouse ke developer tanpa bank. Tenor fleksibel 6 - 36 bulan dengan skema 0% bunga murni syariah tanpa denda dan sita.
                  </p>
                </div>

                {project.paymentSchemes.includes('Cash Bertahap') && (
                  <div className="mt-3 pt-3 border-t border-amber-200/80">
                    {project.cashBertahapSchemePhoto ? (
                      <button
                        type="button"
                        onClick={() => setLightboxImage({
                          url: project.cashBertahapSchemePhoto!,
                          caption: project.cashBertahapSchemePhotoCaption || 'Tabel Skema Cicilan Cash Bertahap Developer 0%'
                        })}
                        className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Skema Perhitungan</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-800/80 font-medium block text-center">
                        Skema tabel cicilan tersedia via Marketing
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bank BSI */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                project.paymentSchemes.includes('Bank BSI')
                  ? 'bg-emerald-50/70 border-emerald-200 ring-1 ring-emerald-300'
                  : 'bg-slate-50 border-slate-200 opacity-40'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-emerald-900 text-sm">3. Bank BSI (KPR Syariah)</span>
                    {project.paymentSchemes.includes('Bank BSI') && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Tersedia
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pembiayaan Griya BSI Hasanah (Bank Syariah Indonesia). Akad Murabahah / MMQ yang tenang, angsuran pasti tetap hingga lunas, DP mulai 0-10%.
                  </p>
                </div>

                {project.paymentSchemes.includes('Bank BSI') && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/80">
                    {project.bsiSchemePhoto ? (
                      <button
                        type="button"
                        onClick={() => setLightboxImage({
                          url: project.bsiSchemePhoto!,
                          caption: project.bsiSchemePhotoCaption || 'Tabel & Skema Angsuran KPR Syariah Bank BSI'
                        })}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Skema Perhitungan</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-800/80 font-medium block text-center">
                        Simulasi KPR Syariah via Bank BSI
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Credit Developer */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                project.paymentSchemes.includes('Credit Developer')
                  ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-300'
                  : 'bg-slate-50 border-slate-200 opacity-40'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-indigo-900 text-sm">4. Credit Developer</span>
                    {project.paymentSchemes.includes('Credit Developer') && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Tersedia
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cicilan langsung inhouse ke developer tanpa BI checking dan proses perbankan rumit. Transaksi syariah langsung aman dan tenor bersahabat.
                  </p>
                </div>

                {project.paymentSchemes.includes('Credit Developer') && (
                  <div className="mt-3 pt-3 border-t border-indigo-200/80">
                    {project.creditDeveloperSchemePhoto ? (
                      <button
                        type="button"
                        onClick={() => setLightboxImage({
                          url: project.creditDeveloperSchemePhoto!,
                          caption: project.creditDeveloperSchemePhotoCaption || 'Tabel Skema Cicilan Credit Developer'
                        })}
                        className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Skema Perhitungan</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-indigo-800/80 font-medium block text-center">
                        Skema tabel cicilan tersedia via Marketing
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FOTO SKEMA CICILAN (KPR BSI, CASH BERTAHAP, CREDIT DEVELOPER) SECTION */}
            {(hasBsiPhoto || hasCashBertahapPhoto || hasCreditDeveloperPhoto) && (
              <div className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-5 h-5 text-amber-600" />
                    <h4 className="font-extrabold text-sm sm:text-base text-[#0B1E36]">
                      Brosur & File Skema Perhitungan Cicilan
                    </h4>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    Klik foto skema untuk perbesar / HD
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Foto Skema KPR BSI */}
                  {hasBsiPhoto && (
                    <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          Foto Skema KPR Bank BSI
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          KPR Syariah BSI
                        </span>
                      </div>

                      <div 
                        className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden bg-slate-900 group cursor-pointer border border-slate-200"
                        onClick={() => setLightboxImage({
                          url: project.bsiSchemePhoto!,
                          caption: project.bsiSchemePhotoCaption || 'Tabel & Skema Angsuran KPR Syariah Bank BSI'
                        })}
                      >
                        <img
                          src={project.bsiSchemePhoto}
                          alt="Foto Skema Cicilan KPR BSI"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain bg-slate-950 transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-2xs">
                          <ZoomIn className="w-5 h-5" />
                          <span>Klik Lihat Skema Full HD</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setLightboxImage({
                            url: project.bsiSchemePhoto!,
                            caption: `${project.name} - Skema KPR Bank BSI`
                          })}
                          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Buka Skema Perhitungan BSI (Full HD)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Foto Skema Cash Bertahap */}
                  {hasCashBertahapPhoto && (
                    <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          Foto Skema Cash Bertahap
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          Developer 0%
                        </span>
                      </div>

                      <div 
                        className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden bg-slate-900 group cursor-pointer border border-slate-200"
                        onClick={() => setLightboxImage({
                          url: project.cashBertahapSchemePhoto!,
                          caption: `${project.name} - Skema Cash Bertahap`
                        })}
                      >
                        <img
                          src={project.cashBertahapSchemePhoto}
                          alt="Foto Skema Cicilan Cash Bertahap"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain bg-slate-950 transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-2xs">
                          <ZoomIn className="w-5 h-5" />
                          <span>Klik Lihat Skema Full HD</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setLightboxImage({
                            url: project.cashBertahapSchemePhoto!,
                            caption: `${project.name} - Skema Cash Bertahap`
                          })}
                          className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>Buka Skema Perhitungan Bertahap (Full HD)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Foto Skema Credit Developer */}
                  {hasCreditDeveloperPhoto && (
                    <div className="bg-white rounded-2xl p-4 border border-indigo-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          Foto Skema Credit Developer
                        </span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                          Inhouse Developer
                        </span>
                      </div>

                      <div 
                        className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden bg-slate-900 group cursor-pointer border border-slate-200"
                        onClick={() => setLightboxImage({
                          url: project.creditDeveloperSchemePhoto!,
                          caption: `${project.name} - Skema Credit Developer`
                        })}
                      >
                        <img
                          src={project.creditDeveloperSchemePhoto}
                          alt="Foto Skema Cicilan Credit Developer"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain bg-slate-950 transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-2xs">
                          <ZoomIn className="w-5 h-5" />
                          <span>Klik Lihat Skema Full HD</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setLightboxImage({
                            url: project.creditDeveloperSchemePhoto!,
                            caption: `${project.name} - Skema Credit Developer`
                          })}
                          className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Buka Skema Credit Developer (Full HD)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. DETAIL SPESIFIKASI PROJECT YANG DIJUAL */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-[#0B1E36] flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600" />
              <span>Detail Spesifikasi Unit Proyek</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {/* Group Sales */}
              {project.groupSales && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <div className="flex items-center gap-2 text-amber-700 text-xs mb-1 font-semibold">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>Group Sales</span>
                  </div>
                  <div className="font-extrabold text-sm text-[#0B1E36] truncate" title={project.groupSales}>
                    {project.groupSales}
                  </div>
                </div>
              )}

              {/* Jumlah Total Unit */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-2 text-amber-700 text-xs mb-1 font-semibold">
                  <Boxes className="w-3.5 h-3.5 text-amber-600" />
                  <span>Jumlah Unit</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">
                  {project.totalUnits !== undefined ? `${project.totalUnits} Unit` : 'Tersedia'}
                </div>
              </div>

              {/* Sisa Unit */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                <div className="flex items-center gap-2 text-emerald-700 text-xs mb-1 font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sisa Unit</span>
                </div>
                <div className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                  <span>{project.availableUnits !== undefined ? `${project.availableUnits} Unit` : 'Tersedia'}</span>
                  {project.availableUnits !== undefined && project.availableUnits <= 3 && project.availableUnits > 0 && (
                    <span className="text-[10px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded">
                      Limit!
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Luas Tanah</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">{project.landArea} m²</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Luas Bangunan</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">
                  {project.buildingArea > 0 ? `${project.buildingArea} m²` : 'Lahan Kosong'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Bed className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kamar Tidur</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">
                  {project.bedrooms > 0 ? `${project.bedrooms} Kamar` : '-'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Bath className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kamar Mandi</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">
                  {project.bathrooms > 0 ? `${project.bathrooms} Kamar` : '-'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Car className="w-3.5 h-3.5 text-amber-600" />
                  <span>Carport / Parkir</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">
                  {project.carports ? `${project.carports} Kendaraan` : 'Area Lapang'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Legalitas Surat</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">{project.certificate || 'SHM'}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Daya Listrik</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">{project.electricity || 'Standard PLN'}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Droplets className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sumber Air</span>
                </div>
                <div className="font-extrabold text-sm text-[#0B1E36]">{project.waterSource || 'PDAM / Sumur'}</div>
              </div>
            </div>

            {/* Description Text */}
            <div className="mt-4 p-5 bg-white rounded-2xl border border-slate-200">
              <h4 className="font-bold text-sm text-[#0B1E36] mb-2">Deskripsi Lengkap Project</h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </div>

          {/* 5. FASILITAS & KEUNGGULAN LOKASI STRATEGIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fasilitas */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-sm text-[#0B1E36] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fasilitas Kawasan & Properti</span>
              </h4>
              <ul className="space-y-2">
                {project.facilities && project.facilities.map((fac, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Akses Strategis */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-sm text-[#0B1E36] mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Akses & Lokasi Strategis</span>
              </h4>
              <ul className="space-y-2">
                {project.strategicPoints && project.strategicPoints.map((pt, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6. URL MAP & INTEGRASI LOKASI */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Peta Lokasi & Koordinat Map</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Lokasi Google Maps Proyek
                </h4>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs text-slate-300 truncate max-w-md bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
                    {project.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(project.name + ' ' + project.address)}`}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMapUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-xs"
                    title="Salin Link Google Maps"
                  >
                    {copiedMapUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={project.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(project.name + ' ' + project.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white px-5 sm:px-8 py-3.5 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="hidden sm:block text-xs text-slate-500">
            Database Terintegrasi <span className="font-bold text-[#0B1E36]">Sentra Properti</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
            >
              Tutup
            </button>

            <a
              href={`https://wa.me/6281234567890?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Jadwalkan Survey Lokasi</span>
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          {/* Header Action Bar */}
          <div 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-70"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={lightboxImage.url}
              target="_blank"
              rel="noreferrer"
              download="skema-perhitungan-properti.jpg"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-bold backdrop-blur-md transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Buka File / Unduh</span>
            </a>

            <button
              onClick={() => setLightboxImage(null)}
              className="text-white hover:text-amber-400 p-2 text-sm font-bold bg-white/20 hover:bg-white/30 rounded-full px-4 backdrop-blur-md transition-all"
            >
              ✕ Tutup
            </button>
          </div>
          
          <img
            src={lightboxImage.url}
            alt={lightboxImage.caption}
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-[92vw] object-contain rounded-xl shadow-2xl bg-slate-900 border border-white/10"
          />

          <div 
            onClick={(e) => e.stopPropagation()}
            className="text-white text-center mt-4 text-xs sm:text-sm font-semibold bg-black/80 px-6 py-2.5 rounded-full border border-white/20 max-w-2xl"
          >
            {lightboxImage.caption}
          </div>
        </div>
      )}
    </div>
  );
};
