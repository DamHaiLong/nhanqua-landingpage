"use client";

import Script from "next/script";

/**
 * Microsoft Clarity — heatmap, bản đồ click/cuộn và video ghi lại phiên
 * khách thật lướt web, để kiểm tra chất lượng UX landing page.
 * Chỉ tải khi đã cấu hình NEXT_PUBLIC_CLARITY_ID.
 * Tạo project miễn phí tại clarity.microsoft.com để lấy Project ID.
 */
export default function ClarityAnalytics() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!clarityId) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `}
    </Script>
  );
}
