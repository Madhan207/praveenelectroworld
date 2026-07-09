import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import { BusinessProvider } from '../context/BusinessContext';

export const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('adminDarkMode') === 'true';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '');
  }, [darkMode]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('adminDarkMode', next);
  };

  return (
    <BusinessProvider>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: 'var(--admin-content-bg)' }}
      >
        {/* Sidebar */}
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

        {/* Main area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <AdminTopbar
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(c => !c)}
            darkMode={darkMode}
            onToggleDark={toggleDark}
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="page-enter max-w-screen-2xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </BusinessProvider>
  );
};
