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
  // Đang bán = Hàng mới + Còn hàng (tất cả chưa bán)
  const availableProducts = newProducts + inStockProducts;

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
      value: availableProducts.toString(), 
      icon: ArrowTrendingUpIcon, 
      change: `${newProducts} mới · ${inStockProducts} cũ`, 
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
      <div className="mb-6 lg:mb-12">
        <h1 className="text-2xl lg:text-3xl font-serif text-navy mb-1">Tổng quan</h1>
        <p className="text-xs lg:text-sm text-stone-500">Những gì đang diễn ra tại Cái Tiệm hôm nay.</p>
      </div>

      {/* Real Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-12">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-4 lg:p-6 shadow-sm border border-stone-200 rounded-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 lg:p-3 bg-stone-50 rounded-lg ${item.color}`}>
                <item.icon className="w-4 h-4 lg:w-6 lg:h-6" />
              </div>
              <span className={`text-[8px] lg:text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden sm:inline ${item.changeBg}`}>{item.change}</span>
            </div>
            <p className="text-[8px] lg:text-[10px] uppercase tracking-[0.1em] lg:tracking-[0.2em] font-bold text-stone-400 mb-1 leading-tight">{item.name}</p>
            <h3 className="text-xl lg:text-2xl font-serif text-navy">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <div className="bg-white p-5 lg:p-8 shadow-sm border border-stone-200 rounded-sm">
          <h3 className="text-base lg:text-lg font-serif text-navy mb-4 lg:mb-6">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <Link to="/admin/products" className="p-4 lg:p-6 bg-stone-50 border border-stone-100 text-left hover:bg-navy hover:text-white transition-all group rounded-sm flex items-center gap-3">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="min-w-0">
                <p className="text-[9px] lg:text-[10px] uppercase tracking-widest font-bold leading-tight">Thêm sản phẩm</p>
                <p className="text-[8px] opacity-60 hidden sm:block">Đăng tải hàng mới</p>
              </div>
            </Link>
            <Link to="/admin/brands" className="p-4 lg:p-6 bg-stone-50 border border-stone-100 text-left hover:bg-navy hover:text-white transition-all group rounded-sm flex items-center gap-3">
              <ShoppingBagIcon className="w-5 h-5 lg:w-6 lg:h-6 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="min-w-0">
                <p className="text-[9px] lg:text-[10px] uppercase tracking-widest font-bold leading-tight">Thương hiệu</p>
                <p className="text-[8px] opacity-60 hidden sm:block">Quản lý danh sách</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
