/**
 * Form Editor & Modal Module - Toukir Studio Admin
 * Modular orchestrator for app creation and editing.
 */

import { escapeHtml, showToast } from "./helpers.js";
import { attachImagePreview } from "./form/image-preview.js";
import { addStringInputRow, addScreenshotInputRow, addChangelogRow } from "./form/dynamic-lists.js";
import { saveDraft, clearDraft, loadDraft } from "./form/drafts.js";

// DOM References
const appModal = document.getElementById("app-modal");
const modalTitle = document.getElementById("modal-title");
const appForm = document.getElementById("app-form");

const featuresContainer = document.getElementById("features-container");
const screenshotsContainer = document.getElementById("screenshots-container");
const changelogContainer = document.getElementById("changelog-container");

const btnAddFeature = document.getElementById("btn-add-feature");
const btnAddScreenshotBlank = document.getElementById("btn-add-screenshot-blank");
const batchScreenshotPicker = document.getElementById("batch-screenshot-picker");
const btnAddChangelog = document.getElementById("btn-add-changelog");

let editingAppId = null;
let draftSaveTimer = null;

export function getEditingAppId() {
  return editingAppId;
}

export function closeForm() {
  if (appModal) appModal.classList.remove("active");
}

function collectPayload() {
  const features = Array.from(featuresContainer.querySelectorAll(".list-input-item"))
    .map(el => el.value.trim())
    .filter(Boolean);

  const screenshots = Array.from(screenshotsContainer.querySelectorAll(".list-input-item"))
    .map(el => el.value.trim())
    .filter(Boolean);

  const changelog = Array.from(changelogContainer.querySelectorAll(".changelog-form-item"))
    .map(item => ({
      version: item.querySelector(".cl-version").value.trim(),
      date: item.querySelector(".cl-date").value.trim(),
      notes: item.querySelector(".cl-notes").value
        .split("\n")
        .map(n => n.trim())
        .filter(Boolean)
    }))
    .filter(cl => cl.version && cl.date);

  return {
    id: document.getElementById("app-id").value.trim(),
    name: document.getElementById("app-name").value.trim(),
    tagline: document.getElementById("app-tagline").value.trim(),
    shortDescription: document.getElementById("app-short-desc").value.trim(),
    fullDescription: document.getElementById("app-full-desc").value.trim(),
    version: document.getElementById("app-version").value.trim(),
    apkSize: document.getElementById("app-apk-size").value.trim(),
    category: document.getElementById("app-category-select").value,
    icon: document.getElementById("app-icon-path").value.trim(),
    banner: document.getElementById("app-banner-path")?.value.trim() || "",
    downloadUrl: document.getElementById("app-dl-url").value.trim(),
    githubUrl: document.getElementById("app-gh-url").value.trim(),
    lastUpdated: document.getElementById("app-updated").value.trim(),
    featured: document.getElementById("app-featured-toggle")?.checked ?? false,
    hidden: document.getElementById("app-hidden-toggle")?.checked ?? false,
    features,
    screenshots,
    changelog
  };
}

function scheduleDraftSave() {
  clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(() => {
    saveDraft(collectPayload, editingAppId);
  }, 1000);
}

