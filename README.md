# PriviHub Web Preview

Static marketing/preview website for **PriviHub** — a multi-vendor salon, barber and spa booking marketplace launching first in Bloemfontein, South Africa.

This is a plain HTML/CSS/JS site with no build step. It is not connected to the vendor app or customer app, but its waitlist forms do post directly to PriviHub-api — it exists to explain the product and collect waitlist signups ahead of launch.

## Pages

- `index.html` — home page
- `how-it-works.html` — client-facing booking flow explainer
- `for-stylists.html` — vendor/stylist pitch and waitlist
- `reviews.html` — honest "no reviews yet" pre-launch page
- `privacy.html`, `terms.html`, `vendor-terms.html`, `booking-policy.html`, `delete-account.html`, `legal.html` — legal pages (Privacy Policy, Customer Terms, Vendor Terms, Booking Policy, account deletion, and company details / cookie notice / website terms). **Drafts:** each has `<meta name="robots" content="noindex, nofollow">` and a yellow draft banner, and contains yellow `mark.ph` placeholders. Before launch, fill every placeholder, get attorney sign-off, then remove the noindex meta and the `.draft-banner` div on each page and add the pages to `sitemap.xml`. Source text lives in the CoWork `Legal` folder (Word files).

## Structure

```
├── index.html
├── how-it-works.html
├── for-stylists.html
├── reviews.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

## Local preview

No build tools required. From this folder, run either:

```
npx http-server .
```

or open `index.html` directly in a browser. The waitlist forms need the site served over http(s) (not `file://`) to reach the API.

## Waitlist forms

Every page's "Join the waitlist" form posts JSON straight to PriviHub-api (see `initApiWaitlistForm` in `js/main.js`):

- The stylist form on `for-stylists.html` collects name, mobile number, and suburb and posts to `POST /waitlist` with `source: "website"`.
- The customer-facing forms on `index.html`, `how-it-works.html`, and `reviews.html` collect just an email address and post to `POST /customer-waitlist`.

`API_BASE_URL` in `js/main.js` is a placeholder (`https://api.privihub.app`) until a real backend URL is deployed — point it at your running PriviHub-api instance (`http://localhost:3000` for local dev) to test the forms end to end.

## Deployment

Static site — deploy as-is to any static host (Netlify, Vercel, GitHub Pages, S3 + CloudFront, etc.). No environment variables or server-side config needed beyond setting `API_BASE_URL`. `sitemap.xml` and `robots.txt` assume the site is served from `https://privihub.app/` — update them if the final domain differs.
