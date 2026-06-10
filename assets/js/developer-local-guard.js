// Local-only access guard. Not authentication.
(() => {
  if (sessionStorage.getItem('hokLocalDeveloper') !== 'true') {
    location.replace('developer-login.html');
    return;
  }

  document.getElementById('developer-logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('hokLocalDeveloper');
    location.replace('developer-login.html');
  });
})();
