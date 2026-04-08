// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 1600);
});

// ── NAVBAR SCROLL ──
const navbar = document.querySelector('.navbar');
const backTop = document.querySelector('.back-top');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  if (backTop) {
    backTop.classList.toggle('show', window.scrollY > 300);
  }
});

// ── HAMBURGER ──
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── BACK TO TOP ──
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── LOGIN PROTECTION FOR BOOKINGS
function checkLoginBeforeBooking(event, href) {
  // Check if auth.js is loaded and user is logged in
  if (typeof AUTH !== 'undefined' && AUTH.isLoggedIn()) {
    // User is logged in, allow navigation
    window.location.href = href;
  } else {
    // User not logged in, redirect to login with message
    event.preventDefault();
    sessionStorage.setItem('pt_redirect', href);
    sessionStorage.setItem('pt_message', 'Please login to access bookings');
    window.location.href = 'login.html';
  }
}

// Add click handlers to booking links
document.addEventListener('DOMContentLoaded', function() {
  // Booking links in navigation
  const bookingLinks = document.querySelectorAll('a[href="booking.html"]');
  bookingLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      checkLoginBeforeBooking(e, 'booking.html');
    });
  });
  
  // Dashboard links
  const dashboardLinks = document.querySelectorAll('a[href="dashboard.html"]');
  dashboardLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (typeof AUTH !== 'undefined' && !AUTH.isLoggedIn()) {
        e.preventDefault();
        sessionStorage.setItem('pt_redirect', 'dashboard.html');
        sessionStorage.setItem('pt_message', 'Please login to access dashboard');
        window.location.href = 'login.html';
      }
    });
  });
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── ACTIVE NAV ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── STAGGER REVEAL ──
document.querySelectorAll('.stagger-grid').forEach(grid => {
  const children = grid.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});
