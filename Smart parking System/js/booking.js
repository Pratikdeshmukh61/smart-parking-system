/* ========================================
   BOOKING PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  checkLoginStatus();
  
  // Initialize booking flow
  initializeBooking();
});

// Check login status and show appropriate message
function checkLoginStatus() {
  const isLoggedIn = sessionStorage.getItem('pt_auth') === 'true';
  const bookingContent = document.querySelector('.booking-wrap');
  
  if (!isLoggedIn) {
    // User is not logged in - show login message
    showLoginRequiredMessage();
    // Disable booking form
    disableBookingForm();
  } else {
    // User is logged in - show welcome message and enable booking
    showWelcomeMessage();
    enableBookingForm();
  }
}

// Show login required message
function showLoginRequiredMessage() {
  const bookingContent = document.querySelector('.booking-wrap');
  const loginMessage = `
    <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
      <h3 style="font-size: 1.5rem; margin-bottom: 1rem; font-family: 'Syne', sans-serif;">Login Required</h3>
      <p style="font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.6;">
        Please login first to book a parking slot. This ensures we can provide you with the best service and keep track of your bookings.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="login.html" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem; background: white; color: #f59e0b;">
          <i class="fas fa-sign-in-alt"></i> Login Now
        </a>
        <a href="register.html" class="btn btn-outline" style="font-size: 1rem; padding: 0.875rem 1.5rem; border-color: white; color: white;">
          <i class="fas fa-user-plus"></i> Create Account
        </a>
      </div>
      <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.2);">
        <p style="font-size: 0.9rem; opacity: 0.9;">
          <i class="fas fa-info-circle"></i> 
          New to ParkTech? Register now to get started with smart parking solutions.
        </p>
      </div>
    </div>
  `;
  
  bookingContent.innerHTML = loginMessage;
}

// Show welcome message for logged in users
function showWelcomeMessage() {
  const userName = sessionStorage.getItem('pt_user') || 'User';
  const welcomeAlert = document.createElement('div');
  welcomeAlert.className = 'alert alert-info';
  welcomeAlert.style.cssText = `
    background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05));
    border: 1px solid rgba(34,197,94,0.3);
    color: #166534;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
  `;
  welcomeAlert.innerHTML = `
    <i class="fas fa-user-check" style="font-size: 1.5rem; color: #22c55e;"></i>
    <div>
      <strong>Welcome back, ${userName}!</strong><br>
      <span style="font-size: 0.9rem;">You can now proceed with booking your parking slot.</span>
    </div>
  `;
  
  // Insert welcome message after page hero
  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    pageHero.parentNode.insertBefore(welcomeAlert, pageHero.nextSibling);
  }
}

// Disable booking form
function disableBookingForm() {
  // Form is already replaced with login message, so no need to disable
  console.log('Booking form disabled - user not logged in');
}

// Enable booking form for logged in users
function enableBookingForm() {
  console.log('Booking form enabled - user is logged in');
  // The existing booking form will work normally
}

// Initialize booking functionality for logged in users
function initializeBooking() {
  const isLoggedIn = sessionStorage.getItem('pt_auth') === 'true';
  
  if (isLoggedIn) {
    // Initialize existing booking functionality
    initializeExistingBooking();
  }
}

// Initialize existing booking functionality
function initializeExistingBooking() {
  // Set up event listeners for existing booking form
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }
  
  // Initialize existing variables and functions
  window.currentStep = 1;
  window.selectedSlot = null;
  window.selectedPay = null;
  window.bookingData = {};
  
  // Make existing functions available globally
  window.goStep = goStep;
  window.selectSlot = selectSlot;
  window.selectPay = selectPay;
  window.calcAmount = calcAmount;
  window.confirmBooking = confirmBooking;
  
  // Initialize slot grid
  initializeSlotGrid();
}

// Initialize slot grid
function initializeSlotGrid() {
  const taken = [2, 5, 8, 11, 14, 17, 20, 23];
  const grid = document.getElementById('slotGrid');
  if (grid) {
    for (let i = 1; i <= 25; i++) {
      const button = document.createElement('button');
      button.className = 'slot-btn' + (taken.includes(i) ? ' taken' : '');
      button.textContent = 'A' + i;
      button.disabled = taken.includes(i);
      button.onclick = () => {
        document.querySelectorAll('.slot-btn').forEach(x => x.classList.remove('selected'));
        button.classList.add('selected');
        window.selectedSlot = 'A' + i;
        updateSummaryBar();
      };
      grid.appendChild(button);
    }
  }
}

// Step navigation function
function goStep(n) {
  if (n > window.currentStep) {
    if (window.currentStep === 1 && !validateStep1()) return;
    if (window.currentStep === 2 && !validateStep2()) return;
    if (window.currentStep === 3 && !validateStep3()) return;
  }
  
  window.currentStep = n;
  document.querySelectorAll('.step-content').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === n);
  });
  
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 < n) {
      el.classList.add('done');
      el.querySelector('.step-circle').innerHTML = '<i class="fas fa-check"></i>';
    } else if (i + 1 === n) {
      el.classList.add('active');
    } else {
      el.querySelector('.step-circle').textContent = i + 1;
    }
  });
  
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

// Validation functions
function validateStep1() {
  const name = document.getElementById('s1-name')?.value.trim();
  const mobile = document.getElementById('s1-mobile')?.value.trim();
  const email = document.getElementById('s1-email')?.value.trim();
  const vehicle = document.getElementById('s1-vehicle')?.value.trim();
  
  if (!name || !mobile || !email || !vehicle) {
    showToast('Please fill all required fields!', 'warning');
    return false;
  }
  return true;
}

function validateStep2() {
  const plan = document.getElementById('s2-plan')?.value;
  const cinDate = document.getElementById('s2-cin-date')?.value;
  const coutDate = document.getElementById('s2-cout-date')?.value;
  
  if (!plan || !cinDate || !coutDate) {
    showToast('Please complete schedule details!', 'warning');
    return false;
  }
  return true;
}

function validateStep3() {
  if (!window.selectedSlot) {
    showToast('Please select a parking slot!', 'warning');
    return false;
  }
  if (!window.selectedPay) {
    showToast('Please select a payment method!', 'warning');
    return false;
  }
  if (!document.getElementById('terms')?.checked) {
    showToast('Please accept Terms & Conditions!', 'warning');
    return false;
  }
  return true;
}

// Calculate amount function
function calcAmount() {
  const plan = document.getElementById('s2-plan')?.value;
  const cinDate = document.getElementById('s2-cin-date')?.value;
  const coutDate = document.getElementById('s2-cout-date')?.value;
  const cinTime = document.getElementById('s2-cin-time')?.value || '09:00';
  const coutTime = document.getElementById('s2-cout-time')?.value || '18:00';
  
  if (!plan || !cinDate || !coutDate) return;
  
  const start = new Date(`${cinDate}T${cinTime}`);
  const end = new Date(`${coutDate}T${coutTime}`);
  
  if (end <= start) return;
  
  const diff = end - start;
  let amount = 0, duration = '';
  
  if (plan === 'hourly') {
    const hours = Math.ceil(diff / 3.6e6);
    amount = hours * 20;
    duration = `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (plan === 'daily') {
    const days = Math.ceil(diff / 8.64e7);
    amount = days * 150;
    duration = `${days} day${days > 1 ? 's' : ''}`;
  } else if (plan === 'monthly') {
    const months = Math.ceil(diff / 8.64e7 / 30);
    amount = months * 2000;
    duration = `${months} month${months > 1 ? 's' : ''}`;
  }
  
  const calcResult = document.getElementById('calcResult');
  const calcDur = document.getElementById('calcDur');
  const calcAmt = document.getElementById('calcAmt');
  
  if (calcResult && calcDur && calcAmt) {
    calcResult.style.display = 'block';
    calcDur.textContent = duration;
    calcAmt.textContent = `Rs.${amount}`;
    window.bookingData.amount = amount;
    window.bookingData.duration = duration;
    window.bookingData.checkoutTime = end;
    updateSummaryBar();
  }
}

// Select payment method
function selectPay(element) {
  document.querySelectorAll('.pay-opt').forEach(p => p.classList.remove('selected'));
  element.classList.add('selected');
  window.selectedPay = element.textContent.trim();
}

// Update summary bar
function updateSummaryBar() {
  const nameEl = document.getElementById('sb-name');
  const vehicleEl = document.getElementById('sb-vehicle');
  const planEl = document.getElementById('sb-plan');
  const slotEl = document.getElementById('sb-slot');
  const totalEl = document.getElementById('sb-total');
  
  if (nameEl) nameEl.textContent = document.getElementById('s1-name')?.value || '---';
  if (vehicleEl) vehicleEl.textContent = document.getElementById('s1-vehicle')?.value || '---';
  if (planEl) {
    const plan = document.getElementById('s2-plan')?.value;
    planEl.textContent = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : '---';
  }
  if (slotEl) slotEl.textContent = window.selectedSlot || '---';
  if (totalEl) totalEl.textContent = window.bookingData.amount ? `Rs.${window.bookingData.amount}` : 'Rs.0';
}

// Confirm booking function
function confirmBooking() {
  if (!validateStep3()) return;
  
  const userName = sessionStorage.getItem('pt_user') || 'User';
  const userEmail = sessionStorage.getItem('pt_user_email') || '';
  const ref = 'PT-' + Date.now().toString().slice(-6);
  
  window.bookingData.id = ref;
  window.bookingData.userName = userName;
  window.bookingData.userEmail = userEmail;
  window.bookingData.name = document.getElementById('s1-name').value;
  window.bookingData.mobile = document.getElementById('s1-mobile').value;
  window.bookingData.email = document.getElementById('s1-email').value;
  window.bookingData.vehicle = document.getElementById('s1-vehicle').value;
  window.bookingData.slot = window.selectedSlot;
  window.bookingData.plan = document.getElementById('s2-plan').value;
  window.bookingData.checkin = document.getElementById('s2-cin-date').value + ' ' + document.getElementById('s2-cin-time').value;
  window.bookingData.checkout = document.getElementById('s2-cout-date').value + ' ' + document.getElementById('s2-cout-time').value;
  window.bookingData.bookingTime = new Date().toISOString();
  
  document.getElementById('bookingRef').textContent = '#' + ref;
  document.getElementById('confirmDetails').innerHTML = `
    <div class="confirm-row"><span>Booking ID</span><span style="color:var(--gold)">#${ref}</span></div>
    <div class="confirm-row"><span>Customer</span><span>${userName}</span></div>
    <div class="confirm-row"><span>Name</span><span>${window.bookingData.name}</span></div>
    <div class="confirm-row"><span>Vehicle</span><span>${window.bookingData.vehicle}</span></div>
    <div class="confirm-row"><span>Slot</span><span>${window.bookingData.slot}</span></div>
    <div class="confirm-row"><span>Plan</span><span>${window.bookingData.plan}</span></div>
    <div class="confirm-row"><span>Check-In</span><span>${window.bookingData.checkin}</span></div>
    <div class="confirm-row"><span>Check-Out</span><span>${window.bookingData.checkout}</span></div>
    <div class="confirm-row"><span>Amount Paid</span><span style="color:#22c55e">Rs.${window.bookingData.amount || 0}</span></div>
  `;
  
  goStep(4);
  showToast('Booking confirmed! Download your invoice below.', 'success');
  
  // Start countdown
  if (window.bookingData.checkoutTime) {
    startCountdown('countdownTimer', window.bookingData.checkoutTime);
  }
}

// Countdown timer
function startCountdown(timerId, endTime) {
  const timer = document.getElementById(timerId);
  if (!timer) return;
  
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = new Date(endTime).getTime() - now;
    
    if (distance < 0) {
      clearInterval(interval);
      timer.textContent = 'EXPIRED';
      return;
    }
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

// Download PDF function
function downloadPDF() {
  if (!window.bookingData.name) {
    showToast('Complete a booking first!', 'warning');
    return;
  }
  // This function should be implemented in features.js
  if (typeof generateInvoice === 'function') {
    generateInvoice(window.bookingData);
  } else {
    showToast('Invoice generation not available', 'warning');
  }
}

// Reset booking function
function resetBooking() {
  window.selectedSlot = null;
  window.selectedPay = null;
  window.bookingData = {};
  document.querySelectorAll('input:not([type=file]), select').forEach(el => el.value = '');
  goStep(1);
  updateSummaryBar();
}

// Enhanced booking submission with user context
function handleBookingSubmit(e) {
  e.preventDefault();
  
  const userName = sessionStorage.getItem('pt_user') || 'User';
  const userEmail = sessionStorage.getItem('pt_user_email') || '';
  
  // Add user info to booking data
  window.bookingData.userName = userName;
  window.bookingData.userEmail = userEmail;
  window.bookingData.bookingTime = new Date().toISOString();
  
  // Show confirmation with user context
  showBookingConfirmation();
}

// Show booking confirmation with user details
function showBookingConfirmation() {
  const userName = sessionStorage.getItem('pt_user') || 'User';
  const bookingRef = 'PT' + Date.now();
  
  const confirmationModal = document.createElement('div');
  confirmationModal.className = 'modal-overlay';
  confirmationModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  confirmationModal.innerHTML = `
    <div style="background: white; border-radius: 16px; padding: 2.5rem; max-width: 500px; width: 90%; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
      <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #166534; font-family: 'Syne', sans-serif;">Booking Confirmed!</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; text-align: left;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: #64748b;">Booking Reference:</span>
          <strong style="color: #166534;">${bookingRef}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: #64748b;">Customer:</span>
          <strong style="color: #166534;">${userName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Time:</span>
          <strong style="color: #166534;">${new Date().toLocaleString()}</strong>
        </div>
      </div>
      <p style="color: #64748b; margin-bottom: 2rem; line-height: 1.6;">
        Your parking slot has been successfully booked! A confirmation email has been sent to your registered email address.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button onclick="closeConfirmation()" class="btn btn-primary" style="font-size: 1rem; padding: 0.875rem 1.5rem;">
          <i class="fas fa-check"></i> Got it
        </button>
        <a href="dashboard.html" class="btn btn-outline" style="font-size: 1rem; padding: 0.875rem 1.5rem;">
          <i class="fas fa-tachometer-alt"></i> View Dashboard
        </a>
      </div>
    </div>
  `;
  
  document.body.appendChild(confirmationModal);
}

// Close confirmation modal
function closeConfirmation() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
    // Redirect to dashboard after successful booking
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 500);
  }
}

// Enhanced toast messages with user context
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#22c55e' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    animation: slideIn 0.3s ease;
  `;
  
  const icon = type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
  toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  
  document.body.appendChild(toast);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Add CSS animations for toasts
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

console.log('Booking page JavaScript loaded successfully');
