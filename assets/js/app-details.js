/**
 * App Details Template Script
 * Dynamically parses query string and populates app details.
 */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app-detail-container");
  if (!container) return;

  // 1. Parse URL Parameter
  const params = new URLSearchParams(window.location.search);
  const appId = params.get("id");

  if (!appId || !window.appsData) {
    renderError("No application selected.");
    return;
  }

  // 2. Lookup App Data
  const app = window.appsData.find(item => item.id.toLowerCase() === appId.toLowerCase());
  if (!app) {
    renderError("Application not found.");
    return;
  }

  // 3. Populate Page Content
  document.title = `${app.name} - Android App Portfolio`;
  
  // Header details
  document.getElementById("app-title").textContent = app.name;
  document.getElementById("app-tagline").textContent = app.tagline;
  
  const categoryBadge = document.getElementById("app-category");
  if (categoryBadge) {
    categoryBadge.textContent = app.category;
  }

  const iconEl = document.getElementById("app-icon");
  if (iconEl) {
    iconEl.src = app.icon;
    iconEl.alt = `${app.name} Icon`;
  }

  // Description
  const descEl = document.getElementById("app-description");
  if (descEl) {
    descEl.textContent = app.fullDescription;
  }

  // Dynamic Metadata Sidebar
  document.getElementById("meta-version").textContent = app.version;
  document.getElementById("meta-size").textContent = app.apkSize;
  document.getElementById("meta-updated").textContent = app.lastUpdated;

  // Buttons
  const downloadBtn = document.getElementById("btn-download");
  if (downloadBtn) {
    downloadBtn.href = app.downloadUrl || "#";
  }

  const githubBtn = document.getElementById("btn-github");
  if (githubBtn) {
    if (app.githubUrl) {
      githubBtn.href = app.githubUrl;
      githubBtn.style.display = "inline-flex";
    } else {
      githubBtn.style.display = "none";
    }
  }

  const privacyBtn = document.getElementById("btn-privacy");
  if (privacyBtn) {
    privacyBtn.href = `privacy.html?id=${app.id}`;
  }

  // 4. Render Screenshot Carousel
  const gallery = document.getElementById("gallery-container");
  if (gallery) {
    gallery.innerHTML = "";
    if (app.screenshots && app.screenshots.length > 0) {
      app.screenshots.forEach((screenshotPath, index) => {
        const slide = document.createElement("div");
        slide.className = "screenshot-card";
        slide.innerHTML = `
          <img src="${screenshotPath}" alt="${app.name} Screenshot ${index + 1}" onerror="this.src='assets/images/logo.png'">
        `;
        gallery.appendChild(slide);
      });
    } else {
      gallery.style.display = "none";
    }
  }

  // 5. Render Features list
  const featuresList = document.getElementById("features-list");
  if (featuresList) {
    featuresList.innerHTML = "";
    if (app.features && app.features.length > 0) {
      app.features.forEach(feature => {
        const item = document.createElement("div");
        item.className = "feature-item reveal";
        item.innerHTML = `
          <span class="feature-check-icon">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span class="feature-text">${feature}</span>
        `;
        featuresList.appendChild(item);
      });
    }
  }

  // 6. Render Hero Screen Banner
  const heroScreen = document.getElementById("hero-screen-img");
  if (heroScreen && app.screenshots && app.screenshots.length > 0) {
    heroScreen.src = app.screenshots[0];
    heroScreen.alt = `${app.name} Hero Screenshot`;
  }

  // 7. Render Changelog Timeline
  const changelogTimeline = document.getElementById("changelog-timeline");
  if (changelogTimeline) {
    changelogTimeline.innerHTML = "";
    if (app.changelog && app.changelog.length > 0) {
      app.changelog.forEach(item => {
        const timelineItem = document.createElement("div");
        timelineItem.className = "changelog-item reveal active";
        
        let notesHtml = "";
        if (item.notes && item.notes.length > 0) {
          notesHtml = `<ul class="changelog-notes">` + item.notes.map(note => `<li>${note}</li>`).join("") + `</ul>`;
        }
        
        timelineItem.innerHTML = `
          <div class="changelog-header">
            <span class="changelog-version">Version ${item.version}</span>
            <span class="changelog-date">${item.date}</span>
          </div>
          ${notesHtml}
        `;
        changelogTimeline.appendChild(timelineItem);
      });
    } else {
      changelogTimeline.innerHTML = "<p class='app-card-meta'>Changelog details coming soon.</p>";
    }
  }

  // 8. Render Related Apps Grid
  const relatedGrid = document.getElementById("related-apps-grid");
  if (relatedGrid && window.appsData) {
    relatedGrid.innerHTML = "";
    const otherApps = window.appsData.filter(item => item.id.toLowerCase() !== app.id.toLowerCase()).slice(0, 2);
    
    otherApps.forEach(otherApp => {
      const card = document.createElement("div");
      card.className = "glass-card app-card reveal active";
      card.innerHTML = `
        <div class="app-card-header">
          <img src="${otherApp.icon}" alt="${otherApp.name} Icon" class="app-card-icon" onerror="this.src='assets/images/logo.png'">
          <div>
            <h3 class="app-card-title">${otherApp.name}</h3>
            <div><span class="category-pill">${otherApp.category}</span></div>
          </div>
        </div>
        <p class="app-card-desc">${otherApp.shortDescription}</p>
        <div class="app-card-footer">
          <span class="app-card-meta">v${otherApp.version}</span>
          <a href="app.html?id=${otherApp.id}" class="btn-link">
            View Details 
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      `;
      relatedGrid.appendChild(card);
    });
  }

  // Helper: Show error state
  function renderError(message) {
    container.innerHTML = `
      <div class="container reveal active">
        <div class="app-error-state">
          <h1>Oops!</h1>
          <p>${message}</p>
          <a href="index.html" class="btn btn-primary">
            <svg style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    `;
  }

  // 8. Lightbox modal popup
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  
  if (lightboxModal && lightboxImg && lightboxClose) {
    const galleryEl = document.getElementById("gallery-container");
    if (galleryEl) {
      galleryEl.addEventListener("click", (e) => {
        const img = e.target.closest("img");
        if (img) {
          lightboxImg.src = img.src;
          lightboxModal.classList.add("active");
          document.body.style.overflow = "hidden"; // lock page scroll
        }
      });
    }

    lightboxClose.addEventListener("click", () => {
      lightboxModal.classList.remove("active");
      document.body.style.overflow = "";
    });

    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
        lightboxModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
});
