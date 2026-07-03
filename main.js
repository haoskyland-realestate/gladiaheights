/**
 * ARCHITECTURAL CORE ENGINE - HÀO SKY LAND LANDING PAGE (2026)
 * Author: Chuyên gia Lập trình Frontend Cấp cao
 * Version: 2.7.0 (Authorized Real-time Telegram Pipeline, Cache-Busting, Mobile Menu & Particle 3D)
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // MODULE 1: HỆ THỐNG HẠT VẬT LÝ (PARTICLE 3D)
  // ==========================================
  const ParticleEngine = {
    canvas: null,
    ctx: null,
    particlesArray: [],
    mouse: { x: null, y: null, radius: 150 }, // Bán kính tương tác nổ
    isExploding: false,
    
    init() {
      this.canvas = document.getElementById("particle-canvas");
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      
      // Đồng bộ kích thước canvas với màn hình
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());

      // Lắng nghe sự kiện click để tạo vụ nổ (Explosion/Repulse Effect)
      this.canvas.addEventListener("click", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.explode();
      });

      this.createParticles();
      this.animate();
      console.log("[Particle Engine] Đã khởi chạy hệ thống Particle 3D.");
    },

    resizeCanvas() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.parentElement.offsetWidth;
      this.canvas.height = this.canvas.parentElement.offsetHeight;
      // Khởi tạo lại hạt để phủ kín không gian mới
      if (this.particlesArray.length > 0) {
        this.createParticles();
      }
    },

    createParticles() {
      this.particlesArray = [];
      // Số lượng hạt phụ thuộc vào diện tích màn hình để tránh giật lag
      let numberOfParticles = (this.canvas.width * this.canvas.height) / 12000;
      if (numberOfParticles > 200) numberOfParticles = 200; // Giới hạn tối đa

      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * this.canvas.width;
        let y = Math.random() * this.canvas.height;
        let size = (Math.random() * 2) + 1;
        // Vận tốc gốc
        let vx = (Math.random() * 1) - 0.5;
        let vy = (Math.random() * 1) - 0.5;
        
        this.particlesArray.push({
          x: x, y: y, size: size,
          baseVx: vx, baseVy: vy, // Giữ vận tốc gốc để hồi phục
          vx: vx, vy: vy,
          mass: size * 1.5 // Khối lượng để tính toán lực đẩy
        });
      }
    },

    explode() {
      // Khi click, truyền lực đẩy mạnh vào các hạt nằm trong bán kính
      for (let i = 0; i < this.particlesArray.length; i++) {
        let p = this.particlesArray[i];
        let dx = p.x - this.mouse.x;
        let dy = p.y - this.mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius * 2) {
          // Tính toán lực văng ra xa (càng gần tâm càng văng mạnh)
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (this.mouse.radius * 2 - distance) / (this.mouse.radius * 2);
          
          p.vx += forceDirectionX * force * 15; // Hệ số nhân lực nổ
          p.vy += forceDirectionY * force * 15;
        }
      }
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = 0; i < this.particlesArray.length; i++) {
        let p = this.particlesArray[i];
        
        // Ma sát làm giảm tốc độ văng về lại tốc độ gốc
        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;

        p.x += p.vx;
        p.y += p.vy;

        // Bật tường (Bounce off edges)
        if (p.x < 0 || p.x > this.canvas.width) { p.vx *= -1; p.baseVx *= -1; }
        if (p.y < 0 || p.y > this.canvas.height) { p.vy *= -1; p.baseVy *= -1; }

        // Vẽ hạt (Màu vàng kim)
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(184, 154, 90, 0.8)";
        this.ctx.fill();
      }

      this.connect();
      requestAnimationFrame(() => this.animate());
    },

    connect() {
      // Vẽ các đường nối (mạng lưới) giữa các hạt gần nhau
      let maxDistance = 120;
      for (let a = 0; a < this.particlesArray.length; a++) {
        for (let b = a; b < this.particlesArray.length; b++) {
          let dx = this.particlesArray[a].x - this.particlesArray[b].x;
          let dy = this.particlesArray[a].y - this.particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            let opacityValue = 1 - (distance / maxDistance);
            this.ctx.strokeStyle = `rgba(184, 154, 90, ${opacityValue * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.particlesArray[a].x, this.particlesArray[a].y);
            this.ctx.lineTo(this.particlesArray[b].x, this.particlesArray[b].y);
            this.ctx.stroke();
          }
        }
      }
    }
  };

  // ==========================================
  // MODULE 2: SPA LIFECYCLE ENGINE (LÕI XỬ LÝ)
  // ==========================================
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
      
      // Kích hoạt ngay Particle 3D vì Hero section đã nằm sẵn trong index.html
      ParticleEngine.init();

      const sections = document.querySelectorAll("#app-runtime [data-section]");
      if (sections.length === 0) {
        this.initGlobalInteractions();
        return;
      }

      // Kích hoạt nạp dữ liệu không đồng bộ song song qua Promise.all
      // Bỏ qua Hero vì đã load tĩnh, chỉ fetch những file chưa có nội dung con
      const loadPromises = Array.from(sections).map(async (container) => {
        const sectionName = container.getAttribute("data-section");
        if (sectionName !== "hero") {
          return this.fetchAndInjectSection(sectionName, container);
        }
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
      this.initMobileMenu(); 
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
      // Phải querySelectorAll vì lúc này DOM đã có các element được fetch về
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
📱 *info 2:* ${info2Content}
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

  // Kích hoạt toàn bộ hệ thống
  SPALifecycleEngine.bootstrap();
});
