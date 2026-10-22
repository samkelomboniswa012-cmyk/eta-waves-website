# ETA Waves website prototype

This is a responsive, no-framework website prototype for the ETA Waves student football recruitment pathway.

## Included
- Landing page with ETA Waves branding and pathway information
- Registration form with basic validation
- Demo Wave IDs (`WAV-0001`, `WAV-0002`, etc.)
- Basic duplicate warning within the same browser
- Local demo records table
- CSV export for demo data
- Mobile-friendly layout

## Important: this is a prototype, not a live registration service
The current version stores form submissions in the browser's `localStorage`. That means:
- records are only saved in that browser on that device;
- other devices and staff cannot see the records;
- browser data can be cleared;
- Wave IDs are only demo IDs and are not guaranteed globally unique;
- the demo record table is not a secure admin portal.

**Do not collect real student information with this prototype.** Before public launch, connect a real backend/database with server-side ID allocation, authentication for staff, database access rules, backups, privacy notice, retention process and safeguarding/consent procedures. If eligible players can be under 18, set up appropriate safeguarding and consent procedures before launch.

## Run it locally
1. Unzip the folder.
2. Open `index.html` in a modern browser.
3. Use test data only.

## Publish it on a free static host
You can deploy these files to a free static hosting service such as GitHub Pages or Cloudflare Pages. Hosting makes the website visible online, but **does not** turn the local browser storage into a shared database. The form remains a demo until a backend is connected.

### GitHub Pages (high-level steps)
1. Create or sign in to a GitHub account.
2. Create a new public repository, for example `eta-waves-website`.
3. Upload `index.html`, `styles.css`, `app.js`, and this README to the repository's root.
4. In repository Settings, open Pages.
5. Choose deployment from the `main` branch and root folder, then save.
6. Wait for GitHub Pages to provide the published URL.

Check GitHub's current Pages documentation and terms before publishing. Do not put real player data, passwords, secret keys, or private records in the repository.

## Production architecture recommended for the next phase
- Static website frontend
- Hosted database with row-level access rules
- Server-side Wave ID generation with a unique constraint
- Staff sign-in and role-based access
- Server-side duplicate review workflow (flag uncertain matches; do not auto-merge)
- Backups and tested restore process
- Approved privacy and safeguarding process
