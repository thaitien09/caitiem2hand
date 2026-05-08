import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  ShieldCheckIcon, 
  ArrowPathIcon, 
  TruckIcon,
  CheckBadgeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Policies: React.FC = () => {
  useEffect(() => {
    document.title = "Chính sách & Điều khoản | Cái Tiệm 2HAND";
    // Update Meta Tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", "Tìm hiểu về chính sách đổi trả, bảo hành và cam kết chính hãng tại Cái Tiệm 2HAND.");
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-navy py-20 text-white text-center">
        <h1 className="text-3xl md:text-5xl font-serif mb-4">Chính sách & Điều khoản</h1>
        <p className="text-[11px] uppercase tracking-widest text-white/60">Sự an tâm của bạn là ưu tiên hàng đầu của Tiệm</p>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-20 space-y-20">
        
        {/* Cam kết chính hãng */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-stone-100">
            <CheckBadgeIcon className="w-8 h-8 text-navy" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-navy mb-4">1. Cam kết Chính hãng (Authentic)</h2>
            <div className="text-stone-600 text-sm leading-relaxed space-y-3">
              <p>Mọi sản phẩm tại <strong>Cái Tiệm 2HAND</strong> đều được tuyển chọn và kiểm định kỹ lưỡng. Chúng tôi cam kết 100% sản phẩm đến từ các thương hiệu chính hãng như Ralph Lauren, Tommy Hilfiger, Levi's, Lacoste...</p>
              <p>Nếu phát hiện hàng giả, hàng nhái, Tiệm cam kết <strong>hoàn tiền 100%</strong> kèm theo lời xin lỗi sâu sắc nhất.</p>
            </div>
          </div>
        </div>

        {/* Đổi trả */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-stone-100">
            <ArrowPathIcon className="w-8 h-8 text-navy" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-navy mb-4">2. Chính sách Đổi trả & Sửa Size</h2>
            <div className="text-stone-600 text-sm leading-relaxed space-y-3">
              <p>Vì tính chất của đồ si (hàng secondhand), mỗi sản phẩm thường chỉ có một mẫu duy nhất. Tuy nhiên, để đảm bảo bạn luôn mặc đẹp nhất:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Hỗ trợ đổi sản phẩm khác</strong> có giá trị tương đương hoặc cao hơn trong vòng <strong>4 ngày</strong> kể từ ngày nhận hàng (sản phẩm phải còn nguyên trạng, chưa qua giặt tẩy).</li>
                <li>Hỗ trợ <strong>sửa size (bóp eo, lên lai)</strong> miễn phí cho các sản phẩm mua tại Tiệm để vừa vặn nhất với form dáng của bạn.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giao hàng */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-stone-100">
            <TruckIcon className="w-8 h-8 text-navy" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-navy mb-4">3. Vận chuyển & Giao nhận</h2>
            <div className="text-stone-600 text-sm leading-relaxed space-y-3">
              <p>Tiệm nhận giao hàng toàn quốc với sự cẩn thận tối đa trong khâu đóng gói để giữ form áo.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Nội thành TP.HCM:</strong> Giao hàng trong 1-2 ngày làm việc. Có hỗ trợ giao hỏa tốc qua Ahamove/Grab nếu khách cần gấp.</li>
                <li><strong>Ngoại thành & Tỉnh khác:</strong> Giao hàng qua GHTK/Viettel Post từ 3-5 ngày làm việc.</li>
                <li>Miễn phí vận chuyển (Freeship) cho tất cả các đơn hàng có giá trị trên 1.000.000 VNĐ.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bảo mật thông tin */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-stone-100">
            <ShieldCheckIcon className="w-8 h-8 text-navy" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-navy mb-4">4. Chính sách Bảo mật Thông tin</h2>
            <div className="text-stone-600 text-sm leading-relaxed space-y-3">
              <p>Cái Tiệm 2HAND tôn trọng và bảo vệ quyền riêng tư của bạn. Mọi thông tin cá nhân (Tên, Số điện thoại, Địa chỉ) cung cấp qua Inbox/Website chỉ được sử dụng duy nhất cho mục đích tư vấn và giao hàng.</p>
              <p>Chúng tôi tuyệt đối không chia sẻ, bán hoặc trao đổi thông tin khách hàng cho bất kỳ bên thứ ba nào.</p>
            </div>
          </div>
        </div>

        {/* Điều khoản dịch vụ */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-stone-100">
            <DocumentTextIcon className="w-8 h-8 text-navy" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-navy mb-4">5. Điều khoản Dịch vụ</h2>
            <div className="text-stone-600 text-sm leading-relaxed space-y-3">
              <p>Khi tiến hành mua hàng tại <strong>Cái Tiệm 2HAND</strong>, quý khách được xem là đã đồng ý với các điều khoản sau:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Giá cả & Thanh toán:</strong> Giá niêm yết trên Website/Instagram là giá cuối cùng. Hiện tại, Tiệm <strong>chỉ nhận thanh toán qua hình thức chuyển khoản ngân hàng (100% giá trị đơn hàng)</strong> trước khi gửi hàng. Chúng tôi chưa áp dụng hình thức thu hộ (COD).</li>
                <li><strong>Tình trạng sản phẩm:</strong> Đồ si có thể sẽ có những tì vết nhỏ không đáng kể (đã được giặt ủi sạch sẽ). Tiệm luôn cố gắng mô tả và chụp ảnh chi tiết nhất. Quý khách vui lòng kiểm tra kỹ thông tin hoặc nhờ tư vấn thêm trước khi chốt đơn.</li>
                <li><strong>Từ chối phục vụ:</strong> Tiệm xin phép từ chối phục vụ hoặc giao dịch với những trường hợp có hành vi gian lận, bom hàng, hoặc sử dụng ngôn từ thiếu tôn trọng.</li>
              </ul>
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default Policies;
