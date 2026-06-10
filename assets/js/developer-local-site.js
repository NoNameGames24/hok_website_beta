// Author: NoNameGames - Lou
(() => {
  if (window.HoKAccessDenied) return;
  const api = window.HoKLocal;
  const warning = document.getElementById('local-protocol-warning');
  if (location.protocol === 'file:') warning.hidden = false;

  const defaults = {
    heroSubtitle:'Ein Hardcore-RP-Projekt in der Welt von Gothic 2\nGemeinsam schreiben wir Geschichte.',
    discord:'https://discord.gg/FpPTgpY2DZ',
    introEyebrow:'Über History of Khorinis Roleplay',
    introTitle:'Eine lebendige Welt voller Gefahren, Intrigen und Möglichkeiten',
    introText1:'HoK RP ist ein ernsthaftes und atmosphärisches Rollenspielprojekt auf Basis von Gothic 2: Die Nacht des Raben. Im Mittelpunkt stehen glaubwürdige Charaktere, harte Konsequenzen und eine Spielwelt, die sich durch Entscheidungen der Community weiterentwickelt.',
    introText2:'Nordmar, Khorinis und die Kolonie bilden den Rahmen für Geschichten, Fraktionen, Konflikte und gemeinsames Storytelling. Die Startseite führt neue Spieler direkt zu Installation, Regeln, RP-Leitfaden und den wichtigsten Systemen.',
    quickHeading:'Schnellstart',
    worldEyebrow:'Spielwelt & Setting',
    worldTitle:'Khorinis, die See und Nordmar',
    systemsEyebrow:'Systeme & Features',
    systemsTitle:'Charakterentwicklung mit Konsequenzen',
    newsHeading:'Aktuelles aus Khorinis',
    footerText:'© 2024 History of Khorinis Roleplay · Alle Rechte vorbehalten.',
    hardcoreTitle:'Hardcore RP',hardcoreText:'Tiefe Charaktere und echte Konsequenzen statt Powergaming.',hardcoreLink:'hardcore-rp.html',
    communityTitle:'Aktive Community',communityText:'Spieler gestalten die Welt gemeinsam und fair.',communityLink:'community.html',
    worldFeatureTitle:'Lebendige Welt',worldFeatureText:'Nordmar, Khorinis und die Kolonie atmosphärisch inszeniert.',worldFeatureLink:'lebendige-welt.html',
    showIntro:true,showQuick:true,showWorld:true,showFeatures:true,showNews:true,
    sectionOrder:['intro','quick','world','features','news']
  };
  const ids = Object.keys(defaults).concat(['heroMinHeight','contentWidth','sectionSpacing','cardColumns','fontScale']);
  const saved = api.getSite();

  ids.forEach(key=>{
    const input=document.getElementById(`site-${key}`);
    if(!input)return;
    const value = key in saved ? saved[key] : defaults[key];
    if(input.type==='checkbox') input.checked = value !== false;
    else if(key==='sectionOrder') input.value=(value||defaults.sectionOrder).join(', ');
    else input.value=value ?? '';
  });

  document.getElementById('local-site-form').addEventListener('submit',event=>{
    event.preventDefault();
    const data={};
    ids.forEach(key=>{
      const input=document.getElementById(`site-${key}`);
      if(!input)return;
      if(input.type==='checkbox') data[key]=input.checked;
      else if(key==='sectionOrder') data[key]=input.value.split(',').map(v=>v.trim()).filter(Boolean);
      else if(input.type==='number') {
        if(input.value!=='') data[key]=Number(input.value);
      } else data[key]=input.value;
    });
    api.setSite(data);
    const status=document.getElementById('local-site-status');
    status.hidden=false;
    setTimeout(()=>status.hidden=true,2600);
  });

  document.getElementById('local-site-reset').addEventListener('click',()=>{
    if(!confirm('Alle lokalen Änderungen an der Hauptseite zurücksetzen?'))return;
    localStorage.removeItem('hokLocalSiteSettingsV3');
    location.reload();
  });
})();