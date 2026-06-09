// NoNameGames - Lou
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

  if(window.innerWidth > 700 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.querySelector('.snowflake')){
    const count = Math.min(18, Math.floor(window.innerWidth/90));
    for(let i=0;i<count;i++){
      const f=document.createElement('span');
      f.className='snowflake';
      f.textContent = i%4===0 ? '✦' : '•';
      f.style.left = Math.random()*100+'vw';
      f.style.animationDuration = (9+Math.random()*12)+'s';
      f.style.animationDelay = (-Math.random()*12)+'s';
      f.style.fontSize = (10+Math.random()*10)+'px';
      f.style.opacity = String(.22+Math.random()*.48);
      document.body.appendChild(f);
    }
  }
})();
