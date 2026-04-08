// ════════════════════════════════════════
// DARK MODE
// ════════════════════════════════════════
const darkToggle = document.getElementById('darkToggle');
const prefersDark = localStorage.getItem('darkMode') === 'true';
if (prefersDark) document.body.classList.add('dark-mode');

if (darkToggle) {
  darkToggle.checked = prefersDark;
  darkToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', darkToggle.checked);
    localStorage.setItem('darkMode', darkToggle.checked);
  });
}

// Apply dark mode on load for all pages
(function() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
})();

// ════════════════════════════════════════
// TOAST NOTIFICATION SYSTEM
// ════════════════════════════════════════
function showToast(message, type = 'success', duration = 3500) {
  const existing = document.querySelector('.pt-toast');
  if (existing) existing.remove();

  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  const colors = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };

  const toast = document.createElement('div');
  toast.className = 'pt-toast';
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span><button onclick="this.parentElement.remove()">✕</button>`;
  toast.style.cssText = `
    position:fixed; top:90px; right:24px; z-index:9999;
    background:var(--navy-light,#111827); color:#fff;
    padding:1rem 1.2rem; border-radius:12px;
    border-left:4px solid ${colors[type]};
    display:flex; align-items:center; gap:0.75rem;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
    font-family:'DM Sans',sans-serif; font-size:0.9rem;
    animation:slideInToast 0.4s ease;
    max-width:340px;
  `;
  toast.querySelector('i').style.color = colors[type];
  toast.querySelector('button').style.cssText = 'background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:1rem;margin-left:0.5rem;';

  const style = document.createElement('style');
  style.textContent = `@keyframes slideInToast{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}`;
  document.head.appendChild(style);

  document.body.appendChild(toast);
  setTimeout(() => { if(toast.parentElement) toast.remove(); }, duration);
}
window.showToast = showToast;

// ════════════════════════════════════════
// COUNTDOWN TIMER
// ════════════════════════════════════════
function startCountdown(elementId, targetTime) {
  const el = document.getElementById(elementId);
  if (!el) return;
  function update() {
    const now = new Date().getTime();
    const diff = targetTime - now;
    if (diff <= 0) { el.textContent = 'EXPIRED'; el.style.color = '#ef4444'; return; }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (diff < 1800000) el.style.color = '#f59e0b';
    if (diff < 600000) el.style.color = '#ef4444';
  }
  update();
  setInterval(update, 1000);
}
window.startCountdown = startCountdown;

// ════════════════════════════════════════
// PDF INVOICE GENERATOR
// ════════════════════════════════════════
function generateInvoice(bookingData) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const gold = [240, 165, 0];
  const navy = [10, 15, 30];
  const gray = [100, 116, 139];

  // Header background
  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 45, 'F');

  // Logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...gold);
  doc.text('ParkTech', 20, 22);
  doc.setTextColor(255, 255, 255);
  doc.text(' Solutions', 58, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text('Smart Parking Technology', 20, 30);
  doc.text('Pune, Maharashtra | support@parktech.in', 20, 37);

  // Invoice title
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('PARKING INVOICE', 150, 20, { align: 'right' });
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text(`#${bookingData.id || 'PT-' + Date.now().toString().slice(-6)}`, 190, 28, { align: 'right' });

  // Gold separator line
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(0, 47, 210, 47);

  // Booking details section
  doc.setFillColor(248, 249, 250);
  doc.rect(0, 48, 210, 60, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...navy);
  doc.text('CUSTOMER DETAILS', 20, 62);
  doc.text('BOOKING DETAILS', 120, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...gray);

  // Customer info
  const customer = [
    ['Name:', bookingData.name || 'N/A'],
    ['Mobile:', bookingData.mobile || 'N/A'],
    ['Email:', bookingData.email || 'N/A'],
    ['Vehicle:', bookingData.vehicle || 'N/A'],
  ];
  customer.forEach(([label, val], i) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gray);
    doc.text(label, 20, 72 + i * 9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...navy);
    doc.text(val, 45, 72 + i * 9);
  });

  // Booking info
  const booking = [
    ['Slot:', bookingData.slot || 'A-12'],
    ['Plan:', bookingData.plan || 'Daily'],
    ['Check-In:', bookingData.checkin || 'N/A'],
    ['Check-Out:', bookingData.checkout || 'N/A'],
  ];
  booking.forEach(([label, val], i) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gray);
    doc.text(label, 120, 72 + i * 9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...navy);
    doc.text(val, 145, 72 + i * 9);
  });

  // Amount section
  doc.setFillColor(...navy);
  doc.rect(0, 115, 210, 50, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('PAYMENT SUMMARY', 20, 132);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text('Base Amount:', 20, 145);
  doc.text('GST (18%):', 20, 154);

  const base = bookingData.amount || 0;
  const gst = Math.round(base * 0.18);
  const total = base + gst;

  doc.setTextColor(255, 255, 255);
  doc.text(`Rs. ${base}`, 190, 145, { align: 'right' });
  doc.text(`Rs. ${gst}`, 190, 154, { align: 'right' });

  doc.setDrawColor(255, 255, 255, 0.2);
  doc.line(20, 158, 190, 158);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...gold);
  doc.text('TOTAL:', 20, 168);
  doc.text(`Rs. ${total}`, 190, 168, { align: 'right' });

  // Status badge
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(20, 175, 40, 12, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('PAID', 40, 183, { align: 'center' });

  // Footer
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(0, 270, 210, 270);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text('Thank you for choosing ParkTech Solutions!', 105, 278, { align: 'center' });
  doc.text('For support: support@parktech.in | +91 98765 43210 | www.parktech.in', 105, 285, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, 292, { align: 'center' });

  doc.save(`ParkTech_Invoice_${bookingData.id || Date.now()}.pdf`);
  showToast('Invoice downloaded successfully!', 'success');
}
window.generateInvoice = generateInvoice;

