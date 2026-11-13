import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-[#0B1E36] text-white py-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="bg-white/95 px-3 py-1.5 rounded-xl inline-block">
          <Logo size="sm" />
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Sentra Properti. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
