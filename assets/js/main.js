/**
 * Toukir Studio — Main Application Orchestrator
 * Wires together theme, navigation, and catalog modules.
 */

import { setupThemeToggle } from "./core/theme.js";
import { setupNavigation } from "./core/navigation.js";
import { renderCards } from "./catalog/card-renderer.js";
import { setupCatalog } from "./catalog/filters.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Theme Toggling & Brand Asset Sync
  setupThemeToggle();

  // 2. Initialize Navigation Sticky Behavior & Mobile Drawer
  setupNavigation();

  // 3. Populate Apps Grid
  const appsGrid = document.querySelector(".apps-grid");
  if (appsGrid && window.appsData) {
    const mode = appsGrid.dataset.mode || "all";
    const allApps = window.appsData.filter(app => !app.hidden);

    if (mode === "featured") {
      // Homepage: show only featured, non-hidden apps
      const featuredApps = allApps.filter(app => app.featured);
      renderCards(featuredApps, appsGrid);
    } else {
      // Projects / Catalog page: live search and category filters
      setupCatalog(allApps, appsGrid);
    }
  }
});
