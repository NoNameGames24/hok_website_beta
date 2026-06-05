# Asset-Audit V.0.0.2.2

## Ziel

Diese Version setzt die Startseite wieder auf den Stand **vor dem Asset-Einbau aus V.0.0.2.1** zurück. Der Header bleibt auf dem guten Stand aus V.0.0.2.0. Vor weiteren Einbauten werden Assets geprüft und sortiert.

## Technischer Stand

- Basis: `V.0.0.2.0`
- CSS-Cache-Busting: `styles.css?v=23`
- Discord-Link auf Startseite eingebaut: `https://discord.gg/FpPTgpY2DZ`

## Im Projekt vorhandene Asset-Dateien mit echter/teilweiser Transparenz

| Datei | Größe | transparenter Anteil |
|---|---:|---:|
| `hok-logo-gold-transparent.png` | 1024×1024 | 78.1% |
| `hok-logo-red.png` | 1600×895 | 86.1% |
| `logo-lockup-v12-clean.png` | 1402×1122 | 65.1% |
| `ui-about-frame-v11.png` | 2244×701 | 38.1% |
| `ui-about-frame-v12-clean.png` | 1896×829 | 49.6% |
| `ui-card-frame-v11.png` | 1122×1402 | 21.1% |
| `ui-features-strip-v11.png` | 2896×543 | 33.3% |
| `ui-footer-ornament-v11.png` | 5015×314 | 44.1% |
| `ui-header-v11.png` | 2896×543 | 54.7% |
| `ui-header-v12-clean.png` | 2872×547 | 62.3% |
| `ui-picture-frame-v12-clean.png` | 1448×1086 | 79.2% |
| `ui-plaque-v11.png` | 3546×443 | 29.9% |
| `ui-snow-divider-v11.png` | 3546×443 | 69.6% |

## Im Projekt vorhandene Asset-Dateien ohne echte Transparenz

Diese Dateien sind nicht automatisch schlecht: Szenenbilder, Gemälde und Hintergründe sollen meist deckend sein. Für UI-Overlay-Assets sind deckende oder fake-transparente Hintergründe aber problematisch.

| Datei | Größe |
|---|---:|
| `card-board-v6.webp` | 1122×1402 |
| `card-board-v7.webp` | 950×1187 |
| `frame-parchment-v6.webp` | 1448×1086 |
| `frame-parchment-v7.webp` | 1448×1086 |
| `heading-plaque-v6.webp` | 2172×724 |
| `heading-plaque-v7.webp` | 1700×567 |
| `hero-nordmar-night.webp` | 1916×821 |
| `hero-nordmar-v12.png` | 1672×941 |
| `hero-nordmar-v7.webp` | 1916×821 |
| `hok-logo-gold-bg.webp` | 1024×1024 |
| `hok-logo-gold-transparent.webp` | 1024×1024 |
| `hok-logo-red.webp` | 1600×895 |
| `hok-rp-card.webp` | 1600×1597 |
| `ingame-trio.webp` | 958×557 |
| `logo-lockup-v12.png` | 1402×1122 |
| `logo-lockup-v6.webp` | 1448×1086 |
| `logo-lockup-v7.webp` | 900×675 |
| `logo-lockup-v8.webp` | 861×650 |
| `nav-ornament-v6.webp` | 2200×419 |
| `nav-ornament-v7.webp` | 2399×457 |
| `notice-board.webp` | 933×1400 |
| `painting-02.webp` | 1536×1024 |
| `painting-03.webp` | 1536×1024 |
| `painting-04.webp` | 1536×1024 |
| `painting-05.webp` | 1536×1024 |
| `painting-06.webp` | 1536×1024 |
| `painting-07.webp` | 1536×1024 |
| `painting-08.webp` | 1536×1024 |
| `painting-sea-v9.webp` | 1536×1024 |
| `playcard-cover.webp` | 933×1400 |
| `ui-about-frame-v12.png` | 1896×829 |
| `ui-header-v12.png` | 2872×547 |
| `ui-picture-frame-v12.png` | 1448×1086 |

## Für UI aktuell freigegeben / behalten

- `ui-header-v12-clean.png` — Header ist aktuell gut und bleibt.
- `ui-snow-divider-v11.png` — als Hero/Section-Übergang verwendbar, muss sauber positioniert werden.
- `hok-logo-gold-transparent.png` — kleines HoK-Logo.
- `logo-lockup-v12-clean.png` — Hauptlogo auf Hero, aktuell nutzbar.

