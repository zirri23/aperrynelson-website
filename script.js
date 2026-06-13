/* ============================================================
   PERRY NELSON — Personal Website Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVIGATION SCROLL ==========
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ========== MOBILE MENU ==========
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ========== SCROLL REVEAL ==========
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Also trigger stat counters within this element
        const counters = entry.target.querySelectorAll('.stat-counter:not(.counted)');
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== IMAGE REVEAL ANIMATIONS ==========
  const imgRevealElements = document.querySelectorAll('.img-reveal, .img-reveal-up, .img-reveal-left, .img-reveal-right');
  
  const imgRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        imgRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -60px 0px'
  });

  imgRevealElements.forEach(el => imgRevealObserver.observe(el));

  // ========== LIFE GALLERY STAGGERED REVEAL ==========
  const lifeCards = document.querySelectorAll('.life-card');
  const lifeGallery = document.querySelector('.life-gallery');

  if (lifeGallery && lifeCards.length) {
    const lifeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lifeCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('revealed');
            }, index * 150);
          });
          lifeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    lifeObserver.observe(lifeGallery);
  }

  // Also observe stat counters that aren't inside .reveal elements
  const standaloneCounters = document.querySelectorAll('.stat-counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  standaloneCounters.forEach(el => counterObserver.observe(el));

  // ========== ANIMATED COUNTERS ==========
  function animateCounter(el) {
    if (el.classList.contains('counted')) return;
    el.classList.add('counted');
    
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(target * easedProgress);

      if (target >= 1000) {
        el.textContent = current.toLocaleString() + suffix;
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========== TIMELINE LINE ANIMATION ==========
  const timelineFill = document.querySelector('.timeline-line-fill');
  const timelineSection = document.querySelector('.journey');

  if (timelineFill && timelineSection) {
    function updateTimelineFill() {
      const rect = timelineSection.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const scrolledPast = viewportHeight - rect.top;
      const totalDistance = sectionHeight + viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolledPast / totalDistance));
      
      timelineFill.style.height = (progress * 100) + '%';
    }

    window.addEventListener('scroll', updateTimelineFill, { passive: true });
    updateTimelineFill();
  }

  // ========== STAGGER REVEAL FOR GRIDS ==========
  const gridContainers = document.querySelectorAll('.ventures-grid, .media-grid');
  
  gridContainers.forEach(grid => {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.children;
          Array.from(cards).forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('revealed');
            }, index * 100);
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    gridObserver.observe(grid);
  });

});
