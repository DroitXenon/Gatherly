# Gatherly

Gatherly is a student events prototype for discovering and hosting poker nights, board games, study sessions, and other small gatherings. Hosts set a location and capacity, and guests request approval to join.

**[Live demo](https://gatherly-student-events.vercel.app)** · **[User and development guide](instructions.md)**

## Features

- Event discovery with search, category filters, and sorting.
- Demo profiles, event creation, and a personal events view.
- Join requests with host approval, withdrawal, and capacity tracking.
- English and Simplified Chinese, with browser-language detection and saved preferences.
- Light, Dark, and System appearance modes.
- Responsive design with keyboard-accessible controls.

## Project status

This is a browser-local interactive prototype. Profiles are switchable demo identities, not authenticated accounts. Events and requests are stored in the current browser; they are not shared between users or devices. Sample events are fictional.

A shared database, server-side authentication, and server-enforced permissions are required before using Gatherly as a real multi-user service.

## Technology

Plain HTML, CSS, and JavaScript, with a small Node.js development server and Node's built-in test runner. No third-party runtime packages or build step are required. The static site is deployed on Vercel.

## Quick start

With a recent Node.js installation and npm available, run these commands from the project folder:

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000). Stop the development server with `Ctrl+C`.

```sh
npm run check
npm test
```

The checks validate JavaScript syntax and test language and appearance preferences. See [instructions.md](instructions.md) for the complete demo walkthrough, editing examples, manual checks, and deployment process.

## Repository layout

```text
public/                 Static website files deployed to Vercel
  index.html            Page structure
  style.css             Responsive styles and theme colours
  app.js                Events, profiles, requests, and rendering
  translations.js       Chinese translations
  i18n.js               Language detection and localization
  appearance.js         Light, Dark, and System preferences
tests/                  Language and appearance tests
server.mjs              Local development server
package.json            Development and validation commands
deployment.json         Record of the latest recorded deployment
instructions.md         Detailed user and developer guide
```

## Deployment

The Vercel project is named **gatherly**. Its current public address still uses **gatherly-student-events.vercel.app**. Deployable files are in `public/`; local changes do not automatically update production.

## License

No license has been specified in this repository.
