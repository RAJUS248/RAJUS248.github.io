document.addEventListener("DOMContentLoaded", () => {
  
  // Standard Swiper Configuration (for Projects and Games)
  const swiperConfig = {
    slidesPerView: 1.1,
    spaceBetween: 20,
    centeredSlides: true,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2.2,
      },
      1024: {
        slidesPerView: 3,
      }
    }
  };

  // 1. Initialize Projects Swiper (Manual sliding)
  if (document.querySelector('.projectSwiper')) {
    new Swiper(".projectSwiper", swiperConfig);
  }

  // 2. Initialize Certificates Swiper (WITH AUTO-SLIDE AND AUTO-HEIGHT)
  if (document.querySelector('.certificateSwiper')) {
    new Swiper(".certificateSwiper", {
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2.2,
        },
        1024: {
          slidesPerView: 3,
        }
      },
      loop: true,
      autoHeight: true, /* <-- THIS IS THE MAGIC FIX FOR TALL IMAGES */
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      }
    });
  }

  // 3. Initialize Games Swiper (Manual sliding)
  if (document.querySelector('.gameSwiper')) {
    new Swiper(".gameSwiper", swiperConfig);
  }
});