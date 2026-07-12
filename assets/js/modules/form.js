/**
 * Form Editor & Modal Module - Toukir Ahmed Portfolio Admin
 *
 * Handles the slide-out app editor modal.
 * Features: Featured/Hidden toggles, image live preview, auto-save draft.
 */

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

function getEditingAppId() {
  return editingAppId;
}

function closeForm() {
  if (appModal) appModal.classList.remove("active");
}

// ─── Image Live Preview ───────────────────────────────────────────────────────

/**
 * Attaches a live preview thumbnail to an image path input.
 * The preview <img> appears beside the input, updates on input change.
 */
function attachImagePreview(inputEl) {
  if (!inputEl || inputEl.dataset.previewAttached) return;
  inputEl.dataset.previewAttached = "true";

  const previewImg = document.createElement("img");
  previewImg.className = "admin-img-preview";
  previewImg.alt = "Preview";
  previewImg.title = "Image preview";

  const updatePreview = () => {
    const path = inputEl.value.trim();
    if (path) {
      previewImg.src = path;
      previewImg.style.display = "block";
    } else {
      previewImg.style.display = "none";
    }
  };

  previewImg.onerror = () => { previewImg.style.display = "none"; };
  inputEl.addEventListener("input", updatePreview);
  inputEl.parentElement.style.position = "relative";
  inputEl.insertAdjacentElement("afterend", previewImg);
  updatePreview();
}

// ─── Dynamic List Helpers ─────────────────────────────────────────────────────

function addStringInputRow(container, value = "") {
  const div = document.createElement("div");
  div.className = "dynamic-list-item";
  div.innerHTML = `
    <input type="text" class="admin-input list-input-item" value="${escapeHtml(value)}" required>
    <button type="button" class="btn-icon btn-delete btn-remove-item" title="Remove">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;
  div.querySelector(".btn-remove-item").addEventListener("click", () => div.remove());
  container.appendChild(div);
}

function addScreenshotInputRow(container, value = "") {
  const div = document.createElement("div");
  div.className = "dynamic-list-item screenshot-row";
  const pickerId = `scr-picker-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  div.innerHTML = `
    <input type="text" class="admin-input list-input-item screenshot-path-input" value="${escapeHtml(value)}" required style="flex:1">
    <label class="btn btn-secondary" style="margin:0;padding:0 0.75rem;font-size:0.75rem;display:inline-flex;align-items:center;cursor:pointer;border-radius:6px;height:38px;white-space:nowrap">
      Pick Image
      <input type="file" id="${pickerId}" accept="image/*" style="display:none">
    </label>
    <button type="button" class="btn-icon btn-delete btn-remove-item" title="Remove" style="height:38px">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;

  const fileInput = div.querySelector(`#${pickerId}`);
  const textInput = div.querySelector(".screenshot-path-input");

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const appId = document.getElementById("app-id").value.trim().toLowerCase() || "default";
      textInput.value = `assets/images/${appId}/${file.name}`;
      attachImagePreview(textInput);
      showToast(`Selected screenshot: ${file.name}`, "success");
    }
  };

  div.querySelector(".btn-remove-item").addEventListener("click", () => div.remove());
  container.appendChild(div);
  attachImagePreview(textInput);
}

function addChangelogSection(container, entry = { version: "", date: "", notes: [] }) {
  const div = document.createElement("div");
  div.className = "changelog-editor-item";
  const notesListId = `changelog-notes-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  div.innerHTML = `
    <div class="changelog-editor-item-header">
      <span class="changelog-editor-item-title">Version Release</span>
      <button type="button" class="btn-remove-changelog" title="Delete Release version">Remove Version</button>
    </div>
    <div class="form-row">
      <div class="admin-input-group">
        <label class="admin-label">Release Version</label>
        <input type="text" class="admin-input changelog-ver" placeholder="e.g. 1.0.0" value="${escapeHtml(entry.version)}" required>
      </div>
      <div class="admin-input-group">
        <label class="admin-label">Release Date</label>
        <input type="text" class="admin-input changelog-date" placeholder="e.g. June 15, 2026" value="${escapeHtml(entry.date)}" required>
      </div>
    </div>
    <div class="admin-input-group" style="margin-bottom:0">
      <label class="admin-label">Changelog Notes / Commits</label>
      <div class="dynamic-list-container changelog-notes-container" id="${notesListId}">
        <!-- Dynamic notes -->
      </div>
      <button type="button" class="btn-add-item btn-add-changelog-note" style="margin-top:0.5rem">
        <svg style="width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Add Release Note
      </button>
    </div>
  `;

  const notesContainer = div.querySelector(`#${notesListId}`);
  const btnAddNote = div.querySelector(".btn-add-changelog-note");

  if (entry.notes && entry.notes.length > 0) {
    entry.notes.forEach(note => addStringInputRow(notesContainer, note));
  } else {
    addStringInputRow(notesContainer, "");
  }

  btnAddNote.addEventListener("click", () => addStringInputRow(notesContainer, ""));
  div.querySelector(".btn-remove-changelog").addEventListener("click", () => div.remove());
  container.appendChild(div);
}

