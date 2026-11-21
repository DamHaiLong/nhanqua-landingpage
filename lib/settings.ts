import { course as baseCourse } from "@/config/course";
import { getServiceClient } from "@/lib/supabase";

// ============================================================
//  Cài đặt động (sửa trong /admin): HỌC PHÍ + ĐỒNG HỒ ĐẾM NGƯỢC
//  + DÒNG NGÀY KHAI GIẢNG (dateText).
//  DB (bảng site_settings, 1 dòng id=1) GHI ĐÈ lên config gốc.
//  An toàn ngược: chưa cấu hình Supabase / chưa tạo bảng / lỗi
//  → trả về đúng config gốc, trang vẫn chạy bình thường.
//  TUYỆT ĐỐI không import file này vào component client.
// ============================================================

export type ResolvedCourse = typeof baseCourse;

interface SettingsRow {
  price: number | null;
  countdown_enabled: boolean | null;
  countdown_deadline: string | null;
  countdown_heading: string | null;
  date_text: string | null;
}

async function readRow(): Promise<SettingsRow | null> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("site_settings")
      .select(
        "price, countdown_enabled, countdown_deadline, countdown_heading, date_text"
      )
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.warn("[settings] đọc site_settings lỗi:", error.message);
      return null;
    }
    return (data as SettingsRow) ?? null;
  } catch {
    return null;
  }
}

/** Trả về `course` đã merge cài đặt admin (DB) đè lên config gốc. */
export async function getResolvedCourse(): Promise<ResolvedCourse> {
  const row = await readRow();
  if (!row) return baseCourse;
  return {
    ...baseCourse,
    price: typeof row.price === "number" ? row.price : baseCourse.price,
    dateText: row.date_text || baseCourse.dateText,
    countdown: {
      ...baseCourse.countdown,
      enabled:
        typeof row.countdown_enabled === "boolean"
          ? row.countdown_enabled
          : baseCourse.countdown.enabled,
      deadline: row.countdown_deadline || baseCourse.countdown.deadline,
      heading: row.countdown_heading || baseCourse.countdown.heading,
    },
  };
}

/** Giá trị đang áp dụng (đã merge) để đổ vào form admin. */
export async function getEffectiveSettings() {
  const c = await getResolvedCourse();
  return {
    price: c.price,
    dateText: c.dateText,
    countdownEnabled: c.countdown.enabled,
    countdownDeadline: c.countdown.deadline,
    countdownHeading: c.countdown.heading,
  };
}
