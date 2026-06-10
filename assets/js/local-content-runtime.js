// NoNameGames - Lou
(() => {
  'use strict';

  const NEWS_KEY = 'hokLocalNewsCollectionV3';
  const GALLERY_KEY = 'hokLocalGalleryCollectionV4';
  const GALLERY_CATEGORIES_KEY = 'hokLocalGalleryCategoriesV4';
  const SITE_KEY = 'hokLocalSiteSettingsV3';
  const PAGE_OVERRIDES_KEY = 'hokLocalPageOverridesV1';

  const DEFAULT_NEWS = [{"slug": "soeldner-system", "date": "12. Mai 2024", "title": "Das neue Söldner-System", "image": "assets/images/ingame-trio.webp", "teaser": "Neue Wege für Söldner, Wachen und kampforientierte Charaktere.", "body": ["Das neue Söldner-System bündelt kampforientierte Rollen, Ausrüstung und Verantwortlichkeiten klarer als bisher.", "Der Fokus liegt auf nachvollziehbaren Wegen vom einfachen Kämpfer bis zu spezialisierten Aufgaben im Spielbetrieb.", "Details, Balancing und konkrete Abläufe können hier später als aktueller Beitrag gepflegt werden."], "id": "soeldner-system", "builtin": true, "deleted": false, "banner": "assets/images/ingame-trio.webp"}, {"slug": "ratsentscheidungen", "date": "03. Mai 2024", "title": "Ratsentscheidungen", "image": "assets/images/painting-07.webp", "teaser": "Zusammenfassung aktueller Entscheidungen und Änderungen.", "body": ["Hier werden wichtige Ratsentscheidungen, Regelanpassungen und organisatorische Änderungen gesammelt.", "Der Beitrag dient als nachvollziehbares Protokoll für Spieler, Team und Community.", "Neue Beschlüsse können hier ergänzt und anschließend auf der Startseite verlinkt werden."], "id": "ratsentscheidungen", "builtin": true, "deleted": false, "banner": "assets/images/painting-07.webp"}, {"slug": "charaktergeschichten", "date": "27. April 2024", "title": "Charaktergeschichten", "image": "assets/images/painting-06.webp", "teaser": "Ein Ort für Geschichten, Entwicklungen und Chroniken.", "body": ["Charaktergeschichten geben der Spielwelt Tiefe und machen Entscheidungen dauerhaft nachvollziehbar.", "Dieser Bereich kann für Chroniken, Berichte, Zusammenfassungen und besondere Ereignisse genutzt werden.", "Jeder Beitrag erhält eine eigene Seite und kann unten auf der Startseite erscheinen."], "id": "charaktergeschichten", "builtin": true, "deleted": false, "banner": "assets/images/painting-06.webp"}, {"slug": "neues-aus-nordmar", "date": "18. April 2024", "title": "Neues aus Nordmar", "image": "assets/images/hero-nordmar-night.webp", "teaser": "Meldungen aus dem Norden, von Clans und rauen Grenzlanden.", "body": ["Nordmar bleibt ein zentraler Schauplatz für harte Konflikte, Kälte, Ehre und Überlebenskampf.", "Hier können regionale Meldungen, Fraktionsereignisse und neue Entwicklungen veröffentlicht werden.", "Der Beitrag ist als Vorlage für spätere Inhaltsaktualisierungen vorbereitet."], "id": "neues-aus-nordmar", "builtin": true, "deleted": false, "banner": "assets/images/hero-nordmar-night.webp"}, {"slug": "community-event", "date": "10. April 2024", "title": "Community-Event", "image": "assets/images/painting-08.webp", "teaser": "Termine, Aktionen und gemeinsame Community-Inhalte.", "body": ["Community-Events bündeln gemeinsame Aktionen außerhalb und innerhalb des Rollenspiels.", "Dieser Beitrag kann für Ankündigungen, Rückblicke und wichtige Hinweise zu Veranstaltungen verwendet werden.", "Weitere Events lassen sich durch neue Einträge in der Aktuelles-Struktur ergänzen."], "id": "community-event", "builtin": true, "deleted": false, "banner": "assets/images/painting-08.webp"}];
  const DEFAULT_GALLERY = [{"id": "artwork-01", "title": "Khorinis Siedlung", "description": "", "image": "assets/images/painting-02.webp", "category": "artworks", "builtin": true, "deleted": false}, {"id": "artwork-02", "title": "Lagerfeuer", "description": "", "image": "assets/images/painting-03.webp", "category": "artworks", "builtin": true, "deleted": false}, {"id": "artwork-03", "title": "Wildnis", "description": "", "image": "assets/images/painting-04.webp", "category": "artworks", "builtin": true, "deleted": false}, {"id": "artwork-04", "title": "Nordmar", "description": "", "image": "assets/images/painting-05.webp", "category": "artworks", "builtin": true, "deleted": false}, {"id": "artwork-05", "title": "Chroniken", "description": "", "image": "assets/images/painting-06.webp", "category": "artworks", "builtin": true, "deleted": false}, {"id": "artwork-06", "title": "Ratsraum", "description": "", "image": "assets/images/painting-07.webp", "category": "artworks", "builtin": true, "deleted": false}, {"id": "artwork-07", "title": "Gebirge", "description": "", "image": "assets/images/painting-08.webp", "category": "artworks", "builtin": true, "deleted": false}, {"id": "artwork-08", "title": "Seefahrt", "description": "", "image": "assets/images/painting-sea-v9.webp", "category": "artworks", "builtin": true, "deleted": false}];
  const DEFAULT_GALLERY_CATEGORIES = [{"id": "artworks", "name": "Artworks", "builtin": true}, {"id": "screenshots", "name": "Screenshots", "builtin": true}, {"id": "neues", "name": "Neues", "builtin": true}];

  const clone = value => JSON.parse(JSON.stringify(value));
  const read = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  };
  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('hok-local-change', { detail: key }));
  };

  const slugify = value => String(value || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'beitrag';

  function getNews(seed = false) {
    const saved = read(NEWS_KEY);
    if (Array.isArray(saved)) return saved;
    if (seed) {
      const initial = clone(DEFAULT_NEWS);
      write(NEWS_KEY, initial);
      return initial;
    }
    return null;
  }
  function setNews(items) { write(NEWS_KEY, items); }

  function getGallery(seed = false) {
    const saved = read(GALLERY_KEY);
    if (Array.isArray(saved)) return saved;
    if (seed) {
      const initial = clone(DEFAULT_GALLERY);
      write(GALLERY_KEY, initial);
      return initial;
    }
    return null;
  }
  function setGallery(items) { write(GALLERY_KEY, items); }

  function getGalleryCategories(seed = false) {
    const saved = read(GALLERY_CATEGORIES_KEY);
    if (Array.isArray(saved)) return saved;
    if (seed) {
      const initial = clone(DEFAULT_GALLERY_CATEGORIES);
      write(GALLERY_CATEGORIES_KEY, initial);
      return initial;
    }
    return null;
  }
  function setGalleryCategories(items) { write(GALLERY_CATEGORIES_KEY, items); }

  function getSite() { return read(SITE_KEY, {}) || {}; }
  function setSite(value) { write(SITE_KEY, value); }

  function getPageOverrides() { return read(PAGE_OVERRIDES_KEY, {}) || {}; }
  function getPageOverride(file) { return getPageOverrides()[file] || null; }
  function setPageOverride(file, value) {
    const all = getPageOverrides();
    all[file] = value;
    write(PAGE_OVERRIDES_KEY, all);
  }
  function removePageOverride(file) {
    const all = getPageOverrides();
    delete all[file];
    write(PAGE_OVERRIDES_KEY, all);
  }

  function currentFile() {
    return document.body?.dataset.editorFile || location.pathname.split('/').filter(Boolean).slice(-1)[0] || 'index.html';
  }
  function pageDepth() {
    const file = currentFile();
    return Math.max(0, file.split('/').length - 1);
  }
  function resolveAsset(value) {
    const source = String(value || '').trim();
    if (!source) return '';
    if (/^(?:data:|blob:|https?:|\/\/|\/|#)/i.test(source)) return source;
    if (source.startsWith('../') || source.startsWith('./')) return source;
    if (source.startsWith('assets/')) return '../'.repeat(pageDepth()) + source;
    return source;
  }

  function formatDate(value) {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y,m,d] = value.split('-');
      return `${d}.${m}.${y}`;
    }
    return value;
  }

  function makeNewsCard(item, overview = false) {
    const a = document.createElement('a');
    a.href = `aktuelles/beitrag.html?slug=${encodeURIComponent(item.slug || item.id)}`;
    if (overview) a.className = 'news-card-v33';

    const img = document.createElement('img');
    img.src = resolveAsset(item.image || 'assets/images/painting-02.webp');
    img.alt = item.title || '';
    img.loading = 'lazy';
    img.decoding = 'async';

    const date = document.createElement('span');
    date.className = 'news-date';
    date.textContent = formatDate(item.date);

    const title = document.createElement('strong');
    title.textContent = item.title || 'Ohne Titel';

    const small = document.createElement('small');
    small.textContent = overview ? (item.teaser || '') : 'Mehr lesen';

    a.append(img, date, title, small);
    return a;
  }

  function renderNews() {
    const items = getNews(false);
    if (!items) return;
    const visible = items.filter(item => !item.deleted);

    const home = document.querySelector('.news-strip');
    if (home) home.replaceChildren(...visible.slice(0, 8).map(item => makeNewsCard(item, false)));

    const overview = document.querySelector('.news-overview-grid-v33');
    if (overview) overview.replaceChildren(...visible.map(item => makeNewsCard(item, true)));
  }

  let galleryLightboxItems = [];
  let galleryLightboxIndex = 0;

  function ensureGalleryLightbox() {
    let overlay = document.getElementById('gallery-lightbox');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'gallery-lightbox';
    overlay.className = 'gallery-lightbox';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Bildansicht');
    overlay.innerHTML = `
      <button class="gallery-lightbox-close" type="button" aria-label="Bildansicht schließen">×</button>
      <button class="gallery-lightbox-nav gallery-lightbox-prev" type="button" aria-label="Vorheriges Bild">‹</button>
      <figure class="gallery-lightbox-figure">
        <img class="gallery-lightbox-image" alt="">
        <figcaption><strong class="gallery-lightbox-title"></strong><span class="gallery-lightbox-description"></span><small class="gallery-lightbox-counter"></small></figcaption>
      </figure>
      <button class="gallery-lightbox-nav gallery-lightbox-next" type="button" aria-label="Nächstes Bild">›</button>`;

    const close = () => {
      overlay.hidden = true;
      document.body.classList.remove('gallery-lightbox-open');
    };
    const show = index => {
      if (!galleryLightboxItems.length) return;
      galleryLightboxIndex = (index + galleryLightboxItems.length) % galleryLightboxItems.length;
      const item = galleryLightboxItems[galleryLightboxIndex];
      const image = overlay.querySelector('.gallery-lightbox-image');
      image.src = item.src;
      image.alt = item.title || '';
      overlay.querySelector('.gallery-lightbox-title').textContent = item.title || 'Bild';
      const description = overlay.querySelector('.gallery-lightbox-description');
      description.textContent = item.description || '';
      description.hidden = !item.description;
      overlay.querySelector('.gallery-lightbox-counter').textContent = `${galleryLightboxIndex + 1} / ${galleryLightboxItems.length}`;
      overlay.hidden = false;
      document.body.classList.add('gallery-lightbox-open');
      overlay.querySelector('.gallery-lightbox-close').focus();
    };

    overlay.querySelector('.gallery-lightbox-close').addEventListener('click', close);
    overlay.querySelector('.gallery-lightbox-prev').addEventListener('click', () => show(galleryLightboxIndex - 1));
    overlay.querySelector('.gallery-lightbox-next').addEventListener('click', () => show(galleryLightboxIndex + 1));
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    document.addEventListener('keydown', event => {
      if (overlay.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(galleryLightboxIndex - 1);
      if (event.key === 'ArrowRight') show(galleryLightboxIndex + 1);
    });
    overlay.openAt = show;
    document.body.appendChild(overlay);
    return overlay;
  }

  function renderGallery() {
    const container = document.querySelector('#gallery-category-container');
    if (!container) return;

    const items = getGallery(true).filter(item => !item.deleted);
    const categories = getGalleryCategories(true);
    galleryLightboxItems = [];
    container.replaceChildren();

    categories.forEach(category => {
      const section = document.createElement('section');
      section.className = 'gallery-category-block';
      section.dataset.category = category.id;

      const title = document.createElement('div');
      title.className = 'section-title section-title-v6';
      const eyebrow = document.createElement('span');
      eyebrow.textContent = category.name;
      const heading = document.createElement('h2');
      heading.textContent = category.name === 'Neues'
        ? 'Neu hinzugefügte Bilder'
        : category.name === 'Screenshots'
          ? 'Eindrücke aus dem Spiel'
          : 'Galerie der Projektbilder';
      title.append(eyebrow, heading);

      const grid = document.createElement('div');
      grid.className = 'gallery-artworks-v31 gallery-category-grid';
      const categoryItems = items.filter(item => item.category === category.id);

      if (!categoryItems.length) {
        const empty = document.createElement('p');
        empty.className = 'gallery-category-empty';
        empty.textContent = 'In dieser Kategorie sind noch keine Bilder vorhanden.';
        grid.appendChild(empty);
      } else {
        categoryItems.forEach(item => {
          const source = resolveAsset(item.dataUrl || item.image);
          const lightboxIndex = galleryLightboxItems.push({
            src: source,
            title: item.title || 'Bild',
            description: item.description || ''
          }) - 1;

          const figure = document.createElement('figure');
          const trigger = document.createElement('button');
          trigger.type = 'button';
          trigger.className = 'gallery-lightbox-trigger';
          trigger.setAttribute('aria-label', `${item.title || 'Bild'} vergrößern`);
          const image = document.createElement('img');
          image.src = source;
          image.alt = item.title || '';
          image.loading = 'lazy';
          image.decoding = 'async';
          const zoom = document.createElement('span');
          zoom.className = 'gallery-zoom-hint';
          zoom.textContent = 'Vergrößern';
          trigger.append(image, zoom);
          trigger.addEventListener('click', () => ensureGalleryLightbox().openAt(lightboxIndex));
          const caption = document.createElement('figcaption');
          caption.textContent = item.title || 'Bild';
          figure.append(trigger, caption);
          grid.appendChild(figure);
        });
      }

      section.append(title, grid);
      container.appendChild(section);
    });
  }

  function setText(selector, value, breaks = false) {
    if (value === undefined || value === null || value === '') return;
    const node = document.querySelector(selector);
    if (!node) return;
    if (!breaks) {
      node.textContent = value;
      return;
    }
    node.replaceChildren();
    String(value).split('\n').forEach((line, index) => {
      if (index) node.append(document.createElement('br'));
      node.append(document.createTextNode(line));
    });
  }

  function applySiteSettings() {
    const s = getSite();
    if (!Object.keys(s).length) return;

    if (s.contentWidth) document.documentElement.style.setProperty('--container', `${Number(s.contentWidth)}px`);
    if (s.fontScale) document.documentElement.style.fontSize = `${Number(s.fontScale)}%`;

    setText('.hero-subtitle', s.heroSubtitle, true);
    setText('.intro-section .eyebrow', s.introEyebrow);
    setText('.intro-section h2', s.introTitle);

    const introPs = document.querySelectorAll('.intro-section .parchment-panel > p');
    if (s.introText1 && introPs[0]) introPs[0].textContent = s.introText1;
    if (s.introText2 && introPs[1]) introPs[1].textContent = s.introText2;

    setText('.snow-band .section-plaque span', s.quickHeading);
    setText('.world-section-v6 .section-title span', s.worldEyebrow);
    setText('.world-section-v6 .section-title h2', s.worldTitle);
    setText('.features-section-v6 .section-title span, .systems-section-v6 .section-title span', s.systemsEyebrow);
    setText('.features-section-v6 .section-title h2, .systems-section-v6 .section-title h2', s.systemsTitle);
    setText('.news-section .section-plaque span', s.newsHeading);

    const featureSettings = {
      hardcore: { title: s.hardcoreTitle, text: s.hardcoreText, link: s.hardcoreLink },
      community: { title: s.communityTitle, text: s.communityText, link: s.communityLink },
      world: { title: s.worldFeatureTitle, text: s.worldFeatureText, link: s.worldFeatureLink }
    };
    Object.entries(featureSettings).forEach(([key, value]) => {
      const card = document.querySelector(`[data-home-feature="${key}"]`);
      if (!card) return;
      if (value.title) card.querySelector('strong').textContent = value.title;
      if (value.text) card.querySelector('small').textContent = value.text;
      if (value.link) card.href = value.link;
    });

    document.querySelectorAll('[data-site-setting="footer_text"]').forEach(node => {
      if (s.footerText) node.textContent = s.footerText;
    });
    document.querySelectorAll('a[href*="discord.gg"]').forEach(a => {
      if (s.discord) a.href = s.discord;
    });

    const sections = {
      intro: document.querySelector('.intro-section'),
      quick: document.querySelector('.snow-band'),
      world: document.querySelector('.world-section-v6'),
      features: document.querySelector('.features-section-v6, .systems-section-v6'),
      news: document.querySelector('.news-section')
    };

    for (const [key, node] of Object.entries(sections)) {
      if (!node) continue;
      const setting = `show${key[0].toUpperCase()}${key.slice(1)}`;
      if (setting in s) node.hidden = s[setting] === false;
      if (s.sectionSpacing) {
        node.style.paddingTop = `${Number(s.sectionSpacing)}px`;
        node.style.paddingBottom = `${Number(s.sectionSpacing)}px`;
      }
    }

    if (Array.isArray(s.sectionOrder) && s.sectionOrder.length) {
      const main = document.querySelector('main');
      if (main) s.sectionOrder.forEach(key => sections[key] && main.appendChild(sections[key]));
    }

    if (s.cardColumns) {
      for (const selector of ['.quick-grid','.world-grid','.features-row']) {
        const grid = document.querySelector(selector);
        if (grid) grid.style.gridTemplateColumns = `repeat(${Number(s.cardColumns)},minmax(0,1fr))`;
      }
    }

    if (s.heroMinHeight) {
      const hero = document.querySelector('.home-hero');
      if (hero) hero.style.minHeight = `${Number(s.heroMinHeight)}px`;
    }
  }

  function sanitizeContent(html) {
    const template = document.createElement('template');
    template.innerHTML = String(html || '');
    template.content.querySelectorAll('script,object,embed').forEach(node => node.remove());
    template.content.querySelectorAll('*').forEach(node => {
      for (const attr of [...node.attributes]) {
        if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
        if ((attr.name === 'href' || attr.name === 'src') && /^javascript:/i.test(attr.value.trim())) node.removeAttribute(attr.name);
      }
    });
    return template.content;
  }

  function setHeroBanner(hero, banner) {
    if (!hero || !banner) return;
    const source = resolveAsset(banner);
    const cssUrl = `url("${source.replace(/"/g, '%22')}")`;
    hero.style.setProperty('--hero-image', cssUrl);
    hero.style.setProperty('background-image', cssUrl, 'important');
  }

  function applyPageOverride() {
    const file = currentFile();
    const override = getPageOverride(file);
    if (!override) return;

    if (override.browserTitle) document.title = override.browserTitle;
    if (override.metaDescription !== undefined) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = override.metaDescription;
    }

    const main = document.querySelector('main');
    if (!main) return;
    const hero = main.querySelector('.sub-hero, .home-hero');
    if (hero) {
      const heroTitle = hero.querySelector('h1');
      const heroText = hero.querySelector('.sub-hero__inner p, .hero-subtitle, p');
      if (heroTitle && override.heroTitle !== undefined) heroTitle.textContent = override.heroTitle;
      if (heroText && override.heroSubtitle !== undefined) {
        heroText.replaceChildren();
        String(override.heroSubtitle || '').split('\n').forEach((line, index) => {
          if (index) heroText.append(document.createElement('br'));
          heroText.append(document.createTextNode(line));
        });
      }
      setHeroBanner(hero, override.heroBanner);
    }

    if (override.contentHtml !== undefined) {
      [...main.childNodes].forEach(node => { if (node !== hero) node.remove(); });
      main.appendChild(sanitizeContent(override.contentHtml));
    }
  }

  function renderArticle() {
    if (!document.body.classList.contains('local-dynamic-article')) return;
    const items = getNews(false);
    const box = document.getElementById('local-article-content');
    if (!items || !box) return;
    const slug = new URLSearchParams(location.search).get('slug');
    const item = items.find(entry => !entry.deleted && (entry.slug === slug || entry.id === slug));
    if (!item) {
      box.textContent = 'Beitrag nicht gefunden.';
      return;
    }

    document.title = `${item.title} · History of Khorinis`;
    const hero = document.querySelector('.sub-hero');
    const heroTitle = hero?.querySelector('h1');
    const heroText = hero?.querySelector('p');
    if (heroTitle) heroTitle.textContent = item.title;
    if (heroText) heroText.textContent = item.teaser || '';
    setHeroBanner(hero, item.banner || item.image || 'assets/images/hero-page-aktuelles.webp');

    box.replaceChildren();
    const date = document.createElement('p');
    date.className = 'news-date';
    date.textContent = formatDate(item.date);
    const h2 = document.createElement('h2');
    h2.textContent = item.title;
    const img = document.createElement('img');
    img.className = 'article-hero-image-v33';
    img.src = resolveAsset(item.image || 'assets/images/painting-02.webp');
    img.alt = item.title;
    const lead = document.createElement('p');
    lead.className = 'lead-v33';
    lead.textContent = item.teaser || '';
    box.append(date, h2, img, lead);
    const body = Array.isArray(item.body) ? item.body : String(item.body || '').split(/\n+/);
    body.filter(Boolean).forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      box.appendChild(p);
    });
  }

  window.HoKLocal = {
    DEFAULT_NEWS: clone(DEFAULT_NEWS),
    DEFAULT_GALLERY: clone(DEFAULT_GALLERY),
    getNews, setNews, getGallery, setGallery, getGalleryCategories, setGalleryCategories,
    getSite, setSite, getPageOverrides, getPageOverride, setPageOverride, removePageOverride,
    slugify, resolveAsset, renderNews, renderGallery, applySiteSettings, applyPageOverride
  };

  applyPageOverride();

  document.addEventListener('DOMContentLoaded', () => {
    applySiteSettings();
    renderNews();
    renderGallery();
    renderArticle();
  });
  window.addEventListener('storage', () => location.reload());
})();
