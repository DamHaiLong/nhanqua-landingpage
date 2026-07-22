"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  /** Hạn chót dạng ISO có múi giờ, vd "2026-08-05T23:59:59+07:00" */
  deadline: string;
  heading: string;
  expiredText: string;
  /** "dark" = đặt trên nền tối (hero); "light" = nền sáng (form) */
  tone?: "dark" | "light";
}

function remaining(target: number, now: number) {
  const diff = Math.max(0, target - now);
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    finished: diff <= 0,
  };
}

export default function CountdownTimer({
  deadline,
  heading,
  expiredText,
  tone = "dark",
}: CountdownTimerProps) {
  const target = new Date(deadline).getTime();
  // now = null cho tới khi mount ở client → tránh lệch hydration
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = now === null ? null : remaining(target, now);

  if (t?.finished) {
    return (
      <p
        className={`rounded-xl px-4 py-3 text-sm font-semibold ${
          tone === "dark"
            ? "bg-white/10 text-cream/80"
            : "bg-gold-50 text-ink/70 ring-1 ring-gold-200"
        }`}
      >
        {expiredText}
      </p>
    );
  }

  const units = [
    { label: "Ngày", value: t?.days },
    { label: "Giờ", value: t?.hours },
    { label: "Phút", value: t?.minutes },
    { label: "Giây", value: t?.seconds },
  ];

  return (
    <div>
      <p
        className={`text-sm font-bold ${
          tone === "dark" ? "text-gold-300" : "text-brand-800"
        }`}
      >
        {heading}
      </p>
      <div className="mt-2.5 flex gap-2 sm:gap-2.5">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex min-w-0 flex-1 flex-col items-center rounded-xl bg-gradient-to-b from-gold-500 to-gold-600 px-1 py-2 text-white shadow-lg shadow-gold-900/20 ring-1 ring-gold-300/40 sm:py-2.5"
          >
            <span className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
              {now === null ? "--" : String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-white/85 sm:text-xs">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
