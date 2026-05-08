import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { getFirebaseAuth } from '@/lib/firebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState(''); // Firebase uses Email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = await getFirebaseAuth();
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Định dạng email không hợp lệ.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <div className="flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full bg-white p-10 shadow-2xl border border-stone-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-navy mb-3">Đăng nhập Quản trị</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Dành riêng cho Cái Tiệm 2HAND</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-navy mb-2">Email Quản trị</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                placeholder="Nhập email quản trị"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-navy mb-2">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest text-center italic">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-stone-900 transition-all duration-500 shadow-xl shadow-navy/10 disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-stone-100 text-center">
             <p className="text-stone-400 text-[10px] uppercase tracking-widest">Nếu quên mật khẩu, vui lòng kiểm tra tệp cấu hình hoặc liên hệ kỹ thuật.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
