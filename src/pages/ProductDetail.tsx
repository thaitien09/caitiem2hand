import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ScissorsIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MOCK_PRODUCTS } from '@/pages/Home';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Product } from '@/types/product';
import { useProducts } from '@/context/ProductContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { getProductById } = useProducts();
  
  const cachedProduct = (location.state as any)?.product || (id ? getProductById(id) : null);
  const [product, setProduct] = useState<Product | null>(cachedProduct || null);
  const [loading, setLoading] = useState(!cachedProduct);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (cachedProduct) return;

    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      if (!isFirebaseConfigured || !db) {
        const mockProduct = MOCK_PRODUCTS.find(p => p.id.toString() === id);
        if (mockProduct) setProduct(mockProduct);
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ ...docSnap.data(), id: docSnap.id } as unknown as Product);
        } else {
          const mockProduct = MOCK_PRODUCTS.find(p => p.id.toString() === id);
          if (mockProduct) setProduct(mockProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        const mockProduct = MOCK_PRODUCTS.find(p => p.id.toString() === id);
        if (mockProduct) setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const images = product?.images || (product?.image ? [product.image] : []);

  const handleImageChange = (newIndex: number) => {
    if (newIndex === currentIndex || isAnimating) return;
    setPrevIndex(currentIndex);
    setIsAnimating(true);
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isAnimating]);

  const nextImage = () => {
    handleImageChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    handleImageChange((currentIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isZoomed]);

  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Cái Tiệm 2HAND`;
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-navy rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-serif mb-4 text-navy">Không tìm thấy sản phẩm</h2>
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-navy underline underline-offset-8 transition-all">Quay lại trang chủ</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sizes = product.sizeRange ? product.sizeRange.split(/[-/]/) : [];
  const isSold = product.status === 'Đã bán';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-12 md:py-8">
        <Link to="/" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-navy/80 hover:text-navy transition-colors mb-3 md:mb-4 group w-fit">
          <ChevronLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          QUAY LẠI
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
          {/* Left Side: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Thumbnails: Single vertical column on PC */}
            {images.length > 1 && (
              <div className="flex flex-row md:flex-col gap-2 md:gap-3 md:max-h-[600px] md:overflow-y-auto custom-scrollbar md:w-20 lg:w-24 shrink-0 order-2 md:order-1 overflow-x-auto md:overflow-x-hidden snap-x md:snap-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-[calc(25%-8px)] md:w-full aspect-[3/4] shrink-0 snap-start overflow-hidden transition-all duration-300 border-2 ${currentIndex === idx ? 'border-navy shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image View */}
            <div className="flex-1 order-1 md:order-2">
              <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden border border-stone-100">
                <img
                  src={images[currentIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover animate-in fade-in duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Sticky Product Info */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold mb-2 text-stone-500">
              <span className="text-navy">{product?.brand || 'Premium Brand'}</span>
              <span className="w-px h-2 bg-stone-300" />
              <span className={isSold ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>
                {product?.status || 'Còn hàng'}
              </span>
            </div>

            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-serif mb-4 leading-[1.2] tracking-tight ${isSold ? 'text-stone-400' : 'text-navy'}`}>
              {product?.title}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <span className={`text-xl md:text-2xl font-serif tracking-wide ${isSold ? 'text-stone-300 line-through decoration-2' : 'text-navy'}`}>
                {product?.price || 'Liên hệ để sở hữu'}
              </span>
            </div>

            {/* Premium Detail Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
              <div className="border-l-2 border-navy/20 pl-4 md:pl-6 py-2 bg-stone-50/50">
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-stone-500 mb-1 font-bold">Chất liệu</p>
                <p className="text-xs md:text-sm font-bold text-navy uppercase tracking-widest">{product?.material || 'Premium'}</p>
              </div>
              <div className="border-l-2 border-navy/20 pl-4 md:pl-6 py-2 bg-stone-50/50">
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-stone-500 mb-1 font-bold">Tình trạng</p>
                <p className="text-xs md:text-sm font-bold text-navy">{product?.condition || 'Tuyển chọn'}</p>
              </div>
            </div>

            {/* Measurements */}
            {product.measurements && (
              <div className="mb-6 border-t border-stone-100 pt-6">
                <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy">Thông số thực tế (cm)</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Size</span>
                    <div className="flex gap-1.5">
                      {(sizes.length > 0 ? sizes : ['-']).map((s, idx) => (
                        <div key={idx} className="w-10 h-10 md:w-12 md:h-12 border border-navy flex items-center justify-center text-sm font-bold text-navy">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-8 md:gap-12">
                  {[
                    { label: 'Vai', value: product.measurements.shoulder },
                    { label: 'Ngực', value: product.measurements.chest },
                    { label: 'Dài', value: product.measurements.length },
                  ].map((item) => (
                    <div key={item.label} className="text-left">
                      <p className="text-[8px] md:text-[9px] text-stone-500 uppercase tracking-widest mb-1.5 font-bold">{item.label}</p>
                      <p className="text-xl md:text-2xl font-serif text-navy leading-none">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main CTA - Visible on ALL devices, moves with scroll */}
            <div className="mt-2 mb-8">
              {isSold ? (
                <button disabled className="w-full bg-stone-100 text-stone-400 py-4 px-6 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 cursor-not-allowed border-2 border-stone-200">
                  SẢN PHẨM ĐÃ ĐƯỢC CHỐT
                </button>
              ) : (
                <a
                  href="https://www.instagram.com/caitiem.2hand?igsh=ZnJ0bXRhc3lla3ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-navy text-white py-4 px-6 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-stone-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl shadow-navy/20 active:scale-[0.98]"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  LIÊN HỆ CÁI TIỆM SECONDHAND
                </a>
              )}
            </div>

            {/* Commitments */}
            <div className="space-y-4 border-t border-stone-100 pt-6">
              <div className="flex items-start gap-4">
                <ScissorsIcon className="w-4 h-4 text-navy mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-navy mb-1">Dịch vụ sửa size</h4>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    Tiệm nhận sữa size theo yêu cầu không mất form. Tư vấn size chỉ từ vừa đến rộng tí thôi.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckBadgeIcon className="w-4 h-4 text-navy mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-navy mb-1">Đổi trả & Bảo hành</h4>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    Hỗ trợ đổi trong vòng 4 ngày nếu sản phẩm không đúng mô tả hoặc mặc không vừa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Fullscreen Zoom Overlay */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col items-stretch animate-in fade-in duration-300"
        >
          <button
            className="absolute top-4 right-4 z-[110] p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <div className="order-2 h-24 w-full bg-white/5 backdrop-blur-md border-t border-white/10 flex flex-row items-center px-4 py-3 gap-3 overflow-x-auto scrollbar-hide shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleImageChange(idx)}
                  className={`w-14 aspect-[3/4] overflow-hidden transition-all duration-300 shrink-0 border-2 ${currentIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div
            className="order-1 flex-1 flex items-center justify-center p-4 overflow-auto"
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={images[currentIndex]}
                alt={product.title}
                className="max-w-full max-h-[75vh] md:max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute -bottom-10 left-0 w-full text-center text-white/60 text-xs font-serif tracking-widest">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
