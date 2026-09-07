// Immediate theme initialization to prevent theme flashes
const savedTheme = localStorage.getItem("theme") || 
                   (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.removeAttribute("data-theme");
}

// Featured and hidden flags are now stored on each app object (featured: true, hidden: true).
// The admin panel controls these — no hardcoded IDs needed here.

function updateBrandAssets(theme) {
  const favicon = document.getElementById("favicon");
  const navLogo = document.getElementById("nav-logo");
  
  if (theme === "dark") {
    if (favicon) favicon.href = "assets/images/dark_favicon.png";
    if (navLogo) navLogo.src = "assets/images/light_logod.png";
  } else {
    if (favicon) favicon.href = "assets/images/light_favicon.png";
    if (navLogo) navLogo.src = "assets/images/light_logo.png";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Update brand logo and favicon based on initialized theme
  const initialTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  updateBrandAssets(initialTheme);

  // Theme Toggle click handler
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        updateBrandAssets("light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        updateBrandAssets("dark");
      }
    });
  }

  // 1. Navigation Sticky Behavior
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      
      // Toggle body scroll lock
      if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // 4. Populate App Grid & Projects Toolbar (Instant Search & Category Filtering)
  const appsGrid = document.querySelector(".apps-grid");
  if (appsGrid && window.appsData) {
    const mode = appsGrid.dataset.mode || "all"; // data-mode="featured" or "all"
    const allApps = window.appsData.filter(app => !app.hidden);

    if (mode === "featured") {
      // Homepage: show only featured, non-hidden apps
      const featuredApps = allApps.filter(app => app.featured);
      renderCards(featuredApps, appsGrid);
    } else {
      // Projects page: interactive search & dynamic category filter
      const searchInput = document.getElementById("projects-search-input");
      const searchClearBtn = document.getElementById("projects-search-clear");
      const filterChipsContainer = document.getElementById("category-filter-chips");
      const countBadge = document.querySelector(".projects-count-badge");

      let currentCategory = "all";
      let currentQuery = "";

      // Canonical and dynamic category discovery
      const categoryCounts = {};
      allApps.forEach(app => {
        const cat = app.category || "General";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      // Preferred order for tabs
      const preferredCategories = ["Productivity", "Lifestyle", "Media", "Security", "Games", "Education"];
      const discoveredCategories = Object.keys(categoryCounts);
      const sortedCategories = [
        ...preferredCategories.filter(c => discoveredCategories.includes(c)),
        ...discoveredCategories.filter(c => !preferredCategories.includes(c))
      ];

      // Build category filter chips
      if (filterChipsContainer) {
        filterChipsContainer.innerHTML = "";

        // "All" chip
        const allChip = document.createElement("button");
        allChip.type = "button";
        allChip.className = "filter-chip active";
        allChip.dataset.category = "all";
        allChip.innerHTML = `All <span class="chip-count">${allApps.length}</span>`;
        allChip.addEventListener("click", () => selectCategory("all"));
        filterChipsContainer.appendChild(allChip);

        // Specific category chips
        sortedCategories.forEach(cat => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "filter-chip";
          chip.dataset.category = cat.toLowerCase();
          chip.innerHTML = `${cat} <span class="chip-count">${categoryCounts[cat]}</span>`;
          chip.addEventListener("click", () => selectCategory(cat.toLowerCase()));
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
          // Category match
          const matchesCategory = (currentCategory === "all") ||
            (app.category && app.category.toLowerCase() === currentCategory);

          if (!matchesCategory) return false;

          // Query match across name, tagline, description, features, and category
          if (!query) return true;

          const matchName = app.name && app.name.toLowerCase().includes(query);
          const matchTagline = app.tagline && app.tagline.toLowerCase().includes(query);
          const matchDesc = app.shortDescription && app.shortDescription.toLowerCase().includes(query);
          const matchCat = app.category && app.category.toLowerCase().includes(query);
          const matchFeatures = app.features && app.features.some(f => f.toLowerCase().includes(query));

          return matchName || matchTagline || matchDesc || matchCat || matchFeatures;
        });

        // Update count badge if present
        if (countBadge) {
          if (filtered.length === allApps.length) {
            countBadge.innerHTML = `
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
              All Projects (${allApps.length})
            `;
          } else {
            countBadge.innerHTML = `
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
              Showing ${filtered.length} of ${allApps.length} Projects
            `;
          }
        }

        renderCards(filtered, appsGrid, true);
      }

      // Live search input listeners
      if (searchInput) {
        searchInput.placeholder = `Search ${allApps.length} apps by name, category, or keywords...`;
        searchInput.addEventListener("input", (e) => {
          currentQuery = e.target.value;
          if (searchClearBtn) {
            searchClearBtn.classList.toggle("visible", currentQuery.length > 0);
          }
          filterAndDisplay();
        });
      }

      if (searchClearBtn) {
        searchClearBtn.addEventListener("click", () => {
          if (searchInput) {
            searchInput.value = "";
            searchInput.focus();
          }
          currentQuery = "";
          searchClearBtn.classList.remove("visible");
          filterAndDisplay();
        });
      }

      // Initial render of all apps
      filterAndDisplay();
    }
  }

  // Helper to render cards or empty state
  function renderCards(apps, container, isFilterable = false) {
    container.innerHTML = "";

    if (apps.length === 0) {
      const emptyCard = document.createElement("div");
      emptyCard.className = "empty-results-card reveal active";
      emptyCard.innerHTML = `
        <svg class="empty-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3>No matching applications found</h3>
        <p>Try searching for different keywords or select a different category filter above.</p>
        <button type="button" class="btn btn-secondary btn-reset-filters" style="margin:0 auto;display:inline-flex;">
          Clear Filters
        </button>
      `;

      const resetBtn = emptyCard.querySelector(".btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          const searchInput = document.getElementById("projects-search-input");
          const searchClearBtn = document.getElementById("projects-search-clear");
          if (searchInput) searchInput.value = "";
          if (searchClearBtn) searchClearBtn.classList.remove("visible");
          
          const allChip = document.querySelector(".filter-chip[data-category='all']");
          if (allChip) allChip.click();
        });
      }

      container.appendChild(emptyCard);
      return;
    }

    apps.forEach((app, index) => {
      const card = document.createElement("div");
      card.className = "glass-card app-card reveal";
      
      // Delay animation sequence slightly for staggered effect
      card.style.transitionDelay = `${Math.min(index * 0.05, 0.4)}s`;
      
      card.innerHTML = `
        <div class="app-card-header">
          <img src="${app.icon}" alt="${app.name} Icon" class="app-card-icon" onerror="this.src='assets/images/light_logo.png'">
          <div>
            <h3 class="app-card-title">${app.name}</h3>
            <div><span class="category-pill">${app.category}</span></div>
          </div>
        </div>
        <p class="app-card-desc">${app.shortDescription}</p>
        <div class="app-card-footer">
          <span class="app-card-meta">v${app.version}</span>
          <a href="app.html?id=${app.id}" class="btn-link">
            View Details 
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      `;
      
      container.appendChild(card);
    });

    // Trigger IntersectionObserver on newly rendered cards
    const newReveals = container.querySelectorAll(".reveal");
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    });
    
    newReveals.forEach(el => cardObserver.observe(el));
  }
});
