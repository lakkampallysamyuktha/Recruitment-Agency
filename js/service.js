// Service Page JS — Scroll Reveal + FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     SCROLL REVEAL
     Adds .is-revealed when element enters viewport
  -------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-from-left, .reveal-from-right, .reveal-from-bottom');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  }


  /* --------------------------------------------------
     FAQ SINGLE ACCORDION
     Only one <details> can be open at a time.

     We listen to the native 'toggle' event which fires
     AFTER the browser updates the [open] attribute.
     When an item opens, we close all others.

     Using two separate column divs (not CSS grid) already
     prevents the cross-column row-height-sync visual bug,
     but this JS ensures true single-open behaviour.
  -------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      // Only act when this item just opened
      if (!item.open) return;

      faqItems.forEach(other => {
        if (other !== item && other.open) {
          // Close silently — no recursive toggle loop
          // because we only enter this branch when item.open === true
          other.open = false;
        }
      });
    });
  });


  /* --------------------------------------------------
     NEWSLETTER FORM — MANDATORY EMAIL VALIDATION
     Prevents submit if field is empty or invalid.
     Shows an inline error message inside .svc-keep-msg.
  -------------------------------------------------- */
  const keepForm  = document.getElementById('svc-keep-form');
  const keepInput = document.getElementById('svc-keep-email');
  const keepMsg   = document.getElementById('svc-keep-msg');

  if (keepForm && keepInput && keepMsg) {

    // Validate helper
    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    const keepWrapper = keepForm.querySelector('.svc-input-wrapper');

    // Show error state
    function showError(msg) {
      if (keepWrapper) keepWrapper.classList.add('svc-input-wrapper--error');
      keepInput.classList.add('svc-keep-email-input--error');
      keepMsg.textContent = msg;
      keepMsg.style.color = '#ff8a8a';
    }

    // Clear error state
    function clearError() {
      if (keepWrapper) keepWrapper.classList.remove('svc-input-wrapper--error');
      keepInput.classList.remove('svc-keep-email-input--error');
      keepMsg.textContent = '';
      keepMsg.style.color = '';
    }

    // Clear error as user types a valid value
    keepInput.addEventListener('input', () => {
      if (isValidEmail(keepInput.value)) clearError();
    });

    keepForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = keepInput.value.trim();

      if (!val) {
        showError('⚠ Email is required — please enter your email address.');
        keepInput.focus();
        return;
      }
      if (!isValidEmail(val)) {
        showError('⚠ Please enter a valid email address.');
        keepInput.focus();
        return;
      }

      // Success
      clearError();
      keepInput.value = '';
      window.location.href = "404.html";
    });

    window.addEventListener('pageshow', () => {
      keepInput.value = '';
      clearError();
    });
  }


  /* --------------------------------------------------
     METRICS COUNTER ANIMATION
     Animates numbers from 0 to target when scrolled into view
  -------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.svc-stat-number');
  
  if (statNumbers.length > 0) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetEl = entry.target;
          const target = parseInt(targetEl.getAttribute('data-target'), 10);
          const suffix = targetEl.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1500; // 1.5 seconds animation duration
          const frameRate = 1000 / 60; // 60 frames per second
          const totalFrames = Math.round(duration / frameRate);
          let currentFrame = 0;

          const counter = setInterval(() => {
            currentFrame++;
            // Ease out quad formula for smooth decelerating animation
            const progress = currentFrame / totalFrames;
            const easeProgress = progress * (2 - progress);
            count = Math.round(easeProgress * target);

            targetEl.textContent = count + suffix;

            if (currentFrame >= totalFrames) {
              targetEl.textContent = target + suffix;
              clearInterval(counter);
            }
          }, frameRate);

          observer.unobserve(targetEl);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(stat => countObserver.observe(stat));
  }

});
