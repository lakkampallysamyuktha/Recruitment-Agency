// Home Page JavaScript (index.js)

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. SCROLL REVEAL ANIMATIONS FOR SECTION 2 & SECTION 3
  // Observes elements with .reveal-from-left, .reveal-from-right, .reveal-from-bottom
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal-from-left, .reveal-from-right, .reveal-from-bottom');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.15, // Trigger when 15% of element is visible
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ============================================================
  // 2. STATS COUNTER ANIMATION
  // Triggers when .navigate-stats-grid scrolls into view.
  // Each .stat-item fades + slides up, then its number counts up.
  // ============================================================
  const statsGrid = document.getElementById('stats-grid');
  let statsAnimated = false;

  /**
   * Counts a number up from 0 to `target` over `duration` ms.
   */
  function animateCount(el, target, duration) {
    const startTime = performance.now();
    const isDecimal = target !== Math.floor(target);

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for snappy deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * target);
      el.textContent = isDecimal ? current.toFixed(1) : current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  /**
   * Kick off stat item entrance + counter for all items in the grid.
   */
  function runStatsAnimation() {
    if (statsAnimated || !statsGrid) return;
    statsAnimated = true;

    const statItems = statsGrid.querySelectorAll('.stat-item');
    const statCounts = statsGrid.querySelectorAll('.stat-count');

    // Trigger entrance slide-up animation via CSS class
    statItems.forEach((item) => {
      item.classList.add('is-visible');
    });

    // Start count-up for each number after a brief delay
    statCounts.forEach((countEl, i) => {
      const target = parseFloat(countEl.dataset.target);
      const delay = i * 120; // stagger start (matches transition-delay)

      // Clear text initially so the first frame starts from blank
      countEl.textContent = '0';

      setTimeout(() => {
        animateCount(countEl, target, 1600);
      }, delay + 400); // wait for CSS slide-up to begin
    });
  }

  // Use IntersectionObserver for scroll-triggered activation of stats
  if (statsGrid && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runStatsAnimation();
            statsObserver.unobserve(statsGrid); // fire once only
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(statsGrid);
  } else if (statsGrid) {
    // Fallback: run immediately if IntersectionObserver not supported
    runStatsAnimation();
  }

  // ============================================================
  // 3. CURVY MOTION TESTIMONIAL CYCLE
  // Cycles the testimonial cards in a curvy circular path.
  // ============================================================
  const stack = document.getElementById('testimonial-stack');
  if (stack) {
    const cards = Array.from(stack.querySelectorAll('.testimonial-card'));
    let activeIdx = 0;
    let isTransitioning = false;

    function triggerFlowerBlast() {
      const flowerEmojis = ['🌸', '💮', '🌺', '🌼', '🌻', '🌹', '🍃', '🌸'];
      const particleCount = 22;
      const rect = stack.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;

      for (let i = 0; i < particleCount; i++) {
        const el = document.createElement('span');
        el.innerText = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        el.style.position = 'absolute';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.fontSize = `${Math.random() * 12 + 14}px`;
        el.style.pointerEvents = 'none';
        el.style.zIndex = '999';
        el.style.userSelect = 'none';

        // Physics: random angle & distance
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 140 + 90;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 40; // upward bias

        stack.appendChild(el);

        const anim = el.animate([
          { transform: 'translate3d(0, 0, 0) scale(0) rotate(0deg)', opacity: 0 },
          { transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)', opacity: 1, offset: 0.1 },
          { 
            transform: `translate3d(${vx}px, ${vy + 100}px, 0) scale(0.8) rotate(${Math.random() * 720 - 360}deg)`, 
            opacity: 0 
          }
        ], {
          duration: Math.random() * 900 + 800,
          easing: 'cubic-bezier(0.1, 0.8, 0.25, 1)'
        });

        anim.onfinish = () => el.remove();
      }
    }

    function cycleTestimonial(direction = 'next') {
      if (isTransitioning || cards.length < 2) return;
      isTransitioning = true;
      triggerFlowerBlast();

      const currentCard = cards[activeIdx];
      
      // Calculate index of card currently in 'next' state
      const nextIdx = (activeIdx + 1) % cards.length;
      const nextCard = cards[nextIdx];

      // Calculate index of incoming card
      const incomingIdx = (activeIdx + 2) % cards.length;
      const incomingCard = cards[incomingIdx];

      if (direction === 'next') {
        // 1. Current card exits with the curvy exit animation
        currentCard.classList.remove('active');
        currentCard.classList.add('exit-animation');

        // 2. Next card moves up to active
        nextCard.classList.remove('next');
        nextCard.classList.add('active');

        // 3. Incoming card shifts to 'next' position
        incomingCard.classList.remove('incoming');
        incomingCard.classList.add('next');

        // Clean up classes after animation completes
        setTimeout(() => {
          currentCard.classList.remove('exit-animation');
          currentCard.classList.add('incoming');
          
          activeIdx = nextIdx;
          isTransitioning = false;
        }, 850); // Matches the 0.85s CSS animation length
      } else {
        // Reverse direction
        const prevIdx = (activeIdx - 1 + cards.length) % cards.length;
        const prevCard = cards[prevIdx];

        // 1. Current active moves to 'next'
        currentCard.classList.remove('active');
        currentCard.classList.add('next');

        // 2. The card in 'next' state moves to 'incoming'
        nextCard.classList.remove('next');
        nextCard.classList.add('incoming');

        // 3. The previous card (currently incoming) enters into active
        prevCard.classList.remove('incoming');
        prevCard.classList.add('active');

        setTimeout(() => {
          isTransitioning = false;
          activeIdx = prevIdx;
        }, 850);
      }
    }

    // Controls listeners
    const btnNext = document.getElementById('next-test');
    const btnPrev = document.getElementById('prev-test');

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        cycleTestimonial('next');
        resetAutoCycle();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        cycleTestimonial('prev');
        resetAutoCycle();
      });
    }

    // Auto Cycle loop (every 3 seconds)
    let autoCycleInterval = setInterval(() => {
      cycleTestimonial('next');
    }, 3000);

    function resetAutoCycle() {
      clearInterval(autoCycleInterval);
      autoCycleInterval = setInterval(() => {
        cycleTestimonial('next');
      }, 3000);
    }
  }

});

