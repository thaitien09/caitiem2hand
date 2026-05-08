import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, image, title, status, brand } = product;
  const isSold = status === 'Đã bán';
  const isNew = status === 'Hàng mới';

  return (
    <Link to={`/san-pham/${id}`} state={{ product }} className="group cursor-pointer block relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-3 md:mb-5 transition-all duration-500">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105 ${isSold ? 'grayscale opacity-70' : ''}`}
          loading="lazy"
        />
        
        {/* Status Badge */}
        {isSold ? (
          <span className="absolute top-0 left-0 bg-red-600 text-white px-2 md:px-3 py-1 md:py-1.5 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] z-10">
            Hết hàng
          </span>
        ) : isNew ? (
          <span className="absolute top-0 left-0 bg-navy text-white px-2 md:px-3 py-1 md:py-1.5 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] z-10">
            Hàng mới
          </span>
        ) : null}

        {/* Action Button - Desktop Only */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className={`w-full py-3 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer border ${isSold ? 'bg-stone-100 text-stone-400 border-stone-200' : 'bg-white text-navy border-navy hover:bg-navy hover:text-white'}`}>
            {isSold ? 'Đã bán' : 'Chi Tiết Sản Phẩm'}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="text-center space-y-1">
        {brand && (
          <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] ${isSold ? 'text-stone-300' : 'text-stone-400'}`}>
            {brand}
          </span>
        )}
        <h3 className={`text-[10px] md:text-[12px] font-medium tracking-wide uppercase line-clamp-2 px-2 transition-colors ${isSold ? 'text-stone-400' : 'text-stone-800 md:group-hover:text-navy'}`}>
          {title}
        </h3>
        <p className="text-[8px] md:text-[9px] text-stone-400 uppercase tracking-widest pt-0.5 md:pt-1">
          {isSold ? 'Hết hàng' : 'Xem chi tiết'}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
