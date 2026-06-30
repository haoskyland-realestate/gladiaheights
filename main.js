/**
 * ARCHITECTURAL CORE ENGINE - HÀO SKY LAND LANDING PAGE (2026)
 * Author: Chuyên gia Lập trình Frontend Cấp cao
 * Version: 2.1.0 (High-End Animation & Zero-Error Lifecycle)
 */

document.addEventListener("DOMContentLoaded", () => {
  
  const SPALifecycleEngine = {
    // 1. CẤU HÌNH HỆ THỐNG
    config: {
      sectionDir: "sections",          // Thư mục chứa các file HTML cấu phần
      scrollOffset: 70,                // Bù trừ chiều cao của Fixed Navbar (70px)
      animationDelay: 300              // Độ trễ tính toán lại layout trước khi cuộn (ms)
    },

    // 2. KHỞI CHẠY HỆ THỐNG (BOOTSTRAP)
    async bootstrap() {
      console.log("[SPA Engine] Khởi chạy vòng đời DOM...");
      
      // Bước 1: Quét tự động tất cả các cấu phần dựa trên data-section hiện có trong DOM ban đầu
      const sections = document.querySelectorAll("#app-runtime [data-section]");
      
      if (sections.length === 0) {
        console.warn("[SPA Engine] Không tìm thấy thẻ giữ chỗ nào trong #app-runtime.");
        this.initGlobalInteractions();
        return;
      }

      // Bước 2: Kích hoạt cơ chế Fetch song song (Parallel Request) để tối ưu băng thông
      const loadPromises = Array.from(sections).map(async (container) => {
        const sectionName = container.getAttribute("data-section");
        return this.fetchAndInjectSection(sectionName, container);
      });

      // Chờ toàn bộ các cấu phần được tiêm (inject) vào DOM thành công
      await Promise.all(loadPromises);
      console.log("[SPA Engine] Toàn bộ cấu phần HTML đã được nạp vào DOM Tree ổn định.");

      // Bước 3: Kích hoạt toàn bộ mã JavaScript tương tác sau khi DOM Tree hoàn thiện
      this.initGlobalInteractions();

      // Bước 4: Xử lý mốc cuộn trang (Anchor Hash) nếu khách hàng truy cập trực tiếp qua link định danh
      this.handleInitialAnchorHash();
    },

    // 3. TỰ ĐỘNG FETCH VÀ TRUYỀN DỮ LIỆU VÀO DOM
    async fetchAndInjectSection(name, container) {
      const filePath = `${this.config.sectionDir}/${name}.html`;
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        
        const htmlText = await response.text();
        container.innerHTML = htmlText;
        
        console.log(`[Fetch Success] Đã nạp cấu phần: ${name}`);
      } catch (error) {
        console.error(`[Fetch Critical Error] Thất bại khi nạp file: ${filePath}`, error);
        // Thiết kế Fallback UI bảo vệ trải nghiệm người dùng
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

    // 4.1. Hiệu ứng Tiến trình cuộn trang & Đổi kiểu dáng Navbar (Premium Luxury Feel)
    initNavbarTracing() {
      const nav = document.querySelector("nav");
      const progressIndicator = document.getElementById("scrollIndicator");
      
      if (!nav && !progressIndicator) return;

      window.addEventListener("scroll", () => {
        // Tối ưu hóa hiệu năng tính toán toán học tiến trình cuộn
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        
        if (progressIndicator) {
          progressIndicator.style.width = `${scrolled}%`;
        }

        // Tạo hiệu ứng mờ nhòe bám dính khi cuộn trang
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

    // 4.2. Điều khiển Cuộn mượt cho toàn bộ các thẻ liên kết nội bộ (Smooth Scroll Anchor)
    initSmoothAnchorNavigation() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute("href");
          if (targetId === "#") return;

          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            this.scrollToTargetElement(targetElement);
            // Đẩy mốc hash lên thanh URL của trình duyệt một cách tự nhiên mà không gây nhảy trang đột ngột
            history.pushState(null, null, targetId);
          }
        });
      });
    },

    // 4.3. Logic Chuyển đổi Tab linh hoạt (Áp dụng cho cấu phần Hạ Tầng / Mặt Bằng)
    initTabSwitching() {
      // Sử dụng cơ chế Ủy quyền sự kiện (Event Delegation) để tránh lỗi gán sự kiện nếu cấu trúc thay đổi
      const runtimeContainer = document.getElementById("app-runtime");
      if (!runtimeContainer) return;

      runtimeContainer.addEventListener("click", (e) => {
        const tabButton = e.target.closest(".infra-tab");
        if (!tabButton) return;

        const tabGroup = tabButton.closest(".infra-tabs");
        if (!tabGroup) return;

        const targetTabId = tabButton.getAttribute("data-tab");
        const panelContainer = tabGroup.nextElementSibling; // Tìm thẻ .infra-panels kế tiếp

        if (!panelContainer || !targetTabId) return;

        // Xóa trạng thái active của nhóm tab hiện tại
        tabGroup.querySelectorAll(".infra-tab").forEach(t => t.classList.remove("active"));
        // Ẩn tất cả các panel bên trong cấu phần này
        panelContainer.querySelectorAll(".infra-panels > div").forEach(p => p.classList.remove("active"));

        // Kích hoạt trạng thái active cho cấu phần được chọn
        tabButton.classList.add("active");
        const targetPanel = panelContainer.querySelector(`#${targetTabId}`);
        if (targetPanel) {
          targetPanel.classList.add("active");
        }
      });
    },

    // 4.4. Hiệu ứng Xuất hiện tiệm tiến (Fade-In Reveal) khi cuộn trang chuyên nghiệp
    initScrollReveal() {
      const reveals = document.querySelectorAll(".reveal");
      if (reveals.length === 0) return;

      const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Huỷ theo dõi phần tử sau khi đã hiển thị để tối ưu tài nguyên CPU đồ họa
            observer.unobserve(entry.target);
          }
        });
      };

      // Ứng dụng Intersection Observer API cao cấp thay thế cho sự kiện scroll truyền thống
      const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.12, // Kích hoạt khi 12% phần tử xuất hiện trong khung nhìn
        rootMargin: "0px 0px -40px 0px"
      });

      reveals.forEach(el => revealObserver.observe(el));
    },

    // 4.5. Xử lý biểu mẫu thu thập thông tin khách hàng - Tích hợp bot API Telegram
    initTelegramLeadCapture() {
      const runtimeContainer = document.getElementById("app-runtime");
      if (!runtimeContainer) return;

      // Đón chặn sự kiện submit biểu mẫu bằng kỹ thuật Event Delegation bảo mật
      runtimeContainer.addEventListener("submit", async (e) => {
        if (e.target && e.target.id === "leadForm") {
          e.preventDefault();
          const form = e.target;
          const submitBtn = form.querySelector(".form-submit");
          
          // Tránh lỗi click đúp phá hoại tiến trình gửi dữ liệu (Double Submit Prevention)
          if (submitBtn) {
            submitBtn.innerText = "ĐANG GỬI THÔNG TIN KHÁCH HÀNG...";
            submitBtn.disabled = true;
          }

          // Trích xuất dữ liệu form an toàn
          const nameInput = form.querySelector("#formName");
          const phoneInput = form.querySelector("#formPhone");
          const emailInput = form.querySelector("#formEmail");
          const productSelect = form.querySelector("#formProduct");

          const leadData = {
            name: nameInput ? nameInput.value.trim() : "Không cung cấp",
            phone: phoneInput ? phoneInput.value.trim() : "Không cung cấp",
            email: emailInput ? emailInput.value.trim() : "Không cung cấp",
            product: productSelect ? productSelect.value : "Chưa chọn nhu cầu"
          };

          // --- CẤU HÌNH LIÊN KẾT API TELEGRAM CHUYÊN NGHIỆP ---
          // Bạn hãy thay các chuỗi thông tin thực tế của Bot Token và Chat ID của bạn vào đây
          const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN_HERE";
          const CHAT_ID = "YOUR_TELEGRAM_CHAT_ID_HERE";
          
          const telegramMessage = 
            `🔔 **YÊU CẦU ĐĂNG KÝ MỚI - GLADIA BY THE WATERS** 🔔\n\n` +
            `👤 **Khách hàng:** ${leadData.name}\n` +
            `📞 **Số điện thoại:** ${leadData.phone}\n` +
            `✉️ **Email:** ${leadData.email}\n` +
            `🏢 **Sản phẩm quan tâm:** ${leadData.product}\n\n` +
            `⏱ *Thời gian:* ${new Date().toLocaleString('vi-VN')}\n` +
            `🌐 *Nguồn gốc:* Hào Sky Land Premium Page`;

          try {
            // Chỉ chạy API khi bạn đã khai báo token thực tế
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
              
              if (!response.ok) throw new Error("Telegram API Network Response Error");
            } else {
              console.log("[Simulation Mode] Thông tin Khách hàng thu thập thành công:", leadData);
            }

            alert("Đăng ký nhận thông tin thành công! Hào Sky Land sẽ liên hệ trực tiếp đến Chị để tư vấn bài toán dòng tiền trong 15 phút.");
            form.reset();
          } catch (err) {
            console.error("[Form Error] Lỗi hệ thống truyền tải dữ liệu:", err);
            alert("Hệ thống xử lý đang bận. Chị vui lòng liên hệ trực tiếp qua số Hotline: 0986 986 049 để nhận thông tin ngay lập tức.");
          } finally {
            if (submitBtn) {
              submitBtn.innerText = "ĐĂNG KÝ NHẬN QUỸ CĂN CHI TIẾT";
              submitBtn.disabled = false;
            }
          }
        }
      });
    },

    // 5. GIẢI QUYẾT TRIỆT ĐỂ LỖI MẤT MỐC CUỘN (ANCHOR HASH LOSS)
    handleInitialAnchorHash() {
      const currentHash = window.location.hash;
      if (!currentHash) return;

      // Trì hoãn một nhịp nhỏ để trình duyệt hoàn tất việc định vị lại cấu trúc tọa độ trang hình ảnh và phông chữ
      setTimeout(() => {
        const targetSection = document.querySelector(currentHash);
        if (targetSection) {
          console.log(`[Anchor Adjust] Định vị thành công mốc cuộn ban đầu: ${currentHash}`);
          this.scrollToTargetElement(targetSection);
        }
      }, this.config.animationDelay);
    },

    // Hàm tiện ích hỗ trợ tính toán tọa độ cuộn trừ khoảng trống thanh điều hướng linh hoạt
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
