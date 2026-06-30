/**
 * SPA Boilerplate - Real Estate Landing Page Engine
 * Author: Frontend Senior Expert & DevOps Specialist
 * Year: 2026
 */

(function () {
  'use strict';

  // Danh sách các file cấu phần trong thư mục sections/ sắp xếp theo đúng thứ tự hiển thị
  const SECTIONS = [
    '01_hero.html',
    '02_highlights.html',
    '03_intro.html',
    '04_location.html',
    '05_amenities.html',
    '06_apartment.html',
    '07_infra.html',
    '08_overview.html',
    '09_floorplan.html',
    '10_contact.html'
  ];

  // Khởi động vòng đời ứng dụng khi DOM cây lõi sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    initAppCore();
  });

  /**
   * Quản lý vòng đời chính của ứng dụng
   */
  async function initAppCore() {
    const appRuntime = document.getElementById('app-runtime');
    if (!appRuntime) return;

    try {
      // BƯỚC 1: Xử lý Bất đồng bộ đồng nhất - Tải song song toàn bộ file qua Promise.all
      const fetchPromises = SECTIONS.map(file => 
        fetch(`sections/${file}`)
          .then(response => {
            if (!response.ok) throw new Error(`Không thể tải cấu phần: ${file}`);
            return response.text();
          })
      );

      const htmlSegments = await Promise.all(fetchPromises);

      // BƯỚC 2: Gom dữ liệu và chèn an toàn vào DOM cùng một lúc (Tránh Reflow liên tục)
      appRuntime.innerHTML = htmlSegments.join('');

      // BƯỚC 3: Kích hoạt toàn bộ mã JavaScript tương tác sau khi DOM hoàn chỉnh
      executeInteractions();
      executeTelegramFormEngine();

      // BƯỚC 4: Sửa lỗi mất mốc cuộn (Anchor Hash Deep Linking)
      handleAnchorHashRouting();

    } catch (error) {
      console.error('🔴 [SPA Engine Error]:', error);
    }
  }

  /**
   * Khởi tạo toàn bộ tương tác giao diện (Tab, Reveal, Scroll,...)
   */
  function executeInteractions() {
    // 1. Tương tác Tab Switching
    window.switchTab = function(id) {
      document.querySelectorAll('.infra-tab').forEach((t, i) => 
        t.classList.toggle('active', ['short', 'long'][ i] === id)
      );
      document.querySelectorAll('.infra-panels > div').forEach((p, i) => 
        p.classList.toggle('active', ['tab-short', 'tab-long'][ i] === 'tab-' + id)
      );
    };

    // 2. Tương tác Scroll Reveal (Sử dụng IntersectionObserver tối ưu hiệu năng)
    const observerOptions = { threshold: 0.12, rootMargin: '0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { 
        if (e.isIntersecting) { 
          e.target.classList.add('visible'); 
        } 
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 3. Hiệu ứng Navbar Shadow khi cuộn chuột
    const navbar = document.querySelector('nav');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.5)' : 'none';
      }, { passive: true });
    }

    // 4. Sự kiện click cho nút "Đặt Lịch Ngay" trên Navbar cố định
    const navCtaBtn = document.getElementById('navCtaBtn');
    if (navCtaBtn) {
      navCtaBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Engine xử lý và đóng gói dữ liệu Form gửi về Bot Telegram
   */
  function executeTelegramFormEngine() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const TELEGRAM_TOKEN = '8674808661:AAFsxIrYdIXxOSNMhaLyYxwSPTxYLtzgHVE'; 
      const TELEGRAM_CHAT_ID = '8218828728'; 

      const name = form.querySelector('[name="name"]').value;
      let phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]').value || 'Không cung cấp';
      const apartmentType = form.querySelector('[name="apartment_type"]').value;
      const purpose = form.querySelector('[name="purpose"]').value;
      const note = form.querySelector('[name="note"]').value || 'Không có';

      if (phone.startsWith('0')) {
        phone = '+84' + phone.substring(1);
      } else if (!phone.startsWith('+84') && phone.length >= 9) {
        phone = '+84' + phone;
      }

      const message = `
🔥 *CÓ KHÁCH HÀNG ĐĂNG KÝ MỚI* 🔥
━━━━━━━━━━━━━━━━━━
👤 *Info 1 (Khách hàng):* ${name}
📞 *Info 2 (Số điện thoại):* [${phone}](tel:${phone})
✉️ *Email:* ${email}
🏢 *Dự án:* Gladia Heights
🛌 *Nhu cầu:* Căn hộ ${apartmentType}
🎯 *Mục đích:* ${purpose}
📝 *Ghi chú:* ${note}
━━━━━━━━━━━━━━━━━━
📅 *Thời gian:* ${new Date().toLocaleString('vi-VN')}
      `;

      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "⚡ Đang gửi đăng ký...";
      submitBtn.disabled = true;

      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      })
      .then(response => {
        if (response.ok) {
          alert('Đăng ký thành công! Hào Sky Land sẽ liên hệ hỗ trợ Anh/Chị ngay lập tức.');
          form.reset();
        } else {
          alert('Có lỗi cấu hình từ hệ thống, vui lòng thử lại sau!');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Kết nối mạng gián đoạn, vui lòng kiểm tra lại!');
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  /**
   * Tính toán lại tọa độ hình học thực tế và tự động cuộn (Fix lỗi Anchor Hash Link)
   */
  function handleAnchorHashRouting() {
    const hash = window.location.hash;
    if (hash) {
      // Đợi Layout Engine của trình duyệt hoàn tất việc render vị trí thực tế
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          // Trừ đi chiều cao cố định của Navbar (70px) để không bị che khuất tiêu đề
          const offsetPosition = elementPosition - 70;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // 300ms là thời gian vàng tối ưu để Layout Engine ổn định diện tích hiển thị
    }
  }
})();
