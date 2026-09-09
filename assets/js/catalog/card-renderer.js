/**
 * Toukir Studio — App Card Renderer
 * Renders individual app cards and empty states into the grid.
 */

export function renderCards(apps, container) {
  if (!container) return;
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
    card.style.transitionDelay = `${Math.min(index * 0.05, 0.4)}s`;
    
    card.innerHTML = `
      <div class="app-card-header">
        <img src="${app.icon}" alt="${app.name} Icon" class="app-card-icon" onerror="this.src='assets/images/light_logo.png'">
        <div>
          <h3 class="app-card-title">${app.name}</h3>
          <div><span class="category-pill">${app.category}</span></div>
        </div>
      </div>
      <p class="app-card-desc">${app.shortDescription || ''}</p>
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

  // Observe newly added cards
  if ("IntersectionObserver" in window) {
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
}

if (typeof window !== "undefined") {
  window.renderCards = renderCards;
}
