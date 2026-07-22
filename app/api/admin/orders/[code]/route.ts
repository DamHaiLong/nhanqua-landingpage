import { NextResponse } from "next/server";
import { getOrderByCode, markOrderPaid } from "@/lib/orders";
import { sendConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Admin xác nhận thủ công đơn đã thanh toán — dùng khi webhook SePay
 * không bắt được giao dịch (vd. khách chuyển khoản ghi sai nội dung)
 * hoặc cần xác nhận qua kênh khác (gọi điện, chuyển khoản tay...).
 */
export async function PATCH(
  req: Request,
  { params }: { params: { code: string } }
) {
  const expected = process.env.ADMIN_PASSWORD;
  const provided = req.headers.get("x-admin-password") || "";

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Sai mật khẩu." }, { status: 401 });
  }

  try {
    const order = await getOrderByCode(params.code);
    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
    }

    const updated = await markOrderPaid(params.code, "MANUAL_ADMIN");
    if (!updated) {
      return NextResponse.json(
        { error: "Đơn đã được xử lý trước đó hoặc không còn ở trạng thái chờ." },
        { status: 409 }
      );
    }

    if (updated.email) {
      await sendConfirmationEmail({
        to: updated.email,
        fullName: updated.full_name,
        code: updated.code,
        amount: updated.amount,
      });
    }

    return NextResponse.json({ order: updated });
  } catch (e) {
    console.error("[/api/admin/orders/[code] PATCH]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lỗi máy chủ." },
      { status: 500 }
    );
  }
}
