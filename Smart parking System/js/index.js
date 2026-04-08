/* ========================================
   INDEX PAGE JAVASCRIPT
   ======================================== */

// Index page specific functionality
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Hero scroll animation
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function() {
      const nextSection = document.querySelector('.stats-band');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe service cards and feature items
  document.querySelectorAll('.service-card, .feature-item, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Pricing card hover effects
  const priceCards = document.querySelectorAll('.price-card');
  priceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!this.classList.contains('popular')) {
        this.style.transform = 'translateY(-5px)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('popular')) {
        this.style.transform = 'translateY(0)';
      }
    });
  });

  // Testimonial carousel (if implemented)
  let currentTestimonial = 0;
  const testimonials = document.querySelectorAll('.testimonial-card');
  
  if (testimonials.length > 0) {
    // Simple testimonial rotation every 5 seconds
    setInterval(() => {
      testimonials.forEach(t => t.style.display = 'none');
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      testimonials[currentTestimonial].style.display = 'block';
    }, 5000);
  }

  console.log('Index page JavaScript loaded successfully');
});
