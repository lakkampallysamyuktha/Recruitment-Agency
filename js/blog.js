// Blog Page JS — Scroll Reveal & Interactivity
document.addEventListener('DOMContentLoaded', () => {

  /* Scroll Reveal — adds .is-revealed when element enters viewport */
  const revealEls = document.querySelectorAll('.reveal-from-bottom, .reveal-from-top, .reveal-from-left, .reveal-from-right');

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
      { root: null, threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  }

  /* Trending Topics — Category Item Interactive Toggle */
  const topicItems = document.querySelectorAll('.trending-topic-item');
  const featuredTitle = document.querySelector('.trending-card-title');

  // Sample data to simulate content switching
  const topicData = {
    "01": "How leadership styles are evolving for modern remote workplaces",
    "02": "Strategies to build an inclusive workforce and foster belonging",
    "03": "Best practices for onboarding remote employees successfully",
    "04": "Addressing workplace burnout and building emotional resilience"
  };

  if (topicItems.length > 0 && featuredTitle) {
    topicItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove active class from all
        topicItems.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');

        // Extract key from the number span
        const numberSpan = item.querySelector('.topic-number');
        if (numberSpan) {
          const key = numberSpan.textContent.trim();
          if (topicData[key]) {
            // Fade effect simulation
            featuredTitle.style.opacity = '0';
            setTimeout(() => {
              featuredTitle.textContent = topicData[key];
              featuredTitle.style.opacity = '1';
            }, 200);
          }
        }
      });
    });
  }

});
