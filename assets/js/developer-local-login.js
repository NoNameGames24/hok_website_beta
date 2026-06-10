// Author: NoNameGames - Lou
(() => {
  'use strict';

  const auth = window.HoKAuth;
  const loginForm = document.getElementById('developer-login-form');
  const registerForm = document.getElementById('developer-register-form');
  const loginError = document.getElementById('developer-login-error');
  const registerError = document.getElementById('developer-register-error');
  const registerSuccess = document.getElementById('developer-register-success');
  const loginButton = loginForm?.querySelector('button[type="submit"]');
  const registerButton = registerForm?.querySelector('button[type="submit"]');
  const protocolWarning = document.getElementById('file-protocol-warning');
  if (protocolWarning && location.protocol === 'file:') protocolWarning.hidden = false;

  function setMessage(node, message) {
    if (!node) return;
    node.textContent = message || '';
    node.hidden = !message;
  }

  function nextPage() {
    const stored = sessionStorage.getItem('hokLocalLoginNext');
    sessionStorage.removeItem('hokLocalLoginNext');
    return stored && /^developer-[a-z0-9-]+\.html(?:\?.*)?$/i.test(stored) ? stored : 'developer-dashboard.html';
  }

  auth.ready.then(() => {
    if (auth.getCurrentUser()) location.replace(nextPage());
  });

  loginForm?.addEventListener('submit', async event => {
    event.preventDefault();
    setMessage(loginError, '');
    loginButton.disabled = true;
    try {
      const result = await auth.authenticate(
        document.getElementById('developer-username').value,
        document.getElementById('developer-password').value
      );
      if (!result.ok) {
        setMessage(loginError, result.message);
        return;
      }
      location.href = nextPage();
    } catch (error) {
      setMessage(loginError, error.message || 'Die Anmeldung ist fehlgeschlagen.');
    } finally {
      loginButton.disabled = false;
    }
  });

  registerForm?.addEventListener('submit', async event => {
    event.preventDefault();
    setMessage(registerError, '');
    setMessage(registerSuccess, '');

    const password = document.getElementById('register-password').value;
    const confirmation = document.getElementById('register-password-confirm').value;
    if (password !== confirmation) {
      setMessage(registerError, 'Die Passwörter stimmen nicht überein.');
      return;
    }

    registerButton.disabled = true;
    try {
      await auth.register({
        displayName: document.getElementById('register-display-name').value,
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        password
      });
      registerForm.reset();
      setMessage(registerSuccess, 'Der Account wurde erstellt und wartet auf Freigabe durch einen Admin. Eine Anmeldung ist erst nach der Annahme möglich.');
    } catch (error) {
      setMessage(registerError, error.message || 'Der Account konnte nicht erstellt werden.');
    } finally {
      registerButton.disabled = false;
    }
  });
})();
