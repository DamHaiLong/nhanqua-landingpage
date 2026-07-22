import { NextResponse } from "next/server";
import { getOrderByCode, markOrderPaid, extractOrderCode } from "@/lib/orders";
import { sendConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Webhook nhận từ SePay khi có giao dịch chuyển khoản vào.
 * Cấu hình tại SePay > Tích hợp Webhooks:
 *   - URL:  https://<domain-cua-ban>/api/sepay/webhook
 *   - Kiểu xác thực: API Key
 *   - Header: Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>
 *
 * Payload mẫu của SePay:
 * {
 *   "id": 92704, "gateway": "MBBank", "transactionDate": "2024-05-25 21:11:02",
 *   "accountNumber": "0123456789", "code": null, "content": "PGABC123",
 *   "transferType": "in", "transferAmount": 1490000, "referenceCode": "FT..."
 * }
 */
export async function POST(req: Request) {
  // 1) Xác thực API key
  const expected = process.env.SEPAY_WEBHOOK_API_KEY;
  const auth = req.headers.get("authorization") || "";
  const provided = auth.replace(/^Apikey\s+/i, "").trim();

  if (!expected || provided !== expected) {
    console.warn("[sepay] Sai API key webhook.");
    return NextResponse.json({ success: false, message: "Unauthorized" }, {
      status: 401,
    });
  }

  try {
    const body = await req.json();

    // 2) Chỉ xử lý tiền vào
    if (body.transferType && body.transferType !== "in") {
      return NextResponse.json({ success: true, message: "Bỏ qua tiền ra" });
    }

    // 3) Lấy mã đơn: ưu tiên field "code" của SePay, sau đó dò trong nội dung
    const content: string = body.content || body.description || "";
    const code = extractOrderCode(body.code || "") || extractOrderCode(content);

    if (!code) {
      console.warn("[sepay] Không tìm thấy mã đơn trong nội dung:", content);
      // Vẫn trả 200 để SePay không gửi lại liên tục
      return NextResponse.json({ success: true, message: "Không có mã đơn" });
    }

    const order = await getOrderByCode(code);
    if (!order) {
      console.warn("[sepay] Mã đơn không tồn tại:", code);
      return NextResponse.json({ success: true, message: "Đơn không tồn tại" });
    }

    // 4) Kiểm tra số tiền (cho phép chuyển thừa)
    const amount = Number(body.transferAmount || 0);
    if (amount < order.amount) {
      console.warn(
        `[sepay] Số tiền thiếu cho đơn ${code}: nhận ${amount}, cần ${order.amount}`
      );
      return NextResponse.json({
        success: true,
        message: "Số tiền chưa đủ",
      });
    }

    // 5) Đánh dấu đã thanh toán (idempotent)
    const txId = String(body.id ?? body.referenceCode ?? "");
    const updated = await markOrderPaid(code, txId);

    if (updated) {
      console.log(`[sepay] Đơn ${code} đã thanh toán ${amount}đ.`);
      // 6) Gửi email xác nhận (nếu có email + cấu hình Resend)
      if (updated.email) {
        await sendConfirmationEmail({
          to: updated.email,
          fullName: updated.full_name,
          code: updated.code,
          amount: updated.amount,
        });
      }
    } else {
      console.log(`[sepay] Đơn ${code} đã được xử lý trước đó.`);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[sepay] Lỗi webhook:", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
