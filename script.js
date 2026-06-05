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
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

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
    const duration = 2000;
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

  // ========== TYPEWRITER EFFECT ==========
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const phrases = [
      'Technology Leader',
      'AI Researcher',
      'Entrepreneur',
      'Builder',
      'Father'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function typewrite() {
      const currentPhrase = phrases[phraseIndex];

      if (isPaused) {
        isPaused = false;
        isDeleting = true;
        setTimeout(typewrite, 1200);
        return;
      }

      if (!isDeleting) {
        // Typing
        charIndex++;
        typewriterEl.textContent = currentPhrase.substring(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isPaused = true;
          setTimeout(typewrite, 2000);
          return;
        }

        setTimeout(typewrite, 80 + Math.random() * 40);
      } else {
        // Deleting
        charIndex--;
        typewriterEl.textContent = currentPhrase.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typewrite, 500);
          return;
        }

        setTimeout(typewrite, 40);
      }
    }

    // Start after a brief delay
    setTimeout(typewrite, 1000);
  }

  // ========== TIMELINE LINE ANIMATION ==========
  const timelineFill = document.querySelector('.timeline-line-fill');
  const timelineSection = document.querySelector('.journey');

  if (timelineFill && timelineSection) {
    function updateTimelineFill() {
      const rect = timelineSection.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate how far we've scrolled through the section
      const scrolledPast = viewportHeight - rect.top;
      const totalDistance = sectionHeight + viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolledPast / totalDistance));
      
      timelineFill.style.height = (progress * 100) + '%';
    }

    window.addEventListener('scroll', updateTimelineFill, { passive: true });
    updateTimelineFill();
  }

  // ========== VENTURE CARD GLOW ==========
  document.querySelectorAll('.venture-card').forEach(card => {
    const glow = card.querySelector('.venture-card-glow');
    if (!glow) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(16, 185, 129, 0.12) 0%, transparent 50%)`;
    });

    card.addEventListener('mouseenter', () => {
      glow.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
  });

  // ========== PARALLAX ON HERO ==========
  const hero = document.querySelector('.hero');
  if (hero) {
    document.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      
      const glows = document.querySelectorAll('.bg-glow');
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      glows.forEach((glow, i) => {
        const factor = (i + 1) * 8;
        glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
  }

  // ========== PHILOSOPHY CARD TILT ==========
  document.querySelectorAll('.philosophy-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

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
