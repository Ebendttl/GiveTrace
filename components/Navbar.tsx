'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Heart, ShieldCheck, Grid, Menu, X } from 'lucide-react';
import { WalletConnectButton } from './WalletConnectButton';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/match', label: 'AI Matcher', icon: Sparkles },
    { href: '/causes', label: 'Browse Causes', icon: Grid },
    { href: '/impact', label: 'Transparency Log', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-teal-700 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white/20" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-stone-900 leading-none">
              Give<span className="text-teal-700">Trace</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-600">
              Devnet Micro-Giving
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 border border-stone-200/60 p-1 rounded-2xl shadow-2xs">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-brand-300' : 'text-stone-400'}`} />}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connect & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <WalletConnectButton />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-3">
          <nav className="space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                    isActive ? 'bg-teal-700 text-white' : 'text-stone-800 hover:bg-stone-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 sm:hidden">
            <WalletConnectButton />
          </div>
        </div>
      )}
    </header>
  );
};