// ─── Draft Auto-save ──────────────────────────────────────────────────────────

/**
 * Collects current form field values (simple fields only, not dynamic lists)
 * and saves them as a draft to localStorage. Called on every form input event.
 */
function triggerDraftSave() {
  clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(() => {
    const draft = {
      id: document.getElementById("app-id")?.value || "",
      name: document.getElementById("app-name")?.value || "",
      tagline: document.getElementById("app-tagline")?.value || "",
      category: document.getElementById("app-category")?.value || "",
      version: document.getElementById("app-version")?.value || "",
      apkSize: document.getElementById("app-apk-size")?.value || "",
      lastUpdated: document.getElementById("app-last-updated")?.value || "",
      downloadUrl: document.getElementById("app-download-url")?.value || "",
      githubUrl: document.getElementById("app-github-url")?.value || "",
      icon: document.getElementById("app-icon")?.value || "",
      shortDescription: document.getElementById("app-short-desc")?.value || "",
      fullDescription: document.getElementById("app-full-desc")?.value || "",
      featured: document.getElementById("app-featured")?.checked || false,
      hidden: document.getElementById("app-hidden")?.checked || false,
      editingAppId
    };
    saveDraft(draft);
  }, 800); // debounce 800ms
}

function restoreDraftBanner() {
  if (!hasDraft()) return;
  const draft = loadDraft();
  if (!draft) return;

  const banner = document.createElement("div");
  banner.id = "draft-restore-banner";
  banner.style.cssText = `
    background: var(--accent-light);
    border: 1px solid var(--accent-primary);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    font-size: 0.88rem;
    color: var(--accent-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  `;
  banner.innerHTML = `
    <span>📝 You have an unsaved draft for <strong>${escapeHtml(draft.name || "an app")}</strong>. Restore it?</span>
    <div style="display:flex;gap:0.5rem;flex-shrink:0">
      <button id="btn-restore-draft" class="btn btn-primary" style="padding:0.4rem 0.9rem;font-size:0.82rem">Restore</button>
      <button id="btn-discard-draft" class="btn btn-secondary" style="padding:0.4rem 0.9rem;font-size:0.82rem">Discard</button>
    </div>
  `;

  const modalBody = appModal?.querySelector(".modal-body");
  if (modalBody) modalBody.prepend(banner);

  document.getElementById("btn-restore-draft")?.addEventListener("click", () => {
    applyDraftToForm(draft);
    banner.remove();
  });

  document.getElementById("btn-discard-draft")?.addEventListener("click", () => {
    clearDraft();
    banner.remove();
  });
}

function applyDraftToForm(draft) {
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };
  setVal("app-id", draft.id);
  setVal("app-name", draft.name);
  setVal("app-tagline", draft.tagline);
  setVal("app-category", draft.category);
  setVal("app-version", draft.version);
  setVal("app-apk-size", draft.apkSize);
  setVal("app-last-updated", draft.lastUpdated);
  setVal("app-download-url", draft.downloadUrl);
  setVal("app-github-url", draft.githubUrl);
  setVal("app-icon", draft.icon);
  setVal("app-short-desc", draft.shortDescription);
  setVal("app-full-desc", draft.fullDescription);

  const featuredEl = document.getElementById("app-featured");
  const hiddenEl = document.getElementById("app-hidden");
  if (featuredEl) featuredEl.checked = !!draft.featured;
  if (hiddenEl) hiddenEl.checked = !!draft.hidden;

  // Update icon preview
  attachImagePreview(document.getElementById("app-icon"));
  showToast("Draft restored. Dynamic fields (features, screenshots, changelog) need to be re-entered.", "info");
}

