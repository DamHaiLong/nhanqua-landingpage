import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getEffectiveSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

function authed(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  const provided = req.headers.get("x-admin-password") || "";
  return !!expected && provided === expected;
}

/** Lấy cài đặt hiện hành (học phí + đồng hồ + ngày) để đổ vào form admin. */
export async function GET(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "Sai mật khẩu." }, { status: 401 });
  }
  try {
    const settings = await getEffectiveSettings();
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("[/api/admin/settings GET]", e);
    return NextResponse.json({ error: "Không đọc được cài đặt." }, { status: 500 });
  }
}

/** Lưu cài đặt admin đặt (ghi đè config gốc). */
export async function POST(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "Sai mật khẩu." }, { status: 401 });
  }
  try {
    const body = await req.json();

    const price = Number(body.price);
    if (!Number.isInteger(price) || price < 0 || price > 100_000_000) {
      return NextResponse.json({ error: "Học phí không hợp lệ." }, { status: 400 });
    }

    const dateText = String(body.dateText || "").trim().slice(0, 200);
    const countdownEnabled = Boolean(body.countdownEnabled);
    const countdownHeading = String(body.countdownHeading || "").trim().slice(0, 300);

    let countdownDeadline: string | null = null;
    if (body.countdownDeadline) {
      const d = new Date(String(body.countdownDeadline));
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Hạn đếm ngược không hợp lệ." },
          { status: 400 }
        );
      }
      countdownDeadline = d.toISOString();
    }
    if (countdownEnabled && !countdownDeadline) {
      return NextResponse.json(
        { error: "Bật đếm ngược thì phải đặt hạn chót." },
        { status: 400 }
      );
    }

    const sb = getServiceClient();
    const { error } = await sb.from("site_settings").upsert({
      id: 1,
      price,
      date_text: dateText || null,
      countdown_enabled: countdownEnabled,
      countdown_deadline: countdownDeadline,
      countdown_heading: countdownHeading || null,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("[/api/admin/settings POST]", error.message);
      return NextResponse.json(
        { error: "Lưu thất bại: " + error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/admin/settings POST]", e);
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}
