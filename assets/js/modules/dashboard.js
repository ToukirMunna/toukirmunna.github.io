/**
 * Dashboard & Catalog Renderer Module - Blue Pixel Admin
 */

// DOM References
const appsTableBody = document.getElementById("apps-table-body");
const emptyState = document.getElementById("empty-state");
const statsTotalApps = document.getElementById("stat-total-apps");
const statsCategories = document.getElementById("stat-categories");
const statsLastSaved = document.getElementById("stat-last-saved");

function renderDashboard(appsList, actions) {
  if (!appsTableBody) return;

  // 1. Update stats metrics
  if (statsTotalApps) statsTotalApps.textContent = appsList.length;
  
  if (statsCategories) {
    const categories = new Set(appsList.map(app => app.category));
    statsCategories.textContent = categories.size;
  }

  if (statsLastSaved) {
    const isModified = localStorage.getItem("appsData") !== null;
    statsLastSaved.textContent = isModified ? "Local Override Active" : "Default Config Loaded";
    statsLastSaved.style.color = isModified ? "var(--accent-primary)" : "var(--text-muted)";
  }

  // 2. Update empty state
  if (appsList.length === 0) {
    appsTableBody.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  // 3. Render table rows
  appsTableBody.innerHTML = "";
  appsList.forEach((app, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="table-app-meta">
          <img src="${app.icon}" alt="${app.name} Icon" class="table-app-icon" onerror="this.src='assets/images/logo.png'">
          <div>
            <div class="table-app-name">${app.name}</div>
            <div class="table-app-tagline">${app.tagline}</div>
          </div>
        </div>
      </td>
      <td><span class="category-pill">${app.category}</span></td>
      <td>v${app.version}</td>
      <td>${app.lastUpdated}</td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon btn-move-up" title="Move Up" ${index === 0 ? 'disabled style="opacity: 0.35; cursor: not-allowed;"' : ''}>
            <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </button>
          <button class="btn-icon btn-move-down" title="Move Down" ${index === appsList.length - 1 ? 'disabled style="opacity: 0.35; cursor: not-allowed;"' : ''}>
            <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button class="btn-icon btn-edit" title="Edit App" data-id="${app.id}">
            <svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="btn-icon btn-clone" title="Clone App" data-id="${app.id}">
            <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button class="btn-icon btn-delete" title="Delete App" data-id="${app.id}">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </td>
    `;

    // Event Listeners
    tr.querySelector(".btn-edit").onclick = () => actions.onEdit(app.id);
    tr.querySelector(".btn-clone").onclick = () => actions.onClone(app.id);
    tr.querySelector(".btn-delete").onclick = () => actions.onDelete(app.id);

    if (index > 0) {
      tr.querySelector(".btn-move-up").onclick = () => actions.onMoveUp(index);
    }
    if (index < appsList.length - 1) {
      tr.querySelector(".btn-move-down").onclick = () => actions.onMoveDown(index);
    }

    appsTableBody.appendChild(tr);
  });
}
