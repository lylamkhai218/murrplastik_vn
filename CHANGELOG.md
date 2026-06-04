# Changelog

Tất cả các thay đổi quan trọng của dự án Murrplastik Việt Nam sẽ được lưu trữ tại đây.

## [1.4.0] - 2026-06-04

**Service**: murrplastik-vn-web  
**Purpose**: feat(ui/ux, performance): tối ưu hóa dung lượng hình ảnh banner, tích hợp Popup CTA thông minh và bổ sung nút Quay về đầu trang đồng bộ.  
**Release at**: 04/06/2026  
**By who**: KhaiLL

### Tối ưu hóa Hình ảnh & Hiệu năng
- **Chuyển đổi sang WebP**: Chuyển đổi file ảnh banner khuyến mại khổng lồ (`Popup_CTA_Murrplastik.png`, `5.23 MB`) sang định dạng WebP thế hệ mới (`Popup_CTA_Murrplastik.webp`, `337 KB`). Giúp giảm kích thước tải xuống **93.4%** nhưng giữ nguyên độ nét và độ trong suốt của nền, giúp trang tải tức thì trên mọi loại mạng di động.
- **Caching & Nén GZIP (.htaccess)**: Bổ sung cấu hình tối ưu bộ nhớ đệm trình duyệt (Browser Caching) 1 năm cho ảnh (WebP, SVG, PNG, JPG), CSS, JS và kích hoạt nén GZIP dữ liệu truyền tải qua mạng giúp trang web phản hồi siêu nhanh.

### Tích hợp Popup CTA Khuyến mại thông minh
- **Giao diện & Chuyển đổi**: Thêm popup quảng cáo (#promoPopup) vào trang chủ. Sử dụng nút Close (X) phong cách pixel-art màu đỏ thương hiệu dựng trực tiếp bằng SVG và thiết lập liên kết mượt mà cuộn thẳng đến phần liên hệ `#contact` khi nhấp vào banner.
- **Mobile Responsiveness**: Khống chế chiều rộng banner tối đa `320px` và chiều cao tối đa `70vh` trên màn hình nhỏ/điện thoại, đảm bảo giao diện popup cân đối và không làm tràn nút đóng ra ngoài màn hình.
- **Bộ 3 Trình kích hoạt (Triggers)**:
  - **Scroll Depth**: Kích hoạt khi cuộn qua 25% chiều dài trang chủ.
  - **Time Delay**: Kích hoạt sau 10 giây ở lại trang.
  - **Exit Intent**: Kích hoạt trên máy tính khi di chuyển con trỏ chuột hướng lên thanh địa chỉ của trình duyệt để chuẩn bị rời trang.
- **Tần suất hiển thị (Frequency Capping)**: Triển khai Cookie lưu trạng thái tắt `promo_popup_dismissed=true` trong vòng 1 ngày để đảm bảo không hiển thị lặp đi lặp lại gây khó chịu cho khách hàng.

### Nút Quay về đầu trang (Back to Top)
- **Vị trí và căn gióng**: Bổ sung nút quay về đầu trang dạng hình tròn màu đỏ thương hiệu nằm ở góc dưới bên phải, căn ngang thẳng hàng sang trái nút Messenger (`right: 94px` trên desktop và `right: 76px` trên mobile), tạo bố cục gọn gàng, đồng bộ.
- **Kích hoạt & Trải nghiệm**: Thiết lập kích hoạt hiển thị khi cuộn trang đạt mốc **50%** trở lên. Áp dụng hiệu ứng fade-in + slide-in mềm mại.
- **Đồng bộ hóa**: Tích hợp đồng loạt trên trang chủ (`index.html`) và cả 5 trang con giới thiệu sản phẩm trong thư mục `products/`.

### Đo lường chuyển đổi (Analytics)
- **Gửi form thành công**: Tích hợp hàm kích hoạt sự kiện `generate_lead` của Google Analytics khi form báo giá được gửi thành công, giúp việc theo dõi hiệu suất marketing chuẩn xác và trực quan.

### Đa ngôn ngữ (i18n) cho các trang con
- **Đồng bộ hóa Ngôn ngữ**: Liên kết file `i18n.js` vào cả 5 trang sản phẩm (`acs.html`, `aur.html`, `efk.html`, `kdh.html`, `suv.html`). Giao diện sẽ tự động chuyển sang tiếng Anh hoặc tiếng Việt dựa trên tùy chọn đã lưu ở trang chủ hoặc chuyển đổi trực tiếp trên trang con.
- **Thanh Menu & Nút chuyển ngôn ngữ**: Thêm cụm nút chọn ngôn ngữ (VI/EN) và nút menu mobile (hamburger) vào navbar của cả 5 trang con để đồng bộ hóa hoàn toàn trải nghiệm người dùng.
- **Dịch thuật toàn diện nội dung**: Khai báo đầy đủ các thẻ `data-i18n` và dịch thuật toàn bộ các phần: Tiêu đề trang (SEO Title), Mô tả trang (Meta Description), Tiêu đề chính, Các tính năng nổi bật, Mô tả ứng dụng thực tế, Nhãn sản phẩm tiêu biểu và Nút liên hệ của từng trang con.

## [1.3.0] - 2026-05-18

**Service**: murrplastik-vn-web  
**Purpose**: feat(analytics, social & redirection): tích hợp Google Analytics (Google Tag), cập nhật đường dẫn Facebook mới và tự động chuyển hướng tên miền.  
**Release at**: 18/05/2026  
**By who**: KhaiLL

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

### Tối ưu hóa Hình ảnh & Khắc phục Lỗi 404
- **Định dạng WebP thế hệ mới**: Tạo và bổ sung đầy đủ các file ảnh đuôi `.webp` còn thiếu cho danh mục sản phẩm (chuyển đổi chất lượng cao từ các file `.jpg` gốc) bao gồm: `label.webp`, `murrplastik_Conduits_and_fittings.webp`, `murrplastik_Cable_entry_systems_and_holders.webp`, `murrplastik_Energy_chains.webp`, `murrplastik_Automation_and_Robotics.webp`.
- **Sửa lỗi hiển thị (broken images)**: Khắc phục triệt để lỗi 404 hình ảnh trên các trình duyệt hỗ trợ WebP, giúp tối ưu hóa dung lượng trang web và cải thiện đáng kể tốc độ tải trang.

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

