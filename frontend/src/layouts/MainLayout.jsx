import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppWidget } from '../components/WhatsAppWidget';

export const MainLayout = () => {
  const location = useLocation();
  const isFullBleed = location.pathname === '/' || location.pathname.startsWith('/company/');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className={`flex-grow ${isFullBleed ? 'pt-0 pb-0 px-0' : 'pt-24 pb-12 px-6'}`}>
        <div className={isFullBleed ? 'w-full' : 'max-w-7xl mx-auto'}>
          <Outlet />
        </div>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};
