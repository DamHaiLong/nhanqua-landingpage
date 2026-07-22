// ============================================================
//  NỘI DUNG KHÓA HỌC — sửa tại đây là landing tự cập nhật
//  Ảnh nằm trong thư mục /public/images — thay file cùng tên
//  để dùng ảnh thật của Trung tâm / Thầy / các khóa trước.
// ============================================================

export const course = {
  brand: "PranaGreen",
  organizer: "Nền Văn hóa Sức khỏe và Y khoa Giáo dục",

  // --- Thông tin chính ---
  programName: "Nhân Quả – Nghiệp Báo – Luân Hồi Tái Sinh",
  tagline:
    "Có những kiến thức giúp chúng ta kiếm sống. Nhưng cũng có những chân lý giúp chúng ta hiểu cuộc sống.",
  dateText: "31/7 – 5/8/2026",
  durationText: "06 buổi · 20:00 hàng ngày",
  location: "Zoom Online — học tại nhà, ở bất kỳ đâu",
  guideText: "Thầy Ngô Đức Vượng",

  heroImage: "/images/hero-lop-hoc.jpg",

  // --- Học phí (VND) ---
  price: 999_000,
  originalPrice: null as number | null, // đặt số > price để hiện giá gạch + %
  earlyBirdNote:
    "🎁 Tặng bộ tài liệu bản cứng gửi tận nhà cho tất cả học viên đăng ký",

  // --- Bộ đếm ngược hạn đăng ký ---
  //  • deadline: hạn chót theo GIỜ VIỆT NAM (+07:00). Đổi ngày/giờ tại đây.
  //  • enabled: false để tắt bộ đếm.
  countdown: {
    enabled: true,
    deadline: "2026-07-30T23:59:59+07:00",
    heading: "⏳ Khóa học khai giảng 31/7 — hạn đăng ký còn:",
    expiredText:
      "Khóa học đã khai giảng — vui lòng liên hệ hotline để được hỗ trợ.",
  },

  // --- Affiliate: tỉ lệ hoa hồng cho người giới thiệu (0.1 = 10%) ---
  affiliateCommissionRate: 0.1,

  // --- Thông tin nhanh (dải dưới hero) ---
  quickFacts: [
    { label: "Thời gian", value: "31/7 – 5/8/2026 · 20:00 hàng ngày" },
    { label: "Hình thức", value: "Zoom Online trực tiếp" },
    { label: "Người hướng dẫn", value: "Thầy Ngô Đức Vượng" },
    { label: "Quà tặng", value: "Bộ tài liệu bản cứng gửi tận nhà" },
  ],

  // --- Về khóa học ---
  about: {
    image: "/images/thay-giang-bai.jpg",
    heading: "Hiểu cuộc sống bằng ánh sáng của Nhân quả",
    paragraphs: [
      "Nhân quả là một đại định luật của vũ trụ, chi phối mọi suy nghĩ, lời nói, hành động và kết quả trong cuộc đời mỗi con người. Nghiệp báo và luân hồi tái sinh là sự tiếp nối của định luật ấy — giúp lý giải nhiều điều tưởng chừng không có lời giải: vì sao có người hạnh phúc, có người khổ đau; vì sao cùng một hoàn cảnh nhưng mỗi người lại có một số phận khác nhau.",
      "Trong 06 buổi đồng hành trực tiếp qua Zoom, Thầy Ngô Đức Vượng sẽ chia sẻ một cách khoa học, logic và dễ hiểu về những quy luật nền tảng của đời sống — giúp bạn không chỉ hiểu đúng về nhân quả mà còn biết cách ứng dụng vào thực tiễn để xây dựng sức khỏe, hạnh phúc, các mối quan hệ và sự phát triển nội tâm.",
      "Đây không đơn thuần là một khóa học, mà là hành trình thay đổi nhận thức — để hiểu mình, hiểu người, biết gieo nhân lành và kiến tạo một cuộc sống bình an, ý nghĩa hơn.",
    ],
    pillars: [
      {
        title: "Nhân Quả",
        desc: "Hiểu đúng Nhân quả để sống đúng — nhận ra quy luật đang chi phối mọi suy nghĩ, lời nói và hành động.",
      },
      {
        title: "Nghiệp Báo",
        desc: "Hiểu đúng Nghiệp báo để chuyển hóa chính mình — không oán trách số phận, chủ động gieo nhân lành.",
      },
      {
        title: "Luân Hồi",
        desc: "Hiểu đúng Luân hồi — sự tiếp nối của dòng sống, lý giải những điều tưởng chừng không có lời giải.",
      },
      {
        title: "Tái Sinh",
        desc: "Hiểu đúng Tái sinh để kiến tạo một cuộc đời an lạc, trí tuệ và hạnh phúc — từ chính hôm nay.",
      },
    ],
  },

  // --- Video giới thiệu khóa học (tự host, dạng dọc 9:16) ---
  introVideo: {
    src: "/videos/gioi-thieu-khoa-hoc.mp4",
    poster: "/videos/poster-gioi-thieu.jpg",
    title: "Giới thiệu khóa học Nhân Quả – Nghiệp Báo – Luân Hồi Tái Sinh",
  },

  // --- Giới thiệu Thầy Ngô Đức Vượng ---
  teacher: {
    name: "Thầy Ngô Đức Vượng",
    role: "Lương y · Nhà nghiên cứu hơn 40 năm về y học tự nhiên & minh triết phương Đông",
    image: "/images/teacher.jpg",
    bio: [
      "Thầy Ngô Đức Vượng là nhà nghiên cứu và người thầy tâm huyết trong lĩnh vực dưỡng sinh, minh triết phương Đông và lối sống thuận tự nhiên. Với hơn 40 năm nghiên cứu và thực hành, Thầy là một trong những người tiên phong khai sáng Nền Văn hóa Sức khỏe & Y khoa Giáo dục tại Việt Nam.",
      "Thầy là tác giả của nhiều cuốn sách giá trị về sức khỏe, lối sống và chiều sâu nội tâm, truyền cảm hứng cho rất nhiều người trên hành trình hiểu mình, hiểu cuộc sống và sống tỉnh thức.",
      "Các buổi chia sẻ của Thầy khoa học, logic và gần gũi — giúp người học tiếp cận những chủ đề sâu sắc như nhân quả, nghiệp báo, luân hồi một cách sáng rõ, không mê tín, không giáo điều.",
    ],
    quote:
      "Hiểu đúng Nhân quả để sống đúng. Hiểu đúng Nghiệp báo để chuyển hóa chính mình.",
  },

  // --- Vì sao nên học + lợi ích ---
  detox: {
    intro:
      "Nhận thấy đây là nền tảng quan trọng nhưng chưa được truyền dạy một cách hệ thống, Nền Văn hóa Sức khỏe và Y khoa Giáo dục trân trọng giới thiệu khóa học “Nhân Quả – Nghiệp Báo – Luân Hồi Tái Sinh” — nơi những quy luật nền tảng của đời sống được chia sẻ một cách khoa học, logic và dễ hiểu.",
    note: "Khóa học mang tính giáo dục nhận thức, chia sẻ dưới góc nhìn khoa học và minh triết phương Đông — không mê tín, không giáo điều.",
    benefits: [
      {
        image: "/images/lotus.jpg",
        title: "Hiểu quy luật vận hành cuộc sống",
        desc: "Nhận ra nhân quả đang chi phối mọi suy nghĩ, lời nói, hành động — nền tảng để sống đúng và sống an.",
      },
      {
        image: "/images/mindful.jpg",
        title: "Lý giải điều tưởng chừng vô lý",
        desc: "Vì sao có người hạnh phúc, có người khổ đau; cùng một hoàn cảnh nhưng mỗi người một số phận khác nhau.",
      },
      {
        image: "/images/healing.jpg",
        title: "Chuyển hóa khổ đau",
        desc: "Hiểu nghiệp báo để thôi oán trách số phận, biết cách chuyển hóa chính mình từ gốc rễ.",
      },
      {
        image: "/images/community.jpg",
        title: "Nuôi dưỡng các mối quan hệ",
        desc: "Biết gieo nhân lành trong gia đình, công việc — các mối quan hệ trở nên hài hòa, sâu sắc hơn.",
      },
      {
        image: "/images/meditation.jpg",
        title: "Bình an nội tâm",
        desc: "Khi hiểu quy luật, tâm bớt lo sợ, bớt bám víu — sống chủ động, nhẹ nhõm và vững vàng.",
      },
      {
        image: "/images/forest.jpg",
        title: "Kiến tạo tương lai",
        desc: "Chủ động gieo nhân hôm nay để gặt quả mai sau — cho chính mình và những người thân yêu.",
      },
    ],
  },

  // --- Lịch học 6 buổi ---
  // LƯU Ý: chủ đề từng buổi là BẢN NHÁP dựng theo nội dung khóa —
  // vui lòng đối chiếu giáo án thật của Thầy và sửa tại đây.
  scheduleNote: "🕗 Học trực tiếp qua Zoom lúc 20:00 mỗi tối, từ 31/7 đến 5/8",
  schedule: [
    {
      day: "Buổi 1 · 31/7",
      title: "Nhân quả — đại định luật của vũ trụ",
      desc: "Tổng quan về định luật nhân quả: vì sao nhân quả chi phối mọi mặt của đời sống, từ sức khỏe đến số phận mỗi con người.",
    },
    {
      day: "Buổi 2 · 1/8",
      title: "Nhân quả trong suy nghĩ, lời nói, hành động",
      desc: "Cách chúng ta đang gieo nhân mỗi ngày mà không hay biết — và cách gieo nhân lành một cách chủ động, tỉnh thức.",
    },
    {
      day: "Buổi 3 · 2/8",
      title: "Nghiệp báo — cơ chế vận hành",
      desc: "Nghiệp là gì, nghiệp hình thành và trổ quả như thế nào — lý giải khoa học, logic, không mê tín.",
    },
    {
      day: "Buổi 4 · 3/8",
      title: "Luân hồi tái sinh",
      desc: "Sự tiếp nối của dòng sống qua góc nhìn minh triết phương Đông và những nghiên cứu, quan sát thực tiễn.",
    },
    {
      day: "Buổi 5 · 4/8",
      title: "Ứng dụng vào đời sống",
      desc: "Vận dụng hiểu biết về nhân quả vào sức khỏe, hạnh phúc, các mối quan hệ và công việc hằng ngày.",
    },
    {
      day: "Buổi 6 · 5/8",
      title: "Chuyển hóa chính mình",
      desc: "Gieo nhân lành, phát triển nội tâm, kiến tạo cuộc đời an lạc — tổng kết hành trình và hỏi đáp cùng Thầy.",
    },
  ],

  // --- Trọn khóa bao gồm ---
  includedImage: "/images/lop-thuc-hanh.jpg",
  included: [
    "06 buổi học trực tiếp qua Zoom cùng Thầy Ngô Đức Vượng",
    "Bộ tài liệu bản cứng gửi tận nhà cho mọi học viên",
    "Hỏi – đáp trực tiếp với Thầy trong các buổi học",
    "Nhóm Zalo học viên đồng hành trong suốt khóa",
    "Kiến thức ứng dụng ngay vào sức khỏe, hạnh phúc và các mối quan hệ",
  ],

  ctaImage: "/images/forest.jpg",

  // --- Dành cho ai ---
  forWhom: [
    "Người muốn hiểu quy luật nhân quả một cách khoa học, hệ thống — không mê tín",
    "Người đang trải qua khổ đau, biến cố mà chưa tìm được lời giải",
    "Người muốn cải thiện các mối quan hệ gia đình, công việc từ gốc rễ",
    "Người trên hành trình phát triển nội tâm, sống tỉnh thức",
    "Người quan tâm minh triết phương Đông và các chủ đề chiều sâu của đời sống",
  ],

  // --- Cảm nhận THẬT (trích từ đánh giá trên Facebook của học viên & cộng đồng) ---
  testimonials: [
    {
      name: "Lâm Trung",
      role: "Học viên các khóa học của Thầy",
      quote:
        "Con đã học lớp thanh lọc Thân – Tâm – Trí và lớp Văn Hóa Sức Khỏe, áp dụng những kiến thức Thầy dạy và thay đổi phong cách sống — giờ sức khỏe của con rất tốt. Biết ơn Thầy!",
    },
    {
      name: "Thanh Nhã Lâm",
      role: "Học viên khóa thanh lọc",
      quote:
        "Con đã tham gia khóa thanh lọc của Thầy ở Đồng Nai. Về nhà con thay đổi phong cách sống và thói quen ăn uống — hiện tại bệnh của con không phải dùng thuốc tây nữa. Biết ơn Thầy!",
    },
    {
      name: "Trần Quang Minh",
      role: "Học viên lớp Văn Hóa Sức Khỏe",
      quote:
        "Nhiều năm trước do ăn uống và lối sống sai, bệnh tật đầy người. Nhờ học lớp Văn Hóa Sức Khỏe mà cháu thay đổi lối sống, bây giờ bệnh đã giảm 7–8 phần rồi ạ. Biết ơn bác Vượng lắm!",
    },
    {
      name: "Trương Chí Vĩnh",
      role: "Cộng đồng theo Thầy Ngô Đức Vượng",
      quote:
        "Con vốn là người ốm đau quặt quẹo. Nhờ biết đến Thầy, con đã thay đổi cách sống, bây giờ con khỏe lên rất nhiều rồi ạ.",
    },
    {
      name: "Vũ Phi",
      role: "Người thực hành thực dưỡng",
      quote:
        "Con ăn thực dưỡng được 5 năm và áp dụng theo phương pháp 5T của Thầy, bây giờ con hết bệnh rồi ạ.",
    },
    {
      name: "Công Minh",
      role: "Học viên các khóa học của Thầy",
      quote:
        "Con đã từng học khóa thanh lọc Thân – Tâm – Trí của Thầy và đã thay đổi phong cách sống rồi ạ.",
    },
  ],

  // --- Ảnh chụp đánh giá thật trên Facebook (fanpage Lương Y Ngô Đức Vượng) ---
  reviewScreenshots: [
    "/images/reviews/fb-1.jpg",
    "/images/reviews/fb-2.jpg",
    "/images/reviews/fb-3.jpg",
    "/images/reviews/fb-4.jpg",
    "/images/reviews/fb-5.jpg",
    "/images/reviews/fb-6.jpg",
  ],

  // --- Câu hỏi thường gặp ---
  faqs: [
    {
      q: "Tôi chưa từng tìm hiểu về tâm linh / Phật pháp, có học được không?",
      a: "Rất phù hợp. Thầy chia sẻ theo cách khoa học, logic và dễ hiểu — không yêu cầu nền tảng trước, không mê tín, không giáo điều. Ai cũng có thể tiếp cận được.",
    },
    {
      q: "Học qua Zoom như thế nào?",
      a: "Lớp học trực tiếp lúc 20:00 mỗi tối từ 31/7 đến 5/8. Sau khi đăng ký thành công, bạn được đưa vào nhóm Zalo của lớp — link Zoom từng buổi sẽ được gửi trong nhóm trước giờ học. Bạn chỉ cần điện thoại hoặc máy tính có mạng.",
    },
    {
      q: "Bộ tài liệu bản cứng nhận như thế nào?",
      a: "Ban tổ chức gửi bộ tài liệu về tận nhà theo địa chỉ bạn điền khi đăng ký — áp dụng cho tất cả học viên của khóa.",
    },
    {
      q: "Lỡ bận một buổi thì sao?",
      a: "Bạn nên thu xếp tham dự đầy đủ 6 buổi để trọn vẹn nội dung. Trường hợp bất khả kháng, hãy nhắn trong nhóm lớp hoặc gọi hotline để được hỗ trợ.",
    },
    {
      q: "Sau khi thanh toán tôi nhận thông tin thế nào?",
      a: "Ngay khi chuyển khoản thành công, hệ thống sẽ hiển thị link nhóm Zalo của lớp và gửi kèm vào email của bạn (nếu có điền) để nhận hướng dẫn trước khai giảng.",
    },
  ],

  note:
    "Khóa học mang tính giáo dục nhận thức và phát triển nội tâm — chia sẻ dưới góc nhìn khoa học, logic và minh triết phương Đông.",

  contact: {
    hotlines: ["0388 767 271", "0399 293 944"],
    email: "mktpranagreen01@gmail.com",
  },
};

// Định dạng tiền VND
export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}
