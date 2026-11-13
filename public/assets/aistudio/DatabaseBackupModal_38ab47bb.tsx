import React, { useState } from 'react';
import { City, Project, DocumentationPhoto } from '../types';
import { storageService } from '../services/storageService';
import { 
  X, 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Cloud,
  FileJson,
  ShieldCheck
} from 'lucide-react';

interface DatabaseBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];
  projects: Project[];
  documentation?: DocumentationPhoto[];
  onDataRefreshed: (cities: City[], projects: Project[], documentation?: DocumentationPhoto[]) => void;
}

export const DatabaseBackupModal: React.FC<DatabaseBackupModalProps> = ({
  isOpen,
  onClose,
  cities,
  projects,
  documentation = [],
  onDataRefreshed,
}) => {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = storageService.exportDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentra-properti-database-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMsg({ type: 'success', text: 'Database berhasil diexport ke file JSON (termasuk foto dokumentasi)!' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const res = await storageService.importDatabase(content);
        if (res.success && res.cities && res.projects) {
          onDataRefreshed(res.cities, res.projects, res.documentation);
          const docCount = res.documentation ? res.documentation.length : 0;
          setStatusMsg({ type: 'success', text: `Import berhasil ke Firestore! Dimuat ${res.cities.length} kota, ${res.projects.length} proyek, & ${docCount} foto dokumentasi.` });
        } else {
          setStatusMsg({ type: 'error', text: res.error || 'Gagal import database JSON.' });
        }
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: err?.message || 'Terjadi kesalahan saat import' });
      } finally {
        setIsLoading(false);
        setTimeout(() => setStatusMsg(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleSyncFirestore = async () => {
    setIsLoading(true);
    try {
      const res = await storageService.migrateAllDataToFirestore();
      onDataRefreshed(res.cities, res.projects, documentation);
      setStatusMsg({ 
        type: 'success', 
        text: `Sukses sinkronisasi! Semua data kota, proyek, & dokumentasi tersimpan di Firestore.` 
      });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err?.message || 'Gagal sinkronisasi ke Firestore' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleReset = async () => {
    if (confirm('Apakah Anda yakin ingin me-reset database Firestore ke data awal standar Sentra Properti?')) {
      setIsLoading(true);
      try {
        const res = await storageService.resetToDefault();
        onDataRefreshed(res.cities, res.projects, res.documentation);
        setStatusMsg({ type: 'success', text: 'Database Firestore berhasil di-reset ke data bawaan!' });
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: err?.message || 'Gagal mereset Firestore' });
      } finally {
        setIsLoading(false);
        setTimeout(() => setStatusMsg(null), 3000);
      }
    }
  };

  return (
    <div 
      id="database-backup-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0B1E36] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg">Firebase Firestore Database</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Cloud Storage & Sync Status Badge */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl mt-0.5">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-[#0B1E36]">Firestore Sinkronisasi Real-Time</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Online / Terkoneksi
                </span>
              </div>
              <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-600">
                <p>• Database: <strong className="text-slate-800">sentrapropertidb</strong></p>
                <p>• Database ID: <strong className="text-slate-800 font-mono text-[10px]">spdb</strong></p>
                <p>• Collection ID: <strong className="text-emerald-700 font-mono">dbproperti</strong></p>
                <p>• Document ID: <strong className="text-emerald-700 font-mono">Database</strong></p>
                <p>• Tersimpan di Firestore: <strong className="text-slate-800">{cities.length} Kota</strong> & <strong className="text-slate-800">{projects.length} Proyek</strong></p>
              </div>
            </div>
          </div>

          {statusMsg && (
            <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Action List */}
          <div className="space-y-3">
            {/* Sync to Firestore */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                  <span>Sinkronkan & Upload ke Firestore</span>
                </h4>
                <p className="text-[11px] text-emerald-800/80 mt-0.5">
                  Simpan dan verifikasi seluruh data kota, detail proyek, dan foto ke Firestore (dbproperti/Database).
                </p>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSyncFirestore}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex-shrink-0"
              >
                {isLoading ? 'Menyimpan...' : 'Sinkron Firestore'}
              </button>
            </div>
            {/* Export */}
            <div className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 transition-colors flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-[#0B1E36] flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-amber-600" />
                  <span>Download / Export Database (JSON)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Simpan seluruh data kota, proyek, dan 6 foto utama ke file cadangan.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex-shrink-0"
              >
                Export JSON
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-[#0B1E36] flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Restore / Import File JSON</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Unggah file cadangan JSON untuk memulihkan seluruh data proyek.
                </p>
              </div>
              <label className="cursor-pointer px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex-shrink-0">
                <span>Pilih File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset */}
            <div className="p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition-colors flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-rose-700 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-rose-600" />
                  <span>Reset ke Data Standar</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Kembalikan database ke data bawaan awal Sentra Properti.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold active:scale-95 transition-all flex-shrink-0"
              >
                Reset Default
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
