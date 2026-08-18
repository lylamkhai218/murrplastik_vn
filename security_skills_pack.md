# SECURITY & DEPLOYMENT SKILLS PACK - T&T VINA PROJECT

Cẩm nang bảo mật, tối ưu hóa token và vận hành hệ thống Deploy tự động dành cho AI Assistant và Lập trình viên phát triển dự án T&T Vina (từ mã nguồn Murrplastik).

---

## 1. TỔNG QUAN HỆ THỐNG & NHẬN DIỆN THƯƠNG HIỆU
* **Môi trường Staging (Thử nghiệm)**: [https://slategray-scorpion-577666.hostingersite.com/](https://slategray-scorpion-577666.hostingersite.com/)
* **Môi trường Production (Chính thức)**: [https://murrplastikvn.com/](https://murrplastikvn.com/) (hoặc tên miền mới sau khi đổi).
* **Quy chuẩn đổi tên**: Toàn bộ từ khóa độc quyền của hãng *Murrplastik* được đổi sang *T&T Vina Industrial Co., Ltd* và email sang `sales@murrplastik-vn.com`.

---

## 2. QUY TẮC BẢO MẬT BẮT BUỘC (SECURITY RULES)

### A. Quản lý thông tin cấu hình (`.env`)
* **NGHIÊM CẤM** commit file `.env` lên Git. File `.env` chứa thông tin đăng nhập FTP nhạy cảm của máy chủ và đã được chặn trong `.gitignore`.
* Khi viết mã nguồn, không được in trực tiếp (print/log) giá trị biến mật khẩu FTP ra màn hình console.

### B. Môi trường Staging (Bảo mật 2 lớp chống Google Index)
* **Lớp 1: Khóa mật khẩu truy cập (Basic Auth)**:
  - File `.htaccess` tại Staging phải luôn bắt đầu bằng block cấu hình HTTP Basic Authentication trỏ tới `.htpasswd`.
  - Mật khẩu lưu trong `.htpasswd` phải sử dụng mã hóa muối chuẩn của Apache (mã hóa MD5 muối dạng `$apr1$...`). *Lưu ý: Mã hóa MD5 thường hoặc SHA1 sẽ không được hỗ trợ bởi Apache/LiteSpeed của Hostinger.*
* **Lớp 2: Chống Google Index**:
  - File `robots.txt` trên Staging phải chứa nội dung `User-agent: *\nDisallow: /`.
  - Tất cả các file `.html` trên Staging phải có thẻ `<meta name="robots" content="noindex, nofollow" />` nằm ngay trong thẻ `<head>`.

### C. Ghi đè file `.htaccess` an toàn (URL Rewrite Preservation)
* Website sử dụng các đường dẫn sạch (Clean URLs - không có đuôi `.html` ở cuối). Quy tắc định nghĩa định tuyến này nằm trong `.htaccess` gốc.
* Khi chỉnh sửa `.htaccess` để cấu hình Basic Auth cho Staging, **không được ghi đè trực tiếp**. Phải đọc nội dung gốc của `.htaccess` trước, sau đó **chèn các quy tắc bảo mật lên đầu (prepend)** để bảo toàn các luật `mod_rewrite` bên dưới.

### D. Kết nối mạng an toàn
* Luôn sử dụng giao thức **FTPS (FTP over Explicit TLS)** với port 21 để đồng bộ file. Không sử dụng FTP thường (không mã hóa) để tránh bị nghe lén dữ liệu trên đường truyền.

---

## 3. TỐI ƯU HÓA TOKEN & HIỆU NĂNG (TOKEN & PERFORMANCE SAVINGS)

### A. Triển khai theo phương thức So sánh Delta (Delta Uploads)
* Không được upload lại toàn bộ thư mục web (khoảng 250MB) mỗi lần sửa đổi.
* Tận dụng tối đa logic so sánh kích thước file (`MLSD` directory cache) trong các script `deploy_staging.py` và `deploy_production.py` để bỏ qua các file trùng khớp kích thước. Cách này tiết kiệm 95% thời gian xử lý và giảm số lượng API/Token trao đổi.

### B. Bỏ qua các file nhị phân (Binary Exclusions)
* Tránh đọc hoặc phân tích nội dung các file nhị phân lớn (`.pdf`, `.zip`, `.png`, `.jpg`, `.webp`) bằng các công cụ đọc file. Chỉ thực hiện sao chép nhị phân thuần túy (`shutil.copy2`).
* Các thư mục lớn như `.git`, `ttvina_staging`, `ttvina_production` và file `.zip` luôn nằm trong danh sách loại trừ khi quét thư mục nguồn.

---

## 4. QUY TRÌNH VẬN HÀNH CHUẨN (STANDARD OPERATING PROCEDURES)

### Bước 1: Sửa đổi code tại thư mục gốc
Lập trình viên và AI chỉnh sửa mã nguồn trực tiếp tại các file gốc (ví dụ: `index.html`, `products/`, `css/`...).

### Bước 2: Build & Đóng gói sản phẩm thương hiệu
Chạy lệnh Python tương ứng để tạo ra thư mục phân phối sạch:
* **Cho Staging (Khóa mật khẩu + Chặn Index)**:
  ```bash
  python copy_and_replace.py staging
  ```
* **Cho Production (Mở công khai + Cho phép Google Index)**:
  ```bash
  python copy_and_replace.py production
  ```

### Bước 3: Deploy đồng bộ hóa lên máy chủ
* **Đẩy lên Staging**:
  ```bash
  python deploy_staging.py
  ```
* **Đẩy lên Production (Cực kỳ cẩn thận)**:
  ```bash
  python deploy_production.py
  ```
