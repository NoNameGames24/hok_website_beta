// Author: NoNameGames - Lou
(() => {
  'use strict';
  if (window.HoKAccessDenied) return;

  const auth = window.HoKAuth;
  const form = document.getElementById('developer-profile-form');
  const avatarData = document.getElementById('developer-profile-avatar-data');
  const avatarFile = document.getElementById('developer-profile-avatar-file');
  const avatarPreview = document.getElementById('developer-profile-avatar-preview');
  const errorNode = document.getElementById('developer-profile-error');
  const successNode = document.getElementById('developer-profile-success');

  function initials(name, username = '') {
    const source = String(name || username || '?').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)[0]}` : source.slice(0, 2)).toUpperCase();
  }

  function setAvatar(value = '') {
    avatarPreview.replaceChildren();
    if (value) {
      const image = document.createElement('img');
      image.src = value;
      image.alt = '';
      avatarPreview.appendChild(image);
    } else {
      avatarPreview.textContent = initials(
        document.getElementById('developer-profile-display-name').value,
        document.getElementById('developer-profile-username').value
      );
    }
  }

  function setMessages(error = '', success = '') {
    errorNode.textContent = error;
    errorNode.hidden = !error;
    successNode.textContent = success;
    successNode.hidden = !success;
  }

  function fill(user) {
    document.getElementById('developer-profile-display-name').value = user.displayName || '';
    document.getElementById('developer-profile-username').value = user.username || '';
    document.getElementById('developer-profile-email').value = user.email || '';
    document.getElementById('developer-profile-discord').value = user.discord || '';
    document.getElementById('developer-profile-role').value = auth.roleLabel(user.role);
    document.getElementById('developer-profile-status').value = auth.statusLabel(user.status);
    document.getElementById('developer-profile-bio').value = user.bio || '';
    avatarData.value = user.avatar || '';
    setAvatar(user.avatar || '');
    auth.applyCurrentUserUI();
  }

  function resizeAvatar(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Die ausgewählte Datei ist kein Bild.'));
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('error', () => reject(new Error('Das Profilbild konnte nicht gelesen werden.')));
      reader.addEventListener('load', () => {
        const image = new Image();
        image.addEventListener('error', () => reject(new Error('Das Profilbild konnte nicht verarbeitet werden.')));
        image.addEventListener('load', () => {
          const scale = Math.min(1, 512 / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/webp', 0.84));
        });
        image.src = reader.result;
      });
      reader.readAsDataURL(file);
    });
  }

  document.getElementById('developer-profile-display-name').addEventListener('input', () => {
    if (!avatarData.value) setAvatar('');
  });
  document.getElementById('developer-profile-username').addEventListener('input', () => {
    if (!avatarData.value) setAvatar('');
  });

  avatarFile.addEventListener('change', async () => {
    const file = avatarFile.files?.[0];
    if (!file) return;
    setMessages();
    try {
      avatarData.value = await resizeAvatar(file);
      setAvatar(avatarData.value);
    } catch (error) {
      avatarFile.value = '';
      setMessages(error.message || 'Das Profilbild konnte nicht verarbeitet werden.');
    }
  });

  document.getElementById('developer-profile-avatar-remove').addEventListener('click', () => {
    avatarData.value = '';
    avatarFile.value = '';
    setAvatar('');
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    setMessages();
    const newPassword = document.getElementById('developer-profile-new-password').value;
    const confirmation = document.getElementById('developer-profile-new-password-confirm').value;
    if (newPassword !== confirmation) {
      setMessages('Die neuen Passwörter stimmen nicht überein.');
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    try {
      const user = await auth.updateOwnProfile({
        displayName: document.getElementById('developer-profile-display-name').value,
        username: document.getElementById('developer-profile-username').value,
        email: document.getElementById('developer-profile-email').value,
        discord: document.getElementById('developer-profile-discord').value,
        bio: document.getElementById('developer-profile-bio').value,
        avatar: avatarData.value,
        currentPassword: document.getElementById('developer-profile-current-password').value,
        newPassword
      });
      document.getElementById('developer-profile-current-password').value = '';
      document.getElementById('developer-profile-new-password').value = '';
      document.getElementById('developer-profile-new-password-confirm').value = '';
      fill(user);
      setMessages('', 'Das eigene Profil wurde gespeichert.');
    } catch (error) {
      setMessages(error.message || 'Das Profil konnte nicht gespeichert werden.');
    } finally {
      submit.disabled = false;
    }
  });

  const current = auth.getCurrentUser();
  if (current) fill(current);
})();
