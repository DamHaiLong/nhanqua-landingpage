import PaymentClient from "@/components/PaymentClient";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function PaymentPage({
  params,
}: {
  params: { code: string };
}) {
  const account = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT || "";
  const bank = process.env.NEXT_PUBLIC_SEPAY_BANK || "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-cream to-cream">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <span className="hidden items-center gap-1.5 text-sm font-medium text-brand-700 sm:flex">
            <LockIcon /> Thanh toán an toàn
          </span>
        </div>
      </header>

      <div className="container-page py-10 md:py-14">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
            Bước cuối cùng
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
            Hoàn tất đăng ký của bạn
          </h1>
          <p className="mt-3 text-ink/70">
            Chuyển khoản theo thông tin bên dưới để nhận ngay link nhóm Zalo của
            chương trình.
          </p>
        </div>

        <PaymentClient code={params.code} account={account} bank={bank} />
      </div>
    </main>
  );
}
