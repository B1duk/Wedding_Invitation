// ===== Таймер обратного отсчёта =====
document.addEventListener('DOMContentLoaded', function() {
  const countdownElement = document.getElementById('countdown');
  
  if (countdownElement) {
    const targetDate = new Date(countdownElement.getAttribute('data-target-date')).getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      daysEl.textContent = days.toString().padStart(2, '0');
      hoursEl.textContent = hours.toString().padStart(2, '0');
      minutesEl.textContent = minutes.toString().padStart(2, '0');
      secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
  
  // ===== Плавная прокрутка =====
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', function() {
      document.querySelector('.greeting').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // ===== КАРУСЕЛЬ ПОЖЕЛАНИЙ (свайпы + точки) =====
  const carousel = document.getElementById('wishesCarousel');
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (carousel && track && slides.length > 0) {
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    
    // Переключение слайда
    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Обновляем точки
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    // Обработчик точек
    dots.forEach(dot => {
      dot.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        goToSlide(slideIndex);
      });
    });
    
    // Свайпы для мобильных
    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      
      // Предотвращаем скролл страницы при горизонтальном свайпе
      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
    }, { passive: false });
    
    carousel.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      // Если свайп больше 50px — переключаем слайд
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1); // свайп влево → следующий
        } else {
          goToSlide(currentIndex - 1); // свайп вправо → предыдущий
        }
      }
    });
    
    // Клик по старым точкам (для совместимости)
    const oldNavDots = document.querySelectorAll('.wishes-nav .nav-dot');
    oldNavDots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        oldNavDots.forEach(d => d.classList.remove('active'));
        this.classList.add('active');
        goToSlide(index);
      });
    });
  }
});