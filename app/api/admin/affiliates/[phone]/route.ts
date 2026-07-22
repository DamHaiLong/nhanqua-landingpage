import { NextResponse } from "next/server";
import { markAffiliateCommissionPaid } from "@/lib/orders";

export const dynamic = "force-dynamic";

/** Đánh dấu toàn bộ hoa hồng còn nợ của 1 người giới thiệu là đã trả. */
export async function PATCH(
  req: Request,
  { params }: { params: { phone: string } }
) {
  const expected = process.env.ADMIN_PASSWORD;
  const provided = req.headers.get("x-admin-password") || "";

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Sai mật khẩu." }, { status: 401 });
  }

  try {
    await markAffiliateCommissionPaid(decodeURIComponent(params.phone));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/admin/affiliates/[phone] PATCH]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lỗi máy chủ." },
      { status: 500 }
    );
  }
}
