# Changelog

Tất cả các thay đổi quan trọng của dự án Murrplastik Việt Nam sẽ được lưu trữ tại đây.

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

