import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppWidget } from '../components/WhatsAppWidget';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};
