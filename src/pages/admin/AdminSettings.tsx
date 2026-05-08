import React, { useState } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import { ShieldCheckIcon, KeyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AdminSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      setLoading(false);
      return;
    }

    try {
      const auth = await getFirebaseAuth();
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error('Không tìm thấy thông tin người dùng.');
      }

      // Firebase yêu cầu xác thực lại (re-authenticate) trước khi đổi mật khẩu
      const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth');
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSuccess('Đã đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        setError('Mật khẩu hiện tại không đúng.');
      } else if (err.code === 'auth/weak-password') {
        setError('Mật khẩu mới quá yếu.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-navy mb-2">Cài đặt tài khoản</h1>
        <p className="text-sm text-stone-500">Quản lý bảo mật và thông tin cá nhân của quản trị viên.</p>
      </div>

      <div className="bg-white border border-stone-200 shadow-sm rounded-sm overflow-hidden">
        <div className="p-8 border-b border-stone-100 flex items-center gap-4">
          <div className="p-3 bg-navy/5 rounded-lg text-navy">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-serif text-navy">Bảo mật tài khoản</h2>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Đổi mật khẩu định kỳ để bảo vệ website</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Mật khẩu hiện tại</label>
              <div className="relative">
                <KeyIcon className="w-4 h-4 text-stone-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-50 mt-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu mới"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="Xác nhận mật khẩu"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-2 border-red-500 flex items-center gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-2 border-green-500 flex items-center gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-green-600">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-navy text-white px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-stone-900 transition-all duration-500 shadow-xl shadow-navy/10 disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </form>

        <div className="p-8 bg-stone-50 border-t border-stone-100">
           <div className="flex items-start gap-4">
              <ExclamationTriangleIcon className="w-5 h-5 text-stone-400 mt-1 shrink-0" />
              <div>
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-navy mb-1">Lưu ý bảo mật</h4>
                 <p className="text-xs text-stone-500 leading-relaxed">
                    Mật khẩu nên bao gồm chữ cái viết hoa, viết thường, số và ký tự đặc biệt. Đừng bao giờ chia sẻ mật khẩu quản trị cho người lạ.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
