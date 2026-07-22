import { Resend } from "resend";
import { course, formatVND } from "@/config/course";

/**
 * Gửi email xác nhận + link Zalo sau khi thanh toán thành công.
 * Nếu chưa cấu hình RESEND_API_KEY thì bỏ qua (không lỗi).
 */
export async function sendConfirmationEmail(params: {
  to: string;
  fullName: string;
  code: string;
  amount: number;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const zaloLink = process.env.NEXT_PUBLIC_ZALO_GROUP_LINK;

  if (!apiKey || !from) {
    console.log("[email] Bỏ qua gửi email (chưa cấu hình RESEND_API_KEY/EMAIL_FROM).");
    return false;
  }
  if (!params.to) return false;

  const resend = new Resend(apiKey);

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
    <div style="background:#16a34a;color:#fff;padding:24px;border-radius:12px 12px 0 0">
      <h1 style="margin:0;font-size:20px">Chào mừng đến với ${course.brand}! 🌿</h1>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 12px 12px">
      <p>Xin chào <b>${params.fullName}</b>,</p>
      <p>Cảm ơn bạn đã đăng ký <b>${course.programName}</b>. Chúng tôi đã nhận được thanh toán của bạn.</p>
      <table style="width:100%;font-size:14px;margin:16px 0">
        <tr><td style="padding:6px 0;color:#64748b">Mã đơn</td><td style="text-align:right"><b>${params.code}</b></td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Số tiền</td><td style="text-align:right"><b>${formatVND(params.amount)}</b></td></tr>
      </table>
      <p><b>Bước tiếp theo:</b> tham gia nhóm Zalo của khóa học để bắt đầu học và được đồng hành:</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${zaloLink}" style="background:#16a34a;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;display:inline-block;font-weight:bold">
          👉 Vào nhóm Zalo khóa học
        </a>
      </p>
      <p style="font-size:13px;color:#64748b">Nếu nút trên không bấm được, mở link: ${zaloLink}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />
      <p style="font-size:13px;color:#64748b">Cần hỗ trợ? Liên hệ hotline ${course.contact.hotlines.join(" / ")} hoặc email ${course.contact.email}.</p>
    </div>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: params.to,
      subject: `[${course.brand}] Xác nhận đăng ký thành công — Link Zalo bên trong`,
      html,
    });
    // Resend SDK không throw khi bị từ chối (rate limit, domain lỗi...) —
    // luôn phải kiểm tra field `error` trong kết quả trả về.
    if (error) {
      console.error("[email] Resend từ chối gửi xác nhận:", error);
      return false;
    }
    console.log(`[email] Đã gửi xác nhận tới ${params.to}`);
    return true;
  } catch (e) {
    console.error("[email] Lỗi gửi email:", e);
    return false;
  }
}

/**
 * Email nhắc khách hoàn tất chuyển khoản khi đơn còn "pending" quá lâu.
 * Nếu chưa cấu hình RESEND_API_KEY thì bỏ qua (không lỗi).
 */
export async function sendPaymentReminderEmail(params: {
  to: string;
  fullName: string;
  code: string;
  amount: number;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  if (!apiKey || !from) {
    console.log("[email] Bỏ qua gửi email nhắc (chưa cấu hình RESEND_API_KEY/EMAIL_FROM).");
    return false;
  }
  if (!params.to) return false;

  const resend = new Resend(apiKey);
  const paymentLink = `${siteUrl}/thanh-toan/${params.code}`;

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
    <div style="background:#b8863c;color:#fff;padding:24px;border-radius:12px 12px 0 0">
      <h1 style="margin:0;font-size:20px">Bạn quên hoàn tất đăng ký? 🌿</h1>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 12px 12px">
      <p>Xin chào <b>${params.fullName}</b>,</p>
      <p>Chúng tôi thấy bạn đã đăng ký <b>${course.programName}</b> nhưng chưa hoàn tất chuyển khoản. Chỗ của bạn vẫn đang được giữ — hoàn tất ngay để không bỏ lỡ.</p>
      <table style="width:100%;font-size:14px;margin:16px 0">
        <tr><td style="padding:6px 0;color:#64748b">Mã đơn</td><td style="text-align:right"><b>${params.code}</b></td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Số tiền</td><td style="text-align:right"><b>${formatVND(params.amount)}</b></td></tr>
      </table>
      <p style="text-align:center;margin:24px 0">
        <a href="${paymentLink}" style="background:#b8863c;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;display:inline-block;font-weight:bold">
          Tiếp tục thanh toán
        </a>
      </p>
      <p style="font-size:13px;color:#64748b">Nếu nút trên không bấm được, mở link: ${paymentLink}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />
      <p style="font-size:13px;color:#64748b">Cần hỗ trợ? Liên hệ hotline ${course.contact.hotlines.join(" / ")} hoặc email ${course.contact.email}.</p>
    </div>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: params.to,
      subject: `[${course.brand}] Bạn còn 1 bước nữa để hoàn tất đăng ký`,
      html,
    });
    if (error) {
      console.error("[email] Resend từ chối gửi nhắc thanh toán:", error);
      return false;
    }
    console.log(`[email] Đã gửi nhắc thanh toán tới ${params.to}`);
    return true;
  } catch (e) {
    console.error("[email] Lỗi gửi email nhắc:", e);
    return false;
  }
}
