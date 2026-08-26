# Trailhead — Landing Page

A static marketing landing page for **Trailhead**, a fictional trip planner for
backcountry hikers. It is a small promotional site: a sticky header with
navigation, a hero (headline, subtext, and call-to-action buttons), a features
grid, an "About" section, a pricing call-to-action, and a footer.

## Use case

This is the kind of page a small product team publishes to pitch what they make.
Most of the page is fixed chrome, but the **"About Trailhead" section** holds the
narrative copy the owner revisits most often. That one section is meant to be
edited in place — right on the page — so the owner can refine the wording without
editing HTML or redeploying the site.

In the markup it is the clearly delimited block
`#editable-about` (class `editable-region`) inside the `#about` section.

## What's on the page

- A sticky header with the product name and navigation links.
- A **hero** with an eyebrow label, headline, subtext, and call-to-action
  buttons.
- A **features** grid of three short blurbs.
- An **About** section containing the single editable content region (a heading
  and two paragraphs).
- A **pricing** call-to-action.
- A footer with a tagline and a legal line.

No rich text editor is integrated yet — integrating one is the evaluation task.

## Tech

Plain vanilla **HTML, CSS, and JavaScript**. No framework and no bundler:
`index.html` links `styles.css` and a small `script.js` of plain DOM code (footer
year, smooth-scroll fallback). A tiny static file server serves the folder during
development.

## Running

Requires Node.js.

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal (default
http://localhost:8080).
