(() => {
  'use strict';
  const api = window.HoKLocal;
  const pages = window.HoKEditablePages || [];
  const search = document.getElementById('developer-page-search');
  const groups = document.getElementById('developer-page-groups');
  const summary = document.getElementById('developer-page-summary');
  const warning = document.getElementById('local-protocol-warning');
  if (location.protocol === 'file:') warning.hidden = false;

  function render() {
    const query = search.value.trim().toLowerCase();
    const overrides = api.getPageOverrides();
    const siteSettings = api.getSite();
    const filtered = pages.filter(page => `${page.title} ${page.file} ${page.group}`.toLowerCase().includes(query));
    summary.textContent = `${filtered.length} von ${pages.length} Seiten`;
    groups.replaceChildren();

    const grouped = new Map();
    filtered.forEach(page => {
      if (!grouped.has(page.group)) grouped.set(page.group, []);
      grouped.get(page.group).push(page);
    });

    grouped.forEach((entries, groupName) => {
      const section = document.createElement('section');
      section.className = 'developer-panel developer-page-group';
      const heading = document.createElement('div');
      heading.className = 'developer-list-heading';
      heading.innerHTML = `<h2></h2><small></small>`;
      heading.querySelector('h2').textContent = groupName;
      heading.querySelector('small').textContent = `${entries.length} Seiten`;
      const grid = document.createElement('div');
      grid.className = 'developer-page-card-grid';

      entries.forEach(page => {
        const card = document.createElement('article');
        card.className = 'developer-page-card';
        const changed = page.mode === 'start' ? (Object.keys(siteSettings).length > 0 || Boolean(overrides[page.file])) : Boolean(overrides[page.file]);
        card.innerHTML = `<div><small class="developer-page-file"></small><h3></h3><span class="developer-page-status"></span></div><div class="developer-entry-actions"></div>`;
        card.querySelector('.developer-page-file').textContent = page.file;
        card.querySelector('h3').textContent = page.title;
        const status = card.querySelector('.developer-page-status');
        status.textContent = changed ? 'Lokal angepasst' : 'Originalzustand';
        status.classList.toggle('is-customized', changed);
        const actions = card.querySelector('.developer-entry-actions');
        const edit = document.createElement('a');
        edit.className = 'developer-primary-button';
        edit.textContent = page.mode === 'start' ? 'Startseite einstellen' : 'Bearbeiten';
        edit.href = page.mode === 'start' ? 'developer-startseite.html' : `developer-seite-bearbeiten.html?file=${encodeURIComponent(page.file)}`;
        const detail = page.mode === 'start' ? document.createElement('a') : null;
        if (detail) {
          detail.className = 'developer-secondary-button';
          detail.textContent = 'Inhalt im Detail';
          detail.href = `developer-seite-bearbeiten.html?file=${encodeURIComponent(page.file)}`;
        }
        const open = document.createElement('a');
        open.className = 'developer-secondary-button';
        open.textContent = 'Öffnen';
        open.target = '_blank';
        open.href = page.file;
        actions.append(edit);
        if (detail) actions.append(detail);
        actions.append(open);
        card.appendChild(actions);
        grid.appendChild(card);
      });

      section.append(heading, grid);
      groups.appendChild(section);
    });
  }
  search.addEventListener('input', render);
  render();
})();