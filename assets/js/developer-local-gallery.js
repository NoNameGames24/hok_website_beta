(() => {
  'use strict';

  const api = window.HoKLocal;
  const categoryList = document.getElementById('local-category-list');
  const categorySelect = document.getElementById('local-gallery-category');
  const form = document.getElementById('local-gallery-form');
  const cancel = document.getElementById('local-gallery-cancel');
  const openCategoryIds = new Set();
  let openStateInitialized = false;

  const getItems = () => api.getGallery(true);
  const getCategories = () => api.getGalleryCategories(true);

  const slugifyCategory = value => {
    const base = api.slugify(value);
    const used = new Set(getCategories().map(item => item.id));
    let result = base;
    let index = 2;
    while (used.has(result)) result = `${base}-${index++}`;
    return result;
  };

  const imageCountLabel = count => `${count} ${count === 1 ? 'Bild' : 'Bilder'}`;

  function captureOpenCategories() {
    if (!openStateInitialized) return;
    openCategoryIds.clear();
    categoryList.querySelectorAll('details[data-category-id]').forEach(details => {
      if (details.open) openCategoryIds.add(details.dataset.categoryId);
    });
  }

  function populateCategories(selected = '') {
    const categories = getCategories();
    categorySelect.replaceChildren();

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      option.selected = category.id === selected;
      categorySelect.appendChild(option);
    });

    if (selected && !categories.some(category => category.id === selected) && categories[0]) {
      categorySelect.value = categories[0].id;
    }
  }

  function clearForm() {
    form.reset();
    document.getElementById('local-gallery-id').value = '';
    document.getElementById('local-gallery-form-title').textContent = 'Bild hinzufügen';
    cancel.hidden = true;
    populateCategories();
  }

  function editItem(item) {
    openCategoryIds.add(item.category);
    document.getElementById('local-gallery-id').value = item.id;
    document.getElementById('local-gallery-title').value = item.title || '';
    document.getElementById('local-gallery-description').value = item.description || '';
    document.getElementById('local-gallery-form-title').textContent = 'Bild bearbeiten';
    populateCategories(item.category);
    cancel.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function moveCategory(categoryId, direction) {
    const categories = getCategories();
    const currentIndex = categories.findIndex(category => category.id === categoryId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= categories.length) return;

    [categories[currentIndex], categories[targetIndex]] = [categories[targetIndex], categories[currentIndex]];
    api.setGalleryCategories(categories);
    openCategoryIds.add(categoryId);
    render(false);
  }

  function moveItem(itemId, direction) {
    const items = getItems();
    const currentIndex = items.findIndex(item => item.id === itemId);
    if (currentIndex < 0) return;

    const currentItem = items[currentIndex];
    const categoryIndices = items.reduce((indices, item, index) => {
      if (item.category === currentItem.category) indices.push(index);
      return indices;
    }, []);
    const categoryPosition = categoryIndices.indexOf(currentIndex);
    const targetPosition = categoryPosition + direction;
    if (targetPosition < 0 || targetPosition >= categoryIndices.length) return;

    const targetIndex = categoryIndices[targetPosition];
    [items[currentIndex], items[targetIndex]] = [items[targetIndex], items[currentIndex]];
    api.setGallery(items);
    openCategoryIds.add(currentItem.category);
    render(false);
  }

  function makeButton(label, onClick, disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'developer-secondary-button';
    button.textContent = label;
    button.disabled = disabled;
    button.addEventListener('click', onClick);
    return button;
  }

  function makeGalleryItem(item, categoryItems, itemIndex) {
    const card = document.createElement('article');
    card.className = `developer-gallery-item${item.deleted ? ' is-deleted' : ''}`;

    const image = document.createElement('img');
    image.src = item.dataUrl || item.image || 'assets/images/painting-02.webp';
    image.alt = item.title || 'Galeriebild';
    image.loading = 'lazy';
    image.decoding = 'async';

    const box = document.createElement('div');
    box.className = 'developer-gallery-item-content';

    const titleRow = document.createElement('div');
    titleRow.className = 'developer-gallery-item-title';
    const title = document.createElement('h3');
    title.textContent = item.title || 'Bild';
    titleRow.appendChild(title);

    if (item.deleted) {
      const state = document.createElement('span');
      state.className = 'developer-deleted-badge';
      state.textContent = 'Gelöscht';
      titleRow.appendChild(state);
    }

    const description = document.createElement('p');
    description.textContent = item.description || 'Keine Beschreibung hinterlegt.';

    const actions = document.createElement('div');
    actions.className = 'developer-entry-actions developer-gallery-item-actions';

    actions.append(
      makeButton('Nach oben', () => moveItem(item.id, -1), itemIndex === 0),
      makeButton('Nach unten', () => moveItem(item.id, 1), itemIndex === categoryItems.length - 1),
      makeButton('Bearbeiten', () => editItem(item)),
      makeButton(item.deleted ? 'Wiederherstellen' : 'Löschen', () => {
        const all = getItems();
        const target = all.find(entry => entry.id === item.id);
        if (target) target.deleted = !target.deleted;
        api.setGallery(all);
        openCategoryIds.add(item.category);
        render(false);
      })
    );

    box.append(titleRow, description, actions);
    card.append(image, box);
    return card;
  }

  function renderCategories() {
    const categories = getCategories();
    const items = getItems();
    categoryList.replaceChildren();

    if (!openStateInitialized && categories[0]) {
      openCategoryIds.add(categories[0].id);
      openStateInitialized = true;
    }

    categories.forEach((category, categoryIndex) => {
      const categoryItems = items.filter(item => item.category === category.id);
      const activeCount = categoryItems.filter(item => !item.deleted).length;
      const deletedCount = categoryItems.length - activeCount;

      const details = document.createElement('details');
      details.className = 'developer-category-section';
      details.dataset.categoryId = category.id;
      details.open = openCategoryIds.has(category.id);
      details.addEventListener('toggle', () => {
        if (details.open) openCategoryIds.add(category.id);
        else openCategoryIds.delete(category.id);
      });

      const summary = document.createElement('summary');
      summary.className = 'developer-category-summary';

      const summaryText = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = category.name;
      const count = document.createElement('small');
      count.textContent = deletedCount
        ? `${imageCountLabel(activeCount)} aktiv · ${deletedCount} gelöscht`
        : imageCountLabel(activeCount);
      summaryText.append(name, count);

      const indicator = document.createElement('span');
      indicator.className = 'developer-category-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      indicator.textContent = '▾';
      summary.append(summaryText, indicator);

      const body = document.createElement('div');
      body.className = 'developer-category-body';

      const categoryActions = document.createElement('div');
      categoryActions.className = 'developer-entry-actions developer-category-actions';
      categoryActions.append(
        makeButton('Kategorie nach oben', () => moveCategory(category.id, -1), categoryIndex === 0),
        makeButton('Kategorie nach unten', () => moveCategory(category.id, 1), categoryIndex === categories.length - 1),
        makeButton('Umbenennen', () => {
          const next = prompt('Neuer Kategoriename:', category.name);
          if (next === null || !next.trim()) return;
          const all = getCategories();
          const target = all.find(entry => entry.id === category.id);
          if (target) target.name = next.trim();
          api.setGalleryCategories(all);
          openCategoryIds.add(category.id);
          render(false);
        })
      );

      if (!category.builtin) {
        categoryActions.append(makeButton('Kategorie löschen', () => {
          if (categoryItems.length) {
            alert('Die Kategorie enthält noch Bilder, einschließlich gelöschter Einträge. Verschiebe diese Bilder zuerst in eine andere Kategorie.');
            return;
          }
          if (!confirm(`Kategorie „${category.name}“ wirklich löschen?`)) return;
          api.setGalleryCategories(getCategories().filter(entry => entry.id !== category.id));
          openCategoryIds.delete(category.id);
          render(false);
        }));
      }

      const itemList = document.createElement('div');
      itemList.className = 'developer-gallery-list developer-category-gallery-list';

      if (!categoryItems.length) {
        const empty = document.createElement('p');
        empty.className = 'developer-category-empty';
        empty.textContent = 'In dieser Kategorie sind noch keine Bilder vorhanden.';
        itemList.appendChild(empty);
      } else {
        categoryItems.forEach((item, itemIndex) => {
          itemList.appendChild(makeGalleryItem(item, categoryItems, itemIndex));
        });
      }

      body.append(categoryActions, itemList);
      details.append(summary, body);
      categoryList.appendChild(details);
    });
  }

  function render(captureState = true) {
    if (captureState) captureOpenCategories();
    populateCategories(document.getElementById('local-gallery-category').value);
    renderCategories();
  }

  document.getElementById('local-category-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('local-category-name');
    const name = input.value.trim();
    if (!name) return;

    const category = { id: slugifyCategory(name), name, builtin: false };
    const categories = getCategories();
    categories.push(category);
    api.setGalleryCategories(categories);
    openCategoryIds.add(category.id);
    event.target.reset();
    render(false);
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const id = document.getElementById('local-gallery-id').value;
    const title = document.getElementById('local-gallery-title').value.trim();
    const category = categorySelect.value;
    const description = document.getElementById('local-gallery-description').value.trim();
    const file = document.getElementById('local-gallery-file').files[0];

    const saveItem = dataUrl => {
      const items = getItems();

      if (id) {
        const currentIndex = items.findIndex(item => item.id === id);
        const target = items[currentIndex];
        if (!target) return;

        const previousCategory = target.category;
        target.title = title;
        target.description = description;
        if (dataUrl) target.dataUrl = dataUrl;

        if (previousCategory !== category) {
          target.category = category;
          items.splice(currentIndex, 1);
          const lastTargetIndex = items.reduce((last, item, index) => item.category === category ? index : last, -1);
          items.splice(lastTargetIndex + 1, 0, target);
        } else {
          target.category = category;
        }
      } else {
        if (!dataUrl) {
          alert('Für ein neues Bild muss eine Datei ausgewählt werden.');
          return;
        }

        const item = {
          id: `gallery-${Date.now()}`,
          title,
          category,
          description,
          dataUrl,
          builtin: false,
          deleted: false
        };
        const lastTargetIndex = items.reduce((last, entry, index) => entry.category === category ? index : last, -1);
        items.splice(lastTargetIndex + 1, 0, item);
      }

      try {
        api.setGallery(items);
      } catch {
        alert('Das Bild ist für den lokalen Browserspeicher zu groß.');
        return;
      }

      openCategoryIds.add(category);
      clearForm();
      render(false);
    };

    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => saveItem(reader.result));
      reader.addEventListener('error', () => alert('Die Bilddatei konnte nicht gelesen werden.'));
      reader.readAsDataURL(file);
    } else {
      saveItem('');
    }
  });

  cancel.addEventListener('click', clearForm);

  document.getElementById('local-gallery-reset').addEventListener('click', () => {
    if (!confirm('Alle lokalen Galerieänderungen und eigenen Kategorien zurücksetzen?')) return;
    localStorage.removeItem('hokLocalGalleryCollectionV4');
    localStorage.removeItem('hokLocalGalleryCategoriesV4');
    api.getGallery(true);
    api.getGalleryCategories(true);
    openCategoryIds.clear();
    openStateInitialized = false;
    clearForm();
    render(false);
  });

  api.getGallery(true);
  api.getGalleryCategories(true);
  render(false);
})();
