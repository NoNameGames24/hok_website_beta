# GitHub-Pages-Version

Diese Ausgabe ist eine rein statische Website.

## Sicherheitsmodell

Auf GitHub Pages kann kein sicherer eigener Admin-Login betrieben werden. Deshalb wurden entfernt:

- Login und Registrierung
- Admin-Dashboard
- Servercode
- Datenbank
- Passwörter und Secrets
- Upload-Endpunkte
- Formulare, die Inhalte direkt veröffentlichen

Die Bearbeitung erfolgt ausschließlich über ein berechtigtes GitHub-Konto im Repository.

## Empfohlene Repository-Einstellungen

1. Repository auf privat stellen, falls der Quellcode nicht öffentlich sein soll.
2. Branch `main` schützen.
3. Pull Requests für Änderungen verlangen.
4. Zwei-Faktor-Authentifizierung oder Passkey für alle berechtigten GitHub-Konten erzwingen.
5. GitHub Pages über `GitHub Actions` veröffentlichen.
6. Keine Secrets in HTML, JavaScript, JSON oder Commits speichern.

## Inhalte ändern

- Aktuelles: `data/aktuelles.json` und die zugehörigen HTML-Dateien bearbeiten.
- Galerie: Bilder unter `assets/images/` ergänzen und `galerie.html` aktualisieren.
- Allgemeine Texte: direkt in den jeweiligen HTML-Dateien ändern.

## Wichtig

Eine statische GitHub-Pages-Seite kann sicher öffentlich ausgeliefert werden, aber sie kann keinen sicheren eigenen Benutzer-Login, keine serverseitige Freigabe und keine geschützten Uploads bereitstellen.
