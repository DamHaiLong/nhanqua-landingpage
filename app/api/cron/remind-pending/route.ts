import { NextResponse } from "next/server";
import {
  getPendingOrdersDueForReminder,
  markReminderSent,
} from "@/lib/orders";
import { sendPaymentReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Gọi định kỳ (Vercel Cron hoặc dịch vụ cron ngoài) để gửi email nhắc
 * cho các đơn "pending" quá `PENDING_REMINDER_MINUTES` phút chưa nhắc lần nào.
 *
 * Bảo vệ bằng CRON_SECRET — gọi kèm header:
 *   Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const provided = auth.replace(/^Bearer\s+/i, "").trim();

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const minutes = Number(process.env.PENDING_REMINDER_MINUTES || "30");

  try {
    const orders = await getPendingOrdersDueForReminder(minutes);
    let sent = 0;

    for (const order of orders) {
      if (!order.email) continue;
      const ok = await sendPaymentReminderEmail({
        to: order.email,
        fullName: order.full_name,
        code: order.code,
        amount: order.amount,
      });
      // Chỉ đánh dấu "đã nhắc" khi gửi thành công — nếu Resend từ chối
      // (vd. vượt rate limit), lần cron kế tiếp sẽ tự thử lại đơn này.
      if (ok) {
        await markReminderSent(order.code);
        sent++;
      }
      // Nghỉ giữa các lần gửi để tránh vượt rate limit của Resend khi
      // có nhiều đơn cần nhắc cùng lúc.
      await new Promise((r) => setTimeout(r, 600));
    }

    return NextResponse.json({ checked: orders.length, sent });
  } catch (e) {
    console.error("[cron/remind-pending]", e);
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}
