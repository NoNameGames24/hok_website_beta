#!/usr/bin/env node
/**
 * DokuWiki Importer für History of Khorinis.
 * Lädt mehrere bekannte DokuWiki-Exportformen und speichert Rohtext/HTML.
 * Nutzung: node tools/crawl-dokuwiki.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';

const pages = ['start','rpleitfaden','regeln','logs','manuelleinstallation','berufe','lernpunkte','schadenstypen','serverfinanzen'];
const base = 'https://www.historyofkhorinis.de/dokuwiki/doku.php';
const outDir = new URL('../imported-wiki/', import.meta.url);

async function fetchText(url){
  const res = await fetch(url, {headers:{'user-agent':'HoK-Website-Migration/3.0'}});
  if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.text();
}

function stripHtml(input){
  return input
    .replace(/<script[\s\S]*?<\/script>/gi,'')
    .replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;/g,' ')
    .replace(/&amp;/g,'&')
    .replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>')
    .replace(/\s+/g,' ')
    .trim();
}

await mkdir(outDir, {recursive:true});
const report = [];
for (const id of pages) {
  const urls = [
    `${base}?id=${encodeURIComponent(id)}&do=export_raw`,
    `${base}?do=export_raw&id=${encodeURIComponent(id)}`,
    `${base}?id=${encodeURIComponent(id)}&do=export_xhtml`,
    `${base}?id=${encodeURIComponent(id)}`
  ];
  let ok = false;
  for (const url of urls) {
    try {
      const raw = await fetchText(url);
      const text = url.includes('export_raw') ? raw : stripHtml(raw);
      if (text.length < 80) throw new Error('zu wenig Inhalt');
      await writeFile(new URL(`${id}.txt`, outDir), text, 'utf8');
      await writeFile(new URL(`${id}.source-url.txt`, outDir), url, 'utf8');
      report.push({id, status:'ok', url, chars:text.length});
      ok = true;
      break;
    } catch (err) {
      report.push({id, status:'fail', url, error:String(err.message || err)});
    }
  }
  if (!ok) console.error(`Nicht importiert: ${id}`);
}
await writeFile(new URL('import-report.json', outDir), JSON.stringify(report,null,2), 'utf8');
console.log('Importversuch abgeschlossen. Siehe imported-wiki/import-report.json');
