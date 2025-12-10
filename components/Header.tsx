import React from 'react';
import { Newspaper, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-tre-blue text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full">
           {/* Abstract icon representing institution/justice */}
           <ShieldCheck className="w-6 h-6 text-tre-blue" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Coletor de Pauta</h1>
          <p className="text-xs text-tre-gold font-medium uppercase tracking-wider">ASCOM TRE-MT</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 text-sm opacity-80">
        <Newspaper size={16} />
        <span>Apoio à Comunicação Institucional</span>
      </div>
    </header>
  );
};