## Nur als normale Bilder/Hintergründe verwenden

- `hero-nordmar-v12.png`, `hero-nordmar-night.webp`, `hero-nordmar-v7.webp`
- `painting-02.webp` bis `painting-08.webp`
- `painting-sea-v9.webp`
- `ingame-trio.webp`

## Kritisch / vor Einsatz manuell prüfen

Diese Assets können optisch Checkerboard/Fake-Transparenz enthalten oder als UI-Overlay zu unruhig sein. Nicht mehr blind einbauen.

- `card-board-v6.webp` — Alpha: False, transparenter Anteil: -
- `card-board-v7.webp` — Alpha: False, transparenter Anteil: -
- `frame-parchment-v6.webp` — Alpha: False, transparenter Anteil: -
- `frame-parchment-v7.webp` — Alpha: False, transparenter Anteil: -
- `heading-plaque-v6.webp` — Alpha: False, transparenter Anteil: -
- `heading-plaque-v7.webp` — Alpha: False, transparenter Anteil: -
- `hok-logo-gold-bg.webp` — Alpha: False, transparenter Anteil: -
- `hok-logo-gold-transparent.webp` — Alpha: False, transparenter Anteil: -
- `hok-logo-red.png` — Alpha: True, transparenter Anteil: 86.1%
- `hok-logo-red.webp` — Alpha: False, transparenter Anteil: -
- `hok-rp-card.webp` — Alpha: False, transparenter Anteil: -
- `logo-lockup-v12.png` — Alpha: False, transparenter Anteil: -
- `logo-lockup-v6.webp` — Alpha: False, transparenter Anteil: -
- `logo-lockup-v7.webp` — Alpha: False, transparenter Anteil: -
- `logo-lockup-v8.webp` — Alpha: False, transparenter Anteil: -
- `nav-ornament-v6.webp` — Alpha: False, transparenter Anteil: -
- `nav-ornament-v7.webp` — Alpha: False, transparenter Anteil: -
- `playcard-cover.webp` — Alpha: False, transparenter Anteil: -
- `ui-about-frame-v11.png` — Alpha: True, transparenter Anteil: 38.1%
- `ui-about-frame-v12-clean.png` — Alpha: True, transparenter Anteil: 49.6%
- `ui-about-frame-v12.png` — Alpha: False, transparenter Anteil: -
- `ui-card-frame-v11.png` — Alpha: True, transparenter Anteil: 21.1%
- `ui-features-strip-v11.png` — Alpha: True, transparenter Anteil: 33.3%
- `ui-footer-ornament-v11.png` — Alpha: True, transparenter Anteil: 44.1%
- `ui-header-v11.png` — Alpha: True, transparenter Anteil: 54.7%
- `ui-header-v12.png` — Alpha: False, transparenter Anteil: -
- `ui-picture-frame-v12-clean.png` — Alpha: True, transparenter Anteil: 79.2%
- `ui-picture-frame-v12.png` — Alpha: False, transparenter Anteil: -
- `ui-plaque-v11.png` — Alpha: True, transparenter Anteil: 29.9%

## Externe generierte Kandidaten in `/mnt/data` vor Einbau prüfen

