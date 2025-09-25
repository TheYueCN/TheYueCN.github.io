// script.js
const GITHUB_USERNAME = "starlight-syss"; 
const PROJECTS_COUNT = 6; 

// THEME TOGGLE
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("theme");

  // Apply saved theme
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
    btn.textContent = "☀️";
    btn.setAttribute("aria-pressed", "true");
  }

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");

    if (isDark) {
      btn.textContent = "☀️";
      btn.setAttribute("aria-pressed", "true");
      localStorage.setItem("theme", "dark");
    } else {
      btn.textContent = "🌙";
      btn.setAttribute("aria-pressed", "false");
      localStorage.setItem("theme", "light");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  initTheme(); 
  loadProjects();
  setupFallbackProjects();
});


// PROJECTS - fetch public repos
async function loadProjects() {
  const grid = document.getElementById("projects-grid");
  const fallback = document.getElementById("projects-fallback");

  
  if (!GITHUB_USERNAME || GITHUB_USERNAME.includes("YOUR_GITHUB_USERNAME")) {
    grid.innerHTML = `<div class="card"><h3>Set your GitHub username</h3><p class="muted">Open <code>script.js</code> and replace <code>YOUR_GITHUB_USERNAME</code> with your username.</p></div>`;
    return;
  }

  const url = `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" }});
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const repos = await res.json();

    // filter and sort by stargazers_count then updated
    const publicRepos = repos
      .filter(r => !r.fork && !r.private)
      .sort((a,b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at)))
      .slice(0, PROJECTS_COUNT);

    if (publicRepos.length === 0) {
      grid.innerHTML = `<div class="card"><h3>No public repos</h3><p class="muted">You currently have no public repositories to show.</p></div>`;
      return;
    }

    grid.innerHTML = publicRepos.map(repoCardHtml).join("");
    fallback.remove?.(); // remove fallback container if present
  } catch (err) {
    console.warn("Failed to fetch GitHub repos:", err);
    grid.innerHTML = `<div class="card"><h3>Unable to load projects</h3><p class="muted">There was a problem fetching GitHub repos. Showing fallback projects below.</p></div>`;
  }
}

function repoCardHtml(r) {
  const desc = escapeHtml(r.description || "No description");
  const language = r.language ? `<span class="meta-item">● ${r.language}</span>` : "";
  const stars = `<span class="meta-item">★ ${r.stargazers_count}</span>`;
  const updated = new Date(r.updated_at).toLocaleDateString();
  return `
  <article class="card">
    <h3><a href="${r.html_url}" target="_blank" rel="noopener">${escapeHtml(r.name)}</a></h3>
    <p>${desc}</p>
    <div class="meta">${language} ${stars} <span class="meta-item">Updated ${updated}</span></div>
  </article>`;
}

function escapeHtml(s){
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

// CONTACT FORM HANDLING (Formspree)
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    status.textContent = "Sending...";

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        status.textContent = "✅ Thanks! Your message has been sent.";
        form.reset();
      } else {
        status.textContent = "⚠️ Oops, something went wrong. Try again.";
      }
    } catch (err) {
      status.textContent = "⚠️ Network error. Please try again.";
    }
  });
}


// Fallback static projects shown in case of fetch failure or before username is set
function setupFallbackProjects(){
  const fallback = document.getElementById("projects-fallback");
  const fallbackItems = [
    {
      name: "Project Alpha",
      url: "#",
      desc: "A demo app showing core features and responsive layout.",
      meta: "React · Vite"
    },
    {
      name: "CLI Tool",
      url: "#",
      desc: "Small Node.js CLI for developer productivity.",
      meta: "Node.js · npm"
    },
    {
      name: "Design System",
      url: "#",
      desc: "Reusable components, tokens, accessibility-first.",
      meta: "CSS · Tokens"
    }
  ];
  fallback.innerHTML = fallbackItems.map(p => `
    <article class="card">
      <h3><a href="${p.url}" target="_blank" rel="noopener">${p.name}</a></h3>
      <p class="muted">${p.desc}</p>
      <div class="meta"><span class="meta-item">${p.meta}</span></div>
    </article>
  `).join("");
}
