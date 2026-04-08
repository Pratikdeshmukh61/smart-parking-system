// ══════════════════════════════════════════════════
// PARKTECH — ROUTE PROTECTION SYSTEM
// Pure JavaScript | sessionStorage based
// ══════════════════════════════════════════════════

const AUTH = {
  // Pages jo protected hain (login chahiye)
  protectedPages: [
    'dashboard.html',
    'booking.html',
    'review.html',
  ],

  // Pages jo sirf guests ke liye hain (logged in ho toh redirect)
  guestOnlyPages: [
    'login.html',
    'register.html',
  ],

  // Check karo user logged in hai ya nahi
  isLoggedIn() {
    return sessionStorage.getItem('pt_auth') === 'true';
  },

  // Current page ka naam
  currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  },

  // Login karo (login.html se call hoga)
  login(username, password) {
    const VALID_USERS = [
      { user: 'admin', pass: 'admin' },
      { user: 'parktech', pass: 'park@2025' },
    ];
    const found = VALID_USERS.find(u => u.user === username && u.pass === password);
    if (found) {
      sessionStorage.setItem('pt_auth', 'true');
      sessionStorage.setItem('pt_user', username);
      return true;
    }
    return false;
  },

  // Logout
  logout() {
    sessionStorage.removeItem('pt_auth');
    sessionStorage.removeItem('pt_user');
    sessionStorage.removeItem('pt_redirect');
    window.location.href = 'login.html';
  },

  // Get username
  getUser() {
    return sessionStorage.getItem('pt_user') || 'User';
  },

  // ── MAIN GUARD ──
  guard() {
    const page = this.currentPage();
    const loggedIn = this.isLoggedIn();

    // Protected page + not logged in → redirect to login
    if (this.protectedPages.includes(page) && !loggedIn) {
      // Save where they were trying to go
      sessionStorage.setItem('pt_redirect', page);
      sessionStorage.setItem('pt_message', `🔐 Please login to access "${page.replace('.html','').replace('-',' ')}"`);
      window.location.href = 'login.html';
      return false;
    }

    // Guest-only page + already logged in → redirect to dashboard
    if (this.guestOnlyPages.includes(page) && loggedIn) {
      window.location.href = 'dashboard.html';
      return false;
    }

    return true;
  },

  // Show alert message on login page if redirected
  showRedirectMessage() {
    const msg = sessionStorage.getItem('pt_message');
    if (!msg) return;
    sessionStorage.removeItem('pt_message');

    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
      background: #1e293b; color: #fff;
      padding: 1rem 2rem; border-radius: 12px;
      border-left: 4px solid #f0a500;
      font-family: 'DM Sans', sans-serif; font-size: 0.92rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      z-index: 9999; display: flex; align-items: center; gap: 0.75rem;
      animation: slideDown 0.4s ease;
      max-width: 90vw; text-align: center;
    `;
    banner.innerHTML = `
      <i class="fas fa-lock" style="color:#f0a500;font-size:1rem"></i>
      <span>${msg}</span>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:1.1rem;margin-left:0.5rem">✕</button>
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`;
    document.head.appendChild(style);
    document.body.appendChild(banner);
    setTimeout(() => { if(banner.parentElement) banner.remove(); }, 5000);
  },

  // After login — go to where user wanted
  redirectAfterLogin() {
    const target = sessionStorage.getItem('pt_redirect') || 'dashboard.html';
    sessionStorage.removeItem('pt_redirect');
    window.location.href = target;
  },

  // Inject user info in navbar
  injectUserBadge() {
    if (!this.isLoggedIn()) return;
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Remove existing login link
    const loginLink = navLinks.querySelector('a[href="login.html"]');
    if (loginLink) loginLink.parentElement.remove();

    // Add user badge
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0.8rem;
        background:rgba(240,165,0,0.1);border:1px solid rgba(240,165,0,0.25);
        border-radius:50px;cursor:pointer;position:relative" id="userBadge">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--gold);
          display:flex;align-items:center;justify-content:center;
          font-family:'Syne',sans-serif;font-weight:800;color:var(--navy);font-size:0.8rem">
          ${this.getUser().charAt(0).toUpperCase()}
        </div>
        <span style="color:rgba(255,255,255,0.85);font-size:0.85rem;font-weight:500">
          ${this.getUser()}
        </span>
        <i class="fas fa-chevron-down" style="color:rgba(255,255,255,0.4);font-size:0.65rem"></i>
        <div id="userDropdown" style="display:none;position:absolute;top:110%;right:0;
          background:#111827;border:1px solid rgba(240,165,0,0.15);
          border-radius:12px;min-width:160px;overflow:hidden;
          box-shadow:0 20px 60px rgba(0,0,0,0.4);z-index:1000">
          <a href="dashboard.html" style="display:flex;align-items:center;gap:0.75rem;
            padding:0.75rem 1rem;color:rgba(255,255,255,0.75);font-size:0.88rem;
            text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.05)">
            <i class="fas fa-gauge-high" style="color:#f0a500;width:16px"></i> Dashboard
          </a>
          <a href="booking.html" style="display:flex;align-items:center;gap:0.75rem;
            padding:0.75rem 1rem;color:rgba(255,255,255,0.75);font-size:0.88rem;
            text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.05)">
            <i class="fas fa-car" style="color:#f0a500;width:16px"></i> My Bookings
          </a>
          <button onclick="AUTH.logout()" style="width:100%;display:flex;align-items:center;gap:0.75rem;
            padding:0.75rem 1rem;color:#ef4444;font-size:0.88rem;
            background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;
            text-align:left">
            <i class="fas fa-sign-out-alt" style="width:16px"></i> Logout
          </button>
        </div>
      </div>
    `;
    navLinks.appendChild(li);

    // Toggle dropdown
    document.getElementById('userBadge').addEventListener('click', () => {
      const dd = document.getElementById('userDropdown');
      dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#userBadge')) {
        const dd = document.getElementById('userDropdown');
        if (dd) dd.style.display = 'none';
      }
    });
  }
};

// ── AUTO RUN on every page ──
document.addEventListener('DOMContentLoaded', () => {
  AUTH.guard();
  AUTH.showRedirectMessage();
  AUTH.injectUserBadge();
});

window.AUTH = AUTH;
