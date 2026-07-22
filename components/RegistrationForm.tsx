"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatVND } from "@/config/course";
import { fbTrack } from "@/lib/fbPixel";

// Trùng logic với lib/orders.ts (không import trực tiếp để tránh kéo theo
// module server-only vào bundle client).
function normalizePhone(raw: string): string {
  let p = raw.trim().replace(/[\s.\-()]/g, "");
  if (p.startsWith("+84")) p = "0" + p.slice(3);
  else if (p.startsWith("84") && p.length === 11) p = "0" + p.slice(2);
  return p;
}

export default function RegistrationForm({ price }: { price: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    shippingAddress: "",
    referrerPhone: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Kiểm tra cơ bản
    if (!form.fullName.trim()) return setError("Vui lòng nhập họ tên.");
    if (!/^[0-9+\s.]{9,15}$/.test(form.phone.trim()))
      return setError("Số điện thoại chưa hợp lệ.");
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      return setError("Email chưa hợp lệ.");
    if (!form.shippingAddress.trim())
      return setError("Vui lòng nhập địa chỉ nhận bộ tài liệu.");
    if (
      form.referrerPhone &&
      !/^[0-9+\s.]{9,15}$/.test(form.referrerPhone.trim())
    )
      return setError("SĐT người giới thiệu chưa hợp lệ.");
    if (
      form.referrerPhone &&
      normalizePhone(form.referrerPhone) === normalizePhone(form.phone)
    )
      return setError("SĐT người giới thiệu không được trùng với SĐT của bạn.");

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          shippingAddress: form.shippingAddress.trim(),
          referrerPhone: form.referrerPhone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      fbTrack("Lead", { value: data.amount, currency: "VND" });
      // Chuyển sang trang thanh toán
      router.push(`/thanh-toan/${data.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Nguyễn Thị A"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Số điện thoại (Zalo) <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="09xx xxx xxx"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email (để nhận link Zalo và xác nhận thanh toán)
        </label>
        <input
          type="email"
          inputMode="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="email@cua-ban.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Địa chỉ nhận bộ tài liệu bản cứng <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.shippingAddress}
          onChange={(e) => update("shippingAddress", e.target.value)}
          placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
        <p className="mt-1 text-xs text-slate-400">
          🎁 Bộ tài liệu bản cứng sẽ được gửi tận nhà cho bạn theo địa chỉ này.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          SĐT người giới thiệu{" "}
          <span className="font-normal text-slate-400">(không bắt buộc)</span>
        </label>
        <input
          type="tel"
          inputMode="tel"
          value={form.referrerPhone}
          onChange={(e) => update("referrerPhone", e.target.value)}
          placeholder="09xx xxx xxx"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full animate-glow rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 px-6 py-4 text-lg font-bold text-brand-900 shadow-xl shadow-gold-500/40 ring-2 ring-gold-300/70 transition hover:brightness-105 disabled:cursor-not-allowed disabled:animate-none disabled:opacity-60"
      >
        {loading ? "Đang xử lý..." : `Đăng ký ngay — ${formatVND(price)}`}
      </button>

      <p className="text-center text-xs text-slate-500">
        Bấm đăng ký để chuyển sang bước thanh toán qua chuyển khoản (QR VietQR).
      </p>
    </form>
  );
}
