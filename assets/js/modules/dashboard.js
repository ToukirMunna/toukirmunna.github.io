/**
 * Dashboard & Catalog Renderer Module - Toukir Ahmed Portfolio Admin
 *
 * Renders the stats strip and the app listing table.
 * Supports: Featured badge, Hidden badge, drag-to-reorder rows.
 */

// DOM References
const appsTableBody = document.getElementById("apps-table-body");
const emptyState = document.getElementById("empty-state");
const statsTotalApps = document.getElementById("stat-total-apps");
const statsCategories = document.getElementById("stat-categories");
const statsLastSaved = document.getElementById("stat-last-saved");
const statsLastExported = document.getElementById("stat-last-exported");

// Drag state
let dragSrcIndex = null;

function renderDashboard(appsList, actions) {
  if (!appsTableBody) return;

  // 1. Update stats metrics
  if (statsTotalApps) statsTotalApps.textContent = appsList.length;

  if (statsCategories) {
    const categories = new Set(appsList.filter(a => !a.hidden).map(app => app.category));
    statsCategories.textContent = categories.size;
  }

  if (statsLastSaved) {
    const isModified = localStorage.getItem("appsData") !== null;
    statsLastSaved.textContent = isModified ? "Local Override Active" : "Default Config Loaded";
    statsLastSaved.style.color = isModified ? "var(--accent-primary)" : "var(--text-muted)";
  }

  if (statsLastExported) {
    statsLastExported.textContent = formatRelativeTime(getLastExportTime());
    statsLastExported.style.color = getLastExportTime() ? "var(--accent-primary)" : "var(--text-muted)";
  }

  // 2. Empty state
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
    tr.dataset.index = index;
    tr.draggable = true;
    tr.className = app.hidden ? "row-hidden" : "";

    // Build status badges
    const featuredBadge = app.featured
      ? `<span class="admin-badge badge-featured" title="Shown on homepage">★ Featured</span>`
      : "";
    const hiddenBadge = app.hidden
      ? `<span class="admin-badge badge-hidden" title="Hidden from public">● Hidden</span>`
      : "";

    tr.innerHTML = `
      <td>
        <div class="table-app-meta">
          <span class="drag-handle" title="Drag to reorder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
              <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
              <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
            </svg>
          </span>
          <img src="${app.icon}" alt="${escapeHtml(app.name)} Icon" class="table-app-icon" onerror="this.src='assets/images/light_logo.png'">
          <div>
            <div class="table-app-name">${escapeHtml(app.name)} ${featuredBadge} ${hiddenBadge}</div>
            <div class="table-app-tagline">${escapeHtml(app.tagline)}</div>
          </div>
        </div>
      </td>
      <td><span class="category-pill">${escapeHtml(app.category)}</span></td>
      <td>v${escapeHtml(app.version)}</td>
      <td>${escapeHtml(app.lastUpdated)}</td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon btn-edit" title="Edit App" data-id="${app.id}">
            <svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="btn-icon btn-toggle-hidden" title="${app.hidden ? 'Show App' : 'Hide App'}" data-id="${app.id}">
            ${app.hidden
              ? `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
              : `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
            }
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

    // Button events
    tr.querySelector(".btn-edit").onclick = () => actions.onEdit(app.id);
    tr.querySelector(".btn-clone").onclick = () => actions.onClone(app.id);
    tr.querySelector(".btn-delete").onclick = () => actions.onDelete(app.id);
    tr.querySelector(".btn-toggle-hidden").onclick = () => actions.onToggleHidden(app.id);

    // Drag-and-drop events
    tr.addEventListener("dragstart", (e) => {
      dragSrcIndex = index;
      tr.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });

    tr.addEventListener("dragend", () => {
      tr.classList.remove("dragging");
      appsTableBody.querySelectorAll("tr").forEach(r => r.classList.remove("drag-over"));
    });

    tr.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      appsTableBody.querySelectorAll("tr").forEach(r => r.classList.remove("drag-over"));
      tr.classList.add("drag-over");
    });

    tr.addEventListener("drop", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(tr.dataset.index);
      if (dragSrcIndex !== null && dragSrcIndex !== targetIndex) {
        actions.onReorder(dragSrcIndex, targetIndex);
      }
      dragSrcIndex = null;
    });

    appsTableBody.appendChild(tr);
  });
}
