import { NextResponse } from "next/server";
import { createOrder, normalizePhone } from "@/lib/orders";
import { course } from "@/config/course";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const shippingAddress = String(body.shippingAddress || "").trim();
    const referrerPhone = String(body.referrerPhone || "").trim();

    if (!fullName) {
      return NextResponse.json({ error: "Thiếu họ tên." }, { status: 400 });
    }
    if (!/^[0-9+\s.]{9,15}$/.test(phone)) {
      return NextResponse.json(
        { error: "Số điện thoại không hợp lệ." },
        { status: 400 }
      );
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 });
    }
    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Thiếu địa chỉ nhận bộ tài liệu." },
        { status: 400 }
      );
    }
    if (referrerPhone && !/^[0-9+\s.]{9,15}$/.test(referrerPhone)) {
      return NextResponse.json(
        { error: "SĐT người giới thiệu không hợp lệ." },
        { status: 400 }
      );
    }
    if (referrerPhone && normalizePhone(referrerPhone) === normalizePhone(phone)) {
      return NextResponse.json(
        { error: "SĐT người giới thiệu không được trùng với SĐT của bạn." },
        { status: 400 }
      );
    }

    // Giá lấy từ config phía server — không tin giá do client gửi lên
    const order = await createOrder({
      fullName,
      phone,
      email,
      shippingAddress,
      amount: course.price,
      referrerPhone,
    });

    return NextResponse.json({ code: order.code, amount: order.amount });
  } catch (e) {
    // Log chi tiết ở server để debug; trả về client thông báo thân thiện
    console.error("[/api/orders POST]", e);
    return NextResponse.json(
      {
        error:
          "Hệ thống đang tạm gián đoạn, vui lòng thử lại sau ít phút hoặc liên hệ hotline để được hỗ trợ.",
      },
      { status: 500 }
    );
  }
}
