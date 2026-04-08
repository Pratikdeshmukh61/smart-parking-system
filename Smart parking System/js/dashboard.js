/* ========================================
   DASHBOARD PAGE JAVASCRIPT
   ======================================== */

// Dashboard page specific functionality
document.addEventListener('DOMContentLoaded', function() {
  // Generate live slot map
  const map = document.getElementById('liveMap');
  if (map) {
    const occupied = [1,3,5,7,10,12,15,18,20,22,25,28,30,32,35];
    const totalSlots = 40;
    
    for (let i = 1; i <= totalSlots; i++) {
      const cell = document.createElement('div');
      cell.className = 'slot-cell';
      if (occupied.includes(i)) {
        cell.classList.add('occupied');
        cell.innerHTML = `<i class="fas fa-car"></i>`;
      } else {
        cell.classList.add('available');
        cell.textContent = `A${i}`;
      }
      map.appendChild(cell);
    }
  }

  // Filter functionality for slots
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      const filter = this.textContent.toLowerCase();
      const slots = document.querySelectorAll('.slot-cell');
      
      slots.forEach(slot => {
        if (filter === 'all') {
          slot.style.display = 'flex';
        } else if (filter === 'available' && slot.classList.contains('available')) {
          slot.style.display = 'flex';
        } else if (filter === 'occupied' && slot.classList.contains('occupied')) {
          slot.style.display = 'flex';
        } else {
          slot.style.display = 'none';
        }
      });
    });
  });

  // Slot click handler
  const slotCells = document.querySelectorAll('.slot-cell.available');
  slotCells.forEach(cell => {
    cell.addEventListener('click', function() {
      const slotNumber = this.textContent;
      if (confirm(`Book slot ${slotNumber}?`)) {
        // In a real app, this would make an API call
        alert(`Slot ${slotNumber} booked successfully!`);
        this.classList.remove('available');
        this.classList.add('occupied');
        this.innerHTML = '<i class="fas fa-car"></i>';
        updateStats();
      }
    });
  });

  // Update statistics
  function updateStats() {
    const totalSlots = document.querySelectorAll('.slot-cell').length;
    const occupiedSlots = document.querySelectorAll('.slot-cell.occupied').length;
    const availableSlots = totalSlots - occupiedSlots;
    const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);
    
    // Update stat cards if they exist
    const totalElement = document.querySelector('.stat-value');
    const availableElement = document.querySelectorAll('.stat-value')[1];
    const occupiedElement = document.querySelectorAll('.stat-value')[2];
    const rateElement = document.querySelectorAll('.stat-value')[3];
    
    if (totalElement) totalElement.textContent = totalSlots;
    if (availableElement) availableElement.textContent = availableSlots;
    if (occupiedElement) occupiedElement.textContent = occupiedSlots;
    if (rateElement) rateElement.textContent = occupancyRate + '%';
  }

  // Initialize stats
  updateStats();

  // Sidebar navigation
  const navLinks = document.querySelectorAll('.dash-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      this.classList.add('active');
      
      // In a real app, this would load different content
      const section = this.textContent.trim();
      console.log(`Navigating to ${section}`);
    });
  });

  // Quick action buttons
  const quickBookBtn = document.querySelector('.btn-primary');
  if (quickBookBtn && quickBookBtn.textContent.includes('Quick Book')) {
    quickBookBtn.addEventListener('click', function() {
      // Find first available slot
      const firstAvailable = document.querySelector('.slot-cell.available');
      if (firstAvailable) {
        const slotNumber = firstAvailable.textContent;
        if (confirm(`Quick book slot ${slotNumber}?`)) {
          alert(`Slot ${slotNumber} booked successfully!`);
          firstAvailable.classList.remove('available');
          firstAvailable.classList.add('occupied');
          firstAvailable.innerHTML = '<i class="fas fa-car"></i>';
          updateStats();
        }
      } else {
        alert('No available slots at the moment!');
      }
    });
  }

  // Refresh button
  const refreshBtn = document.querySelector('.btn-secondary');
  if (refreshBtn && refreshBtn.textContent.includes('Refresh')) {
    refreshBtn.addEventListener('click', function() {
      // Simulate refreshing data
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
      this.disabled = true;
      
      setTimeout(() => {
        // Reset some random slots to available (simulate real-time updates)
        const occupiedSlots = document.querySelectorAll('.slot-cell.occupied');
        if (occupiedSlots.length > 5) {
          const randomSlot = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];
          randomSlot.classList.remove('occupied');
          randomSlot.classList.add('available');
          randomSlot.innerHTML = `A${Array.from(randomSlot.parentElement.children).indexOf(randomSlot) + 1}`;
        }
        
        updateStats();
        this.innerHTML = originalText;
        this.disabled = false;
        alert('Slot map refreshed!');
      }, 1500);
    });
  }

  // Export/Report functionality
  const exportBtn = document.querySelector('.btn-outline');
  if (exportBtn && exportBtn.textContent.includes('Export')) {
    exportBtn.addEventListener('click', function() {
      // Generate simple report
      const totalSlots = document.querySelectorAll('.slot-cell').length;
      const occupiedSlots = document.querySelectorAll('.slot-cell.occupied').length;
      const availableSlots = totalSlots - occupiedSlots;
      const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);
      
      const report = `
PARKTECH DASHBOARD REPORT
Generated: ${new Date().toLocaleString()}

TOTAL SLOTS: ${totalSlots}
OCCUPIED: ${occupiedSlots}
AVAILABLE: ${availableSlots}
OCCUPANCY RATE: ${occupancyRate}%
      `;
      
      // Create and download text file
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'parktech-dashboard-report.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Auto-refresh every 30 seconds
  setInterval(() => {
    console.log('Auto-refreshing dashboard data...');
    // In a real app, this would fetch fresh data from API
    updateStats();
  }, 30000);

  console.log('Dashboard page JavaScript loaded successfully');
});
