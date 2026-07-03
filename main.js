/**
 * SENIOR SPA ENGINE - BY HÀO SKY LAND (2026)
 * - Tự động nạp song song (Promise.all)
 * - Event Delegation toàn cục (Bypass XSS block form Telegram)
 * - Quản lý DOM Lifecycle & Anchor Hash Navigation
 */

document.addEventListener("DOMContentLoaded", () => {
  const AppEngine = {
    config: {
      telegramToken: '8674808661:AAFsxIrYdIXxOSNMhaLyYxwSPTxYLtzgHVE', 
      telegramChatId: '8218828728'
    },

    // 1. KHỞI TẠO VÒNG ĐỜI
    async init() {
      // Bật Màn hình chờ (Loader) nếu anh đã định nghĩa trong HTML, nếu không sẽ bỏ qua
      const loader = document.getElementById('global-loader');
      if (loader) loader.style.opacity = '1';

      // Nạp cấu phần HTML
      await this.loadPartials();

      // Sau khi DOM đã render đủ -> Kích hoạt tính năng
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 600);
      }

      this.bindMobileMenu();
      this.bindDelegatedEvents();
      this.initScrollReveal();
      this.initScrollProgress();
      this.resolveAnchorHash();
    },

    // 2. FETCH SONG SONG ĐỂ ĐẨY NHANH TỐC ĐỘ TẢI TRANG
    async loadPartials() {
      const placeholders = document.querySelectorAll("#app-runtime [data-section]");
      if (placeholders.length === 0) return;

      const fetchJobs = Array.from(placeholders).map(async (container) => {
        const sectionName = container.getAttribute("data-section");
        const url = `sections/${sectionName}.html?v=${Date.now()}`; 
        try {
          const response = await fetch(url);
          if (response.ok) {
            container.innerHTML = await response.text();
          }
        } catch (error) {
          console.error(`[Lỗi nạp cấu phần] ${sectionName}`, error);
        }
      });

      // Bắt buộc chờ TẤT CẢ HTML chèn vào xong mới đi tiếp
      await Promise.all(fetchJobs);
    },

    // 3. XỬ LÝ SỰ KIỆN TOÀN CỤC (EVENT DELEGATION) CHO FORM TELEGRAM
    bindDelegatedEvents() {
      const runtime = document.getElementById("app-runtime");
      
      runtime.addEventListener("submit", async (e) => {
        const form = e.target.closest("form");
        if (!form) return;
        
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerText : "GỬI ĐĂNG KÝ";
        if (submitBtn) { submitBtn.innerText = "ĐANG ĐỒNG BỘ..."; submitBtn.disabled = true; }

        try {
          // Trích xuất dữ liệu
          const formData = new FormData(form);
          const nameVal = formData.get("name")?.trim() || "Chưa cung cấp";
          let rawPhone = formData.get("phone")?.trim() || "";
          const emailVal = formData.get("email")?.trim() || "";
          
          // Các trường option thêm tuỳ theo Form (Overview hoặc Contact)
          const aptVal = formData.get("apartment_type") || "Chưa xác định";
          const purposeVal = formData.get("purpose") || "Chưa xác định";
          const noteVal = formData.get("note")?.trim() || "Trống";

          // Chuẩn hóa định dạng số điện thoại +84 (Loại bỏ ký tự không phải số)
          let cleanPhone = rawPhone.replace(/\D/g, '');
          if (cleanPhone.startsWith('0')) cleanPhone = '+84' + cleanPhone.slice(1);
          else if (cleanPhone.startsWith('84') && !cleanPhone.startsWith('+84')) cleanPhone = '+' + cleanPhone;
          else if (!cleanPhone.startsWith('+84')) cleanPhone = '+84' + cleanPhone;

          // Xây dựng chuỗi Info 2 (Ưu tiên Email theo quy định)
          let info2 = emailVal ? `✉️ Email: ${emailVal}\n📞 ĐT: ${cleanPhone}` : `📞 ĐT: ${cleanPhone}`;

          // Format tin nhắn Telegram
          const mdMessage = 
`🔥 *ĐĂNG KÝ MỚI TỪ GLADIA HEIGHTS* 🔥
━━━━━━━━━━━━━━━━━━
👤 *Info 1:* ${nameVal}
📱 *Info 2:* 
${info2}
🏢 *Quan tâm:* ${aptVal}
🎯 *Mục đích:* ${purposeVal}
📝 *Ghi chú:* ${noteVal}
━━━━━━━━━━━━━━━━━━
📅 *Nguồn:* Website Chính Thức`;

          await fetch(`https://api.telegram.org/bot${this.config.telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: this.config.telegramChatId, text: mdMessage, parse_mode: 'Markdown' })
          });

          alert("Đăng ký thành công! Đội ngũ Hào Sky Land sẽ liên hệ tư vấn trong thời gian sớm nhất.");
          form.reset();
        } catch (err) {
          console.error(err);
          alert("Lỗi kết nối. Vui lòng thử lại hoặc gọi trực tiếp Hotline.");
        } finally {
          if (submitBtn) { submitBtn.innerText = originalText; submitBtn.disabled = false; }
        }
      });
    },

    // 4. XỬ LÝ MENU MOBILE (3 GẠCH)
    bindMobileMenu() {
      const menuBtn = document.getElementById("mobileMenuBtn");
      const navLinks = document.getElementById("navLinks");
      
      if(menuBtn && navLinks) {
        // Bật/tắt menu
        menuBtn.addEventListener("click", () => {
          navLinks.classList.toggle("active");
        });

        // Khi bấm vào 1 link thì tự động đóng menu lại
        navLinks.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", () => {
            navLinks.classList.remove("active");
          });
        });
      }
    },

    // 5. HIỆU ỨNG REVEAL CHUẨN XÁC
    initScrollReveal() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    },

    // 6. THANH TIẾN TRÌNH CUỘN TRANG
    initScrollProgress() {
      const indicator = document.getElementById("scrollIndicator");
      if(!indicator) return;
      window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + "%";
      });
    },

    // 7. XỬ LÝ LỖI MẤT MỐC CUỘN HASH LINK
    resolveAnchorHash() {
      const hash = window.location.hash;
      if (hash && hash !== "#") {
        setTimeout(() => {
          const target = document.querySelector(hash);
          if (target) {
            const yOffset = -80; // Bù khoảng trống cho Navbar
            const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 500); // Chờ 500ms để DOM bung đủ layout
      }
    }
  };

  // Khởi động Engine
  AppEngine.init();
});
