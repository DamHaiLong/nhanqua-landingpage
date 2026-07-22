-- ============================================================
--  Nhân Quả – Nghiệp Báo – Luân Hồi Tái Sinh — Bảng đăng ký
--  Chạy trong: Supabase Dashboard > SQL Editor > New query
--  (Dự án Supabase RIÊNG — không dùng chung với khóa thanh lọc)
-- ============================================================

create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,                 -- mã đơn = nội dung CK (NQxxxxxx)
  full_name   text not null,
  phone       text not null,
  email       text,
  shipping_address text not null,                   -- địa chỉ nhận bộ tài liệu bản cứng
  amount      integer not null,                     -- số tiền (VND)
  status      text not null default 'pending',      -- pending | paid | canceled
  sepay_tx_id text,                                 -- id giao dịch SePay
  paid_at     timestamptz,
  reminder_sent_at timestamptz,                     -- đã gửi email nhắc chưa (null = chưa)
  referrer_phone text,
  referrer_commission_paid_at timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists orders_code_idx   on public.orders (code);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_referrer_idx on public.orders (referrer_phone);

-- Bật RLS: chặn mọi truy cập từ client (anon/authenticated).
-- App chỉ đọc/ghi qua server bằng service_role key (bỏ qua RLS).
alter table public.orders enable row level security;

-- (Không tạo policy nào => anon key không đọc/ghi được. An toàn.)
