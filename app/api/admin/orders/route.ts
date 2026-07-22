import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const provided = req.headers.get("x-admin-password") || "";

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Sai mật khẩu." }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw new Error(error.message);

    const orders = data || [];
    const paid = orders.filter((o) => o.status === "paid");
    const revenue = paid.reduce((sum, o) => sum + (o.amount || 0), 0);

    return NextResponse.json({
      orders,
      stats: {
        total: orders.length,
        paid: paid.length,
        pending: orders.filter((o) => o.status === "pending").length,
        revenue,
      },
    });
  } catch (e) {
    console.error("[/api/admin/orders]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lỗi máy chủ." },
      { status: 500 }
    );
  }
}
