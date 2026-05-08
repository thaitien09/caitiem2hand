import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  TruckIcon,
  ScissorsIcon,
  XMarkIcon,
  NoSymbolIcon
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
  
  // 3-tier loading: router state → Context cache → Firestore fetch
  const cachedProduct = (location.state as any)?.product || (id ? getProductById(id) : null);
  const [product, setProduct] = useState<Product | null>(cachedProduct || null);
  const [loading, setLoading] = useState(!cachedProduct);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // If product already available from state or context, skip fetching
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
      // 1. Cập nhật thẻ Title trên trình duyệt
      document.title = `${product.title} | Cái Tiệm 2HAND`;
      
      // Hàm hỗ trợ tự động tìm và cập nhật thẻ Meta
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // 2. Cập nhật các thẻ chia sẻ mạng xã hội (Open Graph)
      updateMetaTag('og:title', `${product.title} | Cái Tiệm 2HAND`);
      updateMetaTag('og:description', `Sản phẩm độc bản tại Cái Tiệm 2HAND. Tình trạng: ${product.condition}. Mua ngay!`);
      updateMetaTag('og:image', product.image); // Lấy hình ảnh thực tế của sản phẩm
      updateMetaTag('og:url', window.location.href);
      
      // Twitter Card
      updateMetaTag('twitter:title', `${product.title} | Cái Tiệm 2HAND`);
      updateMetaTag('twitter:description', `Sản phẩm độc bản tại Cái Tiệm 2HAND. Tình trạng: ${product.condition}. Mua ngay!`);
      updateMetaTag('twitter:image', product.image);
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

  // Parse sizes (e.g. "M-L" -> ["M", "L"])
  const sizes = product.sizeRange ? product.sizeRange.split(/[-/]/) : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-6 md:py-8">
        <Link to="/" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-navy/80 hover:text-navy transition-colors mb-4 group w-fit">
          <ChevronLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          QUAY LẠI
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Side: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[400px] scrollbar-hide md:w-16 lg:w-20 shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageChange(idx)}
                    className={`aspect-[3/4] md:w-full overflow-hidden transition-all duration-500 shrink-0 ${currentIndex === idx ? 'opacity-100 ring-2 ring-navy ring-offset-2' : 'opacity-40 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image View */}
            <div className="flex-1 relative group overflow-hidden">
              <div
                className="aspect-[3/4] w-full max-h-[450px] md:max-h-[500px] overflow-hidden relative bg-stone-50 cursor-zoom-in border border-stone-100"
                onClick={() => setIsZoomed(true)}
              >
                <img src={images[prevIndex]} alt="Prev" className={`absolute inset-0 w-full h-full object-cover z-0 ${product.isSoldOut ? 'grayscale opacity-50' : ''}`} />
                <img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={product.title}
                  className={`absolute inset-0 w-full h-full object-cover z-10 transition-all duration-1000 ease-out ${isAnimating ? 'opacity-0 blur-lg scale-105' : 'opacity-100 blur-0 scale-100'
                    } ${product.status === 'Đã bán' ? 'grayscale opacity-50' : 'hover:scale-105 transition-transform duration-700'}`}
                />

                {product.status !== 'Đã bán' && images.length > 1 && (
                  <div className="absolute inset-0 z-20 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-2 text-navy/60 hover:text-navy transition-colors">
                      <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-2 text-navy/60 hover:text-navy transition-colors">
                      <ChevronRightIcon className="w-8 h-8" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="lg:col-span-6 flex flex-col pt-4">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold mb-2 text-stone-500">
              <span className="text-navy">{product?.brand || 'Premium Brand'}</span>
              <span className="w-px h-2 bg-stone-300" />
              <span className={product?.status === 'Đã bán' ? 'text-red-600 font-bold' : 'text-navy'}>
                {product?.status || 'Còn hàng'}
              </span>
            </div>

            <h1 className={`text-3xl md:text-4xl font-serif mb-4 leading-[1.2] tracking-tight ${product?.status === 'Đã bán' ? 'text-stone-400' : 'text-navy'}`}>
              {product?.title}
            </h1>

            {/* Price */}
            <div className="mb-4">
              <span className={`text-2xl font-serif tracking-wide ${product?.status === 'Đã bán' ? 'text-stone-300 line-through decoration-2' : 'text-navy'}`}>
                {product?.price || 'Liên hệ để sở hữu'}
              </span>
            </div>

            {/* Premium Detail Cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border-l-2 border-navy/10 pl-6 py-2">
                <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 mb-2 font-bold">Chất liệu</p>
                <p className="text-sm font-bold text-navy uppercase tracking-widest">{product?.material || 'Premium'}</p>
              </div>
              <div className="border-l-2 border-navy/10 pl-6 py-2">
                <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 mb-2 font-bold">Tình trạng (Cond)</p>
                <p className="text-sm font-bold text-navy">{product?.condition || 'Tuyển chọn'}</p>
              </div>
            </div>

            {/* Measurements */}
            {product.measurements && (
              <div className="mb-6 border-t border-stone-200 pt-6">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy">Thông số thực tế (cm)</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">S.i.z.e</span>
                    <div className="flex gap-2">
                      {sizes.map((s, idx) => (
                        <div key={idx} className="w-12 h-12 border border-navy flex items-center justify-center text-sm font-bold text-navy">
                          {s}
                        </div>
                      ))}
                      {sizes.length === 0 && (
                        <div className="w-12 h-12 border border-navy flex items-center justify-center text-sm font-bold text-navy">
                          -
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between max-w-sm">
                  {[
                    { label: 'Vai', value: product.measurements.shoulder },
                    { label: 'Ngực', value: product.measurements.chest },
                    { label: 'Dài', value: product.measurements.length },
                  ].map((item) => (
                    <div key={item.label} className="text-left">
                      <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-1.5 font-bold">{item.label}</p>
                      <p className="text-2xl font-serif text-navy leading-none">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final CTA */}
            <div className="mt-4 mb-8">
              {product.status === 'Đã bán' ? (
                <div className="space-y-4">
                  <button className="w-full bg-stone-100 text-stone-400 py-4 px-6 text-[12px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 cursor-not-allowed border-2 border-stone-200">
                    SẢN PHẨM ĐÃ ĐƯỢC CHỐT
                  </button>
                </div>
              ) : (
                <a
                  href="https://www.instagram.com/caitiem.2hand?igsh=ZnJ0bXRhc3lla3ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-navy text-white py-4 px-6 text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-stone-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl shadow-navy/20"
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
          className="fixed inset-0 z-[100] bg-[#f5f5f5] flex items-stretch animate-in fade-in duration-300"
        >
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 z-[110] p-3 bg-white rounded-full shadow-lg text-navy hover:rotate-90 transition-transform duration-300"
            onClick={() => setIsZoomed(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Thumbnails Sidebar */}
          {images.length > 1 && (
            <div className="w-24 md:w-32 bg-white/50 backdrop-blur-md border-r border-stone-200 flex flex-col items-center py-10 gap-4 overflow-y-auto scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleImageChange(idx)}
                  className={`w-16 md:w-20 aspect-[3/4] overflow-hidden transition-all duration-300 shrink-0 border-2 ${currentIndex === idx ? 'border-navy shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image Container */}
          <div
            className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-auto"
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={images[currentIndex]}
                alt={product.title}
                className="max-w-none w-auto h-auto max-h-[120vh] object-contain shadow-2xl bg-white"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