// ─── Open / Close Form ────────────────────────────────────────────────────────

function openAddForm() {
  editingAppId = null;
  if (modalTitle) modalTitle.textContent = "Add New Application";
  if (appForm) appForm.reset();

  const featuredEl = document.getElementById("app-featured");
  const hiddenEl = document.getElementById("app-hidden");
  if (featuredEl) featuredEl.checked = false;
  if (hiddenEl) hiddenEl.checked = false;

  featuresContainer.innerHTML = "";
  screenshotsContainer.innerHTML = "";
  changelogContainer.innerHTML = "";

  addStringInputRow(featuresContainer, "");
  addScreenshotInputRow(screenshotsContainer, "");
  addChangelogSection(changelogContainer, {
    version: "1.0.0",
    date: getCurrentFormattedDate(),
    notes: ["Initial release of the application."]
  });

  const nameInput = document.getElementById("app-name");
  const idInput = document.getElementById("app-id");
  if (idInput) {
    idInput.value = "";
    idInput.readOnly = false;
  }

  if (nameInput && idInput) {
    nameInput.oninput = () => {
      if (!editingAppId) {
        idInput.value = nameInput.value.toLowerCase().trim()
          .replace(/[^a-z0-9\-]/g, "-")
          .replace(/-+/g, "-");
      }
    };
  }

  // Attach icon preview
  attachImagePreview(document.getElementById("app-icon"));

  if (appModal) appModal.classList.add("active");
  restoreDraftBanner();
}

function openEditForm(app) {
  if (!app) return;
  editingAppId = app.id;
  if (modalTitle) modalTitle.textContent = `Edit Application: ${app.name}`;
  if (appForm) appForm.reset();

  const idInput = document.getElementById("app-id");
  if (idInput) {
    idInput.value = app.id;
    idInput.readOnly = true;
  }

  const nameInput = document.getElementById("app-name");
  if (nameInput) nameInput.oninput = null;

  document.getElementById("app-name").value = app.name || "";
  document.getElementById("app-tagline").value = app.tagline || "";
  document.getElementById("app-category").value = app.category || "";
  document.getElementById("app-version").value = app.version || "";
  document.getElementById("app-apk-size").value = app.apkSize || "";
  document.getElementById("app-last-updated").value = app.lastUpdated || getCurrentFormattedDate();
  document.getElementById("app-download-url").value = app.downloadUrl || "";
  document.getElementById("app-github-url").value = app.githubUrl || "";
  document.getElementById("app-icon").value = app.icon || "";
  document.getElementById("app-short-desc").value = app.shortDescription || "";
  document.getElementById("app-full-desc").value = app.fullDescription || "";

  // Featured / Hidden toggles
  const featuredEl = document.getElementById("app-featured");
  const hiddenEl = document.getElementById("app-hidden");
  if (featuredEl) featuredEl.checked = !!app.featured;
  if (hiddenEl) hiddenEl.checked = !!app.hidden;

  featuresContainer.innerHTML = "";
  screenshotsContainer.innerHTML = "";
  changelogContainer.innerHTML = "";

  (app.features?.length ? app.features : [""]).forEach(val => addStringInputRow(featuresContainer, val));
  (app.screenshots?.length ? app.screenshots : [""]).forEach(val => addScreenshotInputRow(screenshotsContainer, val));
  (app.changelog?.length ? app.changelog : [{}]).forEach(entry => addChangelogSection(changelogContainer, entry));

  // Attach icon preview
  attachImagePreview(document.getElementById("app-icon"));

  if (appModal) appModal.classList.add("active");
}

// ─── Form Handlers ────────────────────────────────────────────────────────────

