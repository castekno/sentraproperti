import React, { useState } from 'react';
import { Shield, Lock, KeyRound, CheckCircle2, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verification with the exact password requested by the user: shahnam85
    if (password === 'shahnam85') {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
        onSuccessLogin();
        onClose();
      }, 700);
    } else {
      setError('Password admin tidak sesuai! Silakan periksa kembali.');
    }
  };

  return (
    <div 
      id="admin-login-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Decor */}
        <div className="bg-gradient-to-r from-[#0B1E36] via-[#122e52] to-[#0B1E36] p-6 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-amber-500/20 border border-amber-400/40 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-white">
            Autentikasi Admin
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Sentra Properti Database & Manajemen Konten
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Password Khusus Admin
              </label>
              
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Ketik password admin..."
                  autoFocus
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Login Berhasil! Mengalihkan ke Mode Admin...</span>
              </div>
            )}

            <div className="pt-2">
              <button
                id="btn-submit-admin-login"
                type="submit"
                disabled={success}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>Masuk Sebagai Admin</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Hak akses admin mengizinkan Anda menambah, mengubah, dan menghapus data kota, proyek perumahan, tanah, ruko, serta 6 foto proyek.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
