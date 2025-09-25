# Portfolio Website

## Setup
1. Replace placeholders:
   - open `script.js` and set `GITHUB_USERNAME = "your-username"`.
   - edit `index.html` (name, description, social links).
   - optionally add `resume.pdf` in the repo root.

2. Preview locally:
   - open `index.html` in a browser, or run a static server:
     ```bash
     npx serve .    # or: python -m http.server 8080
     ```

## Deploy to GitHub Pages
1. Create a GitHub repo (e.g., `portfolio`) and push all files.
2. On GitHub, go to **Settings > Pages** and set the source to the branch `main` (or `gh-pages`) and root `/`.
3. Wait a minute — your site will be available at `https://<your-username>.github.io/<repo-name>/`.

## Notes
- The projects section fetches public repos from GitHub's API (no auth). For private repos or higher rate limits, add a server-side token or generate a GitHub token and fetch server-side.
- This is intentionally minimal and easy to customize; feel free to add animations, images, or a blog section.
