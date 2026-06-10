// Author: NoNameGames - Lou
(() => {
  'use strict';

  const ACCOUNTS_KEY = 'hokLocalAccountsV2';
  const SESSION_KEY = 'hokLocalSessionV2';
  const AUDIT_KEY = 'hokLocalUserAuditV2';
  const MAX_AUDIT_ITEMS = 300;

  const ROLE_DEFINITIONS = {
    member: {
      label: 'Benutzer',
      permissions: ['dashboard']
    },
    admin: {
      label: 'Admin',
      permissions: ['dashboard', 'news:create', 'news:manage-all', 'gallery:create', 'gallery:manage-all', 'pages:edit', 'users:view', 'users:approve', 'users:roles', 'users:ban', 'users:notes', 'audit:clear']
    },
    support: {
      label: 'Support',
      permissions: ['dashboard', 'news:create', 'news:manage-own', 'gallery:create', 'gallery:manage-own', 'users:view', 'users:ban']
    },
    technician: {
      label: 'Techniker',
      permissions: ['dashboard', 'news:create', 'news:manage-all', 'gallery:create', 'gallery:manage-all', 'pages:edit']
    },
    socialmedia: {
      label: 'SocialMedia',
      permissions: ['dashboard', 'news:create', 'news:manage-own', 'gallery:create', 'gallery:manage-own']
    },
    balancing: {
      label: 'Balancing',
      permissions: ['dashboard', 'news:create', 'news:manage-own', 'gallery:create', 'gallery:manage-own']
    },
    eventler: {
      label: 'Eventler',
      permissions: ['dashboard', 'news:create', 'news:manage-own', 'gallery:create', 'gallery:manage-own']
    }
  };

  const STATUS_DEFINITIONS = {
    pending: 'Wartet auf Prüfung',
    active: 'Angenommen',
    rejected: 'Abgelehnt',
    banned: 'Gebannt'
  };

  const clone = value => JSON.parse(JSON.stringify(value));

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('hok-auth-change', { detail: key }));
  }

  function randomHex(bytes = 16) {
    const values = new Uint8Array(bytes);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(values);
    else for (let i = 0; i < values.length; i += 1) values[i] = Math.floor(Math.random() * 256);
    return [...values].map(value => value.toString(16).padStart(2, '0')).join('');
  }

  async function hashPassword(password, salt) {
    const source = `${salt}:${password}`;
    if (window.crypto?.subtle && window.TextEncoder) {
      const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
      return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
    }

    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `fallback-${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  function normalizeAccount(account) {
    const role = ROLE_DEFINITIONS[account?.role] ? account.role : 'member';
    const status = STATUS_DEFINITIONS[account?.status] ? account.status : 'pending';
    return {
      id: String(account?.id || `user-${Date.now()}-${randomHex(4)}`),
      displayName: String(account?.displayName || account?.username || 'Benutzer'),
      username: String(account?.username || ''),
      email: String(account?.email || ''),
      discord: String(account?.discord || ''),
      role,
      status,
      registeredAt: String(account?.registeredAt || new Date().toISOString()),
      lastLogin: String(account?.lastLogin || ''),
      avatar: String(account?.avatar || ''),
      bio: String(account?.bio || ''),
      notes: String(account?.notes || ''),
      banReason: String(account?.banReason || ''),
      salt: String(account?.salt || ''),
      passwordHash: String(account?.passwordHash || '')
    };
  }

  function getRawAccounts() {
    const accounts = readStorage(ACCOUNTS_KEY, []);
    return Array.isArray(accounts) ? accounts.map(normalizeAccount) : [];
  }

  function saveRawAccounts(accounts) {
    writeStorage(ACCOUNTS_KEY, accounts.map(normalizeAccount));
  }

  function safeAccount(account) {
    if (!account) return null;
    const { salt, passwordHash, ...safe } = account;
    return clone(safe);
  }

  async function ensureBootstrap() {
    const accounts = getRawAccounts();
    if (accounts.some(account => account.role === 'admin')) return;

    const salt = randomHex();
    const passwordHash = await hashPassword('Passwort', salt);
    accounts.unshift(normalizeAccount({
      id: 'system-admin',
      displayName: 'Admin',
      username: 'Admin',
      email: '',
      discord: '',
      role: 'admin',
      status: 'active',
      registeredAt: new Date().toISOString(),
      lastLogin: '',
      avatar: '',
      bio: '',
      notes: 'Initiales lokales Administratorkonto.',
      banReason: '',
      salt,
      passwordHash
    }));
    saveRawAccounts(accounts);
  }

  const ready = ensureBootstrap();

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      const session = raw ? JSON.parse(raw) : null;
      return session && typeof session === 'object' ? session : null;
    } catch {
      return null;
    }
  }

  function setSession(userId) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId, createdAt: new Date().toISOString() }));
    sessionStorage.removeItem('hokLocalDeveloper');
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('hokLocalDeveloper');
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session?.userId) return null;
    const account = getRawAccounts().find(entry => entry.id === session.userId);
    if (!account || account.status !== 'active') {
      clearSession();
      return null;
    }
    return safeAccount(account);
  }

  function hasPermission(permission, user = getCurrentUser()) {
    if (!user || user.status !== 'active') return false;
    return Boolean(ROLE_DEFINITIONS[user.role]?.permissions.includes(permission));
  }

  function validateIdentity({ displayName, username, email }, accounts, currentId = '') {
    const cleanDisplayName = String(displayName || '').trim();
    const cleanUsername = String(username || '').trim();
    const cleanEmail = String(email || '').trim();

    if (!cleanDisplayName) throw new Error('Der Anzeigename fehlt.');
    if (!/^[A-Za-z0-9._-]{3,40}$/.test(cleanUsername)) {
      throw new Error('Der Benutzername muss 3 bis 40 Zeichen lang sein und darf nur Buchstaben, Zahlen, Punkt, Unterstrich und Bindestrich enthalten.');
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Die E-Mail-Adresse ist ungültig.');
    if (accounts.some(account => account.id !== currentId && account.username.toLowerCase() === cleanUsername.toLowerCase())) {
      throw new Error('Dieser Benutzername ist bereits vergeben.');
    }
    if (cleanEmail && accounts.some(account => account.id !== currentId && account.email && account.email.toLowerCase() === cleanEmail.toLowerCase())) {
      throw new Error('Diese E-Mail-Adresse ist bereits vergeben.');
    }

    return { displayName: cleanDisplayName, username: cleanUsername, email: cleanEmail };
  }

  function getAudit() {
    const entries = readStorage(AUDIT_KEY, []);
    return Array.isArray(entries) ? clone(entries) : [];
  }

  function addAudit(target, action, detail = '') {
    const actor = getCurrentUser();
    const entries = getAudit();
    entries.unshift({
      id: `audit-${Date.now()}-${randomHex(3)}`,
      timestamp: new Date().toISOString(),
      actorId: actor?.id || '',
      actorName: actor?.displayName || actor?.username || 'System',
      targetId: target?.id || '',
      targetName: target?.displayName || target?.username || 'Unbekannter Benutzer',
      action,
      detail
    });
    writeStorage(AUDIT_KEY, entries.slice(0, MAX_AUDIT_ITEMS));
  }

  async function register(data) {
    await ready;
    const accounts = getRawAccounts();
    const identity = validateIdentity(data, accounts);
    const password = String(data.password || '');
    if (password.length < 8 || password.length > 128) throw new Error('Das Passwort muss 8 bis 128 Zeichen lang sein.');

    const salt = randomHex();
    const account = normalizeAccount({
      id: `user-${Date.now()}-${randomHex(4)}`,
      ...identity,
      discord: '',
      role: 'member',
      status: 'pending',
      registeredAt: new Date().toISOString(),
      lastLogin: '',
      avatar: '',
      bio: '',
      notes: '',
      banReason: '',
      salt,
      passwordHash: await hashPassword(password, salt)
    });
    accounts.push(account);
    saveRawAccounts(accounts);
    addAudit(account, 'Registrierung eingereicht', 'Status: Wartet auf Prüfung');
    return safeAccount(account);
  }

  async function authenticate(login, password) {
    await ready;
    const identifier = String(login || '').trim().toLowerCase();
    const accounts = getRawAccounts();
    const account = accounts.find(entry => entry.username.toLowerCase() === identifier || (entry.email && entry.email.toLowerCase() === identifier));
    if (!account) return { ok: false, code: 'invalid', message: 'Benutzername, E-Mail-Adresse oder Passwort ist falsch.' };

    const candidateHash = await hashPassword(String(password || ''), account.salt);
    if (!account.passwordHash || candidateHash !== account.passwordHash) {
      return { ok: false, code: 'invalid', message: 'Benutzername, E-Mail-Adresse oder Passwort ist falsch.' };
    }
    if (account.status === 'pending') return { ok: false, code: 'pending', message: 'Der Account wartet noch auf Freigabe durch einen Admin.' };
    if (account.status === 'rejected') return { ok: false, code: 'rejected', message: 'Die Registrierung wurde abgelehnt.' };
    if (account.status === 'banned') return { ok: false, code: 'banned', message: account.banReason ? `Der Account ist gebannt: ${account.banReason}` : 'Der Account ist gebannt.' };
    if (account.status !== 'active') return { ok: false, code: 'inactive', message: 'Der Account ist nicht freigeschaltet.' };

    account.lastLogin = new Date().toISOString();
    saveRawAccounts(accounts);
    setSession(account.id);
    return { ok: true, user: safeAccount(account) };
  }

  function logout() {
    clearSession();
  }

  function getAccounts() {
    return getRawAccounts().map(safeAccount);
  }

  function ensureActor() {
    const actor = getCurrentUser();
    if (!actor) throw new Error('Die Sitzung ist nicht mehr gültig.');
    return actor;
  }

  function countActiveAdmins(accounts) {
    return accounts.filter(account => account.role === 'admin' && account.status === 'active').length;
  }

  function setAccountRole(targetId, nextRole) {
    const actor = ensureActor();
    if (!hasPermission('users:roles', actor)) throw new Error('Nur Admins dürfen Rollen vergeben.');
    if (!ROLE_DEFINITIONS[nextRole]) throw new Error('Die ausgewählte Rolle ist ungültig.');

    const accounts = getRawAccounts();
    const target = accounts.find(account => account.id === targetId);
    if (!target) throw new Error('Der Account wurde nicht gefunden.');
    if (target.role === 'admin' && nextRole !== 'admin' && target.status === 'active' && countActiveAdmins(accounts) <= 1) {
      throw new Error('Der letzte aktive Admin kann nicht herabgestuft werden.');
    }

    const previousRole = target.role;
    target.role = nextRole;
    saveRawAccounts(accounts);
    addAudit(target, 'Rolle geändert', `${ROLE_DEFINITIONS[previousRole]?.label || previousRole} → ${ROLE_DEFINITIONS[nextRole].label}`);
    return safeAccount(target);
  }

  function canManageBan(target, actor = getCurrentUser()) {
    if (!actor || !target || !hasPermission('users:ban', actor)) return false;
    if (target.id === actor.id) return false;
    if (actor.role !== 'admin' && ['admin', 'support'].includes(target.role)) return false;
    return true;
  }

  function setAccountStatus(targetId, nextStatus, banReason = '') {
    const actor = ensureActor();
    if (!STATUS_DEFINITIONS[nextStatus]) throw new Error('Der ausgewählte Status ist ungültig.');

    const accounts = getRawAccounts();
    const target = accounts.find(account => account.id === targetId);
    if (!target) throw new Error('Der Account wurde nicht gefunden.');

    if (target.id === actor.id && nextStatus !== 'active') {
      throw new Error('Der eigene Account kann nicht abgelehnt, deaktiviert oder gebannt werden.');
    }

    const isBanAction = nextStatus === 'banned' || target.status === 'banned';
    if (isBanAction) {
      if (!hasPermission('users:ban', actor)) throw new Error('Nur Admins und Support dürfen Accounts bannen oder entbannen.');
      if (!canManageBan(target, actor)) {
        if (['admin', 'support'].includes(target.role)) {
          throw new Error('Admins und Supporter dürfen ausschließlich von einem Admin gebannt oder entbannt werden.');
        }
        throw new Error('Dieser Account darf von deinem Account nicht gebannt oder entbannt werden.');
      }
      if (nextStatus === 'banned' && !String(banReason || '').trim()) throw new Error('Ein Banngrund ist erforderlich.');
    } else if (!hasPermission('users:approve', actor)) {
      throw new Error('Nur Admins dürfen Registrierungen annehmen oder ablehnen.');
    }

    if (target.role === 'admin' && target.status === 'active' && nextStatus !== 'active' && countActiveAdmins(accounts) <= 1) {
      throw new Error('Der letzte aktive Admin kann nicht deaktiviert werden.');
    }

    const previousStatus = target.status;
    target.status = nextStatus;
    target.banReason = nextStatus === 'banned' ? String(banReason || '').trim() : '';
    saveRawAccounts(accounts);
    addAudit(target, 'Kontostatus geändert', `${STATUS_DEFINITIONS[previousStatus]} → ${STATUS_DEFINITIONS[nextStatus]}${target.banReason ? ` · ${target.banReason}` : ''}`);
    return safeAccount(target);
  }

  function setAccountNotes(targetId, notes) {
    const actor = ensureActor();
    if (!hasPermission('users:notes', actor)) throw new Error('Nur Admins dürfen interne Notizen bearbeiten.');
    const accounts = getRawAccounts();
    const target = accounts.find(account => account.id === targetId);
    if (!target) throw new Error('Der Account wurde nicht gefunden.');
    target.notes = String(notes || '').trim().slice(0, 2000);
    saveRawAccounts(accounts);
    addAudit(target, 'Interne Notiz aktualisiert');
    return safeAccount(target);
  }

  async function updateOwnProfile(data) {
    const actor = ensureActor();
    const accounts = getRawAccounts();
    const target = accounts.find(account => account.id === actor.id);
    if (!target) throw new Error('Der eigene Account wurde nicht gefunden.');

    const identity = validateIdentity(data, accounts, target.id);
    target.displayName = identity.displayName;
    target.username = identity.username;
    target.email = identity.email;
    target.discord = String(data.discord || '').trim().slice(0, 80);
    target.bio = String(data.bio || '').trim().slice(0, 1000);
    target.avatar = String(data.avatar || '');

    const newPassword = String(data.newPassword || '');
    if (newPassword) {
      if (newPassword.length < 8 || newPassword.length > 128) throw new Error('Das neue Passwort muss 8 bis 128 Zeichen lang sein.');
      const currentHash = await hashPassword(String(data.currentPassword || ''), target.salt);
      if (currentHash !== target.passwordHash) throw new Error('Das aktuelle Passwort ist falsch.');
      target.salt = randomHex();
      target.passwordHash = await hashPassword(newPassword, target.salt);
    }

    saveRawAccounts(accounts);
    addAudit(target, 'Eigenes Profil aktualisiert', newPassword ? 'Profil und Passwort geändert' : 'Profildaten geändert');
    return safeAccount(target);
  }

  function clearAudit() {
    const actor = ensureActor();
    if (!hasPermission('audit:clear', actor)) throw new Error('Nur Admins dürfen das Änderungsprotokoll leeren.');
    localStorage.removeItem(AUDIT_KEY);
  }

  function roleLabel(role) {
    return ROLE_DEFINITIONS[role]?.label || role || 'Benutzer';
  }

  function statusLabel(status) {
    return STATUS_DEFINITIONS[status] || status || '';
  }

  function applyCurrentUserUI(root = document) {
    const user = getCurrentUser();
    if (!user) return;
    root.querySelectorAll('[data-current-user-name]').forEach(node => { node.textContent = user.displayName || user.username; });
    root.querySelectorAll('[data-current-user-role]').forEach(node => { node.textContent = roleLabel(user.role); });
    root.querySelectorAll('[data-permission]').forEach(node => {
      node.hidden = !hasPermission(node.dataset.permission, user);
    });
  }

  window.HoKAuth = {
    ACCOUNTS_KEY,
    SESSION_KEY,
    AUDIT_KEY,
    ROLE_DEFINITIONS: clone(ROLE_DEFINITIONS),
    STATUS_DEFINITIONS: clone(STATUS_DEFINITIONS),
    ready,
    register,
    authenticate,
    logout,
    getCurrentUser,
    getAccounts,
    hasPermission,
    roleLabel,
    statusLabel,
    setAccountRole,
    setAccountStatus,
    canManageBan,
    setAccountNotes,
    updateOwnProfile,
    getAudit,
    clearAudit,
    applyCurrentUserUI
  };
})();
