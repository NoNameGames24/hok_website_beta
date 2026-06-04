# Security Hotfix v11

## Problem
GitHub Secret Scanning meldete Google API Keys in lokal gespeicherten YouTube-Embed-Dateien:

- `assets/wiki/history-of-khorinis/XpIeoOsTcdQ.htm`
- `assets/wiki/history-of-khorinis/XpIeoOsTcdQ_data/base.js`
- `assets/wiki/history-of-khorinis/XpIeoOsTcdQ_data/m=root,base`

Diese Dateien stammten aus einem gecachten YouTube-Embed bzw. einem Wiki-Export und gehören nicht in das Repository.

## Hotfix

- Lokale YouTube-Embed-HTML-Datei entfernt.
- Lokalen YouTube-Asset-Ordner entfernt.
- Iframe auf `https://www.youtube-nocookie.com/embed/XpIeoOsTcdQ` umgestellt.
- Repository-Dateien nach `AIza...`-Mustern geprüft.

## Wichtig

Wenn die Dateien bereits gepusht wurden, sind sie noch in der Git-Historie des alten Commits vorhanden. Für ein öffentliches Repository sollte die Historie bereinigt oder ein frischer Commit/Repo-Stand ohne diese Dateien verwendet werden. GitHub-Alerts müssen danach in GitHub Security manuell geprüft/geschlossen werden.
