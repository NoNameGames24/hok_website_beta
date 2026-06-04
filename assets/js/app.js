(function(){
  const year = document.querySelector('[data-year]');
  if(year) year.textContent = new Date().getFullYear();
  const current = document.body.dataset.page || location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('.navlinks a').forEach(a => {
    const key = a.dataset.page || a.getAttribute('href').replace('.html','');
    if(key === current) a.setAttribute('aria-current','page');
  });
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.querySelector('.snowflake')){
    const count = Math.min(24, Math.floor(window.innerWidth/60));
    for(let i=0;i<count;i++){
      const f=document.createElement('span');
      f.className='snowflake'; f.textContent = i%4===0 ? '✦' : '•';
      f.style.left = Math.random()*100+'vw';
      f.style.animationDuration = (8+Math.random()*12)+'s';
      f.style.animationDelay = (-Math.random()*12)+'s';
      f.style.fontSize = (10+Math.random()*10)+'px';
      f.style.opacity = String(.25+Math.random()*.55);
      document.body.appendChild(f);
    }
  }
})();
