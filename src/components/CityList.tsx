import React, { useState } from 'react';
import { City, Project } from '../types';
import { MapPin, Plus, Edit2, Trash2, ArrowRight, Building, Sparkles } from 'lucide-react';
import { DeleteCityWarningModal } from './DeleteCityWarningModal';
import { sortCitiesByFirstAdded } from '../services/storageService';

interface CityListProps {
  cities: City[];
  projects: Project[];
  selectedCityId: string | null;
  onSelectCity: (cityId: string) => void;
  isAdmin: boolean;
  onAddCity: () => void;
  onEditCity: (city: City) => void;
  onDeleteCity: (cityId: string) => void;
}

export const CityList: React.FC<CityListProps> = ({
  cities,
  projects,
  selectedCityId,
  onSelectCity,
  isAdmin,
  onAddCity,
  onEditCity,
  onDeleteCity,
}) => {
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  const sortedCities = sortCitiesByFirstAdded(cities);

  return (
    <section id="city-hierarchy-section" className="py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pilihan Wilayah & Kota</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E36] tracking-tight">
            Pilih Kota Lokasi Properti
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Klik pada salah satu kota di bawah ini untuk melihat daftar lokasi proyek perumahan, ruko, kosan, maupun tanah.
          </p>
        </div>

        {isAdmin && (
          <button
            id="btn-add-city-section"
            onClick={onAddCity}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kota Baru</span>
          </button>
        )}
      </div>

      {/* Cities Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {sortedCities.map((city) => {
          const cityProjects = projects.filter((p) => p.cityId === city.id);
          const isSelected = selectedCityId === city.id;

          return (
            <div
              key={city.id}
              id={`city-card-${city.id}`}
              className={`group relative overflow-hidden rounded-2xl bg-white transition-all duration-300 ${
                isSelected
                  ? 'ring-3 ring-amber-500 shadow-xl scale-[1.02]'
                  : 'border border-slate-200/80 hover:border-amber-300 hover:shadow-lg'
              }`}
            >
              {/* Image Thumbnail Container */}
              <div 
                className="relative h-48 sm:h-52 w-full overflow-hidden cursor-pointer bg-slate-100"
                onClick={() => onSelectCity(city.id)}
              >
                <img
                  src={city.coverImage || 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'}
                  alt={city.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Top Badge: Project Count */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0B1E36] flex items-center gap-1.5 shadow-sm">
                  <Building className="w-3.5 h-3.5 text-amber-600" />
                  <span>{cityProjects.length} Proyek Tersedia</span>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md animate-bounce">
                    <Sparkles className="w-3 h-3" />
                    <span>Kota Terpilih</span>
                  </div>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-medium text-amber-300 uppercase tracking-wider block">
                    {city.province}
                  </span>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors drop-shadow-sm flex items-center justify-between">
                    <span>{city.name}</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300 text-amber-400" />
                  </h3>
                </div>
              </div>

              {/* City Description & Admin Toolbar */}
              <div className="p-4 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {city.description || `Koleksi properti premium dan tanah strategis pilihan di ${city.name}, ${city.province}.`}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectCity(city.id)}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group-hover:underline"
                  >
                    <span>Jelajahi {city.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCity(city);
                        }}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Kota"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCityToDelete(city);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Kota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedCities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Belum ada data kota.</p>
          {isAdmin && (
            <button
              onClick={onAddCity}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kota Pertama</span>
            </button>
          )}
        </div>
      )}

      {/* Warning Modal when Deleting City (especially if has projects) */}
      <DeleteCityWarningModal
        isOpen={!!cityToDelete}
        onClose={() => setCityToDelete(null)}
        city={cityToDelete}
        projects={projects}
        onConfirmDelete={(cityId) => {
          onDeleteCity(cityId);
          setCityToDelete(null);
        }}
      />
    </section>
  );
};

