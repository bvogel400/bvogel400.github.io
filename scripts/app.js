function setFooterYear() {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();
}

function setActiveNavLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    if ((link.getAttribute('href') || '').endsWith(current)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

async function renderProjectSpotlight() {
  const target = document.querySelector('[data-project-spotlight]');
  if (!target) return;

  try {
    const path = location.pathname.includes('/channels/')
      ? '../scripts/projects.json'
      : './scripts/projects.json';
    const response = await fetch(path);
    if (!response.ok) throw new Error('Unable to load project data.');

    const projects = await response.json();
    target.innerHTML = projects
      .slice(0, 3)
      .map((project) => `
        <li class="project-item">
          <h3>${project.name}</h3>
          <p>${project.summary}</p>
          <div class="tag-row">${project.tech.map((tech) => `<span class="tag">${tech}</span>`).join('')}</div>
        </li>
      `)
      .join('');
  } catch (_error) {
    target.innerHTML = '<li class="project-item">Project data is unavailable right now.</li>';
  }
}

setFooterYear();
setActiveNavLink();
renderProjectSpotlight();
