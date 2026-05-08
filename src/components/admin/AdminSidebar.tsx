import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getFirebaseAuth } from '@/lib/firebase';
import { 
  Square2StackIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();

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
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="w-64 bg-navy text-white h-screen sticky top-0 flex flex-col shadow-2xl">
      <div className="p-8 border-b border-white/10">
        <h2 className="text-xl font-serif tracking-tighter uppercase">Cái Tiệm <span className="text-stone-400">2HAND</span></h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
              ${isActive 
                ? 'bg-stone-50 text-navy shadow-lg shadow-black/20 font-bold' 
                : 'text-stone-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
            <span className="text-xs uppercase tracking-widest">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-2 border-t border-white/10">
        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs uppercase tracking-widest"
        >
          <HomeIcon className="w-5 h-5" />
          Xem Website
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-xs uppercase tracking-widest"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
