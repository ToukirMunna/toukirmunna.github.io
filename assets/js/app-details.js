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

  // --- LIGHTBOX STATE & REFERENCES ---
  let activeLightboxIndex = 0;
  let screenshotsList = [];
  
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const btnClose = document.getElementById("lightbox-close");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");

  function initLightbox(screenshots) {
    screenshotsList = screenshots;
    
    if (!lightboxModal) return;

    // Control binds
    if (btnClose) btnClose.onclick = closeLightbox;
    if (btnPrev) btnPrev.onclick = showPrevScreenshot;
    if (btnNext) btnNext.onclick = showNextScreenshot;

    // Click backdrop (outside image content) to dismiss
    lightboxModal.onclick = (e) => {
      if (e.target === lightboxModal || e.target.classList.contains("lightbox-content")) {
        closeLightbox();
      }
    };

    // Keyboard controls
    document.addEventListener("keydown", handleLightboxKeys);

    // Mobile swipe controls
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    lightboxModal.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightboxModal.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Check horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            showPrevScreenshot(); // swipe right
          } else {
            showNextScreenshot(); // swipe left
          }
        }
      } else {
        // Vertical swipe down to close
        if (diffY > 100) {
          closeLightbox();
        }
      }
    }
  }

  function openLightbox(index) {
    if (!lightboxModal || !lightboxImg || !lightboxCounter) return;
    
    activeLightboxIndex = index;
    updateLightboxImage();
    
    lightboxModal.classList.add("active");
    lightboxModal.setAttribute("aria-hidden", "false");
    lightboxModal.focus();
    
    document.body.style.overflow = "hidden"; // block background scroll
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("active");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightboxImage() {
    if (!lightboxImg || !lightboxCounter || screenshotsList.length === 0) return;
    
    const src = screenshotsList[activeLightboxIndex];
    lightboxImg.src = src;
    lightboxCounter.textContent = `${activeLightboxIndex + 1} / ${screenshotsList.length}`;
  }

  function showNextScreenshot() {
    if (screenshotsList.length <= 1) return;
    activeLightboxIndex = (activeLightboxIndex + 1) % screenshotsList.length;
    updateLightboxImage();
  }

  function showPrevScreenshot() {
    if (screenshotsList.length <= 1) return;
    activeLightboxIndex = (activeLightboxIndex - 1 + screenshotsList.length) % screenshotsList.length;
    updateLightboxImage();
  }

  function handleLightboxKeys(e) {
    if (!lightboxModal || !lightboxModal.classList.contains("active")) return;
    
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNextScreenshot();
    } else if (e.key === "ArrowLeft") {
      showPrevScreenshot();
    }
  }

  // 4. Render Screenshot Carousel
  const gallery = document.getElementById("gallery-container");
  if (gallery) {
    gallery.innerHTML = "";
    if (app.screenshots && app.screenshots.length > 0) {
      app.screenshots.forEach((screenshotPath, index) => {
        const slide = document.createElement("div");
        slide.className = "screenshot-card";
        slide.style.cursor = "pointer";
        slide.innerHTML = `
          <img src="${screenshotPath}" alt="${app.name} Screenshot ${index + 1}" onerror="this.src='assets/images/logo.png'">
        `;
        slide.addEventListener("click", () => openLightbox(index));
        gallery.appendChild(slide);
      });
      initLightbox(app.screenshots);
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
  if (heroScreen) {
    const bannerSrc = app.banner || (app.screenshots && app.screenshots.length > 0 ? app.screenshots[0] : 'assets/images/logo.png');
    
    if (bannerSrc) {
      heroScreen.src = bannerSrc;
      heroScreen.style.display = "block";
      heroScreen.alt = `${app.name} Hero Banner`;
      heroScreen.style.cursor = "pointer";
      
      heroScreen.onclick = () => {
        if (app.screenshots && app.screenshots.includes(bannerSrc)) {
          openLightbox(app.screenshots.indexOf(bannerSrc));
        } else {
          if (lightboxModal && lightboxImg && lightboxCounter) {
            lightboxImg.src = bannerSrc;
            lightboxCounter.textContent = "Banner";
            lightboxModal.classList.add("active");
            lightboxModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
          }
        }
      };
      
      // Progressive fallback chain: Custom Banner -> First Screenshot -> Logo -> Hide
      let fallbackStage = 0;
      heroScreen.onerror = () => {
        fallbackStage++;
        if (fallbackStage === 1) {
          const firstScreenshot = app.screenshots && app.screenshots.length > 0 ? app.screenshots[0] : null;
          if (firstScreenshot && firstScreenshot !== app.banner) {
            heroScreen.src = firstScreenshot;
            return;
          }
          fallbackStage++; // skip to logo if no screenshots
        }
        
        if (fallbackStage === 2) {
          heroScreen.src = 'assets/images/logo.png';
          return;
        }
        
        const wrapper = heroScreen.closest(".hero-screen-banner");
        if (wrapper) wrapper.style.display = "none";
      };
    } else {
      const wrapper = heroScreen.closest(".hero-screen-banner");
      if (wrapper) wrapper.style.display = "none";
    }
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
});
