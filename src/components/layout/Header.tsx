import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // If it's a hash link and we're already on the page it refers to
    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      if (location.pathname === basePath || (basePath === '/' && location.pathname === '/')) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
      }
    }
  };

  const menuItems = [
    { name: 'TRANG CHỦ', path: '/' },
    { name: 'SẢN PHẨM', path: '/#san-pham' },
    { name: 'VỀ TIỆM', path: '/ve-tiem' },
    { name: 'LIÊN HỆ', path: '/#lien-he' },
  ];

  return (
    <header className="w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
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

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-navy" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white pt-32 px-10 flex flex-col gap-10 animate-in fade-in slide-in-from-top duration-500">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-2"
          >
            <XMarkIcon className="w-8 h-8 text-navy" />
          </button>

          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              onClick={(e) => handleNavClick(e, item.path)}
              className="text-3xl font-serif tracking-[0.1em] text-navy border-b border-stone-50 pb-6 hover:translate-x-2 transition-transform"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
