(() => {
  'use strict';
  const api = window.HoKLocal;
  const library = window.HoKImageLibrary || [];
  const form = document.getElementById('local-news-form');
  const list = document.getElementById('local-news-list');
  const cancel = document.getElementById('local-news-cancel');
  const warning = document.getElementById('local-protocol-warning');
  if (location.protocol === 'file:') warning.hidden = false;

  let items = api.getNews(true);
  const el = id => document.getElementById(id);
  const toInputDate = value => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return value;
    const m = String(value || '').match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
    return m ? `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}` : '';
  };

  function optimizeImage(file, maxWidth = 1920, maxHeight = 1080, quality = .86) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('error', () => reject(new Error('Datei konnte nicht gelesen werden.')));
      reader.addEventListener('load', () => {
        const image = new Image();
        image.addEventListener('error', () => reject(new Error('Bild konnte nicht verarbeitet werden.')));
        image.addEventListener('load', () => {
          const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/webp', quality));
        });
        image.src = reader.result;
      });
      reader.readAsDataURL(file);
    });
  }

  function createPicker(prefix, defaultValue) {
    const hidden = el(`${prefix}`);
    const select = el(`${prefix}-select`);
    const file = el(`${prefix}-file`);
    const preview = el(`${prefix}-preview`);
    let pending = false;

    function fill(value) {
      select.replaceChildren();
      library.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry.value;
        option.textContent = entry.label;
        select.appendChild(option);
      });
      const isLibraryValue = library.some(entry => entry.value === value);
      if (value && !isLibraryValue) {
        const custom = document.createElement('option');
        custom.value = value;
        custom.textContent = value.startsWith('data:') ? 'Eigenes hochgeladenes Bild' : `Eigener Pfad: ${value}`;
        select.prepend(custom);
      }
      select.value = value || defaultValue;
    }

    function set(value) {
      const next = value || defaultValue;
      hidden.value = next;
      preview.src = next;
      fill(next);
    }

    select.addEventListener('change', () => set(select.value));
    file.addEventListener('change', async () => {
      const selected = file.files[0];
      if (!selected) return;
      try {
        pending = true;
        file.disabled = true;
        set(await optimizeImage(selected));
      } catch (error) {
        alert(error.message);
      } finally {
        pending = false;
        file.disabled = false;
      }
    });

    set(defaultValue);
    return { set, get: () => hidden.value, isPending: () => pending };
  }

  const imagePicker = createPicker('local-news-image', 'assets/images/painting-02.webp');
  const bannerPicker = createPicker('local-news-banner', 'assets/images/hero-page-aktuelles.webp');

  function clear() {
    form.reset();
    el('local-news-id').value = '';
    imagePicker.set('assets/images/painting-02.webp');
    bannerPicker.set('assets/images/hero-page-aktuelles.webp');
    el('local-news-form-heading').textContent = 'Beitrag erstellen';
    cancel.hidden = true;
  }

  function edit(item) {
    el('local-news-id').value = item.id;
    el('local-news-title').value = item.title || '';
    el('local-news-date').value = toInputDate(item.date);
    el('local-news-teaser').value = item.teaser || '';
    el('local-news-body').value = Array.isArray(item.body) ? item.body.join('\n\n') : (item.body || '');
    imagePicker.set(item.image || 'assets/images/painting-02.webp');
    bannerPicker.set(item.banner || item.image || 'assets/images/hero-page-aktuelles.webp');
    el('local-news-form-heading').textContent = 'Beitrag bearbeiten';
    cancel.hidden = false;
    scrollTo({top:0,behavior:'smooth'});
  }

  function save() {
    api.setNews(items);
    render();
  }

  function render() {
    items = api.getNews(true);
    list.replaceChildren();
    items.forEach(item => {
      const card = document.createElement('article');
      card.className = `developer-entry developer-news-entry${item.deleted ? ' is-deleted' : ''}`;
      const thumb = document.createElement('img');
      thumb.className = 'developer-news-thumb';
      thumb.src = item.image || 'assets/images/painting-02.webp';
      thumb.alt = '';
      const content = document.createElement('div');
      content.innerHTML = `<small></small><h3></h3><p></p><div class="developer-entry-actions"></div>`;
      content.querySelector('small').textContent = item.date || '';
      content.querySelector('h3').textContent = item.title || 'Ohne Titel';
      content.querySelector('p').textContent = item.teaser || '';
      const actions = content.querySelector('.developer-entry-actions');

      const editBtn = document.createElement('button');
      editBtn.type='button'; editBtn.className='developer-secondary-button'; editBtn.textContent='Bearbeiten';
      editBtn.addEventListener('click',()=>edit(item));

      const delBtn = document.createElement('button');
      delBtn.type='button'; delBtn.className='developer-secondary-button'; delBtn.textContent=item.deleted?'Wiederherstellen':'Löschen';
      delBtn.addEventListener('click',()=>{ item.deleted=!item.deleted; save(); });

      const open = document.createElement('a');
      open.className='developer-secondary-button';
      open.target='_blank';
      open.href=`aktuelles/beitrag.html?slug=${encodeURIComponent(item.slug || item.id)}`;
      open.textContent='Öffnen';

      actions.append(editBtn,delBtn,open);
      card.append(thumb, content);
      list.appendChild(card);
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (imagePicker.isPending() || bannerPicker.isPending()) {
      alert('Das ausgewählte Bild wird noch verarbeitet. Warte einen Moment und speichere danach erneut.');
      return;
    }
    items = api.getNews(true);
    const id = el('local-news-id').value;
    const data = {
      title: el('local-news-title').value.trim(),
      date: el('local-news-date').value,
      teaser: el('local-news-teaser').value.trim(),
      body: el('local-news-body').value.split(/\n{2,}/).map(v=>v.trim()).filter(Boolean),
      image: imagePicker.get(),
      banner: bannerPicker.get(),
      deleted: false
    };
    if (id) {
      const target = items.find(x=>x.id===id);
      if (target) Object.assign(target,data);
    } else {
      const stamp = Date.now();
      items.unshift({
        id:`local-${stamp}`,
        slug:`${api.slugify(data.title)}-${stamp.toString(36)}`,
        builtin:false,
        ...data
      });
    }
    try {
      api.setNews(items);
    } catch {
      alert('Der lokale Browserspeicher ist voll. Verwende kleinere Bilder oder lösche andere hochgeladene Inhalte.');
      return;
    }
    clear();
    render();
  });

  cancel.addEventListener('click', clear);
  el('local-news-reset').addEventListener('click',()=>{
    if (!confirm('Alle lokalen Aktuelles-Änderungen verwerfen?')) return;
    localStorage.removeItem('hokLocalNewsCollectionV3');
    items = api.getNews(true);
    clear();
    render();
  });

  render();
})();