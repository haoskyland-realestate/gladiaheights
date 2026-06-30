/**
 * ARCHITECTURAL CORE ENGINE - HÀO SKY LAND LANDING PAGE (2026)
 * Author: Chuyên gia Lập trình Frontend Cấp cao
 * Version: 2.3.0 (Anti-Caching Engine & Zero-Error Lifecycle)
 */

document.addEventListener("DOMContentLoaded", () => {
  
  const SPALifecycleEngine = {
    // 1. CẤU HÌNH HỆ THỐNG
    config: {
      sectionDir: "sections",          // Thư mục chứa các file HTML cấu phần
      scrollOffset: 70,                // Bù trừ chiều cao của Fixed Navbar (70px)
      animationDelay: 400              // Độ trễ tính toán lại layout sau khi nạp ảnh (ms)
    },

    // 2. KHỞI CHẠY HỆ THỐNG (BOOTSTRAP)
    async bootstrap() {
      console.log("[SPA Engine] Khởi chạy vòng đời DOM...");
      
      // Quét tự động tất cả các cấu phần dựa trên data-section hiện có trong #app-runtime
      const sections = document.querySelectorAll("#app-runtime [data-section]");
      
      if (sections.length === 0) {
        this.initGlobalInteractions();
        return;
      }

      // Kích hoạt cơ chế Fetch song song (Parallel Request) để tối ưu băng thông
      const loadPromises = Array.from(sections).map(async (container) => {
        const sectionName = container.getAttribute("data-section");
        return this.fetchAndInjectSection(sectionName, container);
      });

      // Chờ toàn bộ các cấu phần được tiêm (inject) vào DOM thành công
      await Promise.all(loadPromises);
      console.log("[SPA Engine] Toàn bộ cấu phần HTML đã được nạp vào DOM Tree ổn định.");

      // Kích hoạt toàn bộ mã JavaScript tương tác sau khi DOM Tree hoàn thiện
      this.initGlobalInteractions();

      // Xử lý mốc cuộn trang (Anchor Hash) nếu khách hàng truy cập trực tiếp bằng link định danh
      this.handleInitialAnchorHash();
    },

    // 3. TỰ ĐỘNG FETCH VÀ TRUYỀN DỮ LIỆU VÀO DOM (CÓ CACHE-BUSTING)
    async fetchAndInjectSection(name, container) {
      // Thêm tham số timestamp (?v=...) để phá vỡ bộ nhớ đệm cache của trình duyệt, ép nạp file mới nhất
      const cacheBuster = `?v=${new Date().getTime()}`;
      const filePath = `${this.config.sectionDir}/${name}.html${cacheBuster}`;
      
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        
        const htmlText = await response.text();
        container.innerHTML = htmlText;
        console.log(`[Fetch Success] Đã nạp cấu phần: ${name}`);
      } catch (error) {
        console.error(`[Fetch Critical Error] Thất bại khi nạp file: ${filePath}`, error);
        container.innerHTML = `
          <div style="padding: 50px 20px; text-align: center; color: var(--gold); border: 1px dashed var(--gold);">
            <p>Hệ thống đang cập nhật cấu phần <strong>${name}</strong>. Vui lòng quay lại sau.</p>
          </div>
        `;
      }
    },

    // 4. QUẢN LÝ TOÀN BỘ SỰ KIỆN TƯƠNG TÁC ĐỘNG (INTERACTION LAYER)
    initGlobalInteractions() {
      this.initNavbarTracing();
      this.initSmoothAnchorNavigation();
      this.initTabSwitching();
      this.initScrollReveal();
      this.initTelegramLeadCapture();
    },

    // 4.1. Tiến trình cuộn trang & Đổi kiểu dáng Navbar khi lướt trang
    initNavbarTracing() {
      const nav = document.querySelector("nav");
      const progressIndicator = document.getElementById("scrollIndicator");
      if (!nav && !progressIndicator) return;

      window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        
        if (progressIndicator) progressIndicator.style.width = `${scrolled}%`;

        if (window.scrollY > 40) {
          nav.style.background = "rgba(14, 14, 14, 0.96)";
          nav.style.height = "65px";
          nav.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
        } else {
          nav.style.background = "rgba(14, 14, 14, 0.85)";
          nav.style.height = "70px";
          nav.style.boxShadow = "none";
        }
      });
    },

    // 4.2. Smooth Scroll Anchor cho toàn bộ liên kết nội bộ
    initSmoothAnchorNavigation() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute("href");
          if (targetId === "#") return;

          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            this.scrollToTargetElement(targetElement);
            history.pushState(null, null, targetId);
          }
        });
      });
    },

    // 4.3. Chuyển đổi Tab (Mặt Bằng / Hạ Tầng) sử dụng Event Delegation
    initTabSwitching() {
      const runtimeContainer = document.getElementById("app-runtime");
      if (!runtimeContainer) return;

      runtimeContainer.addEventListener("click", (e) => {
        const tabButton = e.target.closest(".infra-tab");
        if (!tabButton) return;

        const tabGroup = tabButton.closest(".infra-tabs");
        if (!tabGroup) return;

        const targetTabId = tabButton.getAttribute("data-tab");
        const panelContainer = tabGroup.nextElementSibling;

        if (!panelContainer || !targetTabId) return;

        tabGroup.querySelectorAll(".infra-tab").forEach(t => t.classList.remove("active"));
        panelContainer.querySelectorAll(".infra-panels > div").forEach(p => p.classList.remove("active"));

        tabButton.classList.add("active");
        const targetPanel = panelContainer.querySelector(`#${targetTabId}`);
        if (targetPanel) targetPanel.classList.add("active");
      });
    },

    // 4.4. Hiệu ứng Xuất hiện tiệm tiến (Fade-In Reveal) qua Intersection Observer API
    initScrollReveal() {
      const reveals = document.querySelectorAll(".reveal");
      if (reveals.length === 0) return;

      const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      };

      const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      });

      reveals.forEach(el => revealObserver.observe(el));
    },

    // 4.5. Xử lý Biểu mẫu Đăng ký & Đồng bộ Định dạng Dữ liệu đưa về Telegram Bot
    initTelegramLeadCapture() {
      const runtimeContainer = document.getElementById("app-runtime");
      if (!runtimeContainer) return;

      runtimeContainer.addEventListener("submit", async (e) => {
        if (e.target && e.target.id === "leadForm") {
          e.preventDefault();
          const form = e.target;
          const submitBtn = form.querySelector(".form-submit");
          
          if (submitBtn) {
            submitBtn.innerText = "ĐANG KHỞI TẠO ĐƠN ĐĂNG KÝ VÀO HỆ THỐNG...";
            submitBtn.disabled = true;
          }

          // Chuẩn hóa định dạng số điện thoại sang đầu số quốc tế +84
          const formatPhoneNumber = (phone) => {
            let cleaned = phone.replace(/\D/g, ''); 
            if (cleaned.startsWith('0')) {
              cleaned = '+84' + cleaned.slice(1);
            } else if (cleaned.startsWith('84') && !cleaned.startsWith('+84')) {
              cleaned = '+' + cleaned;
            } else if (!cleaned.startsWith('+84')) {
              cleaned = '+84' + cleaned;
            }
            return cleaned;
          };

          const nameValue = form.querySelector("#formName")?.value.trim() || "Không cung cấp";
          let phoneValue = form.querySelector("#formPhone")?.value.trim() || "";
          const emailValue = form.querySelector("#formEmail")?.value.trim() || "Không cung cấp";
          const apartmentType = form.querySelector("#formProduct")?.value || "Chưa xác định";
          const purposeValue = form.querySelector("#formPurpose")?.value || "Tư vấn đầu tư / dòng tiền";
          const noteValue = form.querySelector("#formNote")?.value.trim() || "Trống";

          if (phoneValue) {
            phoneValue = formatPhoneNumber(phoneValue);
          } else {
            phoneValue = "Không cung cấp";
          }

          // CẤU HÌNH BOT TELEGRAM CỦA BẠN
          const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN_HERE";
          const CHAT_ID = "YOUR_TELEGRAM_CHAT_ID_HERE";
          
          const telegramMessage = 
`🔥 *CÓ KHÁCH HÀNG ĐĂNG KÝ MỚI* 🔥
━━━━━━━━━━━━━━━━━━
👤 *Info 1 (Khách hàng):* ${nameValue}
📞 *Info 2 (Số điện thoại):* [${phoneValue}](tel:${phoneValue})
✉️ *Email:* ${emailValue}
🏢 *Dự án:* Gladia Heights
🛌 *Nhu cầu:* Căn hộ ${apartmentType}
🎯 *Mục đích:* ${purposeValue}
📝 *Ghi chú:* ${noteValue}
━━━━━━━━━━━━━━━━━━
📅 *Thời gian:* ${new Date().toLocaleString('vi-VN')}`;

          try {
            if (BOT_TOKEN !== "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
              const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: CHAT_ID,
                  text: telegramMessage,
                  parse_mode: "Markdown"
                })
              });
              
              if (!response.ok) throw new Error("Telegram API Request Error");
            } else {
              console.log("[Simulation Mode] Nội dung bản tin gửi đi:\n", telegramMessage);
            }

            alert("Đăng ký nhận thông tin thành công! Hào Sky Land sẽ liên hệ trực tiếp đến Chị để tư vấn bài toán dòng tiền trong 15 phút.");
            form.reset();
          } catch (err) {
            console.error("[Form Submit Error]", err);
            alert("Hệ thống xử lý đang bận. Chị vui lòng liên hệ trực tiếp qua Hotline: 0986 986 049.");
          } finally {
            if (submitBtn) {
              submitBtn.innerText = "ĐĂNG KÝ NHẬN QUỸ CĂN CHI TIẾT";
              submitBtn.disabled = false;
            }
          }
        }
      });
    },

    // 5. KHẮC PHỤC LỖI MẤT MỐC CUỘN DO ĐỘ TRỄ FETCH
    handleInitialAnchorHash() {
      const currentHash = window.location.hash;
      if (!currentHash) return;

      setTimeout(() => {
        const targetSection = document.querySelector(currentHash);
        if (targetSection) {
          console.log(`[Anchor Adjust] Định vị thành công mốc cuộn ban đầu: ${currentHash}`);
          this.scrollToTargetElement(targetSection);
        }
      }, this.config.animationDelay);
    },

    scrollToTargetElement(element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - this.config.scrollOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Khởi chạy lõi ứng dụng
  SPALifecycleEngine.bootstrap();
});
