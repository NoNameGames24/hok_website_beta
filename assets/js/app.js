// Author: NoNameGames - Lou
(function(){
  const year = document.querySelector('[data-year]');
  if(year) year.textContent = new Date().getFullYear();

  const current = document.body.dataset.page || location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('.navlinks a[data-page]').forEach(a => {
    const key = a.dataset.page || a.getAttribute('href').replace('.html','');
    if(key === current) a.setAttribute('aria-current','page');
  });

  const topbar = document.querySelector('.topbar');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.navlinks');
  const mobileBp = window.matchMedia('(max-width: 980px)');

  const closeMenu = () => {
    if(!topbar || !toggle) return;
    topbar.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Menü öffnen');
  };
  const openMenu = () => {
    if(!topbar || !toggle) return;
    topbar.classList.add('menu-open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Menü schließen');
  };

  if(toggle && topbar && nav){
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      if(mobileBp.matches) closeMenu();
    }));
    window.addEventListener('resize', () => {
      if(!mobileBp.matches) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') closeMenu();
    });
  }

  // Decorative snow particles were removed because they could cover interactive homepage icons.
})();
