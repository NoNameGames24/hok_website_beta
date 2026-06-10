// Author: NoNameGames - Lou
(() => {
  'use strict';
  if (window.HoKAccessDenied) return;

  const auth = window.HoKAuth;
  const current = auth.getCurrentUser();
  const elements = {
    search: document.getElementById('local-user-search'),
    statusFilter: document.getElementById('local-user-status-filter'),
    roleFilter: document.getElementById('local-user-role-filter'),
    list: document.getElementById('local-user-list'),
    summary: document.getElementById('local-user-result-summary'),
    placeholder: document.getElementById('local-user-editor-placeholder'),
    editor: document.getElementById('local-user-editor'),
    editorStatus: document.getElementById('local-user-editor-status'),
    editorTitle: document.getElementById('local-user-editor-title'),
    avatar: document.getElementById('local-user-avatar-preview'),
    displayName: document.getElementById('local-user-display-name'),
    identity: document.getElementById('local-user-identity'),
    discord: document.getElementById('local-user-discord'),
    roleLabel: document.getElementById('local-user-role-label'),
    statusLabel: document.getElementById('local-user-status-label'),
    registered: document.getElementById('local-user-registered'),
    lastLogin: document.getElementById('local-user-last-login'),
    bio: document.getElementById('local-user-bio'),
    banReasonDisplay: document.getElementById('local-user-ban-reason-display'),
    role: document.getElementById('local-user-role'),
    notes: document.getElementById('local-user-notes'),
    banReason: document.getElementById('local-user-ban-reason'),
    banControls: document.getElementById('local-user-ban-controls'),
    accept: document.getElementById('local-user-accept'),
    reject: document.getElementById('local-user-reject'),
    ban: document.getElementById('local-user-ban'),
    unban: document.getElementById('local-user-unban'),
    saveAdmin: document.getElementById('local-user-save-admin'),
    cancel: document.getElementById('local-user-cancel'),
    error: document.getElementById('local-user-form-error'),
    success: document.getElementById('local-user-form-success'),
    auditList: document.getElementById('local-user-audit-list'),
    auditClear: document.getElementById('local-user-audit-clear')
  };

  let users = auth.getAccounts();
  let selectedId = '';

  function formatDate(value) {
    if (!value) return 'Nie';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  function initials(name, username = '') {
    const source = String(name || username || '?').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)[0]}` : source.slice(0, 2)).toUpperCase();
  }

  function setAvatar(element, user) {
    element.replaceChildren();
    if (user.avatar) {
      const image = document.createElement('img');
      image.src = user.avatar;
      image.alt = '';
      element.appendChild(image);
    } else {
      element.textContent = initials(user.displayName, user.username);
    }
  }

  function setMessages(error = '', success = '') {
    elements.error.textContent = error;
    elements.error.hidden = !error;
    elements.success.textContent = success;
    elements.success.hidden = !success;
  }

  function refreshUsers() {
    users = auth.getAccounts();
  }

  function filteredUsers() {
    const query = elements.search.value.trim().toLocaleLowerCase('de');
    const status = elements.statusFilter.value;
    const role = elements.roleFilter.value;
    const order = { pending: 0, active: 1, banned: 2, rejected: 3 };
    return users
      .filter(user => status === 'all' || user.status === status)
      .filter(user => role === 'all' || user.role === role)
      .filter(user => !query || [user.displayName, user.username, user.email, user.discord].some(value => String(value || '').toLocaleLowerCase('de').includes(query)))
      .sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || String(a.displayName || a.username).localeCompare(String(b.displayName || b.username), 'de'));
  }

  function makeButton(label, className, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  function renderCounters() {
    Object.keys(auth.STATUS_DEFINITIONS).forEach(status => {
      const node = document.getElementById(`local-user-count-${status}`);
      if (node) node.textContent = String(users.filter(user => user.status === status).length);
    });
  }

  function renderList() {
    const filtered = filteredUsers();
    elements.summary.textContent = `${filtered.length} von ${users.length} Accounts`;
    elements.list.replaceChildren();
    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'developer-user-empty';
      empty.textContent = 'Keine Accounts entsprechen den gewählten Filtern.';
      elements.list.appendChild(empty);
      return;
    }

    filtered.forEach(user => {
      const card = document.createElement('article');
      card.className = `developer-user-card is-${user.status}${selectedId === user.id ? ' is-selected' : ''}`;
      const main = document.createElement('div');
      main.className = 'developer-user-card-main';
      const avatar = document.createElement('div');
      avatar.className = 'developer-user-avatar';
      setAvatar(avatar, user);
      const data = document.createElement('div');
      data.className = 'developer-user-card-data';
      const heading = document.createElement('div');
      heading.className = 'developer-user-card-heading';
      const title = document.createElement('h3');
      title.textContent = user.displayName || user.username;
      const badge = document.createElement('span');
      badge.className = `developer-user-status is-${user.status}`;
      badge.textContent = auth.statusLabel(user.status);
      heading.append(title, badge);
      const identity = document.createElement('p');
      identity.className = 'developer-user-identity';
      identity.textContent = `@${user.username}${user.email ? ` · ${user.email}` : ''}`;
      const meta = document.createElement('p');
      meta.className = 'developer-user-meta';
      meta.textContent = `${auth.roleLabel(user.role)} · Registriert: ${formatDate(user.registeredAt)}`;
      data.append(heading, identity, meta);
      main.append(avatar, data);
      const actions = document.createElement('div');
      actions.className = 'developer-entry-actions developer-user-card-actions';
      actions.appendChild(makeButton('Öffnen', 'developer-primary-button', () => openUser(user.id)));
      card.append(main, actions);
      elements.list.appendChild(card);
    });
  }

  function openUser(userId) {
    refreshUsers();
    const user = users.find(entry => entry.id === userId);
    if (!user) return;
    selectedId = user.id;
    elements.placeholder.hidden = true;
    elements.editor.hidden = false;
    elements.editorStatus.textContent = auth.statusLabel(user.status);
    elements.editorTitle.textContent = user.displayName || user.username;
    setAvatar(elements.avatar, user);
    elements.displayName.textContent = user.displayName || user.username;
    elements.identity.textContent = `@${user.username}${user.email ? ` · ${user.email}` : ''}`;
    elements.discord.textContent = user.discord ? `Discord: ${user.discord}` : 'Kein Discord-Name hinterlegt';
    elements.roleLabel.textContent = auth.roleLabel(user.role);
    elements.statusLabel.textContent = auth.statusLabel(user.status);
    elements.registered.textContent = formatDate(user.registeredAt);
    elements.lastLogin.textContent = formatDate(user.lastLogin);
    elements.bio.textContent = user.bio || 'Keine Profilbeschreibung hinterlegt.';
    elements.banReasonDisplay.textContent = user.banReason || 'Kein Banngrund hinterlegt.';
    elements.role.value = user.role;
    elements.notes.value = user.notes || '';
    elements.banReason.value = user.banReason || '';
    elements.accept.hidden = !['pending', 'rejected'].includes(user.status);
    elements.reject.hidden = !['pending', 'active'].includes(user.status);
    setMessages();
    auth.applyCurrentUserUI(elements.editor);

    const mayManageBan = auth.canManageBan(user, current);
    elements.banControls.hidden = !mayManageBan;
    elements.ban.hidden = !mayManageBan || user.status === 'banned';
    elements.unban.hidden = !mayManageBan || user.status !== 'banned';

    renderList();
    elements.editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeEditor() {
    selectedId = '';
    elements.editor.hidden = true;
    elements.placeholder.hidden = false;
    setMessages();
    renderList();
  }

  function runAction(action) {
    if (!selectedId) return;
    try {
      action();
      refreshUsers();
      openUser(selectedId);
      renderAll();
      setMessages('', 'Änderung wurde gespeichert.');
    } catch (error) {
      setMessages(error.message || 'Die Änderung konnte nicht gespeichert werden.');
    }
  }

  function renderAudit() {
    const entries = auth.getAudit();
    elements.auditList.replaceChildren();
    if (!entries.length) {
      const empty = document.createElement('p');
      empty.className = 'developer-user-empty';
      empty.textContent = 'Noch keine Änderungen protokolliert.';
      elements.auditList.appendChild(empty);
      return;
    }
    entries.slice(0, 80).forEach(entry => {
      const item = document.createElement('article');
      item.className = 'developer-user-audit-entry';
      const time = document.createElement('time');
      time.dateTime = entry.timestamp;
      time.textContent = formatDate(entry.timestamp);
      const content = document.createElement('div');
      const heading = document.createElement('strong');
      heading.textContent = `${entry.action} · ${entry.targetName}`;
      const detail = document.createElement('p');
      detail.textContent = `${entry.detail || 'Keine Zusatzangabe'} · Ausgeführt von ${entry.actorName || 'System'}`;
      content.append(heading, detail);
      item.append(time, content);
      elements.auditList.appendChild(item);
    });
  }

  function renderAll() {
    refreshUsers();
    renderCounters();
    renderList();
    renderAudit();
  }

  elements.search.addEventListener('input', renderList);
  elements.statusFilter.addEventListener('change', renderList);
  elements.roleFilter.addEventListener('change', renderList);
  elements.cancel.addEventListener('click', closeEditor);
  document.querySelectorAll('[data-user-status]').forEach(button => button.addEventListener('click', () => {
    elements.statusFilter.value = button.dataset.userStatus;
    renderList();
    elements.list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  elements.saveAdmin.addEventListener('click', () => runAction(() => {
    auth.setAccountRole(selectedId, elements.role.value);
    auth.setAccountNotes(selectedId, elements.notes.value);
  }));
  elements.accept.addEventListener('click', () => runAction(() => auth.setAccountStatus(selectedId, 'active')));
  elements.reject.addEventListener('click', () => runAction(() => auth.setAccountStatus(selectedId, 'rejected')));
  elements.ban.addEventListener('click', () => runAction(() => auth.setAccountStatus(selectedId, 'banned', elements.banReason.value)));
  elements.unban.addEventListener('click', () => runAction(() => auth.setAccountStatus(selectedId, 'active')));
  elements.auditClear.addEventListener('click', () => {
    if (!confirm('Das lokale Änderungsprotokoll vollständig leeren?')) return;
    try {
      auth.clearAudit();
      renderAudit();
    } catch (error) {
      alert(error.message);
    }
  });

  window.addEventListener('hok-auth-change', renderAll);
  window.addEventListener('storage', event => {
    if ([auth.ACCOUNTS_KEY, auth.AUDIT_KEY].includes(event.key)) renderAll();
  });

  auth.applyCurrentUserUI();
  renderAll();
})();
