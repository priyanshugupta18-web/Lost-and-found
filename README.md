# Lost & Found Web App

A lightweight web app where users can sign in, report lost/found items, and search listings.

## Features

- Email/password and Google sign-in with Firebase Auth
- Post lost/found items to Firestore
- Search listings via Algolia
- Protected dashboard and posting routes
- Responsive UI across key pages

## Tech Stack

- HTML, CSS, JavaScript (ES modules)
- Firebase Auth + Firestore
- Algolia Search

## Current Structure

```text
lost-and-found/
├── index.html
├── auth/
│   └── auth.js
├── dashboard/
│   └── dashboard.js
├── pages/
│   ├── auth.html
│   ├── dashboard.html
│   ├── listings.html
│   └── post-item.html
├── js/
│   ├── app-config.js
│   ├── authGuard.js
│   ├── firebase.js
│   ├── index-auth.js
│   ├── listings.js
│   └── post-item.js
├── css/
│   ├── auth.css
│   ├── dashboard.css
│   ├── index.css
│   ├── listings.css
│   └── post-item.css
└── assets/
    ├── favicon.svg
    └── placeholder-item.svg
```

## Setup

1. Clone the repo.
2. Open the folder in a static server (recommended) or browser.
3. Verify Firebase and Algolia values in `js/app-config.js`.
4. Optional for local/private overrides: define `window.LOST_FOUND_CONFIG` before app modules load.

Example override shape:

```js
window.LOST_FOUND_CONFIG = {
  firebase: {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...",
  },
  algolia: {
    appId: "...",
    searchKey: "...",
    index: "items",
  },
};
```

## Testing

Use the smoke checklist in `TESTING.md` before merging or deploying.
