document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const storedUser = localStorage.getItem('exam_pulse_user');

  if (storedUser && loginBtn) {
    try {
      const user = JSON.parse(storedUser);
      loginBtn.innerHTML = `
        <span>Hi, ${user.name.split(' ')[0]} (${user.role})</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      `;
      loginBtn.title = "Click to Log Out";
      loginBtn.href = "#";
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('exam_pulse_user');
        localStorage.removeItem('exam_pulse_token');
        window.location.reload();
      });
    } catch (err) {
      console.error('Failed to parse user session:', err);
    }
  }
});
