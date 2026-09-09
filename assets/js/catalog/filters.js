/**
 * Toukir Studio — Catalog Filtering & Search
 * Manages category filter tabs, live query debouncing, and counts.
 */

import { escapeHtml, debounce } from "../core/utils.js";
import { renderCards } from "./card-renderer.js";

const categoryIcons = {
  "all": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chip-svg"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  "productivity": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chip-svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  "lifestyle": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chip-svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  "media": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chip-svg"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>',
  "security": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chip-svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  "games": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chip-svg"><rect x="2" y="6" width="20" height="12" rx="6"></rect><path d="M6 12h4m-2-2v4m10-2h.01m2-2h.01"></path></svg>',
  "education": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chip-svg"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
};

const defaultIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chip-svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

export function setupCatalog(allApps, appsGrid) {
  if (!appsGrid || !allApps) return;

  const searchInput = document.getElementById("projects-search-input");
  const searchClearBtn = document.getElementById("projects-search-clear");
  const filterChipsContainer = document.getElementById("category-filter-chips");
  const sidebarResetBtn = document.getElementById("sidebar-reset-filters");
  const countBadge = document.querySelector(".projects-count-badge");

  let currentCategory = "all";
  let currentQuery = "";

  // Category counts
  const categoryCounts = {};
  allApps.forEach(app => {
    const cat = app.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const preferredOrder = ["Productivity", "Lifestyle", "Media", "Security", "Games", "Education"];
  const discovered = Object.keys(categoryCounts);
  const sortedCategories = [
    ...preferredOrder.filter(c => discovered.includes(c)),
    ...discovered.filter(c => !preferredOrder.includes(c))
  ];

  // Render chips
  if (filterChipsContainer) {
    filterChipsContainer.innerHTML = "";

    const allChip = document.createElement("button");
    allChip.type = "button";
    allChip.className = "filter-chip active";
    allChip.dataset.category = "all";
    allChip.innerHTML = `
      <span class="chip-label-group">
        ${categoryIcons["all"]}
        <span>All Projects</span>
      </span>
      <span class="chip-count">${allApps.length}</span>
    `;
    allChip.addEventListener("click", () => selectCategory("all"));
    filterChipsContainer.appendChild(allChip);

    sortedCategories.forEach(cat => {
      const catKey = cat.toLowerCase();
      const icon = categoryIcons[catKey] || defaultIcon;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip";
      chip.dataset.category = catKey;
      chip.innerHTML = `
        <span class="chip-label-group">
          ${icon}
          <span>${escapeHtml(cat)}</span>
        </span>
        <span class="chip-count">${categoryCounts[cat]}</span>
      `;
      chip.addEventListener("click", () => selectCategory(catKey));
      filterChipsContainer.appendChild(chip);
    });
  }

  function selectCategory(cat) {
    currentCategory = cat;
    if (filterChipsContainer) {
      filterChipsContainer.querySelectorAll(".filter-chip").forEach(chip => {
        chip.classList.toggle("active", chip.dataset.category === cat);
      });
    }
    filterAndDisplay();
  }

  function filterAndDisplay() {
    const query = currentQuery.trim().toLowerCase();

    const filtered = allApps.filter(app => {
      const matchesCategory = (currentCategory === "all") ||
        (app.category && app.category.toLowerCase() === currentCategory);

      if (!matchesCategory) return false;
      if (!query) return true;

      const matchName = app.name && app.name.toLowerCase().includes(query);
      const matchTagline = app.tagline && app.tagline.toLowerCase().includes(query);
      const matchDesc = app.shortDescription && app.shortDescription.toLowerCase().includes(query);
      const matchCat = app.category && app.category.toLowerCase().includes(query);
      const matchFeatures = app.features && app.features.some(f => f.toLowerCase().includes(query));

      return matchName || matchTagline || matchDesc || matchCat || matchFeatures;
    });

    if (countBadge) {
      if (filtered.length === allApps.length) {
        countBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
          Studio Catalog (${allApps.length})
        `;
      } else {
        countBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
          Showing ${filtered.length} of ${allApps.length} Apps
        `;
      }
    }

    if (sidebarResetBtn) {
      const isFiltered = (currentCategory !== "all") || (query.length > 0);
      sidebarResetBtn.style.display = isFiltered ? "inline-block" : "none";
    }

    renderCards(filtered, appsGrid);
  }

  // Live search input
  if (searchInput) {
    searchInput.addEventListener("input", debounce(e => {
      currentQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle("visible", currentQuery.length > 0);
      }
      filterAndDisplay();
    }, 150));
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      currentQuery = "";
      searchClearBtn.classList.remove("visible");
      filterAndDisplay();
    });
  }

  if (sidebarResetBtn) {
    sidebarResetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      currentQuery = "";
      if (searchClearBtn) searchClearBtn.classList.remove("visible");
      selectCategory("all");
    });
  }

  // Initial render
  filterAndDisplay();
}

if (typeof window !== "undefined") {
  window.setupCatalog = setupCatalog;
}