// ════════════════════════════════════════
// MOBILE BOTTOM NAV — inject dynamically
// ════════════════════════════════════════
(function injectBottomNav() {
  const style = document.createElement('style');
  style.textContent = `
    .bottom-nav {
      display: none;
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 900;
      background: var(--navy, #0a0f1e);
      border-top: 1px solid rgba(240,165,0,0.15);
      padding: 0.5rem 0 0.75rem;
      backdrop-filter: blur(16px);
    }
    .bottom-nav-inner {
      display: flex; justify-content: space-around; align-items: center;
    }
    .bottom-nav-item {
      display: flex; flex-direction: column; align-items: center;
      gap: 0.2rem; padding: 0.4rem 1rem;
      color: rgba(255,255,255,0.45); font-size: 0.65rem;
      font-family: 'DM Sans', sans-serif; font-weight: 500;
      text-decoration: none; transition: all 0.2s ease;
      border-radius: 10px; min-width: 60px;
    }
    .bottom-nav-item i { font-size: 1.2rem; }
    .bottom-nav-item.active, .bottom-nav-item:hover {
      color: #f0a500;
      background: rgba(240,165,0,0.08);
    }
    .bottom-nav-book {
      background: #f0a500 !important;
      color: #0a0f1e !important;
      border-radius: 14px; padding: 0.5rem 1.2rem;
      margin-top: -12px;
      box-shadow: 0 4px 20px rgba(240,165,0,0.4);
    }
    .bottom-nav-book:hover { background: #fbbf24 !important; }
    @media (max-width: 768px) {
      .bottom-nav { display: block; }
      body { padding-bottom: 70px; }
    }
  `;
  document.head.appendChild(style);

  const current = window.location.pathname.split('/').pop() || 'index.html';
  const isActive = (page) => current === page ? 'active' : '';

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <div class="bottom-nav-inner">
      <a href="index.html" class="bottom-nav-item ${isActive('index.html')}">
        <i class="fas fa-home"></i><span>Home</span>
      </a>
      <a href="services.html" class="bottom-nav-item ${isActive('services.html')}">
        <i class="fas fa-cogs"></i><span>Services</span>
      </a>
      <a href="booking.html" class="bottom-nav-item bottom-nav-book">
        <i class="fas fa-car"></i><span>Book</span>
      </a>
      <a href="dashboard.html" class="bottom-nav-item ${isActive('dashboard.html')}">
        <i class="fas fa-gauge-high"></i><span>Dashboard</span>
      </a>
      <a href="login.html" class="bottom-nav-item ${isActive('login.html')}">
        <i class="fas fa-user"></i><span>Profile</span>
      </a>
    </div>
  `;
  document.body.appendChild(nav);
})();

// ════════════════════════════════════════
// PRICING CALCULATOR (for pricing page)
// ════════════════════════════════════════
function initPricingCalc() {
  const calc = document.getElementById('pricingCalc');
  if (!calc) return;
  calc.innerHTML = `
    <div style="background:var(--white);border-radius:20px;padding:2.5rem;box-shadow:0 8px 40px rgba(0,0,0,0.08);max-width:560px;margin:0 auto">
      <h3 style="font-family:'Syne',sans-serif;font-size:1.4rem;margin-bottom:1.5rem;text-align:center">
        💰 Parking Cost Calculator
      </h3>
      <div style="margin-bottom:1.5rem">
        <label style="font-weight:600;display:block;margin-bottom:0.5rem">Select Plan</label>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem" id="planBtns">
          <button onclick="setPlan('hourly',20,this)" style="padding:0.75rem;border-radius:10px;border:2px solid #e5e7eb;cursor:pointer;font-weight:600;font-family:'DM Sans',sans-serif;background:#fff;transition:all 0.2s">Hourly<br><small style="color:#9ca3af">₹20/hr</small></button>
          <button onclick="setPlan('daily',150,this)" style="padding:0.75rem;border-radius:10px;border:2px solid #f0a500;cursor:pointer;font-weight:600;font-family:'DM Sans',sans-serif;background:rgba(240,165,0,0.08);transition:all 0.2s">Daily<br><small style="color:#9ca3af">₹150/day</small></button>
          <button onclick="setPlan('monthly',2000,this)" style="padding:0.75rem;border-radius:10px;border:2px solid #e5e7eb;cursor:pointer;font-weight:600;font-family:'DM Sans',sans-serif;background:#fff;transition:all 0.2s">Monthly<br><small style="color:#9ca3af">₹2000/mo</small></button>
        </div>
      </div>
      <div style="margin-bottom:1.5rem">
        <label style="font-weight:600;display:block;margin-bottom:0.75rem">Duration: <span id="durLabel" style="color:#f0a500">1 Day</span></label>
        <input type="range" id="durSlider" min="1" max="30" value="1" oninput="updateCalc()" style="width:100%;accent-color:#f0a500;height:6px">
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#9ca3af;margin-top:0.5rem">
          <span>Min</span><span>Max</span>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#0a0f1e,#1a2340);border-radius:16px;padding:2rem;text-align:center">
        <div style="font-size:0.8rem;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:0.5rem">Total Cost</div>
        <div id="calcTotal" style="font-family:'Syne',sans-serif;font-size:3rem;font-weight:800;color:#f0a500;line-height:1">₹150</div>
        <div id="calcNote" style="color:rgba(255,255,255,0.4);font-size:0.85rem;margin-top:0.5rem">1 day × ₹150</div>
        <div id="savingsNote" style="margin-top:0.75rem;font-size:0.82rem;color:#22c55e"></div>
      </div>
      <a href="booking.html" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-top:1.5rem;padding:1rem;background:#f0a500;color:#0a0f1e;border-radius:12px;font-weight:700;font-family:'Syne',sans-serif;font-size:1rem;text-decoration:none;transition:all 0.2s">
        <i class="fas fa-car"></i> Book Now
      </a>
    </div>
  `;
  window._calcPlan = 'daily';
  window._calcRate = 150;
  window._calcUnit = 'day';
}

function setPlan(plan, rate, btn) {
  window._calcPlan = plan;
  window._calcRate = rate;
  window._calcUnit = plan === 'hourly' ? 'hour' : plan === 'daily' ? 'day' : 'month';
  const slider = document.getElementById('durSlider');
  slider.max = plan === 'hourly' ? 24 : plan === 'daily' ? 30 : 12;
  slider.value = 1;
  document.querySelectorAll('#planBtns button').forEach(b => {
    b.style.borderColor = '#e5e7eb';
    b.style.background = '#fff';
  });
  btn.style.borderColor = '#f0a500';
  btn.style.background = 'rgba(240,165,0,0.08)';
  updateCalc();
}

function updateCalc() {
  const dur = parseInt(document.getElementById('durSlider').value);
  const rate = window._calcRate || 150;
  const unit = window._calcUnit || 'day';
  const plan = window._calcPlan || 'daily';
  const total = dur * rate;
  document.getElementById('durLabel').textContent = `${dur} ${unit}${dur > 1 ? 's' : ''}`;
  document.getElementById('calcTotal').textContent = `₹${total.toLocaleString()}`;
  document.getElementById('calcNote').textContent = `${dur} ${unit}${dur > 1 ? 's' : ''} × ₹${rate}`;

  // Savings comparison
  const savings = document.getElementById('savingsNote');
  if (plan === 'hourly' && dur >= 8) {
    const dailySaving = total - 150;
    if (dailySaving > 0) savings.textContent = `💡 Switch to Daily and save ₹${dailySaving}!`;
    else savings.textContent = '';
  } else if (plan === 'daily' && dur >= 20) {
    const monthlySaving = total - 2000;
    if (monthlySaving > 0) savings.textContent = `💡 Switch to Monthly and save ₹${monthlySaving}!`;
    else savings.textContent = '';
  } else {
    savings.textContent = '';
  }
}
window.setPlan = setPlan;
window.updateCalc = updateCalc;

// ════════════════════════════════════════
// SKELETON LOADER
// ════════════════════════════════════════
function showSkeleton(container, count = 3) {
  const skeletonStyle = `
    .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
    .dark-mode .skeleton { background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%); background-size: 200% 100%; }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  `;
  if (!document.getElementById('skeletonStyle')) {
    const s = document.createElement('style');
    s.id = 'skeletonStyle';
    s.textContent = skeletonStyle;
    document.head.appendChild(s);
  }
  container.innerHTML = Array(count).fill(`
    <div style="background:#fff;border-radius:16px;padding:1.5rem;border:1px solid #e5e7eb;margin-bottom:1rem">
      <div class="skeleton" style="height:20px;width:60%;margin-bottom:0.75rem"></div>
      <div class="skeleton" style="height:14px;width:90%;margin-bottom:0.5rem"></div>
      <div class="skeleton" style="height:14px;width:75%;margin-bottom:0.5rem"></div>
      <div class="skeleton" style="height:36px;width:120px;margin-top:1rem"></div>
    </div>
  `).join('');
}
window.showSkeleton = showSkeleton;

// Init pricing calc if element exists
document.addEventListener('DOMContentLoaded', initPricingCalc);
