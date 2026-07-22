/**
 * Logo chính thức PranaGreen (bản gốc: logo-ngang-2.png trong bộ não,
 * đã thu nhỏ thành /public/images/logo.png — nền trong suốt).
 */
export default function Logo({ large = false }: { large?: boolean }) {
  return (
    <a href="/" aria-label="PranaGreen — về đầu trang" className="inline-flex">
      <img
        src="/images/logo.png"
        alt="PranaGreen — Refresh your health"
        className={large ? "h-14 w-auto" : "h-10 w-auto md:h-11"}
      />
    </a>
  );
}
