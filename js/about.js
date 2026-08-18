// About Page JS - Scroll Reveal & Animation Controller
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. SCROLL REVEAL — text & images slide in from sides
     Uses .reveal-from-left, .reveal-from-right, .reveal-from-bottom
     Adds .is-revealed when element enters the viewport
     ========================================== */
  const revealSelectors = '.reveal-from-left, .reveal-from-right, .reveal-from-bottom';
  const revealElements  = document.querySelectorAll(revealSelectors);

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ==========================================
     2. JUMPY-FALL HOVER ANIMATION — desktop only
     Adds/removes .img-jump class on image wrappers.
     The CSS @keyframes imgJumpFall handles the physics bounce.
     We use JS so the animation can re-trigger every hover.
     ========================================== */
  const isDesktop = () => window.matchMedia('(hover: hover) and (min-width: 900px)').matches;

  const jumpWrappers = document.querySelectorAll(
    '.client-img-wrapper, .leadership-img-wrapper, .find-img-wrapper, .bottom-banner-wrapper, .simplify-card.img-card'
  );

  jumpWrappers.forEach(wrapper => {
    wrapper.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      // Remove class first so re-hovering retriggers
      wrapper.classList.remove('img-jump');
      // Force reflow to restart animation
      void wrapper.offsetWidth;
      wrapper.classList.add('img-jump');
    });
    wrapper.addEventListener('mouseleave', () => {
      wrapper.classList.remove('img-jump');
    });
    wrapper.addEventListener('animationend', () => {
      // Keep slight lift after jump settles (handled by CSS forwards fill)
    });
  });


  /* ==========================================
     3. VALUE CARDS — continuous rotation on desktop
     Rotation runs via CSS animation. JS only handles
     pausing on hover and restarting on mouse leave.
     ========================================== */
  const valueCards = document.querySelectorAll('.value-card');

  valueCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      card.style.animationPlayState = 'paused';
    });
    card.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      card.style.animationPlayState = 'running';
    });
  });

});
