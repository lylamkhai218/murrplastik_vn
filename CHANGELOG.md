# Changelog

Tất cả các thay đổi quan trọng của dự án Murrplastik Việt Nam sẽ được lưu trữ tại đây.

## [1.3.0] - 2026-05-18

**Service**: murrplastik-vn-web  
**Purpose**: feat(analytics, social & redirection): tích hợp Google Analytics (Google Tag), cập nhật đường dẫn Facebook mới và tự động chuyển hướng tên miền.  
**Release at**: 18/05/2026  
**By who**: Antigravity & KhaiLL

### Tích hợp Đo lường & Analytics
- **Google Tag (gtag.js)**: Triển khai cài đặt mã theo dõi Google Analytics chính thức (`G-VEEJQJ53DS`) trên toàn bộ hệ thống trang công khai để theo dõi lưu lượng truy cập và hành vi chuyển đổi:
  - Trang chủ ([index.html](file:///d:/T&TVina/murrplastik_code/index.html))
  - 5 trang chi tiết sản phẩm thuộc thư mục [products/](file:///d:/T&TVina/murrplastik_code/products/): [acs.html](file:///d:/T&TVina/murrplastik_code/products/acs.html), [aur.html](file:///d:/T&TVina/murrplastik_code/products/aur.html), [efk.html](file:///d:/T&TVina/murrplastik_code/products/efk.html), [kdh.html](file:///d:/T&TVina/murrplastik_code/products/kdh.html), [suv.html](file:///d:/T&TVina/murrplastik_code/products/suv.html).

### Cập nhật Liên kết Mạng xã hội & Thương hiệu
- **Facebook & Messenger Vanity URLs**: Cập nhật đồng loạt các đường dẫn liên kết Facebook cũ chứa ID số (`https://www.facebook.com/profile.php?id=100080348380792`) và liên kết Messenger (`https://m.me/100080348380792`) sang đường dẫn định danh thương hiệu mới (`https://www.facebook.com/murrplastikvietnam` và `https://m.me/murrplastikvietnam`) tại tất cả vị trí:
  - Schema Structured Data (LocalBusiness Schema `sameAs`) trên trang chủ.
  - Các mục thông tin liên hệ và footer trên trang chủ cùng 5 trang chi tiết sản phẩm.

### Cấu hình Chuyển hướng Tên miền & Bảo mật (Server-side)
- **Tự động Redirect (.htaccess)**: Tạo file cấu hình máy chủ [.htaccess](file:///d:/T&TVina/murrplastik_code/.htaccess) ở thư mục gốc để máy chủ Apache/LiteSpeed của Hostinger tự động xử lý chuyển hướng ở mức tối ưu nhất:
  - Tự động chuyển hướng toàn bộ lượt truy cập không an toàn từ HTTP sang HTTPS (Bảo mật SSL).
  - Tự động chuyển hướng từ tên miền phụ có `www` (`www.murrplastikvn.com`) về tên miền gốc không có `www` (`murrplastikvn.com`) bằng phương thức chuyển hướng vĩnh viễn 301 Redirect chuẩn SEO.

## [1.2.0] - 2026-05-13

**Service**: murrplastik-vn-web  
**Purpose**: fix(ui/ux): nâng cấp trải nghiệm người dùng, tối ưu form chuyển đổi và kỹ thuật SEO chuyên sâu.  
**Release at**: 13/05/2026  
**MR**: [https://github.com/lylamkhai218/murrplastik_vn/commit/c370557](https://github.com/lylamkhai218/murrplastik_vn/commit/c370557)  
**By who**: KhaiLL

### Nâng cấp UI/UX & Điều hướng
- **ScrollSpy**: Tự động làm nổi bật mục Menu tương ứng khi người dùng cuộn đến phần nội dung đó.
- **Preloader**: Thêm màn hình chờ (loading screen) với logo và thanh trạng thái mượt mà khi truy cập web.
- **Hiệu ứng Pulse**: Áp dụng hiệu ứng phát sáng cho bộ 3 nút liên hệ (Zalo, Messenger, Hotline) để tăng tỉ lệ tương tác.
- **Fix Navigation Anchor**: Xử lý triệt để lỗi lệch vị trí khi điều hướng từ trang con về trang chủ thông qua tính năng "cuộn bù" (Scroll Offset & Load Handling).
- **Social Update**: Loại bỏ chữ "Facebook:" thừa tại footer và tích hợp link Fanpage chính thức vào mục Liên hệ.

### Tối ưu Form & Chuyển đổi
- **Real-time Validation**: Hệ thống tự động kiểm tra định dạng Số điện thoại (chuẩn VN), Email và Họ tên ngay khi người dùng đang nhập liệu.
- **Inline Error Messages**: Hiển thị thông báo lỗi chi tiết ngay dưới từng trường thông tin bị sai định dạng.
- **Success Popup Modal**: Thay thế thông báo văn bản đơn giản bằng cửa sổ Popup chuyên nghiệp khi gửi form thành công.

### SEO & Tối ưu Kỹ thuật
- **Structured Data (Schema)**: 
  - Triển khai `LocalBusiness` Schema cho doanh nghiệp (địa chỉ, mạng xã hội, giờ mở cửa).
  - Triển khai `ItemList/Product` Schema cho 5 dòng sản phẩm chính nhằm tối ưu hiển thị Rich Snippets trên Google.
- **Next-gen Images (WebP)**: Cập nhật thẻ `<picture>` cho toàn bộ ảnh sản phẩm chính, ưu tiên định dạng WebP và kích hoạt `lazy loading` để tăng tốc độ tải trang.
- **Responsive**: Tăng kích thước font `.why-num` và tối ưu khoảng cách hiển thị trên thiết bị di động.

