# Professional Waves

Website for Professional Waves, a UAE event production company (audio, video & LED,
lighting, technical support). Built with Next.js 16 (App Router), TypeScript and CSS Modules.

## Running it

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`.

## Admin dashboard

Sign in at **`/admin`** with `ADMIN_PASSWORD` to edit the site without touching code:

| Section           | What you can change                                                                 |
| ----------------- | ----------------------------------------------------------------------------------- |
| Home page         | Hero image (upload, framing, zoom, height), headline, highlights, stats, section texts |
| About page        | Hero and section images and texts; add/remove Experience cards                      |
| Services          | Add, remove and reorder services; each service's card, page texts and photo gallery |
| Works             | Add/remove projects with their details and photos                                   |
| Contact & socials | Contact person, phone, email, website, map location, social media links            |
| Website health    | Live check of every page, content issues to fix, storage, security and server status |
| Login settings    | Change the admin password, session length, sign out other devices, recent sign-ins |

Saved changes go live immediately. Every save is validated first, and the previous 30
versions are kept in `storage/history/` in case something needs rolling back by hand.

Uploaded images are auto-rotated, scaled to at most 2400px and stored as WebP. For each
image you can choose to fill the frame or show the whole picture, zoom, and click the
preview to set the point that stays in view when cropping.

### Signing in

The first password comes from `ADMIN_PASSWORD`. Once it's changed under **Login settings**, the
new one is stored as a salted hash in `storage/settings/admin-auth.json` and `ADMIN_PASSWORD`
is no longer used. If that password is forgotten, delete that file and `ADMIN_PASSWORD` works
again. After 5 wrong passwords within 15 minutes, that network address is blocked for 15 minutes.

### Environment variables

| Variable               | Required | Purpose                                                                 |
| ---------------------- | -------- | ----------------------------------------------------------------------- |
| `ADMIN_PASSWORD`       | Yes      | First password for `/admin`, until one is set in Login settings.        |
| `ADMIN_SESSION_SECRET` | No       | Signs login sessions. Defaults to a random key stored with the settings. |
| `CONTENT_DIR`          | No       | Where content, uploads and settings are saved. Defaults to `./storage`. |
| `SITE_URL`             | No       | Public address checked by Website health. Defaults to the admin's address. |

### Hosting note

Content and uploads are saved as files (`storage/site-content.json`, `storage/uploads/`),
so the site needs a host with a **persistent disk**: a VPS, a Docker volume, or a Node host
with disk storage. Point `CONTENT_DIR` at that disk and back it up.

Serverless hosts such as Vercel don't keep files between requests. To host there, swap the
two file-based implementations in `src/lib/content/storage.ts` for a database and cloud image
storage. The rest of the app only talks to those interfaces.

## Where things are

- `src/app/(site)/`: the public pages
- `src/app/admin/`: the dashboard, its login and its Server Actions
- `src/lib/content/`: content schema (validation), default content, storage
- `src/data/content.ts`: fixed settings that aren't edited in the admin (menus, form options)
- `public/images/`: the original photos used by the default content
