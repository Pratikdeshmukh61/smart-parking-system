/* ========================================
   CONTACT PAGE JAVASCRIPT
   ======================================== */

// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const successToast = document.getElementById('successToast');

  // Handle contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');
      
      // Basic validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Simulate form submission (in real app, this would be an API call)
      console.log('Contact form submitted:', { name, email, subject, message });
      
      // Show success toast
      showSuccessToast();
      
      // Reset form
      contactForm.reset();
    });
  }

  // Show success toast notification
  function showSuccessToast() {
    if (successToast) {
      successToast.classList.add('show');
      
      // Hide after 5 seconds
      setTimeout(() => {
        successToast.classList.remove('show');
      }, 5000);
    }
  }

  // Add input focus effects
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });

  // Character counter for message textarea
  const messageTextarea = document.querySelector('textarea[name="message"]');
  if (messageTextarea) {
    const maxLength = 500;
    
    // Add character counter display if it doesn't exist
    let counter = document.querySelector('.char-counter');
    if (!counter) {
      counter = document.createElement('div');
      counter.className = 'char-counter';
      counter.style.cssText = 'font-size: 0.8rem; color: var(--gray-500); text-align: right; margin-top: 0.25rem;';
      messageTextarea.parentElement.appendChild(counter);
    }
    
    function updateCounter() {
      const remaining = maxLength - messageTextarea.value.length;
      counter.textContent = `${remaining} characters remaining`;
      
      if (remaining < 50) {
        counter.style.color = 'var(--danger)';
      } else if (remaining < 100) {
        counter.style.color = 'var(--gold)';
      } else {
        counter.style.color = 'var(--gray-500)';
      }
    }
    
    messageTextarea.addEventListener('input', updateCounter);
    messageTextarea.setAttribute('maxlength', maxLength);
    updateCounter();
  }

  // Phone number formatting
  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      // Remove all non-numeric characters
      let value = e.target.value.replace(/\D/g, '');
      
      // Format as phone number (simple format)
      if (value.length > 0) {
        if (value.length <= 3) {
          value = value;
        } else if (value.length <= 6) {
          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
      }
      
      e.target.value = value;
    });
  }

  console.log('Contact page JavaScript loaded successfully');
});
