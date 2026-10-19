# Gatherly — first draft

A responsive student events prototype, built as a dependency-free static site for Vercel.

Run `npm run dev` and open http://localhost:3000. Run `npm run check` for JavaScript syntax validation. Deploy the contents of `public/` with Vercel's static framework preset.

## Try the full demo

1. Choose **Join the community** and create a demo profile or choose Jamie.
2. Host an event with a future date, location, category, description and capacity.
3. Open your profile and switch to Sophie. Find the event and request to join.
4. Switch back to the host, open **My events**, and approve or decline the request.
5. Switch back to the guest to see the result. Approved guests consume capacity; pending requests do not. Guests can withdraw and free their place.

Search, category filters, sorting, empty states and full-event states are included. Six illustrative events are seeded with dates relative to the first visit. Hosts count toward capacity.

## First-draft boundary

This is an interactive prototype, **not a production multi-user service**. Profiles are explicitly labelled demo identities and are intentionally switchable without authentication. All changes are stored in localStorage in the current browser. No passwords or emails are collected. No server-side database or actual account authentication is configured. Do not enter sensitive information. Sample events and initial attendance counts are fictional.

Before inviting real students, connect a managed authentication provider and shared database, move event/request writes and ownership checks to server endpoints, and enforce capacity atomically. Add university verification, moderation, and appropriate event-location privacy controls. The prototype currently makes locations visible to all visitors.

The only remote asset dependency is Google Fonts; system fonts are used if it is unavailable. All illustrations are CSS/text artwork.

## Language

The header language selector switches between English and Simplified Chinese. On first visit, the browser's primary preferred language (`navigator.languages[0]`, falling back to `navigator.language`) selects Chinese for any `zh` locale, and English otherwise. A manual selection is stored separately under `gatherly-language` and overrides detection on later visits. If storage is blocked, the switch still works for the current visit. The browser is the available proxy for the client's system language.

Interface copy, sample-event copy, accessible labels, page metadata, and dates are localized. User-written names, locations, descriptions, and messages are preserved. Internal category/status keys remain language-independent, so existing demo data continues to work.

## Appearance

The interface uses system typography, translucent navigation, rounded surfaces, and theme-aware illustrations. The header's appearance selector offers **System**, **Light**, and **Dark** (also translated into Chinese). System is the default and follows `prefers-color-scheme` changes live. An explicit choice is saved under `gatherly-appearance`; choosing System restores automatic behavior. The theme is applied before the stylesheet loads to avoid a light flash, and updates native control colors and the browser theme color. Storage failures do not prevent switching during the current visit.

Run `npm test` to check language detection, preference persistence, and appearance behavior.
