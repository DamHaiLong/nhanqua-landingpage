import { course, formatVND } from "@/config/course";
import RegistrationForm from "@/components/RegistrationForm";
import CountdownTimer from "@/components/CountdownTimer";
import Logo from "@/components/Logo";

const tel = (s: string) => "tel:" + s.replace(/\s/g, "");

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-[0.25em] ${
        light
          ? "text-gold-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]"
          : "text-gold-600"
      }`}
    >
      {children}
    </span>
  );
}

function Divider({ center = false }: { center?: boolean }) {
  return (
    <div
      className={`mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-gold-400 to-brand-400 ${
        center ? "mx-auto" : ""
      }`}
    />
  );
}

/* Đốm màu trang trí mờ — tạo chiều sâu tươi sáng cho nền */
function Blob({ className }: { className: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    />
  );
}

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.86.33 1.7.62 2.5a2 2 0 0 1-.45 2.11L8 9.6a16 16 0 0 0 6.4 6.4l1.27-1.27a2 2 0 0 1 2.11-.45c.8.29 1.64.5 2.5.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function ArrowIcon({ className = "h-5 w-5" }: { className?: string }) {
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

/* Icon cho dải thông tin nhanh: lịch, địa điểm, người hướng dẫn, hình thức */
function FactIcon({ index, className = "h-5 w-5" }: { index: number; className?: string }) {
  const paths = [
    // lịch
    <g key="cal">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </g>,
    // địa điểm
    <g key="pin">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </g>,
    // người hướng dẫn
    <g key="user">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </g>,
    // lưu trú
    <g key="home">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </g>,
  ];
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
      {paths[index % paths.length]}
    </svg>
  );
}

/* Icon 3 trụ cột: Thân (lá), Tâm (tim), Trí (tia sáng) */
function PillarIcon({ index, className = "h-6 w-6" }: { index: number; className?: string }) {
  const paths = [
    <g key="leaf">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </g>,
    <g key="heart">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </g>,
    <g key="spark">
      <path d="M9.94 15.5a2 2 0 0 0-1.44-1.44l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94a2 2 0 0 0 1.44-1.44l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z" />
      <path d="M20 3v4M22 5h-4" />
    </g>,
    <g key="sunrise">
      <path d="M12 2v6" />
      <path d="m8 6 4-4 4 4" />
      <path d="m4.93 12.93 1.41 1.41" />
      <path d="M2 20h2M20 20h2" />
      <path d="m19.07 12.93-1.41 1.41" />
      <path d="M17 20a5 5 0 0 0-10 0" />
      <path d="M22 24H2" />
    </g>,
  ];
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
      {paths[index % paths.length]}
    </svg>
  );
}

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}

/* Nút CTA chính — gradient vàng, vòng sáng lan tỏa, vệt sáng quét khi hover */
function CTAButton({
  children,
  large = false,
}: {
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <a
      href="#dang-ky"
      className={`group relative inline-flex animate-glow items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 font-bold text-brand-900 shadow-xl shadow-gold-500/40 ring-2 ring-gold-300/70 transition-transform duration-200 hover:scale-[1.04] ${
        large ? "px-10 py-5 text-lg" : "px-8 py-4 text-base"
      }`}
    >
      <span className="relative z-10">{children}</span>
      <ArrowIcon className="relative z-10 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/3 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[350%]"
      />
    </a>
  );
}

/* Ảnh chìm mờ phía sau nền section */
function Watermark({ src }: { src: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover opacity-[0.07]"
      />
    </div>
  );
}

export default function HomePage() {
  const hasDiscount =
    !!course.originalPrice && course.originalPrice > course.price;
  const discount = hasDiscount
    ? Math.round((1 - course.price / (course.originalPrice as number)) * 100)
    : 0;
  const [hotline1, hotline2] = course.contact.hotlines;

  return (
    <main className="overflow-x-hidden">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-5">
            <a
              href={tel(hotline1)}
              className="hidden items-center gap-2 text-sm font-semibold text-brand-800 transition hover:text-brand-600 md:flex"
            >
              <PhoneIcon /> {hotline1}
            </a>
            <a
              href="#dang-ky"
              className="rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-5 py-2.5 text-sm font-bold text-brand-900 shadow-md shadow-gold-500/30 transition hover:brightness-105"
            >
              Đăng ký ngay
            </a>
          </div>
        </div>
      </header>

      {/* ===== Hero — banner khóa học ONLINE (gradient + chân dung Thầy) ===== */}
      <section className="relative flex min-h-[640px] items-center overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-800 md:min-h-[720px]">
        {/* Vầng sáng trang trí */}
        <div aria-hidden className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-gold-400/15 blur-3xl" />
        <div aria-hidden className="absolute -bottom-48 right-0 h-[520px] w-[520px] rounded-full bg-brand-500/20 blur-3xl" />
        <div aria-hidden className="absolute right-1/3 top-10 h-64 w-64 rounded-full bg-gold-300/10 blur-2xl" />

        <div className="container-page relative grid items-center gap-12 pb-44 pt-16 md:grid-cols-5 lg:pb-56">
          <div className="animate-fade-up text-cream md:col-span-3">
            <Eyebrow light>{course.organizer}</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-6xl">
              {course.programName}
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium text-cream/85 md:text-xl">
              {course.tagline}
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-sm font-medium">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/90 px-4 py-1.5 font-bold text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                LIVE qua Zoom
              </span>
              <span className="rounded-full border border-cream/30 bg-white/10 px-4 py-1.5 backdrop-blur">
                📅 {course.dateText}
              </span>
              <span className="rounded-full border border-cream/30 bg-white/10 px-4 py-1.5 backdrop-blur">
                🕗 {course.durationText}
              </span>
              <span className="rounded-full border border-gold-300/50 bg-gold-400/15 px-4 py-1.5 font-semibold text-gold-200 backdrop-blur">
                🎁 Tặng bộ tài liệu bản cứng
              </span>
            </div>

            <p className="mt-5 font-medium text-cream/90">
              <span className="font-semibold text-gold-300">Hướng dẫn:</span>{" "}
              {course.guideText}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <CTAButton large>Đăng ký học ngay</CTAButton>
              <a
                href="#chuong-trinh"
                className="rounded-full border border-cream/40 px-8 py-4 text-base font-semibold text-cream transition hover:bg-white/10"
              >
                Tìm hiểu khóa học
              </a>
            </div>

            {course.countdown.enabled && (
              <div className="mt-8 max-w-md rounded-2xl border border-gold-300/30 bg-black/25 px-5 py-4 backdrop-blur">
                <CountdownTimer
                  deadline={course.countdown.deadline}
                  heading={course.countdown.heading}
                  expiredText={course.countdown.expiredText}
                  tone="dark"
                />
              </div>
            )}
          </div>

          {/* Chân dung Thầy — cột phải */}
          <div className="relative mx-auto hidden w-full max-w-xs animate-fade-up md:col-span-2 md:block lg:max-w-sm">
            <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-gold-400/40 to-brand-500/20 blur-xl" />
            <img
              src={course.teacher.image}
              alt="Thầy Ngô Đức Vượng"
              className="relative w-full rounded-[2rem] object-cover shadow-2xl ring-2 ring-gold-300/50"
            />
            <div className="absolute -bottom-5 left-1/2 w-max -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-center shadow-xl">
              <p className="font-display text-base font-bold text-brand-900">
                {course.teacher.name}
              </p>
              <p className="text-xs text-gold-700">Hơn 40 năm nghiên cứu</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Quick facts — thẻ nổi nằm trọn trên ảnh hero ===== */}
      <section className="relative z-10 -mt-20 lg:-mt-36">
        <div className="container-page">
          <div className="grid gap-px overflow-hidden rounded-3xl bg-black/[0.06] shadow-2xl shadow-brand-900/15 ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-4">
            {course.quickFacts.map((f, i) => (
              <div key={f.label} className="flex items-start gap-4 bg-white p-6">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-gold-50 text-gold-600 ring-1 ring-gold-200">
                  <FactIcon index={i} />
                </span>
                <span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
                    {f.label}
                  </p>
                  <p className="mt-1.5 font-semibold text-brand-900">{f.value}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Về chương trình ===== */}
      <section
        id="chuong-trinh"
        className="relative scroll-mt-16 bg-gradient-to-b from-brand-50/70 to-transparent py-20"
      >
        <Watermark src="/images/bamboo.jpg" />
        <Blob className="-left-28 top-10 h-80 w-80 bg-gold-100/70" />
        <Blob className="-right-24 bottom-10 h-72 w-72 bg-brand-100/80" />
        <div className="container-page relative grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <img
              src={course.about.image}
              alt="Thầy Ngô Đức Vượng chia sẻ trong một buổi học"
              className="w-full rounded-3xl object-contain shadow-xl"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-brand-700 px-6 py-5 text-cream shadow-lg sm:block">
              <p className="font-display text-3xl font-semibold text-gold-300">
                6 buổi
              </p>
              <p className="text-sm text-cream/80">đồng hành cùng Thầy</p>
            </div>
          </div>

          <div>
            <Eyebrow>Về chương trình</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              {course.about.heading}
            </h2>
            <Divider />
            {course.about.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-lg leading-relaxed text-ink/75">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* 4 trụ cột: Nhân Quả - Nghiệp Báo - Luân Hồi - Tái Sinh */}
        <div className="container-page relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {course.about.pillars.map((p, i) => (
            <div
              key={p.title}
              className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-500 via-gold-400 to-brand-500" />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-3 font-display text-[7rem] font-bold leading-none text-brand-900/[0.05]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-cream shadow-lg shadow-brand-700/25">
                <PillarIcon index={i} />
              </span>
              <h3 className="relative mt-5 font-display text-2xl font-semibold text-brand-800">
                {p.title}
              </h3>
              <div className="relative mt-2 h-0.5 w-10 rounded bg-gold-400 transition-all duration-300 group-hover:w-16" />
              <p className="relative mt-3 text-ink/70">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Thầy Ngô Đức Vượng ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-50 via-brand-50 to-white py-20">
        <Watermark src="/images/tea.jpg" />
        <Blob className="-right-32 top-0 h-96 w-96 bg-gold-100/60" />
        <div className="container-page relative grid items-center gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl ring-1 ring-gold-200">
              <img
                src={course.teacher.image}
                alt={`Chân dung ${course.teacher.name}`}
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <Eyebrow>Người hướng dẫn</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              {course.teacher.name}
            </h2>
            <p className="mt-2 font-medium text-gold-600">
              {course.teacher.role}
            </p>
            {course.teacher.bio.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-ink/75">
                {p}
              </p>
            ))}
            <blockquote className="mt-6 border-l-4 border-gold-400 pl-5 font-display text-xl italic text-brand-800">
              “{course.teacher.quote}”
            </blockquote>
            <div className="mt-8">
              <CTAButton>Tham gia khóa học cùng Thầy</CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Video giới thiệu khóa học ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-800 py-20">
        <div className="container-page relative">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow light>Video giới thiệu</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-cream md:text-4xl">
              Lắng nghe đôi lời về khóa học
            </h2>
          </div>
          <div className="mx-auto mt-10 max-w-sm">
            <video
              controls
              playsInline
              preload="none"
              poster={course.introVideo.poster}
              className="aspect-[9/16] w-full rounded-3xl bg-black object-cover shadow-2xl ring-1 ring-gold-300/30"
            >
              <source src={course.introVideo.src} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
            <p className="mt-4 text-center text-sm text-cream/70">
              {course.introVideo.title}
            </p>
          </div>
        </div>
      </section>

      {/* ===== Vì sao nên học + lợi ích ===== */}
      <section className="relative bg-white py-20">
        <Watermark src="/images/forest.jpg" />
        <Blob className="-left-24 top-1/3 h-80 w-80 bg-brand-50" />
        <div className="container-page relative">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Vì sao nên học</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              Khóa học này mang lại điều gì cho bạn?
            </h2>
            <Divider center />
            <p className="mt-5 text-lg leading-relaxed text-ink/75">
              {course.detox.intro}
            </p>
          </div>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {course.detox.benefits.map((b) => (
              <div
                key={b.title}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-brand-800">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-ink/70">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm italic text-ink/50">
            {course.detox.note}
          </p>
        </div>
      </section>

      {/* ===== Lịch trình 4 ngày — nền sáng ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-cream to-gold-50 py-20">
        <Watermark src="/images/temple.jpg" />
        <Blob className="-right-28 -top-16 h-80 w-80 bg-gold-100/80" />
        <Blob className="-left-24 bottom-0 h-72 w-72 bg-brand-100/80" />
        <div className="container-page relative">
          <div className="text-center">
            <Eyebrow>Lịch học</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              Lộ trình 06 buổi cùng Thầy
            </h2>
            <Divider center />
            <p className="mx-auto mt-4 inline-block rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-cream shadow-md">
              {course.scheduleNote}
            </p>
          </div>
          <div className="relative mt-14">
            {/* Đường nối timeline (desktop) */}
            <div
              aria-hidden
              className="absolute left-8 right-8 top-7 hidden h-0.5 bg-gradient-to-r from-brand-300 via-gold-400 to-brand-300 lg:block"
            />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {course.schedule.map((s, i) => (
                <div key={s.title} className="group relative">
                  <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-xl font-semibold text-cream shadow-lg shadow-brand-700/30 ring-4 ring-cream lg:mx-0">
                    {i + 1}
                  </div>
                  <div className="mt-5 flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl">
                    <span className="self-start rounded-full bg-gold-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-700 ring-1 ring-gold-200">
                      {s.day}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-semibold text-brand-900">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <CTAButton large>Đăng ký khóa học ngay</CTAButton>
          </div>
        </div>
      </section>

      {/* ===== Trọn gói bao gồm ===== */}
      <section className="relative py-20">
        <Blob className="-right-24 top-16 h-72 w-72 bg-gold-100/60" />
        <div className="container-page relative grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Trọn khóa</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              Khóa học bao gồm
            </h2>
            <Divider />
            <ul className="mt-6 space-y-4">
              {course.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-6 flex-none rounded-full bg-gold-400" />
                  <span className="text-lg text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <img
            src={course.includedImage}
            alt="Không gian học tập và chia sẻ cùng Thầy Ngô Đức Vượng"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
            loading="lazy"
          />
        </div>
      </section>

      {/* ===== Dành cho ai ===== */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-gold-50/60 py-20">
        <div className="container-page grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Đối tượng phù hợp</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              Khóa học dành cho ai?
            </h2>
            <Divider />
            <ul className="mt-6 space-y-3">
              {course.forWhom.map((w) => (
                <li key={w} className="flex items-start gap-3 text-ink/80">
                  <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full border-2 border-gold-400" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <img
            src="/images/community.jpg"
            alt="Học viên và Thầy Ngô Đức Vượng tại chương trình chăm sóc sức khỏe chủ động"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
            loading="lazy"
          />
        </div>
      </section>

      {/* ===== Cảm nhận ===== */}
      <section className="relative py-20">
        <Watermark src="/images/lotus.jpg" />
        <Blob className="-left-28 top-20 h-72 w-72 bg-brand-100/70" />
        <div className="container-page relative">
          <div className="text-center">
            <Eyebrow>Cảm nhận</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              Học viên chia sẻ
            </h2>
            <Divider center />
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {course.testimonials.map((t) => {
              const initial =
                t.name.split(",")[0].trim().split(" ").pop()?.[0] ?? "P";
              return (
                <figure
                  key={t.name}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-3 right-4 font-display text-[6rem] leading-none text-gold-100"
                  >
                    &rdquo;
                  </span>
                  <div className="relative flex gap-1 text-gold-400">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <StarIcon key={n} />
                    ))}
                  </div>
                  <blockquote className="relative mt-4 flex-1 leading-relaxed text-ink/80">
                    {t.quote}
                  </blockquote>
                  <figcaption className="relative mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-lg font-semibold text-cream">
                      {initial}
                    </span>
                    <span>
                      <p className="font-semibold text-brand-900">{t.name}</p>
                      <p className="text-sm text-ink/50">{t.role}</p>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Đánh giá thật trên Facebook ===== */}
      {course.reviewScreenshots.length > 0 && (
        <section className="bg-brand-50/40 pb-16 pt-4">
          <div className="container-page">
            <div className="text-center">
              <Eyebrow>Đánh giá thật</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
                Cộng đồng nói gì trên Facebook
              </h2>
              <Divider center />
              <p className="mx-auto mt-4 max-w-2xl text-ink/60">
                Ảnh chụp trực tiếp từ đánh giá của học viên &amp; cộng đồng trên
                trang Lương Y Ngô Đức Vượng — kéo ngang để xem thêm.
              </p>
            </div>
            <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
              {course.reviewScreenshots.map((src, i) => (
                <figure
                  key={src}
                  className="w-[280px] flex-none snap-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 sm:w-[320px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Đánh giá thật trên Facebook ${i + 1}`}
                    className="w-full"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Đăng ký + Thanh toán ===== */}
      <section
        id="dang-ky"
        className="relative scroll-mt-16 bg-gradient-to-br from-brand-50 via-gold-50/50 to-white py-20"
      >
        <Watermark src="/images/meditation.jpg" />
        <Blob className="-right-28 top-10 h-80 w-80 bg-gold-100/70" />
        <div className="container-page relative grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Đăng ký tham gia</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              Giữ chỗ cho khóa học của bạn
            </h2>
            <Divider />
            <p className="mt-4 text-lg text-ink/75">
              Điền thông tin và thanh toán qua chuyển khoản (QR VietQR). Ngay khi
              nhận được thanh toán, hệ thống sẽ gửi bạn link nhóm Zalo của lớp để
              nhận hướng dẫn trước khai giảng — bộ tài liệu bản cứng sẽ được gửi
              về địa chỉ của bạn.
            </p>

            <div className="mt-6 rounded-2xl border border-gold-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
                Học phí chương trình
              </p>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-4xl font-semibold text-brand-800">
                  {formatVND(course.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-ink/40 line-through">
                      {formatVND(course.originalPrice as number)}
                    </span>
                    <span className="rounded-full bg-gold-400 px-2.5 py-1 text-sm font-bold text-brand-900">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-gold-700">{course.earlyBirdNote}</p>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-6 text-ink/75 ring-1 ring-black/5">
              <p className="font-semibold text-brand-900">Lưu ý</p>
              <p className="mt-1 text-sm">{course.note}</p>
              <p className="mt-3 text-sm">
                Cần hỗ trợ đăng ký? Gọi{" "}
                <a
                  href={tel(hotline1)}
                  className="font-semibold text-brand-700 underline decoration-gold-400 underline-offset-4"
                >
                  {hotline1}
                </a>{" "}
                hoặc{" "}
                <a
                  href={tel(hotline2)}
                  className="font-semibold text-brand-700 underline decoration-gold-400 underline-offset-4"
                >
                  {hotline2}
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl md:p-8">
            {course.countdown.enabled && (
              <div className="mb-6 rounded-2xl bg-gold-50/80 p-4 ring-1 ring-gold-200">
                <CountdownTimer
                  deadline={course.countdown.deadline}
                  heading={course.countdown.heading}
                  expiredText={course.countdown.expiredText}
                  tone="light"
                />
              </div>
            )}
            <RegistrationForm price={course.price} />
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20">
        <div className="container-page max-w-3xl">
          <div className="text-center">
            <Eyebrow>Giải đáp</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              Câu hỏi thường gặp
            </h2>
            <Divider center />
          </div>
          <div className="mt-8 space-y-3">
            {course.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-black/5 bg-white p-5"
              >
                <summary className="cursor-pointer list-none font-semibold text-brand-900 marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="font-display text-2xl text-gold-500 transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA band — sáng ===== */}
      <section className="relative overflow-hidden py-24">
        <img
          src={course.ctaImage}
          alt="Con đường giữa rừng xanh"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-cream/30" />
        <div className="container-page relative">
          <div className="max-w-xl">
            <Eyebrow>Số lượng có hạn</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
              Sẵn sàng cho hành trình trở về với chính mình?
            </h2>
            <p className="mt-4 text-ink/75">
              {course.dateText} · {course.location}. Số lượng có hạn để đảm bảo
              trải nghiệm trọn vẹn cho mỗi người tham dự.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CTAButton large>Đăng ký giữ chỗ</CTAButton>
              <a
                href={tel(hotline1)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-700 px-7 py-3.5 font-semibold text-brand-800 transition hover:bg-brand-700 hover:text-cream"
              >
                <PhoneIcon /> {hotline1}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-black/5 bg-white pb-28 pt-12 md:pb-12">
        <div className="container-page flex flex-col items-center gap-4 text-center">
          <Logo large />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-ink/70">
            <a
              href={tel(hotline1)}
              className="inline-flex items-center gap-2 font-semibold text-brand-800 transition hover:text-brand-600"
            >
              <PhoneIcon /> {hotline1}
            </a>
            <a
              href={tel(hotline2)}
              className="inline-flex items-center gap-2 font-semibold text-brand-800 transition hover:text-brand-600"
            >
              <PhoneIcon /> {hotline2}
            </a>
          </div>
          <p className="text-xs text-ink/40">
            © {new Date().getFullYear()} {course.brand} · {course.organizer}
          </p>
        </div>
      </footer>

      {/* ===== Sticky CTA mobile: gọi + đăng ký ===== */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-black/10 bg-white/95 p-3 backdrop-blur md:hidden">
        <a
          href={tel(hotline1)}
          aria-label={`Gọi hotline ${hotline1}`}
          className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-brand-300 bg-brand-50 text-brand-700"
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
        <a
          href="#dang-ky"
          className="flex flex-1 animate-glow items-center justify-center rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 px-6 py-3 font-bold text-brand-900 shadow-lg shadow-gold-500/40"
        >
          Đăng ký — {formatVND(course.price)}
        </a>
      </div>
    </main>
  );
}
