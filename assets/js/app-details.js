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
  document.title = `${app.name} — Toukir Ahmed`;
  
  // Dynamic OpenGraph / Twitter tags for social previews
  const ogTitle = document.getElementById("og-title");
  const ogDesc = document.getElementById("og-desc");
  const ogImage = document.getElementById("og-image");
  const twitterTitle = document.getElementById("twitter-title");
  const twitterDesc = document.getElementById("twitter-desc");
  const twitterImage = document.getElementById("twitter-image");

  if (ogTitle) ogTitle.content = `${app.name} — Native Android Application`;
  if (ogDesc) ogDesc.content = app.tagline || app.shortDescription;
  if (ogImage && app.icon) ogImage.content = new URL(app.icon, window.location.origin).href;
  if (twitterTitle) twitterTitle.content = `${app.name} — Native Android Application`;
  if (twitterDesc) twitterDesc.content = app.tagline || app.shortDescription;
  if (twitterImage && app.icon) twitterImage.content = new URL(app.icon, window.location.origin).href;

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
    iconEl.onerror = () => { iconEl.src = 'assets/images/light_logo.png'; };
  }

  // Populate Technical Architecture Specs Card
  const techSpecsGrid = document.getElementById("tech-specs-grid");
  if (techSpecsGrid) {
    techSpecsGrid.innerHTML = `
      <div class="tech-spec-item">
        <div class="tech-spec-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div class="tech-spec-details">
          <span class="tech-spec-label">Architecture Stack</span>
          <span class="tech-spec-value">${app.architecture || 'Kotlin 2.0 • Jetpack Compose • Room'}</span>
        </div>
      </div>

      <div class="tech-spec-item">
        <div class="tech-spec-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        </div>
        <div class="tech-spec-details">
          <span class="tech-spec-label">Compatibility</span>
          <span class="tech-spec-value">${app.compatibility || 'Android 10+ (API 29+)'}</span>
        </div>
      </div>

      <div class="tech-spec-item">
        <div class="tech-spec-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div class="tech-spec-details">
          <span class="tech-spec-label">Storage & Privacy</span>
          <span class="tech-spec-value">${app.storage || '100% Offline • Sandboxed Storage'}</span>
        </div>
      </div>

      <div class="tech-spec-item">
        <div class="tech-spec-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="tech-spec-details">
          <span class="tech-spec-label">Release Status</span>
          <span class="tech-spec-value">${app.downloadUrl ? 'Stable Release Active' : 'In Active Development'}</span>
        </div>
      </div>
    `;
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

  // Buttons & Status Management
  const downloadBtn = document.getElementById("btn-download");
  if (downloadBtn) {
    if (app.downloadUrl && app.downloadUrl.trim().length > 0) {
      downloadBtn.href = app.downloadUrl;
      downloadBtn.className = "btn btn-primary";
      downloadBtn.innerHTML = `
        <svg style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Download APK
      `;
      downloadBtn.removeAttribute("aria-disabled");
    } else {
      downloadBtn.removeAttribute("href");
      downloadBtn.className = "btn btn-disabled";
      downloadBtn.setAttribute("aria-disabled", "true");
      downloadBtn.title = "Release APK is currently being prepared";
      downloadBtn.innerHTML = `
        <svg style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        Release Coming Soon
      `;
    }
  }

  const githubBtn = document.getElementById("btn-github");
  if (githubBtn) {
    // Only shown for projects with an explicit, public repository
    if (app.githubUrl && app.githubUrl.trim().length > 0) {
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
  const gallerySection = document.getElementById("gallery-section");
  const gallery = document.getElementById("gallery-container");
  if (gallery) {
    gallery.innerHTML = "";
    if (app.screenshots && app.screenshots.length > 0) {
      if (gallerySection) gallerySection.style.display = "block";
      gallery.style.display = "flex";
      app.screenshots.forEach((screenshotPath, index) => {
        const slide = document.createElement("div");
        slide.className = "screenshot-card";
        slide.style.cursor = "pointer";
        slide.innerHTML = `
          <img src="${screenshotPath}" alt="${app.name} Screenshot ${index + 1}" onerror="this.src='assets/images/light_logo.png'">
        `;
        slide.addEventListener("click", () => openLightbox(index));
        gallery.appendChild(slide);
      });
      initLightbox(app.screenshots);
    } else {
      gallery.style.display = "none";
      if (gallerySection) gallerySection.style.display = "none";
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

  // 6. Render Hero Screen Banner (Collapses gracefully when zero screenshots/banner)
  const heroBannerWrapper = document.getElementById("hero-banner-wrapper") || document.querySelector(".hero-screen-banner");
  const heroScreen = document.getElementById("hero-screen-img");

  if (heroScreen && heroBannerWrapper) {
    const hasScreenshots = app.screenshots && app.screenshots.length > 0;
    const bannerSrc = app.banner || (hasScreenshots ? app.screenshots[0] : null);

    if (bannerSrc) {
      heroBannerWrapper.style.display = "block";
      heroScreen.src = bannerSrc;
      heroScreen.style.display = "block";
      heroScreen.alt = `${app.name} Hero Banner`;
      heroScreen.style.cursor = "pointer";
      
      heroScreen.onclick = () => {
        if (app.screenshots && app.screenshots.includes(bannerSrc)) {
          openLightbox(app.screenshots.indexOf(bannerSrc));
        } else if (lightboxModal && lightboxImg && lightboxCounter) {
          lightboxImg.src = bannerSrc;
          lightboxCounter.textContent = "Banner";
          lightboxModal.classList.add("active");
          lightboxModal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
        }
      };
      
      heroScreen.onerror = () => {
        if (hasScreenshots && heroScreen.src !== app.screenshots[0]) {
          heroScreen.src = app.screenshots[0];
        } else {
          heroBannerWrapper.style.display = "none";
        }
      };
    } else {
      // Gracefully collapse banner when no banner or screenshots exist
      heroBannerWrapper.style.display = "none";
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
          <img src="${otherApp.icon}" alt="${otherApp.name} Icon" class="app-card-icon" onerror="this.src='assets/images/light_logo.png'">
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
          <a href="./" class="btn btn-primary">
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
