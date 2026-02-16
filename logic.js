(function() {
  "use strict";

  // 1. PRELOADER
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        if (preloader.parentNode) preloader.style.display = 'none';
      }, 1000);
    }, 1800);
  }

  // 2. Lenis – mobile‑optimized
  const lenis = new Lenis({
    duration: 1.2,                // slightly shorter for mobile
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 0.8,          // even lower for smoother mobile response
  });

  // 3. GSAP + ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  lenis.on('scroll', ScrollTrigger.update);

  // Mobile detection
  const isMobile = window.matchMedia("(max-width: 700px)").matches;

  // 4. IMAGE 3D EFFECT – simplified on mobile
  const images = document.querySelectorAll('.story-image');
  images.forEach((img, idx) => {
    const dirY = idx % 2 === 0 ? 1.2 : -1.5;
    const dirX = idx % 3 === 0 ? 0.9 : -1.2;
    const section = img.closest('.section');

    if (isMobile) {
      // Mobile: only rotateY, smaller angles, lower scrub
      gsap.fromTo(img, {
        rotateY: -6 * dirY,          // reduced from 12
        z: -10,
      }, {
        rotateY: 9 * dirY,            // reduced from 18
        z: 15,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,                  // much lower frequency
          invalidateOnRefresh: true,
        }
      });
    } else {
      // Desktop: full effect
      gsap.fromTo(img, {
        rotateY: -12 * dirY,
        rotateX: 7 * dirX,
        z: -30,
      }, {
        rotateY: 18 * dirY,
        rotateX: -10 * dirX,
        z: 35,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          invalidateOnRefresh: true,
        }
      });
    }
  });

  // 5. WRAPPER MOVEMENT – disabled on mobile
  if (!isMobile) {
    const wrappers = document.querySelectorAll('.image-3d');
    wrappers.forEach((wrap, i) => {
      gsap.to(wrap, {
        rotationY: i % 2 === 0 ? 6 : -5,
        rotationX: i % 3 === 0 ? 3 : -4,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: wrap.closest('.section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        }
      });
    });
  }

 
  const progressFill = document.getElementById('progressFill');
  function updateProgressBar() {
    if (!progressFill) return;
    const { scroll, limit } = lenis;
    const progress = limit > 0 ? scroll / limit : 0;
    progressFill.style.transform = `scaleX(${progress})`;
  }
  lenis.on('scroll', updateProgressBar);
  window.addEventListener('resize', updateProgressBar);
  updateProgressBar();

  // 7. THEME TOGGLE (unchanged)
  const body = document.body;
  const toggleSwitch = document.getElementById('toggleSwitch');
  const savedTheme = localStorage.getItem('theme-2050');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }
  function switchTheme() {
    body.classList.toggle('light-theme');
    localStorage.setItem('theme-2050', body.classList.contains('light-theme') ? 'light' : 'dark');
  }
  if (toggleSwitch) toggleSwitch.addEventListener('click', switchTheme);
})();
