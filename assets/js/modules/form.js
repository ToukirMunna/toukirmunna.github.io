/**
 * Form Editor & Modal Module - Blue Pixel Admin
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

function getEditingAppId() {
  return editingAppId;
}

function closeForm() {
  if (appModal) appModal.classList.remove("active");
}

// Add simple text input helper
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

// Add screenshot input row with pick image trigger
function addScreenshotInputRow(container, value = "") {
  const div = document.createElement("div");
  div.className = "dynamic-list-item";
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
      showToast(`Selected screenshot: ${file.name}`, "success");
    }
  };

  div.querySelector(".btn-remove-item").addEventListener("click", () => div.remove());
  container.appendChild(div);
}

// Add changelog block helper
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

function openAddForm() {
  editingAppId = null;
  if (modalTitle) modalTitle.textContent = "Add New Application";
  if (appForm) appForm.reset();

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
        idInput.value = nameInput.value.toLowerCase().trim().replace(/[^a-z0-9\-]/g, "-").replace(/-+/g, "-");
      }
    };
  }

  if (appModal) appModal.classList.add("active");
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
  if (nameInput) nameInput.oninput = null; // Unbind slug generator

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

  featuresContainer.innerHTML = "";
  screenshotsContainer.innerHTML = "";
  changelogContainer.innerHTML = "";

  if (app.features && app.features.length > 0) {
    app.features.forEach(val => addStringInputRow(featuresContainer, val));
  } else {
    addStringInputRow(featuresContainer);
  }

  if (app.screenshots && app.screenshots.length > 0) {
    app.screenshots.forEach(val => addScreenshotInputRow(screenshotsContainer, val));
  } else {
    addScreenshotInputRow(screenshotsContainer);
  }

  if (app.changelog && app.changelog.length > 0) {
    app.changelog.forEach(entry => addChangelogSection(changelogContainer, entry));
  } else {
    addChangelogSection(changelogContainer);
  }

  if (appModal) appModal.classList.add("active");
}

function initFormHandlers(onSubmitCallback) {
  // Bind close modal buttons
  const closeModalBtn = document.getElementById("close-modal-btn");
  const btnCancelApp = document.getElementById("btn-cancel-app");
  if (closeModalBtn) closeModalBtn.onclick = closeForm;
  if (btnCancelApp) btnCancelApp.onclick = closeForm;

  // Bind APK file picker to auto-populate URL and size
  const apkFilePicker = document.getElementById("apk-file-picker");
  const appDownloadUrl = document.getElementById("app-download-url");
  const appApkSize = document.getElementById("app-apk-size");

  if (apkFilePicker && appDownloadUrl && appApkSize) {
    apkFilePicker.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        appDownloadUrl.value = `assets/apks/${file.name}`;
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
        appApkSize.value = sizeInMb;
        showToast(`Auto-selected file and calculated size: ${sizeInMb}`, "success");
      }
    };
  }

  // Bind Icon file picker to auto-populate URL
  const iconFilePicker = document.getElementById("icon-file-picker");
  const appIcon = document.getElementById("app-icon");

  if (iconFilePicker && appIcon) {
    iconFilePicker.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const appId = document.getElementById("app-id").value.trim().toLowerCase() || "default";
        appIcon.value = `assets/images/${appId}/${file.name}`;
        showToast(`Selected icon file: ${file.name}`, "success");
      }
    };
  }

  // Bind Batch screenshot picker to auto-populate multiple rows
  if (batchScreenshotPicker) {
    batchScreenshotPicker.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const appId = document.getElementById("app-id").value.trim().toLowerCase() || "default";
        // Clear first row if it is empty and is the only element
        const firstInput = screenshotsContainer.querySelector(".screenshot-path-input");
        if (firstInput && firstInput.value === "" && screenshotsContainer.children.length === 1) {
          screenshotsContainer.innerHTML = "";
        }
        files.forEach(file => {
          addScreenshotInputRow(screenshotsContainer, `assets/images/${appId}/${file.name}`);
        });
        showToast(`Batch added ${files.length} screenshots.`, "success");
      }
    };
  }

  // Bind dynamic add buttons
  if (btnAddFeature) btnAddFeature.onclick = () => addStringInputRow(featuresContainer, "");
  if (btnAddScreenshotBlank) btnAddScreenshotBlank.onclick = () => addScreenshotInputRow(screenshotsContainer, "");
  if (btnAddChangelog) btnAddChangelog.onclick = () => addChangelogSection(changelogContainer);

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
        changelog
      };

      onSubmitCallback(appObject);
    };
  }
}
