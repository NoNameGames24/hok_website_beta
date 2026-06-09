// Author: NoNameGames - Lou
(function(){
  const data = window.HOK_PROJECT_STATUS || [];
  const tbody = document.querySelector('[data-status-table]');
  if(!tbody) return;
  tbody.innerHTML = data.map(row => `<tr><td>${esc(row.area)}</td><td><span class="tag ${cls(row.state)}">${esc(row.state)}</span></td><td>${esc(row.details)}</td></tr>`).join('');
  function esc(s){return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function cls(s){return /fertig/i.test(s)?'ok':(/offen/i.test(s)?'open':'warn');}
})();
