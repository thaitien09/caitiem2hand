import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import { useProducts } from '@/context/ProductContext';

export const MOCK_PRODUCTS: import('@/types/product').Product[] = [];

const Home: React.FC = () => {
  const { products, brands, loading } = useProducts();
  const [activeBrand, setActiveBrand] = useState<string>('Tất cả');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoMaximized, setIsVideoMaximized] = useState(false);

  const filteredProducts = activeBrand === 'Tất cả'
    ? products
    : products.filter(p => 
        (p.brand?.toLowerCase() || '').includes(activeBrand.toLowerCase())
      );

  useEffect(() => {
    document.title = "Cái Tiệm 2HAND | Shop Đồ Si Vintage & Độc Bản";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner Section */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/image/banner.avif"
            alt="Main Banner"
            className="w-full h-full object-cover brightness-50"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="relative z-10 text-center text-white px-6 animate-fade-in">
          <h2 className="text-6xl md:text-9xl font-serif tracking-tighter mb-6">
            Cái Tiệm <span className="text-[1.2em]">2</span>HAND
          </h2>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-12 opacity-80">
            Vintage Branding Collection &middot; Đơn giản & Chất lượng
          </p>
          <div className="w-px h-24 bg-white/30 mx-auto" />
        </div>
      </section>

      {/* Lookbook Section */}
      <section className="bg-stone-50 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Video Side */}
            <div className="lg:col-span-5 relative group">
              <div className="aspect-[9/16] max-w-[350px] mx-auto bg-stone-200 rounded-[2rem] overflow-hidden shadow-2xl relative border-[8px] border-white ring-1 ring-stone-200 cursor-pointer"
                onClick={(e) => {
                  const v = document.getElementById('lookbook-video') as HTMLVideoElement;
                  if (v) {
                    if (v.paused) {
                      v.muted = false;
                      v.play();
                      setIsPlaying(true);
                    } else {
                      v.pause();
                      setIsPlaying(false);
                    }
                  }
                }}>
                <video
                  id="lookbook-video"
                  loop
                  muted
                  autoPlay
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/video/intro.mp4" type="video/mp4" />
                </video>

                {/* Fullscreen Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoMaximized(true);
                  }}
                  className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all z-20"
                  title="Toàn màn hình"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </button>

                {/* Play Button Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-500">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-100 hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-navy/5 rounded-full blur-3xl" />
            </div>

            {/* Text Side */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Feel the vibe</h3>
                <h2 className="text-4xl md:text-6xl font-serif text-navy leading-tight">
                  Tận hưởng phong cách <br /> độc bản tại Tiệm.
                </h2>
              </div>

              <p className="text-stone-600 leading-relaxed max-w-lg">
                Mỗi bộ trang phục tại Cái Tiệm 2HAND đều mang trong mình một câu chuyện riêng. Video Lookbook này ghi lại những khoảnh khắc chân thực nhất về chất liệu và form dáng của các dòng sản phẩm tuyển chọn.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => document.getElementById('san-pham')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-navy text-white px-10 py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-stone-900 transition-all duration-500 shadow-xl shadow-navy/10"
                >
                  Khám phá BST Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center md:justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex gap-6 md:gap-12 items-center">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 py-2 border-b-2 cursor-pointer ${activeBrand === brand ? 'border-navy text-navy' : 'border-transparent text-stone-300 hover:text-stone-500'
                  }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Product List */}
      <section id="san-pham" className="max-w-7xl mx-auto px-6 py-20 md:py-32 min-h-[400px]">
        {loading ? (
          /* Skeleton Loading — perceived performance tốt hơn spinner */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-20 gap-x-4 md:gap-x-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-stone-100 mb-5 rounded" />
                <div className="space-y-2 flex flex-col items-center">
                  <div className="h-2 w-16 bg-stone-100 rounded" />
                  <div className="h-3 w-32 bg-stone-100 rounded" />
                  <div className="h-2 w-24 bg-stone-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-20 gap-x-4 md:gap-x-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-stone-300 uppercase tracking-widest text-[10px] animate-in fade-in duration-700">
            Hiện chưa có sản phẩm nào cho {activeBrand}
          </div>
        )}
      </section>


      <Footer />

      {/* Video Fullscreen Lightbox */}
      {isVideoMaximized && (
        <div
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setIsVideoMaximized(false)}
        >
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 z-[210] p-3 text-white hover:rotate-90 transition-transform duration-300"
            onClick={() => setIsVideoMaximized(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative h-[90vh] aspect-[9/16] bg-black shadow-2xl">
            <video
              autoPlay
              loop
              controls
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            >
              <source src="/video/intro.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