| Datei | Größe | Alpha | transparenter Anteil |
|---|---:|---:|---:|
| `a_collection_of_five_fantasy_themed_circular_icon.png` | 1536×1024 | True | 81.0% |
| `a_digital_illustration_of_a_fantasy_themed_icon_ba.png` | 1536×1024 | True | 70.8% |
| `a_set_of_five_fantasy_themed_icon_badges_is_displa.png` | 1536×1024 | True | 79.5% |
| `bronzemedaillon_mit_waage_und_frost.png` | 1254×1254 | False | - |
| `dekorativer_fantasy_ui_rahmen_mit_schnee.png` | 1916×821 | False | - |
| `dekorativer_mittelalterlicher_ui_banner_mit_schne.png` | 2172×724 | False | - |
| `dekorativer_mittelalterlicher_ui_rahmen.png` | 1122×1402 | False | - |
| `eisig_verziertes_nordisches_medaillon.png` | 1254×1254 | False | - |
| `eisige_allianz_in_bronzefarbenem_medaillon.png` | 1254×1254 | False | - |
| `eisige_schriftrolle_und_federemblem.png` | 1254×1254 | False | - |
| `fantasievolles_holz_ui_mit_goldverzierung.png` | 2508×627 | False | - |
| `fantasy_banner_with_ornate_metal_frame.png` | 2896×543 | False | - |
| `fantasy_kartenrahmen_mit_schneeakzenten.png` | 1122×1402 | False | - |
| `fantasy_ui_mit_nordischem_design.png` | 2508×627 | False | - |
| `fantasy_ui_panel_mit_frostigen_akzenten.png` | 1448×1086 | False | - |
| `gefrorene_ornamentleiste_mit_medaillon.png` | 3318×474 | False | - |
| `gothisches_emblem_mit_buch_und_feder.png` | 1254×1254 | False | - |
| `hok_geschichte_des_khorinis_wappen.png` | 1402×1122 | False | - |
| `holzbalken_rahmen_mit_nordischem_design.png` | 2172×724 | False | - |
| `holzrahmen_mit_nordischen_ornamenten.png` | 2172×724 | False | - |
| `holzschild_mit_nordischer_verzierung.png` | 3546×443 | False | - |
| `kalter_schild_mit_frostigen_akzenten.png` | 1254×1254 | False | - |
| `keltisches_emblem_mit_frostigen_akzenten.png` | 1254×1254 | False | - |
| `keltisches_medaillon_mit_pluszeichen.png` | 1254×1254 | False | - |
| `kreuzende_schwerter_auf_runenmedaillon.png` | 1254×1254 | False | - |
| `magisches_medaillon_mit_goldenen_sternen.png` | 1254×1254 | False | - |
| `medallion_mit_download_symbol_und_schnee.png` | 1254×1254 | False | - |
| `medallion_mit_keltischen_verzierungen_und_frost.png` | 1254×1254 | False | - |
| `medieval_fantasie_ui_mit_schneeakzenten.png` | 2508×627 | False | - |
| `medieval_fantasy_ui_frame.png` | 2244×701 | False | - |
| `medieval_fantasy_ui_frame_mit_schneedetails.png` | 1774×887 | False | - |
| `medieval_fantasy_ui_header_mit_schnee.png` | 2896×543 | False | - |
| `medieval_fantasy_ui_mit_holzrahmen.png` | 2872×547 | False | - |
| `medieval_fantasy_ui_mit_ornamenten.png` | 2244×701 | False | - |
| `medieval_fantasy_ui_with_snow_accents.png` | 2172×724 | False | - |
| `medieval_frost_bound_ui_panel.png` | 2172×724 | False | - |
| `medieval_hölzerner_bannerrahmen_mit_goldverzierung.png` | 2872×547 | False | - |
| `medieval_ornaments_mit_bronze_akzenten.png` | 1122×1402 | False | - |
| `medieval_winter_banner_with_gilded_frame.png` | 2172×724 | False | - |
| `medieval_winter_ui_mit_schlosslandschaft.png` | 1672×941 | False | - |
| `medieval_winter_ui_panel_design.png` | 1536×1024 | False | - |
| `mittelalterliche_gui_mit_frostakzenten.png` | 2508×627 | False | - |
| `mittelalterliche_pergamentrahmen_mit_nordischem_de.png` | 1448×1086 | False | - |
| `mittelalterlicher_ui_rahmen_mit_frostakzenten.png` | 1672×941 | False | - |
| `mittelalterliches_ornamente_bannerdesign.png` | 2172×724 | False | - |
| `mittelalterliches_ui_panel_mit_frostigen_verzierun.png` | 1086×1448 | False | - |
| `mystisches_buch_in_frostigem_medaillon.png` | 1254×1254 | False | - |
| `nordic_medallion_with_village_scene.png` | 1254×1254 | False | - |
| `ornamentale_fantasie_trennlinie_mit_wappen.png` | 3546×443 | False | - |
| `ornamentale_frachtplatte_mit_frostakzenten.png` | 2172×724 | False | - |
| `ornamentale_mittelleiste_mit_frostigen_akzenten.png` | 2508×627 | False | - |
| `ornamentales_nordisches_ui_panel.png` | 2048×768 | False | - |
| `ornamentierter_frostiger_ui_rahmen.png` | 2508×627 | False | - |
| `ornate_eisige_holzplakette_mit_emblem.png` | 2172×724 | False | - |
| `ornate_fantasy_game_ui_panel.png` | 2896×543 | False | - |
| `ornate_fantasy_ui_panel_with_snow.png` | 1086×1448 | False | - |
| `ornate_medieval_banner_with_frosty_accents.png` | 1774×887 | False | - |
| `ornate_mittelalterliche_ui_kopfzeile.png` | 2896×543 | False | - |
| `ornate_mittelalterlicher_ui_banner.png` | 2508×627 | False | - |
| `ornate_nordic_menu_ui_panel.png` | 941×1672 | False | - |
| `ornate_rahmen_im_fantasy_stil.png` | 2172×724 | False | - |
| `ornate_ui_banner_mit_frostigen_akzenten.png` | 2172×724 | False | - |
| `ornate_winter_emblem_mit_keltischen_verzierungen.png` | 1254×1254 | False | - |
| `rustikale_fantasy_kartenrahmen_mit_metallakzenten.png` | 1896×829 | False | - |
| `rustikale_fantasy_schildertafel_im_schnee.png` | 1122×1402 | False | - |
| `rustikales_holz_quest_ui_design.png` | 1086×1448 | False | - |
| `schmiedeeiserne_winterrahmen_mit_holzakzenten.png` | 2172×724 | False | - |
| `schmiedewerkzeug_im_winterlichen_medaillon.png` | 1254×1254 | False | - |
| `schmuckhafter_mittelalterlicher_namensschildrahmen.png` | 2172×724 | False | - |
| `schmuckmedaillon_mit_frostigen_akzenten.png` | 1254×1254 | False | - |
| `schneebedecktes_nordisches_ui_panel.png` | 2172×724 | False | - |
| `symmetrische_nordische_ornamente_mit_wappen.png` | 2896×543 | False | - |
| `verwittertes_wappen_mit_pergamentrolle.png` | 1254×1254 | False | - |
| `verzierte_bannerrahmen_mit_winterlichem_akzent.png` | 2172×724 | False | - |
| `verzierte_fantasy_gamerahmen_mit_winterakzent.png` | 2172×724 | False | - |
| `verzierte_mittelalterliche_rahmen_mit_eisakzenten.png` | 1086×1448 | False | - |
| `verzierter_mittelalterlicher_rahmen_mit_schnee.png` | 1448×1086 | False | - |
| `vikinger_banner_mit_keltischen_verzierungen.png` | 2896×543 | False | - |
| `vikinger_ornamente_der_ui_grenze.png` | 5015×314 | False | - |
| `vikingerrahmen_mit_frostigem_design.png` | 2172×724 | False | - |
| `winterfestes_wappen_mit_dunklem_turm.png` | 1254×1254 | False | - |
| `winterliche_fantasiereiche_ui_plakette.png` | 2508×627 | False | - |
| `winterliche_fantasy_schilderornamente.png` | 2172×724 | False | - |
| `winterliche_holzschild_bannerrahmen.png` | 2896×543 | False | - |
| `winterliche_holztafel_mit_symbol.png` | 1916×821 | False | - |
| `winterliche_medaillon_schaltfläche_mit_pfeil.png` | 1254×1254 | False | - |
| `winterliche_nordische_schilderrahmen_dekoration.png` | 2172×724 | False | - |
| `winterliche_ornamente_mit_frostigen_akzenten.png` | 3546×443 | False | - |
| `winterliche_schilde_und_keltische_muster.png` | 2172×724 | False | - |
| `wintermagic_emblem_with_rune_and_book.png` | 1254×1254 | False | - |
| `öffentliches_wappen_mit_eisakzenten.png` | 2172×724 | False | - |

## Fehlende finale Assets für den Referenz-Look

1. Saubere, transparente Feature-Icons im exakt gleichen Stil und gleicher Größe.
2. Saubere Schnellstart-Kartenrahmen ohne Fake-Transparenz.
3. Saubere Feature-Leiste ohne Checkerboard-Ränder.
4. Sauberer News-Strip/Carousel-Rahmen.
5. Sauberes Footer-Ornament mit echter Transparenz.
6. Einheitliche Unterseiten-Panels im gleichen Stil.
7. Mobile-spezifische Header-/Karten-Assets.

## Nächster sinnvoller Arbeitsschritt

Vor dem nächsten visuellen Einbau erst alle Kandidaten in einem Asset-Review prüfen: Datei öffnen, Alpha prüfen, Checkerboard ausschließen, dann einzeln freigeben. Danach erst wieder HTML/CSS ändern.
