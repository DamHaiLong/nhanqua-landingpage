import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.warn("[supabase] Thiếu NEXT_PUBLIC_SUPABASE_URL trong .env.local");
}

/**
 * Client dùng ở SERVER với service role — có toàn quyền ghi/đọc bảng orders.
 * TUYỆT ĐỐI không import file này vào component client.
 */
export function getServiceClient() {
  if (!url || !serviceKey) {
    throw new Error(
      "Chưa cấu hình Supabase. Hãy điền NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trong .env.local"
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Next.js tự cache các lệnh gọi fetch() phía server theo mặc định — ép
    // no-store để mọi truy vấn luôn lấy dữ liệu mới nhất từ Supabase, tránh
    // hiện tượng admin/API trả về dữ liệu cũ dù DB đã có bản ghi mới.
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
