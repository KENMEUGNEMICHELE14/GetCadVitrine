# GetCad BTP – site vitrine

Site statique (HTML, CSS, JavaScript), sans étape de build. Prêt pour Vercel.

## Structure

```
index.html                    page unique du site
assets/style.css              styles (mobile d'abord)
assets/script.js              menu, filtres, galerie photos, formulaire
assets/img/                   logo, photos des chantiers (optimisées en WebP)
assets/fonts/                 polices Barlow (hébergées avec le site)
assets/references-getcad-btp.pdf   dossier de références (téléchargeable)
vercel.json                   cache et en-têtes de sécurité
```

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Mettre en ligne sur Vercel

1. Pousser ce dossier sur GitHub (le dépôt existant `GetCadVitrine` convient).
2. Sur vercel.com : **Add New → Project**, choisir le dépôt.
3. **Framework Preset : Other**. Laisser tous les autres champs vides, puis **Deploy**.
4. Chaque `git push` sur `main` redéploie automatiquement le site.

Pour un nom de domaine : Vercel → Project → Settings → Domains.

## Modifier le contenu

- Textes, téléphones, email, horaires : `index.html`
- Formulaire de contact (EmailJS) : constantes en haut de la section « Formulaire » de `assets/script.js`
- Changer la photo d'accueil : remplacer `assets/img/hero-1024.webp` (1024×1024) et `hero-640.webp` (640×640)
