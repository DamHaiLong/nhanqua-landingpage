"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { formatVND } from "@/config/course";

interface Affiliate {
  referrerPhone: string;
  orderCount: number;
  totalRevenue: number;
  commission: number;
  paidCommission: number;
  owedCommission: number;
}

function UsersIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function PercentIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
function WalletIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-4a2 2 0 0 1 0-4h4Z" />
    </svg>
  );
}
function AlertIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4M12 17h.01" />
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

export default function AffiliatePage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissionRate, setCommissionRate] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalOwed, setTotalOwed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [payingPhone, setPayingPhone] = useState<string | null>(null);

  const load = useCallback(async (pw: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/affiliates", {
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
      setAffiliates(data.affiliates);
      setCommissionRate(data.commissionRate);
      setTotalCommission(data.totalCommission);
      setTotalOwed(data.totalOwed);
      setAuthed(true);
      localStorage.setItem("pg_admin_pw", pw);
    } catch {
      setError("Không tải được dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function markPaid(phone: string) {
    if (
      !confirm(
        `Xác nhận đã chuyển khoản trả hết hoa hồng còn nợ cho SĐT ${phone}?`
      )
    ) {
      return;
    }
    setPayingPhone(phone);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/affiliates/${encodeURIComponent(phone)}`,
        { method: "PATCH", headers: { "x-admin-password": password } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không cập nhật được.");
      await load(password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không cập nhật được.");
    } finally {
      setPayingPhone(null);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("pg_admin_pw");
    if (saved) {
      setPassword(saved);
      load(saved);
    }
  }, [load]);

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
            Trang quản trị Affiliate
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
            <Link
              href="/admin"
              className="rounded-full px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Đơn hàng
            </Link>
            <span className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-cream">
              Affiliate
            </span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-brand-900 md:text-3xl">
            Affiliate
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

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={<UsersIcon />} label="Người giới thiệu" value={String(affiliates.length)} tone="brand" />
          <StatCard icon={<PercentIcon />} label="Tỉ lệ hoa hồng" value={`${(commissionRate * 100).toFixed(0)}%`} tone="brand" />
          <StatCard icon={<WalletIcon />} label="Tổng hoa hồng phát sinh" value={formatVND(totalCommission)} tone="brand" />
          <StatCard icon={<AlertIcon />} label="Còn nợ (chưa trả)" value={formatVND(totalOwed)} tone="gold" emphasize />
        </div>

        <p className="mt-6 rounded-xl bg-brand-50/60 px-4 py-3 text-sm text-brand-800 ring-1 ring-brand-100">
          Chỉ tính trên đơn <b>đã thanh toán</b> — hoa hồng ={" "}
          {(commissionRate * 100).toFixed(0)}% tổng doanh thu do người đó giới thiệu.
          SĐT đã tự động chuẩn hoá (bỏ khoảng trắng, +84 → 0) nên không bị tách
          nhầm thành nhiều người.
        </p>

        <div className="mt-4 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50/60 text-brand-800">
              <tr>
                <th className="px-4 py-3.5 font-semibold">SĐT người giới thiệu</th>
                <th className="px-4 py-3.5 font-semibold">Số đơn đã thanh toán</th>
                <th className="px-4 py-3.5 font-semibold">Doanh thu giới thiệu</th>
                <th className="px-4 py-3.5 font-semibold">Đã trả</th>
                <th className="px-4 py-3.5 font-semibold">Còn nợ</th>
                <th className="px-4 py-3.5 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <tr key={a.referrerPhone} className="border-b border-black/5 transition hover:bg-brand-50/30 last:border-0">
                  <td className="px-4 py-3.5">
                    <span className="rounded-lg bg-brand-50 px-2 py-1 font-mono text-xs font-bold text-brand-800">
                      {a.referrerPhone}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-ink">{a.orderCount}</td>
                  <td className="px-4 py-3.5 font-semibold text-brand-800">
                    {formatVND(a.totalRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-ink/50">
                    {formatVND(a.paidCommission)}
                  </td>
                  <td className="px-4 py-3.5">
                    {a.owedCommission > 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-1 text-xs font-semibold text-gold-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                        {formatVND(a.owedCommission)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        Đã trả hết
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {a.owedCommission > 0 && (
                      <button
                        onClick={() => markPaid(a.referrerPhone)}
                        disabled={payingPhone === a.referrerPhone}
                        className="rounded-full bg-brand-700 px-3.5 py-1.5 text-xs font-semibold text-cream shadow-sm transition hover:bg-brand-800 disabled:opacity-60"
                      >
                        {payingPhone === a.referrerPhone
                          ? "Đang lưu…"
                          : "Đánh dấu đã trả"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {affiliates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center text-ink/40">
                    Chưa có đơn nào có người giới thiệu.
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
