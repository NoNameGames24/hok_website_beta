// Author: NoNameGames - Lou
(() => {
  'use strict';
  if (window.HoKAccessDenied) return;
  const api = window.HoKLocal;
  const catalog = window.HoKEditablePages || [];
  const library = window.HoKImageLibrary || [];
  const params = new URLSearchParams(location.search);
  const file = params.get('file') || '';
  const page = catalog.find(entry => entry.file === file);
  const form = document.getElementById('developer-page-form');
  const errorBox = document.getElementById('developer-page-load-error');
  const visual = document.getElementById('page-visual-editor');
  const html = document.getElementById('page-content-html');
  const bannerSelect = document.getElementById('page-banner-select');
  const bannerHidden = document.getElementById('page-hero-banner');
  const bannerPreview = document.getElementById('page-banner-preview');
  let original = null;
  let pendingUploads = 0;

  function fail(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    form.hidden = true;
  }
  if (!page) {
    fail('Die angeforderte Seite ist nicht in der bearbeitbaren Seitenliste enthalten.');
    return;
  }

  document.getElementById('developer-page-editor-title').textContent = page.title;
  document.getElementById('developer-page-editor-brand').textContent = page.title;
  document.getElementById('developer-page-editor-file').textContent = page.file;
  const preview = document.getElementById('developer-page-preview-link');
  preview.href = page.file;

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

  function normalizeRootAsset(value) {
    let result = String(value || '').trim();
    const depth = Math.max(0, page.file.split('/').length - 1);
    for (let index = 0; index < depth && result.startsWith('../'); index += 1) result = result.slice(3);
    if (result.startsWith('./')) result = result.slice(2);
    return result;
  }

  function parseBanner(hero) {
    if (!hero) return '';
    const style = hero.getAttribute('style') || '';
    const match = style.match(/(?:--hero-image|background-image)\s*:\s*url\(["']?([^"')]+)["']?\)/i);
    return match ? normalizeRootAsset(match[1]) : '';
  }

  function extractDocument(source) {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const main = doc.querySelector('main');
    if (!main) throw new Error('Die Seite enthält keinen <main>-Bereich.');
    const hero = main.querySelector('.sub-hero, .home-hero');
    const heroTitle = hero?.querySelector('h1')?.textContent.trim() || '';
    const heroSubtitle = hero?.querySelector('.sub-hero__inner p, .hero-subtitle, p')?.textContent.trim() || '';
    const clone = main.cloneNode(true);
    clone.querySelector('.sub-hero, .home-hero')?.remove();
    return {
      browserTitle: doc.title || page.title,
      metaDescription: doc.querySelector('meta[name="description"]')?.content || '',
      heroTitle,
      heroSubtitle,
      heroBanner: parseBanner(hero),
      contentHtml: clone.innerHTML.trim()
    };
  }

  function setBanner(value) {
    const next = value || 'assets/images/hero-page-setting.webp';
    bannerHidden.value = next;
    bannerPreview.src = next;
    bannerSelect.replaceChildren();
    library.forEach(entry => {
      const option = document.createElement('option');
      option.value = entry.value;
      option.textContent = entry.label;
      bannerSelect.appendChild(option);
    });
    if (!library.some(entry => entry.value === next)) {
      const option = document.createElement('option');
      option.value = next;
      option.textContent = next.startsWith('data:') ? 'Eigenes hochgeladenes Banner' : `Aktuelles Banner: ${next}`;
      bannerSelect.prepend(option);
    }
    bannerSelect.value = next;
  }

  function populate(data) {
    document.getElementById('page-browser-title').value = data.browserTitle || '';
    document.getElementById('page-meta-description').value = data.metaDescription || '';
    document.getElementById('page-hero-title').value = data.heroTitle || '';
    document.getElementById('page-hero-subtitle').value = data.heroSubtitle || '';
    setBanner(data.heroBanner);
    visual.innerHTML = data.contentHtml || '';
    html.value = data.contentHtml || '';
    html.dataset.dirty = 'false';
    form.hidden = false;
  }

  async function load() {
    try {
      const response = await fetch(page.file, {cache:'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      original = extractDocument(await response.text());
      populate(api.getPageOverride(page.file) || original);
    } catch (error) {
      const saved = api.getPageOverride(page.file);
      if (saved) {
        original = saved;
        populate(saved);
        errorBox.textContent = 'Die Originaldatei konnte nicht geladen werden. Die gespeicherte lokale Fassung wurde geöffnet.';
        errorBox.hidden = false;
      } else {
        fail(`Die Seitendatei konnte nicht geladen werden: ${error.message}. Starte die Website über START_LOCAL_SERVER.bat.`);
      }
    }
  }

  bannerSelect.addEventListener('change', () => setBanner(bannerSelect.value));
  document.getElementById('page-banner-file').addEventListener('change', async event => {
    const selected = event.target.files[0];
    if (!selected) return;
    pendingUploads += 1;
    try { setBanner(await optimizeImage(selected)); }
    catch (error) { alert(error.message); }
    finally { pendingUploads -= 1; }
  });

  visual.addEventListener('input', () => {
    html.value = visual.innerHTML;
    html.dataset.dirty = 'false';
  });
  html.addEventListener('input', () => { html.dataset.dirty = 'true'; });
  document.getElementById('page-apply-html').addEventListener('click', () => {
    visual.innerHTML = html.value;
    html.dataset.dirty = 'false';
  });

  document.querySelectorAll('.developer-editor-toolbar [data-command]').forEach(button => {
    button.addEventListener('click', () => {
      visual.focus();
      document.execCommand(button.dataset.command, false, button.dataset.value || null);
      html.value = visual.innerHTML;
      html.dataset.dirty = 'false';
    });
  });
  document.getElementById('page-insert-link').addEventListener('click', () => {
    const url = prompt('Zieladresse des Links:');
    if (!url) return;
    visual.focus();
    document.execCommand('createLink', false, url);
    html.value = visual.innerHTML;
    html.dataset.dirty = 'false';
  });
  document.getElementById('page-content-image').addEventListener('change', async event => {
    const selected = event.target.files[0];
    if (!selected) return;
    pendingUploads += 1;
    try {
      const dataUrl = await optimizeImage(selected, 1600, 1200, .84);
      visual.focus();
      document.execCommand('insertHTML', false, `<figure><img src="${dataUrl}" alt=""><figcaption>Bildunterschrift</figcaption></figure>`);
      html.value = visual.innerHTML;
      html.dataset.dirty = 'false';
    } catch (error) { alert(error.message); }
    finally { pendingUploads -= 1; }
    event.target.value = '';
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (pendingUploads > 0) {
      alert('Ein Bild wird noch verarbeitet. Warte einen Moment und speichere danach erneut.');
      return;
    }
    const contentHtml = html.dataset.dirty === 'true' ? html.value : visual.innerHTML;
    if (html.dataset.dirty === 'true') visual.innerHTML = html.value;
    html.value = contentHtml;
    html.dataset.dirty = 'false';
    const data = {
      file: page.file,
      browserTitle: document.getElementById('page-browser-title').value.trim(),
      metaDescription: document.getElementById('page-meta-description').value.trim(),
      heroTitle: document.getElementById('page-hero-title').value.trim(),
      heroSubtitle: document.getElementById('page-hero-subtitle').value.trim(),
      heroBanner: bannerHidden.value,
      contentHtml: contentHtml.trim(),
      updatedAt: new Date().toISOString()
    };
    try {
      api.setPageOverride(page.file, data);
    } catch {
      alert('Der lokale Browserspeicher ist voll. Entferne große hochgeladene Bilder oder andere lokale Anpassungen.');
      return;
    }
    const status = document.getElementById('developer-page-status');
    status.hidden = false;
    setTimeout(() => status.hidden = true, 2600);
  });

  document.getElementById('developer-page-reset').addEventListener('click', () => {
    if (!confirm(`Lokale Anpassung für „${page.title}“ löschen und Original laden?`)) return;
    api.removePageOverride(page.file);
    if (original) populate(original);
  });

  load();
})();