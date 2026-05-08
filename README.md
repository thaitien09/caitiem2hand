# 👜 Cái Tiệm 2HAND - Luxury Vintage Storefront

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-11-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)

**Cái Tiệm 2HAND** là một nền tảng thương mại điện tử chuyên về đồ Si (Vintage) cao cấp, được thiết kế với phong cách "Quiet Luxury" hiện đại, tối giản và tập trung vào trải nghiệm hình ảnh cao cấp.

---

## ✨ Điểm nổi bật (Features)

- **💎 Giao diện Premium:** Thiết kế tối giản, font chữ Serif sang trọng, hiệu ứng chuyển cảnh mượt mà.
- **🎬 Lookbook Video:** Tích hợp video giới thiệu bộ sưu tập ngay tại trang chủ với cơ chế tối ưu load metadata.
- **📱 Responsive Design:** Hiển thị hoàn hảo trên mọi thiết bị từ Mobile đến Desktop.
- **🔐 Admin Dashboard:** Hệ thống quản trị chuyên nghiệp để thêm/sửa/xóa sản phẩm và thương hiệu.
- **🛡️ High Security:** Bảo mật trang Admin bằng Firebase Auth, hỗ trợ tính năng đổi mật khẩu trực tiếp.
- **☁️ Cloudinary Integration:** Tự động tối ưu hóa và lưu trữ hình ảnh sản phẩm.

---

## 🚀 Tối ưu hiệu năng (Performance Optimization)

Dự án đã được tối ưu hóa chuyên sâu để đạt tốc độ load cực nhanh:
- **Lazy Loading Firebase:** Tách biệt các module (Auth, Storage, Analytics) để giảm dung lượng bundle ban đầu (~200KB).
- **One-time Fetching:** Chuyển đổi từ Realtime Listeners sang One-time Fetching cho trang chủ để tăng tốc độ phản hồi.
- **Skeleton UI:** Sử dụng bộ khung loading giả lập thay vì spinner truyền thống, tăng trải nghiệm thị giác.
- **Priority Rendering:** Sử dụng `fetchPriority="high"` cho Hero Banner và tối ưu hóa cơ chế nạp ảnh sản phẩm.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend:** React 19, TypeScript, Tailwind CSS 4.
- **Build Tool:** Vite 8.
- **Backend-as-a-Service:** Firebase 11 (Firestore, Authentication).
- **Media Hosting:** Cloudinary API.
- **Deployment:** Vercel.

---

## 📦 Hướng dẫn cài đặt (Installation)

1. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/cai-tiem-2hand.git
   cd cai-tiem-2hand
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env` tại thư mục gốc và nhập các thông tin Firebase của bạn:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Chạy chế độ phát triển:**
   ```bash
   npm run dev
   ```

---

## 📄 Giấy phép (License)

Dự án này được tạo ra cho mục đích Portfolio cá nhân. Vui lòng liên hệ trước khi sử dụng cho mục đích thương mại.

---

*Made with ❤️ for Cái Tiệm 2HAND*
