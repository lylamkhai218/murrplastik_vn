# DESIGN HUB — MULTI-BRAND SVG & FIGMA ASSET REPOSITORY
====================================================================
Dự án: T&T VINA INDUSTRIAL CO., LTD
Mục đích: Quản trị tập trung toàn bộ tài sản thiết kế vector (SVG) sẵn sàng import và tinh chỉnh trong Figma.

## 1. Cấu Trúc Thương Hiệu (Brand Directory Hierarchy)

```
design-hub/
├── 00_brand-tokens/                    # Bảng màu, typography và guideline từng thương hiệu
│   └── brand_tokens.json
│
├── 01_murrplastik-vn/                  # Thương hiệu Murrplastik CHLB Đức (Đại lý ủy quyền T&T Vina)
│   ├── social-banners-svg/             # Banner Facebook (1200x630, 1080x1080, Story 1080x1920)
│   ├── event-exhibition-svg/           # Poster VEC 2026, Standee, Backdrop gian hàng H1-15
│   └── web-ui-components-svg/          # Thẻ VIP Gift Pass, Vòng quay Canvas, Hotspots 3D
│
├── 02_ttvina-industrial/               # T&T Vina Industrial (Các dòng sản phẩm & thương mại tổng hợp)
│   ├── social-banners-svg/
│   ├── event-exhibition-svg/
│   └── web-ui-components-svg/
│
├── 03_ttpc/                            # Thương hiệu TTPC
│   ├── social-banners-svg/
│   ├── event-exhibition-svg/
│   └── web-ui-components-svg/
│
└── 99_shared-assets/                   # Dùng chung: Icons công nghiệp, flags, badges, patterns
    └── industrial_icons.svg
```

## 2. Tiêu Chuẩn Kỹ Thuật SVG Cho Figma (Figma-Ready Standards)

1. **Kích thước chuẩn (ViewBox):**
   * Facebook Feed Landscape: `viewBox="0 0 1200 630"`
   * Facebook / Instagram Square: `viewBox="0 0 1080 1080"`
   * Story / Reel / Zalo Vertical: `viewBox="0 0 1080 1920"`
   * Poster A2 Triển lãm: `viewBox="0 0 1200 1697"`
2. **Cấu trúc Layer ngữ nghĩa (Semantic Grouping):**
   * Sử dụng `<g id="Background">`, `<g id="Header_Brand">`, `<g id="Hero_Content">`, `<g id="CTA_Button">` để khi kéo vào Figma, các layer được đặt tên tự động.
3. **Typography & Font:**
   * Sử dụng font `font-family="Barlow, sans-serif"` hoặc `Barlow Condensed` để đồng bộ hoàn toàn với bộ nhận diện Murrplastik.

---

## 3. Danh Mục Web UI Components SVG — Chiến Dịch VEC 2026 (27/08/2026)
Thư mục: `01_murrplastik-vn/web-ui-components-svg/`

1. **`MP_UI_VEC2026_Full_Experience_Board.svg` (2400 × 1440)**: Master Figma Artboard tổng hợp toàn bộ 3 bước trải nghiệm (Countdown Hero, Lead Qualification Form, Vòng quay Canvas, Thẻ VIP Pass) và Bảng màu Design Tokens.
2. **`MP_UI_LuckyWheel_Widget_800x800.svg` (800 × 800)**: Vòng quay may mắn 6 nan quà tặng chuẩn kỹ thuật Đức, viền LED metallic, nút quay tâm VIP, kim chỉ báo chính xác góc 12h.
3. **`MP_UI_LeadForm_Modal_640x800.svg` (640 × 840)**: Modal sàng lọc khách hàng B2B: Nhóm vai trò (Role), Giải pháp quan tâm (Interest), Điều khoản bảo mật PDPD Nghị định 13/2023.
4. **`MP_UI_VIPPass_Ticket_800x480.svg` (840 × 520)**: Thẻ VIP Gift Pass cá nhân hóa (Tên khách + Tên công ty) kèm cuống vé QR Code check-in tại Gian hàng Ô H1-15 (Sảnh 2).
5. **`MP_UI_Countdown_Banner_1200x400.svg` (1200 × 400)**: Banner đếm ngược VEC 2026 với 4 flip card đồng hồ kỹ thuật số và Call To Action nhận quà VIP.

