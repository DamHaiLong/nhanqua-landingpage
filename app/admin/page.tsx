"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { formatVND } from "@/config/course";

interface Order {
  code: string;
  full_name: string;
  phone: string;
  email: string | null;
  shipping_address: string | null;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

interface Stats {
  total: number;
  paid: number;
  pending: number;
  revenue: number;
}

function DocIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  );
}
function CheckCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}
function ClockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
function CoinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5c0-1.4 1.1-2 2.5-2s2.5.7 2.5 2c0 2.5-5 1.5-5 4 0 1.3 1.1 2 2.5 2s2.5-.6 2.5-2" />
    </svg>
  );
}
function RefreshIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />
    </svg>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [markingCode, setMarkingCode] = useState<string | null>(null);

  const load = useCallback(async (pw: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-password": pw },
        cache: "no-store",
      });
      if (res.status === 401) {
        setError("Sai mật khẩu.");
        setAuthed(false);
        localStorage.removeItem("pg_admin_pw");
        return;
      }
      const data = await res.json();
      setOrders(data.orders);
      setStats(data.stats);
      setAuthed(true);
      localStorage.setItem("pg_admin_pw", pw);
    } catch {
      setError("Không tải được dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("pg_admin_pw");
    if (saved) {
      setPassword(saved);
      load(saved);
    }
  }, [load]);

  async function markPaid(code: string) {
    if (
      !confirm(
        `Xác nhận thủ công đơn ${code} đã thanh toán?\n\nChỉ dùng khi đã tự kiểm tra chắc chắn có tiền về (SePay không tự bắt được giao dịch này).`
      )
    ) {
      return;
    }
    setMarkingCode(code);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${code}`, {
        method: "PATCH",
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không xác nhận được đơn.");
      await load(password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không xác nhận được đơn.");
    } finally {
      setMarkingCode(null);
    }
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(password);
          }}
          className="w-full max-w-sm rounded-3xl bg-cream p-8 shadow-2xl"
        >
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="mt-5 text-center font-display text-xl font-semibold text-brand-900">
            Trang quản trị
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu admin"
            className="mt-5 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-gold-200"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 px-4 py-3 font-bold text-brand-900 shadow-lg shadow-gold-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang kiểm tra…" : "Đăng nhập"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <Logo />
          <nav className="flex items-center gap-2">
            <span className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-cream">
              Đơn hàng
            </span>
            <Link
              href="/admin/affiliate"
              className="rounded-full px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Affiliate
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-brand-900 md:text-3xl">
            Đơn hàng
          </h1>
          <button
            onClick={() => load(password)}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow ring-1 ring-black/5 transition hover:bg-brand-50 disabled:opacity-60"
          >
            <RefreshIcon className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            {loading ? "Đang tải…" : "Làm mới"}
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon={<DocIcon />} label="Tổng đơn" value={String(stats.total)} tone="brand" />
            <StatCard icon={<CheckCircleIcon />} label="Đã thanh toán" value={String(stats.paid)} tone="brand" />
            <StatCard icon={<ClockIcon />} label="Chờ TT" value={String(stats.pending)} tone="gold" />
            <StatCard icon={<CoinIcon />} label="Doanh thu" value={formatVND(stats.revenue)} tone="gold" emphasize />
          </div>
        )}

        <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50/60 text-brand-800">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Mã đơn</th>
                <th className="px-4 py-3.5 font-semibold">Họ tên</th>
                <th className="px-4 py-3.5 font-semibold">SĐT</th>
                <th className="px-4 py-3.5 font-semibold">Email</th>
                <th className="px-4 py-3.5 font-semibold">Địa chỉ nhận tài liệu</th>
                <th className="px-4 py-3.5 font-semibold">Số tiền</th>
                <th className="px-4 py-3.5 font-semibold">Trạng thái</th>
                <th className="px-4 py-3.5 font-semibold">Thời gian</th>
                <th className="px-4 py-3.5 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.code} className="border-b border-black/5 transition hover:bg-brand-50/30 last:border-0">
                  <td className="px-4 py-3.5">
                    <span className="rounded-lg bg-brand-50 px-2 py-1 font-mono text-xs font-bold text-brand-800">
                      {o.code}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-ink">{o.full_name}</td>
                  <td className="px-4 py-3.5 text-ink/80">{o.phone}</td>
                  <td className="px-4 py-3.5 text-ink/50">{o.email || "—"}</td>
                  <td className="max-w-[220px] whitespace-normal break-words px-4 py-3.5 text-ink/70">
                    {o.shipping_address || "—"}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-brand-800">{formatVND(o.amount)}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={
                        o.status === "paid"
                          ? "inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700"
                          : "inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-1 text-xs font-semibold text-gold-700"
                      }
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${o.status === "paid" ? "bg-brand-500" : "bg-gold-500"}`} />
                      {o.status === "paid" ? "Đã TT" : "Chờ TT"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-ink/50">
                    {new Date(o.created_at).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3.5">
                    {o.status !== "paid" && (
                      <button
                        onClick={() => markPaid(o.code)}
                        disabled={markingCode === o.code}
                        className="rounded-full bg-brand-700 px-3.5 py-1.5 text-xs font-semibold text-cream shadow-sm transition hover:bg-brand-800 disabled:opacity-60"
                      >
                        {markingCode === o.code ? "Đang xác nhận…" : "Xác nhận đã TT"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center text-ink/40">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
  emphasize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "brand" | "gold";
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <span
        className={
          tone === "brand"
            ? "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-cream"
            : "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 text-cream"
        }
      >
        {icon}
      </span>
      <p className="mt-3 text-sm text-ink/50">{label}</p>
      <p
        className={
          emphasize
            ? "mt-0.5 font-display text-2xl font-bold text-gold-700"
            : "mt-0.5 font-display text-2xl font-bold text-brand-900"
        }
      >
        {value}
      </p>
    </div>
  );
}
