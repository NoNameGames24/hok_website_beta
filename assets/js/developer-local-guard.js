// Author: NoNameGames - Lou
(() => {
  'use strict';

  const auth = window.HoKAuth;
  if (!auth) {
    window.HoKAccessDenied = true;
    location.replace('developer-login.html');
    return;
  }

  const user = auth.getCurrentUser();
  if (!user) {
    window.HoKAccessDenied = true;
    sessionStorage.setItem('hokLocalLoginNext', `${location.pathname.split('/').pop() || 'developer-dashboard.html'}${location.search}`);
    location.replace('developer-login.html');
    return;
  }

  const requiredPermission = document.body?.dataset.requiredPermission || '';
  if (requiredPermission && !auth.hasPermission(requiredPermission, user)) {
    window.HoKAccessDenied = true;
    sessionStorage.setItem('hokLocalAccessMessage', 'Für diesen Bereich fehlen deinem Account die erforderlichen Rechte.');
    location.replace('developer-dashboard.html');
    return;
  }

  window.HoKAccessDenied = false;
  auth.applyCurrentUserUI();

  const flash = sessionStorage.getItem('hokLocalAccessMessage');
  const flashNode = document.getElementById('developer-access-message');
  if (flash && flashNode) {
    flashNode.textContent = flash;
    flashNode.hidden = false;
    sessionStorage.removeItem('hokLocalAccessMessage');
  }

  document.getElementById('developer-logout')?.addEventListener('click', () => {
    auth.logout();
    location.replace('developer-login.html');
  });
})();
