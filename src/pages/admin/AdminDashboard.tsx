import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  CursorArrowRaysIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import type { Product } from '@/types/product';

interface Activity {
  id: string;
  type: string;
  productTitle: string;
  createdAt: Timestamp;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!db) return;

    // Load real products data
    const unsubProducts = onSnapshot(query(collection(db, 'products')), (snap) => {
      const data: Product[] = [];
      snap.forEach(doc => data.push({ ...doc.data(), id: doc.id } as unknown as Product));
      setProducts(data);
    });

    return () => { unsubProducts(); };
  }, []);

  const totalProducts = products.length;
  const soldProducts = products.filter(p => p.status === 'Đã bán').length;
  const newProducts = products.filter(p => p.status === 'Hàng mới').length;
  const inStockProducts = products.filter(p => p.status === 'Còn hàng').length;

  const stats = [
    { 
      name: 'Tổng sản phẩm', 
      value: totalProducts.toString(), 
      icon: ShoppingBagIcon, 
      change: `${newProducts} hàng mới`, 
      color: 'text-navy',
      changeBg: 'bg-blue-50 text-blue-600'
    },
    { 
      name: 'Đang bán', 
      value: inStockProducts.toString(), 
      icon: ArrowTrendingUpIcon, 
      change: 'Còn trong kho', 
      color: 'text-purple-600',
      changeBg: 'bg-purple-50 text-purple-600'
    },
    { 
      name: 'Đã bán', 
      value: soldProducts.toString(), 
      icon: CheckCircleIcon, 
      change: 'Đã chốt đơn', 
      color: 'text-green-600',
      changeBg: 'bg-green-50 text-green-600'
    },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-3xl font-serif text-navy mb-2">Tổng quan hệ thống</h1>
        <p className="text-sm text-stone-500">Chào mừng bạn trở lại, đây là những gì đang diễn ra tại Cái Tiệm hôm nay.</p>
      </div>

      {/* Real Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-6 shadow-sm border border-stone-200 rounded-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-stone-50 rounded-lg ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.changeBg}`}>{item.change}</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">{item.name}</p>
            <h3 className="text-2xl font-serif text-navy">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Quick Actions only - removing activity feed as requested to focus on simplicity */}
        <div className="bg-white p-8 shadow-sm border border-stone-200 rounded-sm">
          <h3 className="text-lg font-serif text-navy mb-6">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/products" className="p-6 bg-stone-50 border border-stone-100 text-left hover:bg-navy hover:text-white transition-all group rounded-sm flex items-center gap-4">
              <PlusIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold">Thêm sản phẩm mới</p>
                <p className="text-[9px] opacity-60">Đăng tải hàng mới lên website</p>
              </div>
            </Link>
            <Link to="/admin/brands" className="p-6 bg-stone-50 border border-stone-100 text-left hover:bg-navy hover:text-white transition-all group rounded-sm flex items-center gap-4">
              <ShoppingBagIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold">Quản lý thương hiệu</p>
                <p className="text-[9px] opacity-60">Thêm hoặc chỉnh sửa danh sách hiệu</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
