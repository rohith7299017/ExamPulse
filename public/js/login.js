document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const selectedRoleInput = document.getElementById('selectedRole');
  const roleButtons = document.querySelectorAll('.role-btn');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIcon = document.getElementById('eyeIcon');
  const alertBox = document.getElementById('alertBox');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const demoChips = document.querySelectorAll('.demo-chip');
  const forgotPassBtn = document.getElementById('forgotPassBtn');

  // Role selector buttons
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.getAttribute('data-role');
      selectedRoleInput.value = role;
    });
  });

  // Password visibility toggle
  let isPasswordVisible = false;
  togglePasswordBtn.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    eyeIcon.innerHTML = isPasswordVisible
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  });

  // Demo Chips quick fill
  demoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const demoEmail = chip.getAttribute('data-email');
      const demoPass = chip.getAttribute('data-pass');
      const demoRole = chip.getAttribute('data-role');

      emailInput.value = demoEmail;
      passwordInput.value = demoPass;
      
      // Select corresponding role button
      const targetRoleBtn = Array.from(roleButtons).find(b => b.getAttribute('data-role') === demoRole);
      if (targetRoleBtn) {
        targetRoleBtn.click();
      }

      hideAlert();
    });
  });

  // Forgot password notice
  if (forgotPassBtn) {
    forgotPassBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAlert('Password reset link has been dispatched to your administrator.', 'info');
    });
  }

  // Form submit handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = selectedRoleInput.value;

    if (!email || !password) {
      showAlert('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      showAlert(`Welcome back, ${data.user.name}! Redirecting to dashboard...`, 'success');
      
      // Store session metadata
      localStorage.setItem('exam_pulse_user', JSON.stringify(data.user));
      localStorage.setItem('exam_pulse_token', data.token);

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  });

  function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.classList.remove('hidden');
  }

  function hideAlert() {
    alertBox.classList.add('hidden');
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      btnText.textContent = 'Signing in...';
      btnSpinner.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      btnText.textContent = 'Sign In';
      btnSpinner.classList.add('hidden');
    }
  }
});
