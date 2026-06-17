# whoami

A small personal website for Pratyusha: homepage, about/resume, projects, blog and saved links, plus a wedding website archive.

## Local preview

```sh
cd src/main
npm run dev
```

Then open `http://localhost:4173`.

## Editing content

Most site content lives in `src/main/app.js` inside the `siteContent` object:

- `profile` controls homepage links and short bio copy.
- `projects` controls project cards and GitHub links.
- `posts` controls original blog entries.
- `links` controls saved articles and things to revisit.
- `wedding` controls the archive tab.

Replace `src/main/assets/profile.svg` with a real photo when ready. Replace `src/main/assets/resume.pdf` with the current resume PDF; the About tab embeds and downloads that file directly.
