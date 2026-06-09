// Author: NoNameGames - Lou
(function(){
  const pages = window.HOK_WIKI_PAGES || [];
  const nav = document.querySelector('[data-wiki-nav]');
  const content = document.querySelector('[data-wiki-content]');
  const search = document.querySelector('[data-wiki-search]');
  if(!nav || !content) return;
  function stateClass(status){
    if(/erstellt, kein|offen|nicht gefunden|Nur Navigation/i.test(status)) return 'open';
    if(/Teilimport|nicht|offen/i.test(status)) return 'warn';
    return 'ok';
  }
  function renderNav(filter=''){
    nav.innerHTML='';
    const q=filter.trim().toLowerCase();
    const filtered = pages.filter(p => !q || (p.title+' '+p.summary+' '+p.id+' '+(p.sections||[]).map(s=>s.heading+' '+s.body).join(' ')).toLowerCase().includes(q));
    filtered.forEach((p)=>{
      const b=document.createElement('button');
      b.type='button'; b.textContent=p.title; b.dataset.id=p.id;
      b.addEventListener('click',()=>renderPage(p.id));
      nav.appendChild(b);
    });
    if(filtered.length && !pages.some(p=>p.id === (location.hash||'').replace('#',''))) renderPage(filtered[0].id, false);
  }
  function renderPage(id, updateHash=true){
    const page = pages.find(p=>p.id===id) || pages[0];
    if(!page) return;
    if(updateHash) location.hash = page.id;
    document.querySelectorAll('[data-wiki-nav] button').forEach(b=>b.classList.toggle('active',b.dataset.id===page.id));
    const sections = (page.sections || []).map(sec => `<section><h3>${escapeHtml(sec.heading)}</h3><p>${formatInline(sec.body)}</p></section>`).join('');
    const standalone = page.file ? `<a class="btn btn-primary" href="${escapeAttr(page.file)}">Einzelseite öffnen</a>` : '';
    content.innerHTML = `<article class="wiki-page">
      <div class="wiki-meta"><span class="tag ${stateClass(page.status)}">${escapeHtml(page.status)}</span><span class="tag">${escapeHtml(page.id)}</span></div>
      <h2>${escapeHtml(page.title)}</h2>
      <p class="lead" style="color:var(--ink-soft);text-shadow:none">${escapeHtml(page.summary)}</p>
      ${sections}
      <p class="source-link">Originalquelle: ${formatSource(page.url)}</p>
      <div class="callout-row">${standalone}</div>
      <div class="notice danger" style="margin-top:18px"><strong>Importstatus:</strong> ${escapeHtml(page.sourceQuality || page.status)}</div>
    </article>`;
  }
  function formatSource(url){
    if(!url || /^local/.test(url)) return escapeHtml(url || 'lokal');
    return `<a href="${escapeAttr(url)}" target="_blank" rel="noopener">${escapeHtml(url)}</a>`;
  }
  function escapeHtml(s){return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function escapeAttr(s){return escapeHtml(s).replace(/`/g,'&#096;');}
  function formatInline(s){
    return escapeHtml(s).replace(/(\/newchar &lt;Charactername&gt;|\/erp(?: &lt;text&gt;)?|Patch 2\.6|Gothic 2 DNDR|IC\/OOC)/g,'<code>$1</code>');
  }
  search && search.addEventListener('input', e => renderNav(e.target.value));
  renderNav();
  renderPage((location.hash || '').replace('#','') || pages[0]?.id, false);
})();
