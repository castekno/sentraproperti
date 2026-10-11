import React, { useState, useEffect } from 'react';
import { Project, City, PropertyCategory, PaymentScheme, PropertyStatus } from '../types';
import { 
  X, 
  Building2, 
  MapPin, 
  CreditCard, 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Check, 
  Trash2,
  Sparkles,
  Info,
  Layers,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users
} from 'lucide-react';

import { compressImageFile } from '../utils/imageUtils';
import { storageService } from '../services/storageService';

interface AdminProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Project) => Promise<void> | void;
  editingProject: Project | null;
  cities: City[];
  selectedCityId?: string | null;
  existingProjects?: Project[];
}

const DEFAULT_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
];

export const AdminProjectModal: React.FC<AdminProjectModalProps> = ({
  isOpen,
  onClose,
  onSaveProject,
  editingProject,
  cities,
  selectedCityId,
  existingProjects,
}) => {
  const [cityId, setCityId] = useState('');
  const [name, setName] = useState('');
  const [groupSales, setGroupSales] = useState<string>('');
  const [category, setCategory] = useState<PropertyCategory>('Rumah');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [price, setPrice] = useState<number | ''>(500000000);
  const [paymentSchemes, setPaymentSchemes] = useState<PaymentScheme[]>(['Cash', 'Cash Bertahap', 'Bank BSI']);
  const [description, setDescription] = useState('');
  const [totalUnits, setTotalUnits] = useState<number | ''>(10);
  const [availableUnits, setAvailableUnits] = useState<number | ''>(5);
  const [landArea, setLandArea] = useState<number | ''>(100);
  const [buildingArea, setBuildingArea] = useState<number | ''>(60);
  const [bedrooms, setBedrooms] = useState<number | ''>(2);
  const [bathrooms, setBathrooms] = useState<number | ''>(1);
  const [carports, setCarports] = useState<number | ''>(1);
  const [floors, setFloors] = useState<number | ''>(1);
  const [electricity, setElectricity] = useState('1.300 Watt');
  const [waterSource, setWaterSource] = useState('PDAM');
  const [certificate, setCertificate] = useState('SHM (Sertifikat Hak Milik)');
  const [facilitiesStr, setFacilitiesStr] = useState('One Gate System, Keamanan 24 Jam, Row Jalan 7m, Taman');
  const [strategicStr, setStrategicStr] = useState('10 Menit ke Gerbang Tol, Dekat Sekolah & Rumah Sakit');
  const [status, setStatus] = useState<PropertyStatus>('Tersedia');
  const [featured, setFeatured] = useState<boolean>(false);

  // Dynamic Photo Count & Photo Slots (starts empty to avoid bloating database)
  const [photoCount, setPhotoCount] = useState<number>(6);
  const [photos, setPhotos] = useState<string[]>(Array(6).fill(''));

  // Foto Skema Cicilan KPR BSI, Cash Bertahap, & Credit Developer (Tanpa keterangan text field)
  const [bsiSchemePhoto, setBsiSchemePhoto] = useState<string>('');
  const [cashBertahapSchemePhoto, setCashBertahapSchemePhoto] = useState<string>('');
  const [creditDeveloperSchemePhoto, setCreditDeveloperSchemePhoto] = useState<string>('');

  // Loading and error state for database operations
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Track previous isOpen state and editing project ID to ONLY populate form on initial modal open
  const prevIsOpenRef = React.useRef(false);
  const prevEditingIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    const isOpening = isOpen && !wasOpen;
    const projectChanged = isOpen && (editingProject?.id || null) !== prevEditingIdRef.current;

    prevIsOpenRef.current = isOpen;
    prevEditingIdRef.current = editingProject?.id || null;

    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsSubmitting(false);
      return;
    }

    // Only populate form when modal opens or a different project is selected for editing
    if (isOpening || projectChanged) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsSubmitting(false);

      if (editingProject) {
        setCityId(editingProject.cityId);
        setName(editingProject.name);
        setGroupSales(editingProject.groupSales || '');
        setCategory(editingProject.category);
        setAddress(editingProject.address);
        setMapUrl(editingProject.mapUrl);
        setPrice(editingProject.price !== undefined ? editingProject.price : 500000000);
        setPaymentSchemes(editingProject.paymentSchemes || ['Cash']);
        setDescription(editingProject.description || '');
        setTotalUnits(editingProject.totalUnits !== undefined ? editingProject.totalUnits : '');
        setAvailableUnits(editingProject.availableUnits !== undefined ? editingProject.availableUnits : '');
        setLandArea(editingProject.landArea !== undefined ? editingProject.landArea : 100);
        setBuildingArea(editingProject.buildingArea !== undefined ? editingProject.buildingArea : 60);
        setBedrooms(editingProject.bedrooms !== undefined ? editingProject.bedrooms : 2);
        setBathrooms(editingProject.bathrooms !== undefined ? editingProject.bathrooms : 1);
        setCarports(editingProject.carports !== undefined ? editingProject.carports : 1);
        setFloors(editingProject.floors !== undefined ? editingProject.floors : 1);
        setElectricity(editingProject.electricity || '1.300 Watt');
        setWaterSource(editingProject.waterSource || 'PDAM');
        setCertificate(editingProject.certificate || 'SHM (Sertifikat Hak Milik)');
        setFacilitiesStr((editingProject.facilities || []).join(', '));
        setStrategicStr((editingProject.strategicPoints || []).join(', '));
        setStatus(editingProject.status || 'Tersedia');
        setFeatured(editingProject.featured || false);
        setBsiSchemePhoto(editingProject.bsiSchemePhoto || '');
        setCashBertahapSchemePhoto(editingProject.cashBertahapSchemePhoto || '');
        setCreditDeveloperSchemePhoto(editingProject.creditDeveloperSchemePhoto || '');

        const initialPhotos = editingProject.photos && editingProject.photos.length > 0
          ? [...editingProject.photos]
          : Array(6).fill('');
        
        setPhotoCount(initialPhotos.length);
        setPhotos(initialPhotos);
      } else {
        // Default new project
        setCityId(selectedCityId || (cities[0] ? cities[0].id : ''));
        setName('');
        setGroupSales('');
        setCategory('Rumah');
        setAddress('');
        setMapUrl('');
        setPrice(650000000);
        setPaymentSchemes(['Cash', 'Cash Bertahap', 'Bank BSI']);
        setDescription('Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.');
        setTotalUnits(10);
        setAvailableUnits(5);
        setLandArea(100);
        setBuildingArea(65);
        setBedrooms(3);
        setBathrooms(2);
        setCarports(1);
        setFloors(1);
        setElectricity('1.300 Watt');
        setWaterSource('PDAM');
        setCertificate('SHM (Sertifikat Hak Milik)');
        setFacilitiesStr('One Gate System, CCTV 24 Jam, Masjid, Taman Hijau, Row Jalan 8 Meter');
        setStrategicStr('Dekat Gerbang Tol, 10 Menit ke Stasiun KRL, Dekat Sekolah & Mall');
        setStatus('Tersedia');
        setFeatured(false);
        setBsiSchemePhoto('');
        setCashBertahapSchemePhoto('');
        setCreditDeveloperSchemePhoto('');
        setPhotoCount(6);
        setPhotos(Array(6).fill(''));
      }
    }
  }, [editingProject?.id, isOpen]);

  // Dynamic picklist for Group Sales based on all projects in database
  const availableGroupSales = React.useMemo(() => {
    const sourceProjects = (existingProjects && existingProjects.length > 0)
      ? existingProjects
      : storageService.getProjects();
    const list = sourceProjects
      .map((p) => p.groupSales?.trim())
      .filter((g): g is string => !!g && g.length > 0);
    if (editingProject?.groupSales?.trim()) {
      list.push(editingProject.groupSales.trim());
    }
    return Array.from(new Set<string>(list)).sort((a: string, b: string) => a.localeCompare(b));
  }, [existingProjects, editingProject, isOpen]);

  if (!isOpen) return null;

  const handleSchemeToggle = (scheme: PaymentScheme) => {
    if (paymentSchemes.includes(scheme)) {
      if (paymentSchemes.length === 1) {
        alert('Minimal harus memilih 1 skema penjualan.');
        return;
      }
      setPaymentSchemes(paymentSchemes.filter((s) => s !== scheme));
    } else {
      setPaymentSchemes([...paymentSchemes, scheme]);
    }
  };

  // Adjust photo count dynamically without injecting sample dummy images
  const handlePhotoCountChange = (newCount: number) => {
    const clampedCount = Math.max(1, Math.min(20, newCount));
    setPhotoCount(clampedCount);

    const currentPhotos = [...photos];
    if (clampedCount > currentPhotos.length) {
      const extraNeeded = clampedCount - currentPhotos.length;
      for (let i = 0; i < extraNeeded; i++) {
        currentPhotos.push('');
      }
    } else {
      currentPhotos.length = clampedCount;
    }
    setPhotos(currentPhotos);
  };

  const handlePhotoUrlChange = (index: number, val: string) => {
    const updated = [...photos];
    updated[index] = val;
    setPhotos(updated);
  };

  const handlePhotoFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 800, 800, 0.65);
      const updated = [...photos];
      updated[index] = compressed;
      setPhotos(updated);
    } catch (err) {
      console.error('Failed to process image file:', err);
    }
  };

  const handleClearPhoto = (index: number) => {
    const updated = [...photos];
    updated[index] = '';
    setPhotos(updated);
  };

  const handleBsiPhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 950, 950, 0.70);
      setBsiSchemePhoto(compressed);
    } catch (err) {
      console.error('Failed to process BSI scheme image:', err);
    }
  };

  const handleCashBertahapPhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 950, 950, 0.70);
      setCashBertahapSchemePhoto(compressed);
    } catch (err) {
      console.error('Failed to process Cash Bertahap scheme image:', err);
    }
  };

  const handleCreditDeveloperPhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 950, 950, 0.70);
      setCreditDeveloperSchemePhoto(compressed);
    } catch (err) {
      console.error('Failed to process Credit Developer scheme image:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Nama project perumahan / lokasi wajib diisi.');
      return;
    }

    if (!cityId) {
      setErrorMessage('Silakan pilih kota wilayah untuk proyek ini.');
      return;
    }

    setIsSubmitting(true);

    try {
      const facilities = facilitiesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const strategicPoints = strategicStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Clean photo array up to specified photoCount (no dummy padding)
      const cleanPhotos = photos.slice(0, photoCount).map((p) => p.trim()).filter(Boolean);

      const projectPayload: Project = {
        id: editingProject ? editingProject.id : `proj-${Date.now()}`,
        cityId,
        name: name.trim(),
        groupSales: groupSales.trim() || undefined,
        category,
        address: address.trim() || 'Lokasi Strategis',
        mapUrl: mapUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + address)}`,
        price: Number(price) || 0,
        paymentSchemes,
        description: description.trim(),
        totalUnits: totalUnits !== '' ? Number(totalUnits) : undefined,
        availableUnits: availableUnits !== '' ? Number(availableUnits) : undefined,
        landArea: Number(landArea) || 0,
        buildingArea: Number(buildingArea) || 0,
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        carports: Number(carports) || 0,
        floors: Number(floors) || 1,
        electricity: electricity.trim() || '1.300 Watt',
        waterSource: waterSource.trim() || 'PDAM',
        certificate: certificate.trim() || 'SHM (Sertifikat Hak Milik)',
        facilities,
        strategicPoints,
        photos: cleanPhotos,
        bsiSchemePhoto: paymentSchemes.includes('Bank BSI') ? bsiSchemePhoto.trim() : undefined,
        cashBertahapSchemePhoto: paymentSchemes.includes('Cash Bertahap') ? cashBertahapSchemePhoto.trim() : undefined,
        creditDeveloperSchemePhoto: paymentSchemes.includes('Credit Developer') ? creditDeveloperSchemePhoto.trim() : undefined,
        status,
        featured,
        createdAt: editingProject ? editingProject.createdAt : Date.now(),
        updatedAt: Date.now(),
      };

      await onSaveProject(projectPayload);
      prevEditingIdRef.current = projectPayload.id;
      setSuccessMessage(editingProject ? 'Perubahan proyek berhasil disimpan ke Database!' : 'Proyek baru berhasil disimpan ke Database!');
      
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Error onSaveProject:', msg);
      setErrorMessage(`Gagal menyimpan ke Database: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: PropertyCategory[] = [
    'Rumah',
    'Ruko',
    'Kosan',
    'Tanah Kavling',
    'Tanah Kebun',
    'Tanah Tambang',
    'Lainnya',
  ];

  return (
    <div 
      id="admin-project-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0B1E36] px-6 py-4 text-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg">
              {editingProject ? `Edit Project: ${editingProject.name}` : 'Tambah Proyek Properti Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Notification Feedback Alerts */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-150">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Terjadi Kesalahan Penyimpanan Database:</p>
                <p className="mt-0.5 text-rose-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in duration-150">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* 1. INFORMASI DASAR & HIERARKI KOTA */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-amber-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1. Informasi Pokok & Lokasi Kota</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Kota Wilayah *
                </label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-300"
                >
                  <option value="">-- Pilih Kota --</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Properti *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-300"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Project Perumahan / Lokasi *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Sentra Hills Dago, Kavling Sentra Cimenyan..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Jual (Rp) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="650000000"
                  required
                  min={0}
                  step={1000000}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0B1E36] focus:bg-white focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap Project
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Raya Dago No. 88, Bandung"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Google Map (Link Peta)
                </label>
                <input
                  type="text"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            {/* Field Group Sales: Picklist yang bisa dipilih atau diinput */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Group Sales</span>
                </label>
                {availableGroupSales.length > 0 ? (
                  <span className="text-[11px] text-slate-500 font-medium">
                    {availableGroupSales.length} grup terdaftar
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    Belum ada grup sebelumnya
                  </span>
                )}
              </div>

              {availableGroupSales.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Pilih dari Picklist:
                      </label>
                      <select
                        value={availableGroupSales.includes(groupSales) ? groupSales : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            setGroupSales(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-300"
                      >
                        <option value="">-- Pilih dari Picklist ({availableGroupSales.length}) --</option>
                        {availableGroupSales.map((gs) => (
                          <option key={gs} value={gs}>
                            {gs}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Atau Ketik / Tambah Group Sales Baru:
                      </label>
                      <input
                        type="text"
                        list="group-sales-datalist"
                        value={groupSales}
                        onChange={(e) => setGroupSales(e.target.value)}
                        placeholder="Ketik nama Group Sales..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-300"
                      />
                      <datalist id="group-sales-datalist">
                        {availableGroupSales.map((gs) => (
                          <option key={gs} value={gs} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {groupSales && (
                    <div className="text-[11px] flex items-center justify-between pt-0.5">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Group Sales aktif: <strong className="text-slate-800">{groupSales}</strong>
                        {!availableGroupSales.includes(groupSales.trim()) && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                            Grup Baru
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGroupSales('')}
                        className="text-slate-400 hover:text-rose-600 text-[10px] underline"
                      >
                        Kosongkan
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={groupSales}
                    onChange={(e) => setGroupSales(e.target.value)}
                    placeholder="Ketik nama Group Sales (Contoh: Tim Alpha, In-House, Mitra Agen)..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-300"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Belum ada Group Sales yang pernah diisi. Ketik nama Group Sales di atas untuk menambahkan grup pertama.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. SKEMA PENJUALAN (CASH, CASH BERTAHAP, BANK BSI, CREDIT DEVELOPER) & UPLOAD FOTO SKEMA CICILAN */}
          <div className="p-4 sm:p-5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                2. Skema Penjualan (Pilih Satu atau Semuanya):
              </label>
              <p className="text-xs text-slate-600 mt-0.5">
                Centang metode pembayaran yang diterima untuk proyek ini:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['Cash', 'Cash Bertahap', 'Bank BSI', 'Credit Developer'] as PaymentScheme[]).map((scheme) => {
                const isChecked = paymentSchemes.includes(scheme);
                return (
                  <button
                    key={scheme}
                    type="button"
                    onClick={() => handleSchemeToggle(scheme)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isChecked
                        ? 'bg-white border-amber-500 shadow-xs ring-2 ring-amber-400'
                        : 'bg-slate-100/70 border-slate-200 text-slate-500 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#0B1E36]">{scheme}</div>
                      <div className="text-[10px] text-slate-500">
                        {scheme === 'Cash' && 'Pelunasan Cepat / Diskon'}
                        {scheme === 'Cash Bertahap' && 'Cicilan Developer 0%'}
                        {scheme === 'Bank BSI' && 'KPR Syariah BSI Hasanah'}
                        {scheme === 'Credit Developer' && 'Cicilan Inhouse Developer'}
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isChecked ? 'bg-amber-500 border-amber-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* DYNAMIC UPLOAD FOTO SKEMA CICILAN JIKA KPR BSI, CASH BERTAHAP, ATAU CREDIT DEVELOPER DICENTANG */}
            {(paymentSchemes.includes('Bank BSI') || paymentSchemes.includes('Cash Bertahap') || paymentSchemes.includes('Credit Developer')) && (
              <div className="pt-3 border-t border-amber-200/80 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Upload Foto Skema Cicilan / Brosur Angsuran</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Upload Foto Skema Cicilan KPR Bank BSI */}
                  {paymentSchemes.includes('Bank BSI') && (
                    <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-900 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Foto Skema KPR Bank BSI
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          KPR Syariah BSI
                        </span>
                      </div>

                      {/* Preview Box */}
                      <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                        {bsiSchemePhoto ? (
                          <>
                            <img
                              src={bsiSchemePhoto}
                              alt="Skema KPR BSI"
                              className="w-full h-full object-contain bg-slate-950"
                            />
                            <button
                              type="button"
                              onClick={() => setBsiSchemePhoto('')}
                              className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs shadow-md transition-colors"
                              title="Hapus Foto Skema"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-3 text-slate-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                            <span className="text-[11px] font-medium block">Belum ada foto skema cicilan BSI</span>
                            <span className="text-[10px] text-slate-500">Pilih file atau masukkan link URL</span>
                          </div>
                        )}
                      </div>

                      {/* File Upload & URL (Tanpa field keterangan di bawah) */}
                      <div className="space-y-2">
                        <label className="cursor-pointer w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Skema BSI (Dari HP/Laptop)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBsiPhotoFileUpload}
                            className="hidden"
                          />
                        </label>

                        <input
                          type="text"
                          value={bsiSchemePhoto}
                          onChange={(e) => setBsiSchemePhoto(e.target.value)}
                          placeholder="Atau masukkan URL Gambar: https://..."
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Foto Skema Cicilan Cash Bertahap Developer */}
                  {paymentSchemes.includes('Cash Bertahap') && (
                    <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Foto Skema Cash Bertahap
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          Inhouse Developer 0%
                        </span>
                      </div>

                      {/* Preview Box */}
                      <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                        {cashBertahapSchemePhoto ? (
                          <>
                            <img
                              src={cashBertahapSchemePhoto}
                              alt="Skema Cash Bertahap"
                              className="w-full h-full object-contain bg-slate-950"
                            />
                            <button
                              type="button"
                              onClick={() => setCashBertahapSchemePhoto('')}
                              className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs shadow-md transition-colors"
                              title="Hapus Foto Skema"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-3 text-slate-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                            <span className="text-[11px] font-medium block">Belum ada foto skema cash bertahap</span>
                            <span className="text-[10px] text-slate-500">Pilih file atau masukkan link URL</span>
                          </div>
                        )}
                      </div>

                      {/* File Upload & URL (Tanpa field keterangan di bawah) */}
                      <div className="space-y-2">
                        <label className="cursor-pointer w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Skema Bertahap (Dari HP/Laptop)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCashBertahapPhotoFileUpload}
                            className="hidden"
                          />
                        </label>

                        <input
                          type="text"
                          value={cashBertahapSchemePhoto}
                          onChange={(e) => setCashBertahapSchemePhoto(e.target.value)}
                          placeholder="Atau masukkan URL Gambar: https://..."
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Foto Skema Cicilan Credit Developer */}
                  {paymentSchemes.includes('Credit Developer') && (
                    <div className="p-4 bg-white rounded-2xl border border-indigo-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-900 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          Foto Skema Credit Developer
                        </span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                          Inhouse Developer
                        </span>
                      </div>

                      {/* Preview Box */}
                      <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                        {creditDeveloperSchemePhoto ? (
                          <>
                            <img
                              src={creditDeveloperSchemePhoto}
                              alt="Skema Credit Developer"
                              className="w-full h-full object-contain bg-slate-950"
                            />
                            <button
                              type="button"
                              onClick={() => setCreditDeveloperSchemePhoto('')}
                              className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs shadow-md transition-colors"
                              title="Hapus Foto Skema"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-3 text-slate-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                            <span className="text-[11px] font-medium block">Belum ada foto skema credit developer</span>
                            <span className="text-[10px] text-slate-500">Pilih file atau masukkan link URL</span>
                          </div>
                        )}
                      </div>

                      {/* File Upload & URL (Tanpa field keterangan di bawah) */}
                      <div className="space-y-2">
                        <label className="cursor-pointer w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Skema Credit Developer (Dari HP/Laptop)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCreditDeveloperPhotoFileUpload}
                            className="hidden"
                          />
                        </label>

                        <input
                          type="text"
                          value={creditDeveloperSchemePhoto}
                          onChange={(e) => setCreditDeveloperSchemePhoto(e.target.value)}
                          placeholder="Atau masukkan URL Gambar: https://..."
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. FOTO UTAMA PROJECT (DENGAN FIELD JUMLAH FOTO DITENTUKAN USER) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
              <div>
                <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <span>3. Foto Utama Project</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Foto yang diunggah akan disesuaikan otomatis dengan jumlah yang Anda tentukan di bawah.
                </p>
              </div>

              {/* FIELD JUMLAH FOTO UTAMA */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <span className="text-xs font-bold text-amber-900 whitespace-nowrap">
                  Jumlah Foto:
                </span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={photoCount}
                  onChange={(e) => handlePhotoCountChange(Number(e.target.value))}
                  className="w-14 px-2 py-1 bg-white border border-amber-300 rounded-lg text-xs font-black text-center text-[#0B1E36] focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-amber-800">Slot</span>

                {/* Quick Count Selectors */}
                <div className="hidden sm:flex items-center gap-1 ml-1 pl-2 border-l border-amber-200">
                  {[3, 4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePhotoCountChange(num)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        photoCount === num
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-slate-600 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DYNAMIC PHOTO SLOTS ACCORDING TO USER-DEFINED COUNT (WITHOUT CAPTION FIELDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.slice(0, photoCount).map((photoUrl, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative shadow-2xs hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-800">
                      Foto #{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {idx === 0 ? 'Cover Utama (Fasad)' : idx === 1 ? 'Ruang Utama' : idx === 2 ? 'Kamar' : idx === 3 ? 'Dapur / Fasilitas' : `Foto Tambahan ${idx + 1}`}
                    </span>
                  </div>

                  {/* Thumbnail Preview or Empty State */}
                  {photoUrl ? (
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group">
                      <img
                        src={photoUrl}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleClearPhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1"
                        title="Kosongkan foto ini"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 w-full rounded-xl bg-slate-100/90 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <ImageIcon className="w-7 h-7 text-slate-300 mb-1" />
                      <span className="text-xs font-bold text-slate-500">Belum Ada Foto</span>
                      <span className="text-[10px] text-slate-400">Upload file atau tempel link URL</span>
                    </div>
                  )}

                  {/* URL Input */}
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                    placeholder="URL Gambar https://..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />

                  {/* File Upload Button */}
                  <label className="cursor-pointer w-full py-1.5 bg-slate-200 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{photoUrl ? 'Ganti Foto (HP/Laptop)' : 'Upload dari HP / Laptop'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoFileUpload(idx, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 4. DETAIL SPESIFIKASI BANGUNAN & LAHAN */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-amber-100">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>4. Detail Spesifikasi Teknis & Legalitas</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                <label className="block text-[11px] font-black text-amber-900 mb-1 flex items-center gap-1">
                  <span>Jumlah Total Unit</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Contoh: 24"
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-black text-[#0B1E36] focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <label className="block text-[11px] font-black text-emerald-900 mb-1 flex items-center gap-1">
                  <span>Sisa Unit Tersedia</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={availableUnits}
                  onChange={(e) => setAvailableUnits(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Contoh: 5"
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-black text-emerald-950 focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Luas Tanah (m²)</label>
                <input
                  type="number"
                  min="0"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Luas Bangunan (m²)</label>
                <input
                  type="number"
                  min="0"
                  value={buildingArea}
                  onChange={(e) => setBuildingArea(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Kamar Tidur</label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Kamar Mandi</label>
                <input
                  type="number"
                  min="0"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Carport / Parkir</label>
                <input
                  type="number"
                  min="0"
                  value={carports}
                  onChange={(e) => setCarports(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah Lantai</label>
                <input
                  type="number"
                  min="1"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              {/* Status Properti */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Status Properti</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="Tersedia">Tersedia</option>
                  <option value="Indent">Indent</option>
                  <option value="Terjual">Terjual</option>
                  <option value="Hot Deal">Hot Deal</option>
                </select>
              </div>

              {/* Proyek Unggulan */}
              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                  />
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Proyek Unggulan
                  </span>
                </label>
              </div>

              {/* Sertifikat / Legal Picklist */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Sertifikat / Legal</label>
                <select
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="SHM (Sertifikat Hak Milik)">SHM (Sertifikat Hak Milik)</option>
                  <option value="SHGB (Sertifikat Hak Guna Bangunan)">SHGB (Sertifikat Hak Guna Bangunan)</option>
                  <option value="AJB (Akte Jual Beli)">AJB (Akte Jual Beli)</option>
                  <option value="SPH">SPH</option>
                </select>
              </div>

              {/* Daya Listrik (Default: 1.300 Watt) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Daya Listrik</label>
                <select
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="1.300 Watt">1.300 Watt</option>
                  <option value="2.200 Watt">2.200 Watt</option>
                  <option value="3.500 Watt">3.500 Watt</option>
                  <option value="4.400 Watt">4.400 Watt</option>
                  <option value="5.500 Watt">5.500 Watt</option>
                  <option value="900 Watt">900 Watt</option>
                  <option value="450 Watt">450 Watt</option>
                  <option value="Tanpa Listrik">Tanpa Listrik</option>
                </select>
              </div>

              {/* Sumber AIR (Default: PDAM - dibuat di sebelah Daya Listrik) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Sumber Air</label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="PDAM">PDAM</option>
                  <option value="Sumur Bor / Jet Pump">Sumur Bor / Jet Pump</option>
                  <option value="PDAM & Sumur Bor">PDAM & Sumur Bor</option>
                  <option value="Air Artetis">Air Artetis</option>
                  <option value="Mata Air Pegunungan">Mata Air Pegunungan</option>
                  <option value="Sumur Gali">Sumur Gali</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Lengkap Project
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Tuliskan keunggulan lingkungan, tipe unit, promo menarik..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fasilitas (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={facilitiesStr}
                onChange={(e) => setFacilitiesStr(e.target.value)}
                placeholder="One Gate System, CCTV 24 Jam, Masjid, Kolam Renang, Row Jalan 8m"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Akses Strategis (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={strategicStr}
                onChange={(e) => setStrategicStr(e.target.value)}
                placeholder="5 Menit ke Gerbang Tol, 10 Menit ke Stasiun KRL, Dekat RS & Sekolah"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingProject ? 'Simpan Perubahan Project' : 'Tambahkan Project ke Database'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

