/**
 * Common JavaScript for Header, Navigation, Mobile Menu & Footer across all pages.
 */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndFooter();
});

/**
 * Initializes Common Header, Footer, Links, Mobile Drawer & Form Handlers
 */
function initHeaderAndFooter() {
  const headerContainer = document.getElementById('common-header');
  const footerContainer = document.getElementById('common-footer');

  // Determine relative path prefix (e.g. "" if root index.html, "../" if in html/ subfolder)
  const isHtmlSubfolder = window.location.pathname.includes('/html/');
  const pathPrefix = isHtmlSubfolder ? '../' : '';
  const pagePathPrefix = isHtmlSubfolder ? '' : 'html/';

  // Check if header or footer needs dynamic AJAX fetching (only if container is empty)
  const needsHeaderFetch = headerContainer && !headerContainer.querySelector('.site-header');
  const needsFooterFetch = footerContainer && !footerContainer.querySelector('.site-footer');

  if (needsHeaderFetch || needsFooterFetch) {
    const commonHtmlPath = isHtmlSubfolder ? 'common.html' : 'html/common.html';
    
    fetch(commonHtmlPath)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load common markup');
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        if (needsHeaderFetch && headerContainer) {
          const headerElem = doc.querySelector('.site-header');
          if (headerElem) {
            headerContainer.innerHTML = headerElem.outerHTML;
          }
        }

        if (needsFooterFetch && footerContainer) {
          const footerElem = doc.querySelector('.site-footer');
          if (footerElem) {
            footerContainer.innerHTML = footerElem.outerHTML;
          }
        }

        // Adjust component relative paths and bind interactive features
        adjustComponentPaths(pathPrefix, pagePathPrefix);
        setupMobileMenu();
        highlightActiveNavLink();
        setupFooterSubscribeForm();
      })
      .catch(error => {
        console.error('Error loading common components:', error);
        adjustComponentPaths(pathPrefix, pagePathPrefix);
        setupMobileMenu();
        highlightActiveNavLink();
        setupFooterSubscribeForm();
      });
  } else {
    // Content is already present statically in DOM — zero fetch, zero flicker!
    adjustComponentPaths(pathPrefix, pagePathPrefix);
    setupMobileMenu();
    highlightActiveNavLink();
    setupFooterSubscribeForm();
  }
}

/**
 * Adjusts relative paths for images and navigation links based on page depth
 */
function adjustComponentPaths(pathPrefix, pagePathPrefix) {
  // Logo image paths
  const logoImg = document.getElementById('nav-logo-img');
  const mobileLogoImg = document.getElementById('mobile-logo-img');
  const footerLogoImg = document.getElementById('footer-logo-img');

  if (logoImg) logoImg.src = `${pathPrefix}assets/logo.webp`;
  if (mobileLogoImg) mobileLogoImg.src = `${pathPrefix}assets/logo.webp`;
  if (footerLogoImg) footerLogoImg.src = `${pathPrefix}assets/logo.webp`;

  // Header & Footer Navigation Links Mapping
  const linkMappings = [
    // Header Links
    { id: 'nav-logo-link', href: `${pathPrefix}index.html` },
    { id: 'nav-home', href: `${pathPrefix}index.html` },
    { id: 'nav-about', href: `${pagePathPrefix}about.html` },
    { id: 'nav-service', href: `${pagePathPrefix}service.html` },
    { id: 'nav-blog', href: `${pagePathPrefix}blog.html` },
    { id: 'nav-contact', href: `${pagePathPrefix}contact.html` },
    
    // Mobile Drawer Links
    { id: 'mobile-nav-home', href: `${pathPrefix}index.html` },
    { id: 'mobile-nav-about', href: `${pagePathPrefix}about.html` },
    { id: 'mobile-nav-service', href: `${pagePathPrefix}service.html` },
    { id: 'mobile-nav-blog', href: `${pagePathPrefix}blog.html` },
    { id: 'mobile-nav-contact', href: `${pagePathPrefix}contact.html` },

    // Footer Links
    { id: 'footer-logo-link', href: `${pathPrefix}index.html` },
    { id: 'footer-nav-home', href: `${pathPrefix}index.html` },
    { id: 'footer-nav-about', href: `${pagePathPrefix}about.html` },
    { id: 'footer-nav-service', href: `${pagePathPrefix}service.html` },
    { id: 'footer-nav-blog', href: `${pagePathPrefix}blog.html` },
    { id: 'footer-nav-contact', href: `${pagePathPrefix}contact.html` }
  ];

  linkMappings.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) el.setAttribute('href', item.href);
  });
}

/**
 * Sets up Mobile Hamburger menu toggling & backdrop controls (with scroll locking)
 */
function setupMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const closeBtn = document.getElementById('mobile-close-toggle');

  if (!hamburgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    
    // Lock body scrolling when drawer is open
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');

    // Unlock body scrolling
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Highlights current active navigation link in Header & Footer
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      (currentPath.endsWith('/') || currentPath.endsWith('index.html')) &&
      href.includes('index.html')
    ) {
      link.classList.add('active');
    } else if (href !== 'index.html' && currentPath.includes(href.replace('../', '').replace('html/', ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Form submission handler for mandatory Footer Newsletter Email input
 */
function setupFooterSubscribeForm() {
  const form = document.getElementById('footer-subscribe-form');
  const emailInput = document.getElementById('footer-email-input');
  const msgContainer = document.getElementById('footer-form-msg');

  if (!form || !emailInput || !msgContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
      msgContainer.textContent = 'Please enter your email address.';
      msgContainer.className = 'form-feedback-msg error';
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(emailValue)) {
      msgContainer.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
      msgContainer.className = 'form-feedback-msg error';
      emailInput.focus();
      return;
    }

    // Clear and redirect
    emailInput.value = '';
    window.location.href = "404.html";
  });

  // Clear email input when returning to the page (history back/forward)
  window.addEventListener('pageshow', () => {
    emailInput.value = '';
    msgContainer.textContent = '';
    msgContainer.className = 'form-feedback-msg';
  });
}
