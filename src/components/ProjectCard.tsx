import React from 'react';
import { Project, City } from '../types';
import { 
  MapPin, 
  Layers, 
  Maximize2, 
  Bed, 
  Bath, 
  CreditCard, 
  Eye, 
  Edit2, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  city?: City;
  onSelect: (project: Project) => void;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  city,
  onSelect,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  // Format currency IDR
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Rumah':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ruko':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Kosan':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Tanah Kavling':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Tanah Kebun':
        return 'bg-lime-50 text-lime-800 border-lime-200';
      case 'Tanah Tambang':
        return 'bg-stone-100 text-stone-800 border-stone-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const mainPhoto = project.photos && project.photos.length > 0 
    ? project.photos[0] 
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      id={`project-card-${project.id}`}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Cover Image & Badges */}
      <div 
        className="relative h-56 w-full overflow-hidden cursor-pointer bg-slate-100"
        onClick={() => onSelect(project)}
      >
        <img
          src={mainPhoto}
          alt={project.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Category Badge & Unit badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border shadow-xs backdrop-blur-md bg-white/90 ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
            {project.availableUnits !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs backdrop-blur-md ${
                project.availableUnits === 0
                  ? 'bg-rose-600 text-white'
                  : project.availableUnits <= 3
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600/90 text-white'
              }`}>
                {project.totalUnits ? `Sisa ${project.availableUnits}/${project.totalUnits} Unit` : `Sisa ${project.availableUnits} Unit`}
              </span>
            )}
          </div>

          {/* Photos Count Indicator */}
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs flex-shrink-0">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>{project.photos && project.photos.length > 0 ? `${project.photos.length} Foto` : '1 Foto'}</span>
          </span>
        </div>

        {/* City Tag on Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-300 drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{city ? city.name : 'Lokasi Proyek'}</span>
          </div>

          <span className="text-[11px] font-medium text-slate-200 bg-black/40 px-2 py-0.5 rounded">
            {project.certificate || 'SHM'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Group Sales di Bawah Frame Foto Utama */}
          <div className="mb-1.5">
            <span className="text-[10px] font-medium text-slate-400 block leading-tight">
              Group Sales: <span className={project.groupSales ? "text-slate-600 font-semibold" : "text-slate-400 font-normal"}>{project.groupSales || '-'}</span>
            </span>
          </div>

          {/* Project Title */}
          <h3 
            onClick={() => onSelect(project)}
            className="text-lg font-extrabold text-[#0B1E36] group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {project.name}
          </h3>

          {/* Address */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-3 flex items-center gap-1">
            <span>{project.address}</span>
          </p>

          {/* Specs Mini Bar */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-xs mb-4">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-400 font-medium">Luas Tanah</span>
              <span className="font-bold text-[#0B1E36] flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-amber-600" />
                {project.landArea} m²
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-x border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium">Bangunan</span>
              <span className="font-bold text-[#0B1E36] flex items-center gap-1">
                <Layers className="w-3 h-3 text-amber-600" />
                {project.buildingArea > 0 ? `${project.buildingArea} m²` : 'Lahan'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-400 font-medium">KT / KM</span>
              <span className="font-bold text-[#0B1E36] flex items-center gap-1">
                {project.bedrooms > 0 ? (
                  <>
                    <Bed className="w-3 h-3 text-amber-600" /> {project.bedrooms} / {project.bathrooms}
                  </>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </span>
            </div>
          </div>

          {/* Skema Penjualan Tags */}
          <div className="mb-4">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-1.5">
              <CreditCard className="w-3 h-3 text-slate-400" />
              <span>Skema Penjualan Tersedia:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.paymentSchemes && project.paymentSchemes.map((sch) => (
                <span
                  key={sch}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    sch === 'Bank BSI'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : sch === 'Cash Bertahap'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : sch === 'Credit Developer'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {sch}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-medium text-slate-400 block leading-tight">Harga Penjualan</span>
            <div className="text-base sm:text-lg font-black text-[#0B1E36]">
              {formatRupiah(project.price)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(project)}
              className="px-3.5 py-2 bg-gradient-to-r from-[#0B1E36] to-[#152e4d] hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detail</span>
            </button>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(project);
                  }}
                  className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Edit Data Proyek"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Hapus Proyek"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
