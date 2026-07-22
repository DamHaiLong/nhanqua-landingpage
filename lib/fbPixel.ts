declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Gửi 1 sự kiện chuẩn (Lead, Purchase...) tới Meta Pixel nếu đã cài. */
export function fbTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}
