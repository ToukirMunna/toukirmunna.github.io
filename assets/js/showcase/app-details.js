/**
 * Toukir Studio — Product Showcase Controller
 * Dynamically parses URL parameters, injects metadata, specs, features, changelog, and launches lightbox.
 */

import { setupLightbox } from "./lightbox.js";

export function initAppDetails() {
  const container = document.getElementById("app-detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const appId = params.get("id");

  if (!appId || !window.appsData) {
    renderError("No application selected.");
    return;
  }

  const app = window.appsData.find(item => item.id && item.id.toLowerCase() === appId.toLowerCase());
  if (!app) {
    renderError("Application not found.");
    return;
  }

  // SEO Meta Tags
  document.title = `${app.name} — Toukir Studio`;
  const setMeta = (id, content) => {
    const el = document.getElementById(id);
    if (el && content) el.content = content;
  };

  setMeta("og-title", `${app.name} — Toukir Studio`);
  setMeta("og-desc", app.tagline || app.shortDescription);
  setMeta("twitter-title", `${app.name} — Toukir Studio`);
  setMeta("twitter-desc", app.tagline || app.shortDescription);

  if (app.icon) {
    const iconUrl = new URL(app.icon, window.location.origin).href;
    setMeta("og-image", iconUrl);
    setMeta("twitter-image", iconUrl);
  }

  // Header Details
  const titleEl = document.getElementById("app-title");
  const taglineEl = document.getElementById("app-tagline");
  const catEl = document.getElementById("app-category");
  const iconEl = document.getElementById("app-icon");

  if (titleEl) titleEl.textContent = app.name;
  if (taglineEl) taglineEl.textContent = app.tagline || "";
  if (catEl) catEl.textContent = app.category || "Utility";
  if (iconEl) {
    iconEl.src = app.icon;
    iconEl.alt = `${app.name} Icon`;
    iconEl.onerror = () => { iconEl.src = "assets/images/light_logo.png"; };
  }

  // Tech Specs Grid
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
          <span class="tech-spec-value">${app.architecture || 'Kotlin • Jetpack Compose • Room'}</span>
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
    `;
  }

  // 16:9 Hero Banner
  const bannerWrapper = document.getElementById("hero-banner-wrapper");
  const bannerImg = document.getElementById("hero-screen-img");
  if (bannerWrapper && bannerImg) {
    if (app.banner) {
      bannerImg.src = app.banner;
      bannerImg.alt = `${app.name} Showcase Banner`;
      bannerWrapper.style.display = "block";
    } else {
      bannerWrapper.style.display = "none";
    }
  }

  // Screenshots Gallery & Lightbox
  const gallerySection = document.getElementById("gallery-section");
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer && app.screenshots && app.screenshots.length > 0) {
    galleryContainer.innerHTML = "";
    app.screenshots.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${app.name} Screenshot ${index + 1}`;
      img.className = "gallery-screenshot";
      img.addEventListener("click", () => lightbox.open(index));
      galleryContainer.appendChild(img);
    });
    if (gallerySection) gallerySection.style.display = "block";
    const lightbox = setupLightbox(app.screenshots);
  } else if (gallerySection) {
    gallerySection.style.display = "none";
  }

  // Descriptions & Features
  const fullDescEl = document.getElementById("app-full-description");
  if (fullDescEl) {
    fullDescEl.textContent = app.fullDescription || app.shortDescription || "";
  }

  const featuresList = document.getElementById("app-features-list");
  if (featuresList && app.features) {
    featuresList.innerHTML = "";
    app.features.forEach(feat => {
      const li = document.createElement("li");
      li.className = "feature-item reveal active";
      li.innerHTML = `
        <span class="feature-bullet">•</span>
        <span>${feat}</span>
      `;
      featuresList.appendChild(li);
    });
  }

  // Changelog
  const changelogSection = document.getElementById("changelog-section");
  const changelogList = document.getElementById("changelog-list");
  if (changelogList && app.changelog && app.changelog.length > 0) {
    changelogList.innerHTML = "";
    app.changelog.forEach(entry => {
      const item = document.createElement("div");
      item.className = "changelog-item reveal active";
      const notesHtml = (entry.notes || []).map(n => `<li>${n}</li>`).join("");
      item.innerHTML = `
        <div class="changelog-version-badge">v${entry.version}</div>
        <div class="changelog-date">${entry.date || ""}</div>
        <ul class="changelog-notes">${notesHtml}</ul>
      `;
      changelogList.appendChild(item);
    });
    if (changelogSection) changelogSection.style.display = "block";
  } else if (changelogSection) {
    changelogSection.style.display = "none";
  }

  // Sidebar Actions & Download Button
  const dlBtn = document.getElementById("app-download-btn");
  if (dlBtn) {
    if (app.downloadUrl) {
      dlBtn.href = app.downloadUrl;
      dlBtn.innerHTML = `
        <svg style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Download APK (${app.apkSize || "Direct"})
      `;
    } else {
      dlBtn.style.display = "none";
    }
  }

  const verMeta = document.getElementById("sidebar-app-version");
  const sizeMeta = document.getElementById("sidebar-app-size");
  const updateMeta = document.getElementById("sidebar-app-updated");
  if (verMeta) verMeta.textContent = `v${app.version || "1.0.0"}`;
  if (sizeMeta) sizeMeta.textContent = app.apkSize || "—";
  if (updateMeta) updateMeta.textContent = app.lastUpdated || "—";
}

function renderError(msg) {
  const container = document.getElementById("app-detail-container");
  if (container) {
    container.innerHTML = `
      <div class="container" style="padding: 100px 0; text-align: center;">
        <h2>${msg}</h2>
        <p style="margin: 1rem 0 2rem;">The requested app could not be found or has been archived.</p>
        <a href="projects.html" class="btn btn-primary">Return to Catalog</a>
      </div>
    `;
  }
}

// Auto-run on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initAppDetails);
