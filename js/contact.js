// Contact Page JS — Scroll Reveal & Form Validation
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

  /* Contact Form Validation */
  const contactForm = document.getElementById('contact-main-form');
  
  if (contactForm) {
    const fields = {
      name: {
        input: document.getElementById('contact-name'),
        error: document.getElementById('error-name'),
        validation: val => val.trim() !== "" ? "" : "Name is required."
      },
      email: {
        input: document.getElementById('contact-email'),
        error: document.getElementById('error-email'),
        validation: val => {
          if (val.trim() === "") return "Email is required.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email address.";
          return "";
        }
      },
      phone: {
        input: document.getElementById('contact-phone'),
        error: document.getElementById('error-phone'),
        validation: val => val.trim() !== "" ? "" : "Phone number is required."
      },
      message: {
        input: document.getElementById('contact-message'),
        error: document.getElementById('error-message'),
        validation: val => val.trim() !== "" ? "" : "Message content is required."
      }
    };

    const generalFeedback = document.getElementById('form-general-feedback');

    // Live validation on typing / input
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      field.input.addEventListener('input', () => {
        const errorMsg = field.validation(field.input.value);
        if (errorMsg === "") {
          field.input.classList.remove('error');
          field.error.textContent = "";
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate each field on submit
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const errorMsg = field.validation(field.input.value);

        if (errorMsg !== "") {
          isValid = false;
          field.input.classList.add('error');
          field.error.textContent = errorMsg;
        } else {
          field.input.classList.remove('error');
          field.error.textContent = "";
        }
      });

      if (isValid) {
        // Reset form to clear inputs
        contactForm.reset();
        // Redirect to 404.html
        window.location.href = "404.html";
      } else {
        // Form is invalid - display validation error notice
        generalFeedback.style.color = "#ff8a8a"; // Red error text
        generalFeedback.textContent = "⚠ Please fill out all mandatory fields.";
      }
    });

    // Reset form fields when returning to the page (e.g. from history back/forward cache)
    window.addEventListener('pageshow', () => {
      contactForm.reset();
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        field.input.classList.remove('error');
        field.error.textContent = "";
      });
      if (generalFeedback) {
        generalFeedback.textContent = "";
      }
    });
  }

  /* FAQ Accordion Single-Open Functionality */
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach(other => {
        if (other !== item && other.open) {
          other.open = false;
        }
      });
    });
  });

});