function initFormHandlers(onSubmitCallback) {
  // Close modal
  const closeModalBtn = document.getElementById("close-modal-btn");
  const btnCancelApp = document.getElementById("btn-cancel-app");
  if (closeModalBtn) closeModalBtn.onclick = closeForm;
  if (btnCancelApp) btnCancelApp.onclick = closeForm;

  // APK file picker → auto-populate URL and size
  const apkFilePicker = document.getElementById("apk-file-picker");
  const appDownloadUrl = document.getElementById("app-download-url");
  const appApkSize = document.getElementById("app-apk-size");
  if (apkFilePicker && appDownloadUrl && appApkSize) {
    apkFilePicker.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        appDownloadUrl.value = `assets/apks/${file.name}`;
        appApkSize.value = (file.size / (1024 * 1024)).toFixed(1) + " MB";
        showToast(`Auto-selected file and calculated size: ${appApkSize.value}`, "success");
      }
    };
  }

  // Icon file picker → auto-populate path + trigger preview
  const iconFilePicker = document.getElementById("icon-file-picker");
  const appIconInput = document.getElementById("app-icon");
  if (iconFilePicker && appIconInput) {
    iconFilePicker.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const appId = document.getElementById("app-id").value.trim().toLowerCase() || "default";
        appIconInput.value = `assets/images/${appId}/${file.name}`;
        attachImagePreview(appIconInput);
        showToast(`Selected icon file: ${file.name}`, "success");
      }
    };
  }

  // Icon path live preview
  if (appIconInput) {
    appIconInput.addEventListener("input", () => attachImagePreview(appIconInput));
  }

  // Batch screenshot picker
  if (batchScreenshotPicker) {
    batchScreenshotPicker.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const appId = document.getElementById("app-id").value.trim().toLowerCase() || "default";
        const firstInput = screenshotsContainer.querySelector(".screenshot-path-input");
        if (firstInput && firstInput.value === "" && screenshotsContainer.children.length === 1) {
          screenshotsContainer.innerHTML = "";
        }
        files.forEach(file => addScreenshotInputRow(screenshotsContainer, `assets/images/${appId}/${file.name}`));
        showToast(`Batch added ${files.length} screenshots.`, "success");
      }
    };
  }

  // Dynamic add buttons
  if (btnAddFeature) btnAddFeature.onclick = () => addStringInputRow(featuresContainer, "");
  if (btnAddScreenshotBlank) btnAddScreenshotBlank.onclick = () => addScreenshotInputRow(screenshotsContainer, "");
  if (btnAddChangelog) btnAddChangelog.onclick = () => addChangelogSection(changelogContainer);

  // Auto-save draft on any input inside the modal
  if (appModal) {
    appModal.addEventListener("input", triggerDraftSave);
    appModal.addEventListener("change", triggerDraftSave);
  }

  // Form submit → build app object
  if (appForm) {
    appForm.onsubmit = (e) => {
      e.preventDefault();

      const features = Array.from(featuresContainer.querySelectorAll(".list-input-item"))
        .map(input => input.value.trim())
        .filter(val => val !== "");

      const screenshots = Array.from(screenshotsContainer.querySelectorAll(".list-input-item"))
        .map(input => input.value.trim())
        .filter(val => val !== "");

      const changelogItems = Array.from(changelogContainer.querySelectorAll(".changelog-editor-item"));
      const changelog = changelogItems.map(item => {
        const version = item.querySelector(".changelog-ver").value.trim();
        const date = item.querySelector(".changelog-date").value.trim();
        const notes = Array.from(item.querySelectorAll(".list-input-item"))
          .map(input => input.value.trim())
          .filter(val => val !== "");
        return { version, date, notes };
      }).filter(entry => entry.version !== "");

      const appObject = {
        id: document.getElementById("app-id").value.trim().toLowerCase(),
        name: document.getElementById("app-name").value.trim(),
        tagline: document.getElementById("app-tagline").value.trim(),
        shortDescription: document.getElementById("app-short-desc").value.trim(),
        fullDescription: document.getElementById("app-full-desc").value.trim(),
        icon: document.getElementById("app-icon").value.trim() || "assets/images/logo.png",
        screenshots,
        features,
        version: document.getElementById("app-version").value.trim() || "1.0.0",
        apkSize: document.getElementById("app-apk-size").value.trim() || "0 MB",
        lastUpdated: document.getElementById("app-last-updated").value.trim(),
        downloadUrl: document.getElementById("app-download-url").value.trim(),
        githubUrl: document.getElementById("app-github-url").value.trim(),
        category: document.getElementById("app-category").value.trim(),
        changelog,
        featured: document.getElementById("app-featured")?.checked || false,
        hidden: document.getElementById("app-hidden")?.checked || false
      };

      clearDraft(); // Draft no longer needed once saved
      onSubmitCallback(appObject);
    };
  }
}
