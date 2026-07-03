/**
 * ARCHITECTURAL CORE ENGINE - HÀO SKY LAND LANDING PAGE (2026)
 * Author: Chuyên gia Lập trình Frontend Cấp cao
 * Version: 2.6.0 (Authorized Real-time Telegram Pipeline, Cache-Busting & Mobile Menu)
 */

document.addEventListener("DOMContentLoaded", () => {
  
  const SPALifecycleEngine = {
    // 1. CẤU HÌNH HỆ THỐNG GIẢM THIỂU ĐỘ TRỄ
    config: {
      sectionDir: "sections",          
      scrollOffset: 70,                
      animationDelay: 400              
    },

    // 2. KHỞI CHẠY HỆ THỐNG ĐỒNG BỘ SONG SONG (BOOTSTRAP)
    async bootstrap() {
      console.log("[SPA Engine] Khởi chạy vòng đời DOM...");
      
      const sections = document.querySelectorAll("#app-runtime [data-section]");
      if (sections.length === 0) {
        this.initGlobalInteractions();
        return;
      }

      // Kích hoạt nạp dữ liệu không đồng bộ song song qua Promise.all
      const loadPromises = Array.from(sections).map(async (container) => {
        const sectionName = container.getAttribute("data-section");
        return this.fetchAndInjectSection(sectionName, container);
      });

      await Promise.all(loadPromises);
      console.log("[SPA Engine] Toàn bộ cấu phần HTML đã được nạp vào DOM Tree ổn định.");

      // Bước tiếp theo: Kích hoạt JavaScript tương tác sau khi DOM Tree hoàn thiện
      this.initGlobalInteractions();

      // Đảm bảo tính toán lại tọa độ mốc cuộn ban đầu
      this.handleInitialAnchorHash();
    },

    // 3. TỰ ĐỘNG FETCH VÀ KHỬ CACHE TRÌNH DUYỆT (ANTI-CACHE ENGINE)
    async fetchAndInjectSection(name, container) {
      const cacheBuster = `?v=${new Date().getTime()}`;
      const filePath = `${this.config.sectionDir}/${name}.html${cacheBuster}`;
      
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        
        const htmlText = await response.text();
        container.innerHTML = htmlText;
        console.log(`[Fetch Success] Đã nạp cấu phần: ${name}`);
      } catch (error) {
        console.error(`[Fetch Error] Thất bại khi nạp file: ${filePath}`, error);
        container.innerHTML = `
          <div style="padding: 50px 20px; text-align: center; color: var(--gold); border: 1px dashed var(--gold);">
            <p>Hệ thống đang cập nhật cấu phần <strong>${name}</strong>.</p>
          </div>
        `;
      }
    },

    // 4. QUẢN LÝ TƯƠNG TÁC ĐỘNG (INTERACTION LAYER)
    initGlobalInteractions() {
      this.initNavbarTracing();
      this.initSmoothAnchorNavigation();
      this.initTabSwitching();
      this.initScrollReveal();
      this.initTelegramLeadCapture();
      this.initMobileMenu(); // Bổ sung Module Menu Mobile
    },

    // 4.1. Thanh chỉ báo tiến trình cuộn trang & Kiểu dáng Nav
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

    // 4.2. Mốc cuộn mượt Anchor Link nội bộ
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

    // 4.3. Logic Chuyển đổi Tab (Mặt Bằng / Hạ Tầng) qua Event Delegation
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

    // 4.4. Hiệu ứng Xuất hiện tiệm tiến (Fade-In Reveal)
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

    // 4.5. ĐÃ XÁC THỰC BẢO MẬT: Đón chặn form và truyền dữ liệu real-time về Telegram Bot
    initTelegramLeadCapture() {
      const runtimeContainer = document.getElementById("app-runtime");
      if (!runtimeContainer) return;

      // Event Delegation: Lắng nghe Submit của CẢ Form Tổng Quan lẫn Liên Hệ
      runtimeContainer.addEventListener("submit", async (e) => {
        if (e.target && (e.target.id === "contactForm" || e.target.id === "heroLeadForm")) {
          e.preventDefault();
          const form = e.target;
          const submitBtn = form.querySelector(".form-submit") || form.querySelector(".submit-btn");
          
          if (submitBtn) {
            submitBtn.innerText = "ĐANG KHỞI TẠO ĐƠN ĐĂNG KÝ...";
            submitBtn.disabled = true;
          }

          // Định dạng số điện thoại tự động sang đầu số quốc tế +84
          const formatPhoneNumber = (phone) => {
            let cleaned = phone.replace(/\D/g, ''); 
            if (cleaned.startsWith('0')) {
              cleaned = '+84' + cleaned.slice(1);
            } else if (cleaned.startsWith('84') && !cleaned.startsWith('+84')) {
              cleaned = '+' + cleaned;
            } else if (!cleaned.startsWith('+84') && cleaned.length > 0) {
              cleaned = '+84' + cleaned;
            }
            return cleaned;
          };

          // Trích xuất thông tin an toàn thông qua các nhãn và thuộc tính name
          const nameValue = form.querySelector('[name="name"]')?.value.trim() || "Không cung cấp";
          let phoneValue = form.querySelector('[name="phone"]')?.value.trim() || "";
          const emailValue = form.querySelector('[name="email"]')?.value.trim() || "";
          const apartmentType = form.querySelector('[name="apartment_type"]')?.value || "Chưa chọn";
          const purposeValue = form.querySelector('[name="purpose"]')?.value || "Chưa chọn";
          const noteValue = form.querySelector('[name="note"]')?.value.trim() || "Trống";

          if (phoneValue) {
            phoneValue = formatPhoneNumber(phoneValue);
          }

          // Đồng bộ chuẩn dữ liệu CRM: Ưu tiên Mail nếu có, dồn vào Info 2
          let info2Content = emailValue ? `✉️ Email ưu tiên: ${emailValue}\n📞 ĐT: ${phoneValue}` : `📞 ĐT: ${phoneValue}`;

          // TOKEN VÀ CHAT ID THỰC TẾ
          const BOT_TOKEN = '8674808661:AAFsxIrYdIXxOSNMhaLyYxwSPTxYLtzgHVE';
          const CHAT_ID = '8218828728';
          
          // Mẫu template thông báo chuẩn hóa CRM (Tuyệt đối không dùng STT, sử dụng info 1 và info 2)
          const telegramMessage = 
`🔥 *CÓ KHÁCH HÀNG ĐĂNG KÝ MỚI* 🔥
━━━━━━━━━━━━━━━━━━
👤 *info 1:* ${nameValue}
📱 *info 2:* 
${info2Content}
🏢 *Dự án:* Gladia Heights
🛌 *Nhu cầu:* ${apartmentType}
🎯 *Mục đích:* ${purposeValue}
📝 *Ghi chú:* ${noteValue}
━━━━━━━━━━━━━━━━━━
📅 *Thời gian:* ${new Date().toLocaleString('vi-VN')}`;

          try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: "Markdown"
              })
            });
            
            if (!response.ok) throw new Error("Telegram Bot API Response Critical Error");
            
            alert("Đăng ký nhận tư vấn thành công! Chúng tôi sẽ liên hệ trực tiếp đến Chị để tư vấn bài toán dòng tiền trong 15 phút.");
            form.reset();
          } catch (err) {
            console.error("[Form Submit Error]", err);
            alert("Hệ thống xử lý đang bận. Chị vui lòng liên hệ trực tiếp qua Hotline: 0986 986 049.");
          } finally {
            if (submitBtn) {
              // Khôi phục lại text gốc tùy theo form
              submitBtn.innerText = form.id === "contactForm" ? "✦ Gửi Đăng Ký Ngay" : "TÔI MUỐN NHẬN NGAY";
              submitBtn.disabled = false;
            }
          }
        }
      });
    },

    // 4.6. ĐIỀU KHIỂN MENU MOBILE (BỔ SUNG CHO TÍNH NĂNG 3 GẠCH Ở INDEX.HTML)
    initMobileMenu() {
      const menuBtn = document.getElementById("mobileMenuBtn");
      const navLinks = document.getElementById("navLinks");
      
      if(menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
          navLinks.classList.toggle("active");
        });

        // Tự động đóng menu khi bấm vào bất kỳ liên kết nào
        navLinks.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", () => {
            navLinks.classList.remove("active");
          });
        });
      }
    },

    // 5. KHẮC PHỤC TRIỆT ĐỂ LỖI MẤT MỐC CUỘN ANCHOR HASH VÀ NHẢY TRANG
    handleInitialAnchorHash() {
      const currentHash = window.location.hash;
      
      // Nếu không có hash, hoặc hash là dấu # trống, hoặc hash trỏ thẳng vào vùng contact/lien-he lúc mới vào
      if (!currentHash || currentHash === "#" || currentHash === "#contact" || currentHash === "#lien-he") {
        // Ép trình duyệt đứng im tại tọa độ đỉnh đầu trang (Top: 0, Left: 0)
        window.scrollTo({ top: 0, left: 0 });
        return;
      }

      // Trì hoãn nhẹ để đợi layout của toàn bộ các file con tính toán xong chiều cao thực tế
      setTimeout(() => {
        try {
          const targetSection = document.querySelector(currentHash);
          if (targetSection) {
            this.scrollToTargetElement(targetSection);
          }
        } catch (e) {
          console.warn("[SPA Engine] Sai định dạng thẻ điều hướng:", e);
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

  SPALifecycleEngine.bootstrap();
});
