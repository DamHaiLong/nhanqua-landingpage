import { getServiceClient } from "./supabase";

export type OrderStatus = "pending" | "paid" | "canceled";

export interface Order {
  id: string;
  code: string;
  full_name: string;
  phone: string;
  email: string | null;
  shipping_address: string; // địa chỉ nhận bộ tài liệu bản cứng
  amount: number;
  status: OrderStatus;
  sepay_tx_id: string | null;
  paid_at: string | null;
  reminder_sent_at: string | null;
  referrer_phone: string | null;
  referrer_commission_paid_at: string | null;
  created_at: string;
}

export interface AffiliateSummary {
  referrerPhone: string;
  orderCount: number;
  totalRevenue: number;
  commission: number;
  paidCommission: number;
  owedCommission: number;
}

/** Chuẩn hoá SĐT: bỏ khoảng trắng/dấu, đổi +84 hoặc 84 đầu số thành 0. */
export function normalizePhone(raw: string): string {
  let p = raw.trim().replace(/[\s.\-()]/g, "");
  if (p.startsWith("+84")) p = "0" + p.slice(3);
  else if (p.startsWith("84") && p.length === 11) p = "0" + p.slice(2);
  return p;
}

// Ký tự dễ đọc (bỏ 0/O, 1/I gây nhầm) cho mã đơn
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderCode(): string {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  // Tiền tố NQ (Nhân Quả) — khác PG của khóa thanh lọc để dùng chung tài
  // khoản ngân hàng mà webhook 2 trang không lẫn đơn của nhau.
  return "NQ" + s;
}

/** Trích mã đơn (NQxxxxxx) từ nội dung chuyển khoản của ngân hàng */
export function extractOrderCode(content: string): string | null {
  if (!content) return null;
  const normalized = content.toUpperCase().replace(/\s+/g, "");
  const match = normalized.match(/NQ[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}/);
  return match ? match[0] : null;
}

export async function createOrder(input: {
  fullName: string;
  phone: string;
  email?: string | null;
  shippingAddress: string;
  amount: number;
  referrerPhone?: string | null;
}): Promise<Order> {
  const supabase = getServiceClient();

  // Thử tối đa 5 lần để tránh trùng mã (rất hiếm)
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateOrderCode();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        code,
        full_name: input.fullName,
        phone: input.phone,
        email: input.email || null,
        shipping_address: input.shippingAddress,
        amount: input.amount,
        status: "pending",
        referrer_phone: input.referrerPhone
          ? normalizePhone(input.referrerPhone)
          : null,
      })
      .select()
      .single();

    if (!error && data) return data as Order;
    // 23505 = unique violation (trùng code) -> thử lại
    if (error && error.code !== "23505") {
      throw new Error(error.message);
    }
  }
  throw new Error("Không tạo được mã đơn, vui lòng thử lại.");
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Order) || null;
}

export async function markOrderPaid(
  code: string,
  sepayTxId: string
): Promise<Order | null> {
  const supabase = getServiceClient();
  // Chỉ cập nhật khi đang pending -> idempotent, tránh xử lý 2 lần
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      sepay_tx_id: sepayTxId,
      paid_at: new Date().toISOString(),
    })
    .eq("code", code)
    .eq("status", "pending")
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Order) || null;
}

/**
 * Lấy các đơn "pending" quá hạn (tạo lâu hơn `minutes` phút), có email,
 * và CHƯA được gửi email nhắc — dùng cho cron nhắc thanh toán.
 */
export async function getPendingOrdersDueForReminder(
  minutes: number
): Promise<Order[]> {
  const supabase = getServiceClient();
  const threshold = new Date(Date.now() - minutes * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "pending")
    .is("reminder_sent_at", null)
    .not("email", "is", null)
    .lt("created_at", threshold);
  if (error) throw new Error(error.message);
  return (data as Order[]) || [];
}

/** Đánh dấu đơn đã được gửi email nhắc (tránh gửi lặp lại). */
export async function markReminderSent(code: string): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("orders")
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq("code", code);
  if (error) throw new Error(error.message);
}

/**
 * Tổng hợp hoa hồng affiliate — chỉ tính trên đơn ĐÃ THANH TOÁN, nhóm theo
 * SĐT người giới thiệu (đã chuẩn hoá, để không bị tách nhầm 2 người khi
 * gõ số kiểu khác nhau). Hoa hồng = tổng doanh thu giới thiệu x tỉ lệ.
 */
export async function getAffiliateSummary(
  commissionRate: number
): Promise<AffiliateSummary[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("referrer_phone, amount, referrer_commission_paid_at")
    .eq("status", "paid")
    .not("referrer_phone", "is", null);
  if (error) throw new Error(error.message);

  const byReferrer = new Map<
    string,
    { count: number; revenue: number; paidRevenue: number }
  >();
  for (const row of data || []) {
    const phone = normalizePhone((row.referrer_phone as string) || "");
    if (!phone) continue;
    const entry = byReferrer.get(phone) || {
      count: 0,
      revenue: 0,
      paidRevenue: 0,
    };
    entry.count += 1;
    entry.revenue += row.amount as number;
    if (row.referrer_commission_paid_at) entry.paidRevenue += row.amount as number;
    byReferrer.set(phone, entry);
  }

  return Array.from(byReferrer.entries())
    .map(([referrerPhone, { count, revenue, paidRevenue }]) => {
      const commission = Math.round(revenue * commissionRate);
      const paidCommission = Math.round(paidRevenue * commissionRate);
      return {
        referrerPhone,
        orderCount: count,
        totalRevenue: revenue,
        commission,
        paidCommission,
        owedCommission: commission - paidCommission,
      };
    })
    .sort((a, b) => b.owedCommission - a.owedCommission);
}

/**
 * Đánh dấu TOÀN BỘ hoa hồng còn nợ của 1 người giới thiệu là đã trả —
 * dùng khi admin đã chuyển khoản trả hoa hồng cho họ. So khớp theo SĐT đã
 * chuẩn hoá (không chỉ khớp chuỗi y hệt trong DB) để không bỏ sót đơn cũ
 * lỡ nhập SĐT khác định dạng nhưng cùng một người.
 */
export async function markAffiliateCommissionPaid(
  referrerPhone: string
): Promise<void> {
  const supabase = getServiceClient();
  const phone = normalizePhone(referrerPhone);

  const { data, error: selectError } = await supabase
    .from("orders")
    .select("id, referrer_phone")
    .eq("status", "paid")
    .is("referrer_commission_paid_at", null)
    .not("referrer_phone", "is", null);
  if (selectError) throw new Error(selectError.message);

  const ids = (data || [])
    .filter((row) => normalizePhone((row.referrer_phone as string) || "") === phone)
    .map((row) => row.id as string);
  if (ids.length === 0) return;

  const { error } = await supabase
    .from("orders")
    .update({ referrer_commission_paid_at: new Date().toISOString() })
    .in("id", ids);
  if (error) throw new Error(error.message);
}
