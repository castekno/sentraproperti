import React, { useState, useEffect } from 'react';
import { City } from '../types';
import { X, MapPin, Image, Sparkles, Upload, Check } from 'lucide-react';
import { compressImageFile } from '../utils/imageUtils';

interface AdminCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCity: (city: City) => void;
  editingCity: City | null;
}

export const AdminCityModal: React.FC<AdminCityModalProps> = ({
  isOpen,
  onClose,
  onSaveCity,
  editingCity,
}) => {
  const [name, setName] = useState('');
  const [province, setProvince] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingCity) {
      setName(editingCity.name);
      setProvince(editingCity.province);
      setCoverImage(editingCity.coverImage);
      setDescription(editingCity.description || '');
    } else {
      setName('');
      setProvince('Jawa Barat');
      setCoverImage('https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80');
      setDescription('');
    }
  }, [editingCity, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 1200, 800, 0.78);
      setCoverImage(compressed);
    } catch (err) {
      console.error('Failed to process city image:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cityPayload: City = {
      id: editingCity ? editingCity.id : `city-${Date.now()}`,
      name: name.trim(),
      province: province.trim() || 'Indonesia',
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
      description: description.trim(),
      createdAt: editingCity ? editingCity.createdAt : Date.now(),
    };

    onSaveCity(cityPayload);
    onClose();
  };

  // Sample quick templates
  const cityPresets = [
    { name: 'Bandung', province: 'Jawa Barat', img: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Jakarta Selatan', province: 'DKI Jakarta', img: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Bogor', province: 'Jawa Barat', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Tangerang & BSD', province: 'Banten', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Bekasi', province: 'Jawa Barat', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Yogyakarta', province: 'DI Yogyakarta', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Surabaya', province: 'Jawa Timur', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Bali', province: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
  ];

  return (
    <div 
      id="admin-city-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0B1E36] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg">
              {editingCity ? 'Edit Data Kota' : 'Tambah Kota Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets for New City */}
          {!editingCity && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">
                Rekomendasi Kota Cepat:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {cityPresets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setName(p.name);
                      setProvince(p.province);
                      setCoverImage(p.img);
                    }}
                    className="text-xs bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2.5 py-1 rounded-lg font-medium transition-colors"
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Kota / Wilayah *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bandung, Jakarta Barat, Bogor..."
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Provinsi *
            </label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Contoh: Jawa Barat, DKI Jakarta, Banten..."
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {/* Cover Image URL / File */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Foto Cover Kota (URL atau Upload File)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>Upload Foto dari Perangkat</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {coverImage && (
                <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 mt-2">
                  <img
                    src={coverImage}
                    alt="Preview Kota"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    Pratinjau Cover
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deskripsi Singkat Wilayah
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan daya tarik, kemudahan akses, atau potensi properti di kota ini..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingCity ? 'Simpan Perubahan' : 'Tambah Kota'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
