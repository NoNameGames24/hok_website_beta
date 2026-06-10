// Local-only mock login. Not authentication.
(() => {
  const form = document.getElementById('developer-login-form');
  const error = document.getElementById('developer-login-error');

  if (sessionStorage.getItem('hokLocalDeveloper') === 'true') {
    location.replace('developer-dashboard.html');
    return;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('developer-username').value;
    const password = document.getElementById('developer-password').value;

    if (username === 'Admin' && password === 'Passwort') {
      sessionStorage.setItem('hokLocalDeveloper', 'true');
      location.href = 'developer-dashboard.html';
      return;
    }

    error.hidden = false;
  });
})();
