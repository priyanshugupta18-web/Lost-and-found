# Smoke Test Checklist

Run this checklist after changes to auth, listings, dashboard, or posting flows.

## 1) Home + Auth Nav

- Open `index.html`.
- Confirm logged-out view shows `Login` and `Sign Up`.
- Sign in, return to home, confirm `Dashboard` and `Logout` are visible.
- Click `Logout` and confirm UI returns to logged-out state.

## 2) Auth Page

- Open `pages/auth.html`.
- Test email/password sign up with a new account.
- Test login with an existing account.
- Test Google sign-in.
- Verify successful auth redirects to `pages/dashboard.html`.

## 3) Route Guarding

- In a logged-out state, open `pages/dashboard.html` directly.
- Confirm redirect to `pages/auth.html`.
- In a logged-in state, open `pages/dashboard.html` and verify access.

## 4) Dashboard

- Verify welcome name/avatar renders.
- Verify stats load (or gracefully show fallback dashes on failure).
- Verify quick actions navigate to `pages/listings.html` and `pages/post-item.html`.

## 5) Post Item

- Open `pages/post-item.html` while logged in.
- Submit with valid text fields and no image (should succeed).
- Submit with a valid image (should upload and succeed).
- Submit invalid phone number and confirm inline validation message.

## 6) Listings + Search

- Open `pages/listings.html`.
- Search with a valid keyword and verify cards render.
- Search random keyword and verify "No items found" message.
- Verify cards with missing image show placeholder image.
- Click item image with URL and confirm it opens in a new tab.

## 7) Basic Security Regression

- Ensure listing fields render as plain text (no HTML execution from item data).
- Ensure no page loads missing files or 404 assets in browser console network tab.
