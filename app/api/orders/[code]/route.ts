import { NextResponse } from "next/server";
import { getOrderByCode } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const order = await getOrderByCode(params.code);
    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng." },
        { status: 404 }
      );
    }

    // Chỉ trả link Zalo khi đã thanh toán
    const zaloLink =
      order.status === "paid"
        ? process.env.NEXT_PUBLIC_ZALO_GROUP_LINK || null
        : null;

    return NextResponse.json({
      code: order.code,
      fullName: order.full_name,
      amount: order.amount,
      status: order.status,
      zaloLink,
    });
  } catch (e) {
    console.error("[/api/orders/[code] GET]", e);
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}