export function initForm(saveCallback) {
  // Add row listeners
  if (btnAddFeature) {
    btnAddFeature.addEventListener("click", () => {
      addStringInputRow(featuresContainer);
      scheduleDraftSave();
    });
  }

  if (btnAddScreenshotBlank) {
    btnAddScreenshotBlank.addEventListener("click", () => {
      addScreenshotInputRow(screenshotsContainer);
      scheduleDraftSave();
    });
  }

  if (batchScreenshotPicker) {
    batchScreenshotPicker.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      const folder = (document.getElementById("app-id")?.value.trim() || "app").toLowerCase();
      files.forEach(f => {
        addScreenshotInputRow(screenshotsContainer, `assets/images/${folder}/${f.name}`);
      });
      batchScreenshotPicker.value = "";
      scheduleDraftSave();
    });
  }

  if (btnAddChangelog) {
    btnAddChangelog.addEventListener("click", () => {
      addChangelogRow(changelogContainer);
      scheduleDraftSave();
    });
  }

  // Live image preview attachments
  ["app-icon-path", "app-banner-path"].forEach(id => {
    const el = document.getElementById(id);
    if (el) attachImagePreview(el);
  });

  // Modal tab switching
  document.querySelectorAll(".modal-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".modal-tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const targetPanel = document.getElementById(`tab-panel-${btn.dataset.tab}`);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // Modal dismiss buttons
  document.querySelectorAll(".btn-close-modal").forEach(btn => {
    btn.addEventListener("click", closeForm);
  });

  // Auto-save drafts on input
  if (appForm) {
    appForm.addEventListener("input", scheduleDraftSave);
  }

  // Form submit handler
  if (appForm) {
    appForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = collectPayload();

      // Look up existing app to preserve unedited properties
      const existingApp = window.appsData ? window.appsData.find(a => a.id === payload.id) : null;
      const mergedApp = existingApp ? { ...existingApp, ...payload } : payload;

      try {
        await saveCallback(mergedApp, Boolean(editingAppId));
        clearDraft();
        closeForm();
        showToast(editingAppId ? "App updated successfully!" : "App added successfully!");
      } catch (err) {
        showToast(`Save failed: ${err.message}`, "error");
      }
    });
  }
}

export function openAppForm(app = null) {
  editingAppId = app ? app.id : null;
  if (modalTitle) modalTitle.textContent = app ? `Edit: ${app.name}` : "Add New Application";

  if (appForm) appForm.reset();
  if (featuresContainer) featuresContainer.innerHTML = "";
  if (screenshotsContainer) screenshotsContainer.innerHTML = "";
  if (changelogContainer) changelogContainer.innerHTML = "";

  // Reset tabs to first
  const firstTab = document.querySelector(".modal-tab-btn[data-tab='general']");
  if (firstTab) firstTab.click();

  if (app) {
    document.getElementById("app-id").value = app.id || "";
    document.getElementById("app-id").disabled = true; // Cannot edit primary key
    document.getElementById("app-name").value = app.name || "";
    document.getElementById("app-tagline").value = app.tagline || "";
    document.getElementById("app-short-desc").value = app.shortDescription || "";
    document.getElementById("app-full-desc").value = app.fullDescription || "";
    document.getElementById("app-version").value = app.version || "1.0.0";
    document.getElementById("app-apk-size").value = app.apkSize || "";
    document.getElementById("app-category-select").value = app.category || "Productivity";
    document.getElementById("app-icon-path").value = app.icon || "";
    if (document.getElementById("app-banner-path")) {
      document.getElementById("app-banner-path").value = app.banner || "";
    }
    document.getElementById("app-dl-url").value = app.downloadUrl || "";
    document.getElementById("app-gh-url").value = app.githubUrl || "";
    document.getElementById("app-updated").value = app.lastUpdated || "";

    const featToggle = document.getElementById("app-featured-toggle");
    if (featToggle) featToggle.checked = Boolean(app.featured);

    const hiddenToggle = document.getElementById("app-hidden-toggle");
    if (hiddenToggle) hiddenToggle.checked = Boolean(app.hidden);

    // Populate dynamic lists
    (app.features || []).forEach(feat => addStringInputRow(featuresContainer, feat));
    (app.screenshots || []).forEach(src => addScreenshotInputRow(screenshotsContainer, src));
    (app.changelog || []).forEach(cl => addChangelogRow(changelogContainer, cl.version, cl.date, cl.notes));
  } else {
    document.getElementById("app-id").disabled = false;
    document.getElementById("app-version").value = "1.0.0";
    document.getElementById("app-updated").value = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    addStringInputRow(featuresContainer);
    addScreenshotInputRow(screenshotsContainer);
    addChangelogRow(changelogContainer, "1.0.0", document.getElementById("app-updated").value, ["Initial release"]);
  }

  // Trigger preview updates
  ["app-icon-path", "app-banner-path"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.dispatchEvent(new Event("input"));
  });

  if (appModal) appModal.classList.add("active");
}
