import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { getFirebaseAuth } from '@/lib/firebase';
import {
  Square2StackIcon,
  ShoppingBagIcon,
  TagIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Lock scroll khi sidebar mở trên mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const menuItems = [
    { name: 'Tổng quan', path: '/admin', icon: Square2StackIcon, end: true },
    { name: 'Sản phẩm', path: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Thương hiệu', path: '/admin/brands', icon: TagIcon },
    { name: 'Cài đặt', path: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = async () => {
    try {
      const auth = await getFirebaseAuth();
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
      isActive
        ? 'bg-stone-50 text-navy shadow-lg shadow-black/20 font-bold'
        : 'text-stone-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="flex min-h-screen bg-stone-50">

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex w-64 bg-navy text-white h-screen sticky top-0 flex-col shadow-2xl flex-shrink-0">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-xl font-serif tracking-tighter uppercase">
            Cái Tiệm <span className="text-stone-400">2HAND</span>
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.end} className={navLinkClass}>
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-xs uppercase tracking-widest">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 space-y-2 border-t border-white/10">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs uppercase tracking-widest">
            <HomeIcon className="w-5 h-5" />
            Xem Website
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-xs uppercase tracking-widest">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 bottom-0 z-[9999] w-72 bg-navy text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-serif tracking-tighter uppercase">
                Cái Tiệm <span className="text-stone-400">2HAND</span>
              </h2>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-stone-400 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 mt-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-widest">{item.name}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-4 space-y-2 border-t border-white/10">
              <button onClick={() => { navigate('/'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs uppercase tracking-widest">
                <HomeIcon className="w-5 h-5" />
                Xem Website
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-xs uppercase tracking-widest">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-stone-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Hamburger chỉ hiện trên mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-navy rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Mở menu"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 lg:gap-4 text-stone-400">
              <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:inline">Cái Tiệm 2HAND</span>
              <span className="w-1 h-1 bg-stone-300 rounded-full hidden sm:inline-block" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-navy">Quản Trị</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-navy">Admin</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest">Administrator</p>
            </div>
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
