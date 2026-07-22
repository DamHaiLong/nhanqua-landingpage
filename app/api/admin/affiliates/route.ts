import { NextResponse } from "next/server";
import { getAffiliateSummary } from "@/lib/orders";
import { course } from "@/config/course";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const provided = req.headers.get("x-admin-password") || "";

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Sai mật khẩu." }, { status: 401 });
  }

  try {
    const affiliates = await getAffiliateSummary(course.affiliateCommissionRate);
    const totalCommission = affiliates.reduce((sum, a) => sum + a.commission, 0);
    const totalOwed = affiliates.reduce((sum, a) => sum + a.owedCommission, 0);

    return NextResponse.json({
      affiliates,
      commissionRate: course.affiliateCommissionRate,
      totalCommission,
      totalOwed,
    });
  } catch (e) {
    console.error("[/api/admin/affiliates]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lỗi máy chủ." },
      { status: 500 }
    );
  }
}
