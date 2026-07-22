"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { formatVND } from "@/config/course";
import { fbTrack } from "@/lib/fbPixel";

interface OrderState {
  code: string;
  fullName: string;
  amount: number;
  status: "pending" | "paid" | "canceled";
  zaloLink: string | null;
}

/* ---------- Icon set (SVG mảnh, đồng bộ với landing) ---------- */

function CheckCircleIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function ScanIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}

function CopyIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function FaceSadIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 15s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01" />
    </svg>
  );
}

function Spinner({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${className} animate-spin`} aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-20"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------- */

export default function PaymentClient({
  code,
  account,
  bank,
}: {
  code: string;
  account: string;
  bank: string;
}) {
  const [order, setOrder] = useState<OrderState | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const purchaseTracked = useRef(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${code}`, { cache: "no-store" });
      if (res.status === 404) {
        setNotFound(true);
        return true; // dừng poll
      }
      if (!res.ok) return false; // lỗi tạm thời -> tiếp tục poll
      const data = await res.json();
      if (!data || typeof data.status !== "string") return false;
      setOrder(data);
      if (data.status === "paid" && !purchaseTracked.current) {
        purchaseTracked.current = true;
        fbTrack("Purchase", { value: data.amount, currency: "VND" });
      }
      return data.status === "paid"; // paid -> dừng poll
    } catch {
      return false;
    }
  }, [code]);

  useEffect(() => {
    let stopped = false;
    fetchStatus();
    const timer = setInterval(async () => {
      if (stopped) return;
      const done = await fetchStatus();
      if (done) clearInterval(timer);
    }, 3000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [fetchStatus]);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  /* ----- Không tìm thấy đơn ----- */
  if (notFound) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-black/5 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-gold-600">
          <FaceSadIcon />
        </div>
        <h1 className="mt-4 font-display text-xl font-semibold text-brand-900">
          Không tìm thấy đơn hàng
        </h1>
        <p className="mt-2 text-ink/60">
          Đơn hàng không tồn tại hoặc link đã hết hạn.
        </p>
        <Link
          href="/#dang-ky"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 font-semibold text-cream transition hover:bg-brand-800"
        >
          Đăng ký lại <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  /* ----- Đang tải ----- */
  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-black/5 bg-white p-10 text-center shadow-xl">
        <Spinner className="h-9 w-9 text-brand-600" />
        <p className="mt-4 text-ink/60">Đang tải đơn hàng…</p>
      </div>
    );
  }

  /* ----- Đã thanh toán ----- */
  if (order.status === "paid") {
    return (
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-8 pb-8 pt-9 text-center text-cream">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-cream ring-1 ring-white/30">
            <CheckCircleIcon />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">
            Thanh toán thành công!
          </h1>
        </div>

        <div className="p-8 text-center">
          <p className="text-ink/70">
            Cảm ơn <b className="text-brand-900">{order.fullName}</b> đã đăng
            ký. Bấm nút dưới để vào nhóm Zalo của khóa học để nắm bắt thêm
            thông tin về khóa học.
          </p>

          {order.zaloLink ? (
            <a
              href={order.zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 px-6 py-4 text-lg font-bold text-brand-900 shadow-lg shadow-gold-500/40 ring-2 ring-gold-300/70 transition hover:brightness-105"
            >
              Vào nhóm Zalo khóa học
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <p className="mt-6 rounded-xl bg-gold-50 px-4 py-3 text-sm text-gold-700 ring-1 ring-gold-200">
              Link Zalo sẽ được gửi tới bạn. Vui lòng liên hệ hỗ trợ nếu cần
              gấp.
            </p>
          )}

          {order.zaloLink && (
            <p className="mt-3 break-all text-xs text-ink/40">
              {order.zaloLink}
            </p>
          )}

          <p className="mt-6 border-t border-black/5 pt-5 text-sm text-ink/50">
            Chúng tôi cũng đã gửi link vào email của bạn (nếu có).
          </p>
        </div>
      </div>
    );
  }

  /* ----- Chờ thanh toán ----- */
  const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(
    account
  )}&bank=${encodeURIComponent(bank)}&amount=${order.amount}&des=${encodeURIComponent(
    order.code
  )}`;

  const Row = ({
    label,
    value,
    copyKey,
    emphasize,
  }: {
    label: string;
    value: string;
    copyKey?: string;
    emphasize?: boolean;
  }) => (
    <div className="flex items-center justify-between gap-3 border-b border-black/5 py-3 last:border-0">
      <span className="text-sm text-ink/50">{label}</span>
      <span className="flex items-center gap-2 text-right">
        <span
          className={
            emphasize
              ? "font-display text-lg font-semibold text-brand-800"
              : "font-semibold text-brand-900"
          }
        >
          {value}
        </span>
        {copyKey && (
          <button
            onClick={() => copy(value, copyKey)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
              copied === copyKey
                ? "bg-brand-600 text-cream"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100"
            }`}
          >
            {copied === copyKey ? <CheckIcon /> : <CopyIcon />}
            {copied === copyKey ? "Đã chép" : "Chép"}
          </button>
        )}
      </span>
    </div>
  );

  const configured = account && bank && account !== "0123456789";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6 md:grid-cols-2">
        {/* QR */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 text-center shadow-xl md:p-8">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-cream shadow-md shadow-brand-700/25">
            <ScanIcon />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-brand-900">
            Quét mã QR để chuyển khoản
          </h2>
          <p className="mt-1 text-sm text-ink/50">
            Mở app ngân hàng bất kỳ → Quét QR
          </p>

          {configured ? (
            <div className="mx-auto mt-5 w-fit rounded-2xl bg-gradient-to-br from-brand-50 to-gold-50 p-3 ring-1 ring-gold-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="Mã QR chuyển khoản"
                className="h-56 w-56 rounded-xl bg-white sm:h-64 sm:w-64"
              />
            </div>
          ) : (
            <div className="mx-auto mt-5 flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-gold-200 bg-gold-50/40 p-4 text-sm text-gold-700 sm:h-64 sm:w-64">
              Chưa cấu hình tài khoản SePay (NEXT_PUBLIC_SEPAY_ACCOUNT / _BANK)
            </div>
          )}

          <p className="mt-5 font-display text-3xl font-semibold text-brand-800">
            {formatVND(order.amount)}
          </p>
        </div>

        {/* Thông tin CK + trạng thái */}
        <div className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-xl md:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-50 text-gold-600 ring-1 ring-gold-200">
            <ScanIcon />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-brand-900">
            Hoặc chuyển khoản thủ công
          </h2>
          <p className="mt-1 text-sm text-ink/50">
            Nhập <b className="text-brand-800">chính xác</b> nội dung để hệ
            thống tự xác nhận.
          </p>

          <div className="mt-4">
            <Row label="Ngân hàng" value={bank} />
            <Row label="Số tài khoản" value={account} copyKey="acc" />
            <Row
              label="Số tiền"
              value={String(order.amount)}
              copyKey="amt"
              emphasize
            />
            <Row
              label="Nội dung CK"
              value={order.code}
              copyKey="content"
              emphasize
            />
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gold-50 px-4 py-3.5 ring-1 ring-gold-200">
            <span className="relative flex h-3 w-3 flex-none">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-gold-500" />
            </span>
            <p className="text-sm font-medium text-gold-800">
              Đang chờ thanh toán… Trang sẽ tự cập nhật khi nhận được tiền.
            </p>
          </div>

          <p className="mt-auto pt-4 text-xs text-ink/40">
            Mã đơn: <span className="font-semibold text-ink/60">{order.code}</span>{" "}
            · Không đóng trang này trong lúc chuyển khoản.
          </p>
        </div>
      </div>
    </div>
  );
}
