import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer id="lien-he" className="bg-navy text-white pt-20 pb-10 mt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-serif tracking-[0.2em] mb-6 uppercase">
              Cái Tiệm <span className="text-[1.2em]">2</span>HAND
            </h2>
            <p className="text-stone-400 text-[10px] tracking-widest uppercase leading-loose">
              Tuyển tập những mẫu đồ si độc bản & hoài cổ từ các thương hiệu hàng đầu.
            </p>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-white/50">Liên hệ</h3>
            <ul className="space-y-4 text-[10px] tracking-widest uppercase text-stone-400">
              <li>
                <a href="https://m.me/Caitiem2hand" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Facebook: Cái Tiệm Secondhand
                </a>
              </li>
              <li>
                <a href="https://ig.me/m/caitiem.2hand" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram: caitiem.2hand
                </a>
              </li>
            </ul>
          </div>

          {/* Information Column */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-white/50">Thông tin</h3>
            <ul className="space-y-4 text-[10px] tracking-widest uppercase text-stone-400">
              <li>Hỗ trợ đổi trả trong 4 ngày</li>
              <li>Nhận sửa size theo yêu cầu</li>
              <li>Ship toàn quốc</li>
            </ul>
          </div>


        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-stone-500 uppercase tracking-widest">
          <p>&copy; 2026 Cái Tiệm <span className="text-[1.2em]">2</span>HAND. Mọi quyền được bảo lưu.</p>
          <div className="flex gap-8">
            <Link to="/chinh-sach" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link to="/chinh-sach" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
