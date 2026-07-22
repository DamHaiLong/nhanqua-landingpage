# PranaGreen Landing 🌿

Landing page bán khóa học có **đăng ký trực tiếp** + **thanh toán chuyển khoản tự động (SePay)** → tự động trả **link nhóm Zalo** cho khách sau khi nhận được tiền.

## Công nghệ
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres) — lưu đơn hàng
- SePay — nhận & đối soát chuyển khoản tự động qua webhook
- Resend (tuỳ chọn) — gửi email xác nhận

---

## 🚀 Cài đặt nhanh

### 1. Cài thư viện
```bash
npm install
```

### 2. Tạo file môi trường
Copy `.env.local.example` thành `.env.local` rồi điền giá trị:
```bash
copy .env.local.example .env.local   # Windows
```

### 3. Tạo bảng trong Supabase
- Vào [supabase.com](https://supabase.com) → tạo project (miễn phí)
- Mở **SQL Editor** → dán toàn bộ nội dung `supabase/schema.sql` → **Run**
- Vào **Project Settings > API**, copy vào `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (mục *service_role*, giữ bí mật)

### 4. Cấu hình SePay (nhận CK tự động)
- Đăng ký tại [sepay.vn](https://sepay.vn) → liên kết tài khoản ngân hàng
- Điền vào `.env.local`:
  - `NEXT_PUBLIC_SEPAY_ACCOUNT` = số tài khoản
  - `NEXT_PUBLIC_SEPAY_BANK` = mã ngân hàng (VD: `MB`, `VCB`, `ACB`…)
  - `SEPAY_WEBHOOK_API_KEY` = một chuỗi bí mật bạn tự đặt
- Trong SePay → **Tích hợp > Webhooks**, thêm webhook:
  - **URL:** `https://<domain>/api/sepay/webhook`
  - **Xác thực:** API Key → Header `Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>`
  - (Local test: dùng `ngrok http 3000` để lấy URL public tạm thời)

### 5. Link Zalo & Admin
- `NEXT_PUBLIC_ZALO_GROUP_LINK` = link nhóm Zalo khóa học
- `ADMIN_PASSWORD` = mật khẩu vào trang `/admin`

### 6. Chạy
```bash
npm run dev
```
Mở http://localhost:3000

---

## 📄 Các trang
| Đường dẫn | Chức năng |
|---|---|
| `/` | Landing page + form đăng ký |
| `/thanh-toan/[mã đơn]` | Trang QR thanh toán, tự cập nhật khi nhận tiền |
| `/admin` | Danh sách đơn + doanh thu (cần mật khẩu) |

## ✏️ Sửa nội dung khóa học
Toàn bộ tiêu đề, giá, lợi ích, lộ trình, FAQ… nằm trong **`config/course.ts`**.
Sửa giá tại `course.price` — hệ thống tự dùng giá này cho cả QR thanh toán.

## 🔒 Luồng thanh toán
1. Khách điền form → tạo đơn (status `pending`) với mã đơn duy nhất `PGxxxxxx`
2. Trang thanh toán hiện QR VietQR (số tiền + nội dung = mã đơn)
3. Khách CK → SePay bắn webhook → khớp mã đơn → cập nhật `paid`
4. Trang tự phát hiện `paid` → hiện link Zalo + gửi email

> Giá tiền luôn lấy từ server (`config/course.ts`), không tin giá client gửi lên.
> Link Zalo chỉ trả về khi đơn đã `paid`.

## ☁️ Deploy (Vercel)
1. Push code lên GitHub
2. Import vào [vercel.com](https://vercel.com)
3. Thêm toàn bộ biến trong `.env.local` vào **Environment Variables**
4. Deploy → cập nhật URL webhook thật trong SePay
