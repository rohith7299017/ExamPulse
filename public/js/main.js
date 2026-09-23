document.addEventListener('DOMContentLoaded', () => {
  const loginButtons = document.querySelectorAll('.login-trigger');
  const toastContainer = document.getElementById('toastContainer');

  let activeToast = null;

  loginButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginNotice();
    });
  });

  function showLoginNotice() {
    if (activeToast) {
      activeToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="toast-body">
        <span class="toast-title">Authentication In Progress</span>
        <span class="toast-desc">Login functionality will be implemented in a dedicated branch.</span>
      </div>
    `;

    toastContainer.appendChild(toast);
    activeToast = toast;

    setTimeout(() => {
      if (activeToast === toast) {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }
});
