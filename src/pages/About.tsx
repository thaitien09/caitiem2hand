import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  HeartIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  GlobeAsiaAustraliaIcon,
  ScissorsIcon 
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  useEffect(() => {
    document.title = "Về Tiệm | Cái Tiệm 2HAND - Câu chuyện của chúng tôi";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 px-6 overflow-hidden bg-stone-50">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy mb-8 block animate-fade-in">
            Câu chuyện của chúng tôi
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-navy mb-12 leading-tight tracking-tighter">
            Cái Tiệm <br /> <span className="text-[1.2em]">2</span>HAND
          </h1>
          <div className="w-20 h-px bg-navy/20 mx-auto" />
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 opacity-20">
        <div className="flex-1 h-px bg-navy" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy whitespace-nowrap">Est. 2026</span>
        <div className="flex-1 h-px bg-navy" />
      </div>

      {/* Shop Image Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-10">
            <h2 className="text-3xl md:text-5xl font-serif text-navy leading-tight">
              Không gian của những <br /> giá trị bền vững
            </h2>
            <p className="text-stone-700 font-light leading-relaxed text-lg">
              Tại <strong>Cái Tiệm <span className="text-[1.1em]">2</span>HAND</strong>, chúng tôi tạo ra một không gian nơi mỗi món đồ đều được trân trọng. 
              Không chỉ là một cửa hàng, đây là nơi lưu giữ những thiết kế vượt thời gian từ Ralph Lauren, Tommy Hilfiger và nhiều thương hiệu di sản khác.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-3">
                <SparklesIcon className="w-6 h-6 text-navy" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy">Độ mới tuyệt đối</h4>
                <p className="text-xs text-stone-500 font-normal">Mọi sản phẩm đều được kiểm tra kỹ lưỡng về tình trạng và độ mới.</p>
              </div>
              <div className="space-y-3">
                <ShieldCheckIcon className="w-6 h-6 text-navy" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy">Chính hãng</h4>
                <p className="text-xs text-stone-500 font-normal">Cam kết 100% hàng tuyển chọn từ các thương hiệu lớn.</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden shadow-2xl">
              <img 
                src="/image/anhshop.jpg" 
                alt="Inside the shop" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 opacity-20">
        <div className="flex-1 h-px bg-navy" />
        <div className="w-1.5 h-1.5 rotate-45 border border-navy" />
        <div className="flex-1 h-px bg-navy" />
      </div>

      {/* Instagram Image Section - SEPARATED */}
      <section className="bg-stone-50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <a 
              href="https://www.instagram.com/caitiem.2hand?igsh=ZnJ0bXRhc3lla3ph"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-[4/5] overflow-hidden shadow-2xl group cursor-pointer relative bg-stone-100 block"
            >
              <img 
                src="/image/anhins.jpg" 
                alt="Instagram Vibe" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em] border border-white/40 px-6 py-3 backdrop-blur-sm">View on Instagram</span>
              </div>
            </a>
            <div className="space-y-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy">Cộng đồng của Tiệm</span>
              <h2 className="text-3xl md:text-5xl font-serif text-navy leading-tight">
                Cảm hứng thời trang <br /> mỗi ngày trên Instagram
              </h2>
              <p className="text-stone-700 font-light leading-relaxed text-lg">
                Hãy cùng chúng tôi xây dựng một phong cách sống bền vững. Theo dõi @caitiem.2hand để cập nhật những mẫu đồ mới nhất, cách phối đồ (mix & match) và những câu chuyện thú vị đằng sau mỗi món đồ si tuyển chọn.
              </p>
              <div className="pt-6">
                <a 
                  href="https://www.instagram.com/caitiem.2hand?igsh=ZnJ0bXRhc3lla3ph" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block border-b border-navy pb-2 text-xs font-bold uppercase tracking-widest text-navy hover:text-stone-600 transition-all hover:translate-x-2"
                >
                  Ghé thăm Instagram →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-stone-900 py-32 md:py-48 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block w-12 h-px bg-white/30 mb-12" />
          
          <h3 className="text-4xl md:text-7xl font-serif mb-12 leading-[1.1] tracking-tight">
            "Đồ cũ nhưng <br className="hidden md:block" /> phong cách không cũ"
          </h3>
          
          <p className="text-white/60 font-light leading-relaxed text-lg md:text-2xl max-w-3xl mx-auto mb-24 italic font-serif">
            "Tại Cái Tiệm <span className="text-white">2HAND</span>, chúng tôi không bán quần áo, chúng tôi bán sự hoài niệm và phong cách sống bền vững. Cảm ơn bạn đã cùng Tiệm gìn giữ những giá trị vượt thời gian."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
            {/* Stat 1 */}
            <div className="relative px-8">
              <p className="text-5xl md:text-7xl font-serif mb-4 tracking-tighter">2000<span className="text-2xl align-top ml-1 text-white/40">+</span></p>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-bold">Khách hàng tin tưởng</p>
              <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-white/10" />
            </div>
            
            {/* Stat 2 */}
            <div className="relative px-8">
              <p className="text-5xl md:text-7xl font-serif mb-4 tracking-tighter">3000<span className="text-2xl align-top ml-1 text-white/40">+</span></p>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-bold">Sản phẩm đã trao tay</p>
              <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-white/10" />
            </div>
            
            {/* Stat 3 */}
            <div className="relative px-8">
              <p className="text-5xl md:text-7xl font-serif mb-4 tracking-tighter">01</p>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-bold">Tình yêu cho đồ si</p>
            </div>
          </div>
        </div>
      </section>

      {/* Garment Care Guide Section */}
      <section className="bg-stone-50 py-24 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4">Care Guide</h3>
            <h2 className="text-3xl md:text-5xl font-serif text-navy">Hướng dẫn bảo quản</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-stone-100">
                <SparklesIcon className="w-6 h-6 text-navy" />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy">Giặt tay nhẹ nhàng</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed px-4">Khuyên dùng giặt tay hoặc túi giặt ở chế độ nhẹ để giữ form dáng.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-stone-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-navy">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 3v2.25m6.364.386l-1.591 1.591" />
                </svg>
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy">Tránh nắng gắt</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed px-4">Phơi ở nơi có bóng râm và thoáng mát để tránh làm phai màu vải.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-stone-100">
                <GlobeAsiaAustraliaIcon className="w-6 h-6 text-navy" />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy">Treo nơi khô thoáng</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed px-4">Sử dụng móc treo gỗ hoặc vải để tránh làm biến dạng phần vai áo.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-stone-100">
                <ScissorsIcon className="w-6 h-6 text-navy" />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy">Ủi nhiệt độ thấp</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed px-4">Sử dụng bàn ủi hơi nước hoặc ủi mặt trái ở nhiệt độ thấp cho Linen/Cotton.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
