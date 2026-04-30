# FindIt

FindIt is a lightweight open source web app for reporting and finding lost or found items. Users can sign in, post item details with an optional image, browse the latest listings, and search recent reports.

## Features

- Email/password and Google authentication with Firebase Auth
- Lost/found item posting backed by Firestore
- Optional image uploads through Cloudinary
- Listings page with client-side search and latest-item sorting
- Protected dashboard and post-item routes
- Responsive HTML, CSS, and JavaScript interface

## Tech Stack

- HTML5, CSS3, and vanilla JavaScript ES modules
- Firebase Auth
- Firebase Firestore
- Cloudinary unsigned image uploads

## Project Structure

```text
findit/
|-- index.html
|-- LICENSE
|-- README.md
|-- TESTING.md
|-- assets/
|   |-- favicon.svg
|   |-- placeholder-item.svg
|   `-- preview.webp
|-- auth/
|   `-- auth.js
|-- css/
|   |-- auth.css
|   |-- dashboard.css
|   |-- index.css
|   |-- listings.css
|   `-- post-item.css
|-- dashboard/
|   `-- dashboard.js
|-- js/
|   |-- app-config.js
|   |-- authGuard.js
|   |-- firebase.js
|   |-- index-auth.js
|   |-- listings.js
|   `-- post-item.js
`-- pages/
    |-- auth.html
    |-- dashboard.html
    |-- listings.html
    `-- post-item.html
```

## Getting Started

### Prerequisites

- A modern browser
- A local static server
- A Firebase project with Authentication and Firestore enabled
- A Cloudinary upload preset if you want image uploads to work

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/priyanshugupta18-web/lost-and-found.git
   cd lost-and-found
   ```

2. Start a static server from the project root. For example:

   ```bash
   npx serve .
   ```

   You can also use any other static server. Opening files directly in the browser may break ES module imports on some browsers.

3. Open the served URL in your browser and visit:

   ```text
   /index.html
   /pages/listings.html
   /pages/auth.html
   ```

## Configuration

Default Firebase values live in `js/app-config.js` and `js/firebase.js`. For local or deployment-specific overrides, define `window.LOST_FOUND_CONFIG` before the app modules load:

```html
<script>
  window.LOST_FOUND_CONFIG = {
    firebase: {
      apiKey: "your-api-key",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.firebasestorage.app",
      messagingSenderId: "your-sender-id",
      appId: "your-app-id",
    },
  };
</script>
```

Firebase web config values are client-side identifiers, not private server secrets. Still, production projects should use Firebase security rules, domain restrictions, and least-privilege service configuration.

Cloudinary settings are currently configured in `js/post-item.js`:

```js
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxvkbjxnf/image/upload";
const UPLOAD_PRESET = "lost_found_upload";
```

Update those values for your own Cloudinary account before deploying a fork.

## Testing

Run the smoke checklist in `TESTING.md` before merging or deploying changes. At minimum, verify:

- Auth sign up, login, Google sign-in, and logout
- Protected dashboard and post-item route redirects
- Posting an item with and without an image
- Listing load, latest 10 item display, and search behavior
- Placeholder image fallback
- Basic security regression: listing text renders as text, not HTML

For JavaScript syntax checks, you can run:

```bash
node --check auth/auth.js
node --check dashboard/dashboard.js
node --check js/firebase.js
node --check js/authGuard.js
node --check js/app-config.js
node --check js/index-auth.js
node --check js/listings.js
node --check js/post-item.js
```

## Contributing

Contributions are welcome. To keep changes reviewable:

1. Fork the repository.
2. Create a feature branch.
3. Keep changes focused and consistent with the existing vanilla JS style.
4. Run the smoke checklist in `TESTING.md`.
5. Open a pull request with a clear summary and testing notes.

Good first contributions include UI polish, accessibility improvements, validation fixes, documentation updates, and small testable bug fixes.

## Security

Do not commit private credentials, service account keys, or production-only secrets. If you find a security issue, avoid opening a public issue with exploit details; contact the maintainer privately if contact information is available, or open a minimal issue asking for a security contact.

## License

The source code is licensed under the Apache License 2.0. See `LICENSE` for details.

Project names, logos, and branding assets are not covered by this license and may not be used to imply official endorsement.
