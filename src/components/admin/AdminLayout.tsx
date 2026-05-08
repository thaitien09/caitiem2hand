import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 text-stone-400">
            <span className="text-[10px] uppercase tracking-widest font-bold">Cái Tiệm 2HAND</span>
            <span className="w-1 h-1 bg-stone-300 rounded-full" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-navy">Trang Quản Trị</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right mr-4">
                <p className="text-xs font-bold text-navy">Admin User</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Administrator</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-navy font-bold">
                A
             </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
