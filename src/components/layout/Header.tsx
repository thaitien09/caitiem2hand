import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  // Khoá scroll khi menu mở
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    setMobileMenuOpen(false);
    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      if (location.pathname === basePath || (basePath === '/' && location.pathname === '/')) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/#san-pham' },
    { name: 'Về tiệm', path: '/ve-tiem' },
    { name: 'Liên hệ', path: '/#lien-he' },
  ];

  return (
    <>
      {/* ===== HEADER BAR ===== */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <h1 className="text-lg md:text-xl font-serif tracking-[0.2em] text-navy uppercase">
              Cái Tiệm <span className="text-[1.2em]">2</span>HAND
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-12 items-center h-full">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className="text-[10px] font-bold tracking-[0.3em] text-stone-800 hover:text-navy transition-all duration-300 uppercase hover:translate-y-[-1px]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle Button */}
          <button
            className="lg:hidden p-2 text-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      {mobileMenuOpen && (
        <>
          {/* Lớp mờ phía sau — click để đóng menu */}
          <div
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel menu — trượt từ phải vào */}
          <div className="fixed top-0 right-0 bottom-0 z-[9999] w-[85%] max-w-sm bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 ease-out">
            
            {/* Header của menu */}
            <div className="flex justify-between items-center h-16 px-6 border-b border-stone-100 flex-shrink-0">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-serif tracking-[0.2em] text-navy uppercase"
              >
                Cái Tiệm <span className="text-[1.2em]">2</span>HAND
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-navy"
                aria-label="Đóng menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Danh sách điều hướng */}
            <nav className="flex flex-col flex-1 px-8 pt-8 overflow-y-auto">
              {menuItems.map((item, idx) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className="flex justify-between items-center py-5 border-b border-stone-100 text-navy group"
                >
                  <span className="text-xl font-serif group-hover:translate-x-2 transition-transform duration-300">
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-stone-300 tracking-widest">
                    0{idx + 1}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Footer bên trong menu */}
            <div className="px-8 py-8 border-t border-stone-100 flex-shrink-0">
              <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4">
                Theo dõi chúng tôi
              </p>
              <div className="flex gap-8">
                <a
                  href="https://m.me/Caitiem2hand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-widest text-navy border-b border-navy pb-0.5"
                >
                  Facebook
                </a>
                <a
                  href="https://ig.me/m/caitiem.2hand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-widest text-navy border-b border-navy pb-0.5"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
