/**
 * Admin Panel Controller - Blue Pixel Studio
 * Handles authentication, state management, dynamic forms, exports, and GitHub integration.
 */
document.addEventListener("DOMContentLoaded", () => {
  // --- STATE ---
  let currentApps = [];
  let editingAppId = null;

  // GitHub credentials cache
  const GITHUB_CACHE_KEY = "admin_github_config";
  const AUTH_CACHE_KEY = "admin_authenticated";
  const DEFAULT_PASSCODE = "admin123";

  // --- DOM ELEMENTS ---
  const lockScreen = document.getElementById("lock-screen");
  const passcodeField = document.getElementById("passcode-input");
  const unlockBtn = document.getElementById("unlock-btn");
  const loginError = document.getElementById("login-error");

  const appsTableBody = document.getElementById("apps-table-body");
  const emptyState = document.getElementById("empty-state");
  const statsTotalApps = document.getElementById("stat-total-apps");
  const statsCategories = document.getElementById("stat-categories");
  const statsLastSaved = document.getElementById("stat-last-saved");
  const statsSync = document.getElementById("stat-sync");

  const appModal = document.getElementById("app-modal");
  const modalTitle = document.getElementById("modal-title");
  const appForm = document.getElementById("app-form");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const btnCancelApp = document.getElementById("btn-cancel-app");
  const btnAddApp = document.getElementById("btn-add-app");

  // Dynamic input container references
  const featuresContainer = document.getElementById("features-container");
  const btnAddFeature = document.getElementById("btn-add-feature");
  const screenshotsContainer = document.getElementById("screenshots-container");
  const btnAddScreenshot = document.getElementById("btn-add-screenshot");
  const changelogContainer = document.getElementById("changelog-container");
  const btnAddChangelog = document.getElementById("btn-add-changelog");

  // Exporter panel
  const exportModal = document.getElementById("export-modal");
  const closeExportModalBtn = document.getElementById("close-export-modal-btn");
  const exportCodeTextarea = document.getElementById("export-code-textarea");
  const btnCopyExport = document.getElementById("btn-copy-export");
  const btnDownloadExport = document.getElementById("btn-download-export");
  const btnTriggerExport = document.getElementById("btn-trigger-export");

  // Local actions
  const btnSaveLocal = document.getElementById("btn-save-local");
  const btnResetLocal = document.getElementById("btn-reset-local");
  const btnLogout = document.getElementById("btn-logout");

  // GitHub Sync panel
  const ghUsernameInput = document.getElementById("gh-username");
  const ghRepoInput = document.getElementById("gh-repo");
  const ghBranchInput = document.getElementById("gh-branch");
  const ghTokenInput = document.getElementById("gh-token");
  const ghMessageInput = document.getElementById("gh-message");
  const btnGhPublish = document.getElementById("btn-gh-publish");
  const ghSyncLogs = document.getElementById("gh-sync-logs");
  const ghSyncDot = document.getElementById("gh-sync-dot");

  // Toast
  const toastNotification = document.getElementById("toast-notification");
  const toastMessage = document.getElementById("toast-message");

  // Local File Sync selectors
  const localFileStatus = document.getElementById("local-file-status");
  const btnLinkFile = document.getElementById("btn-link-file");
  const btnUnlinkFile = document.getElementById("btn-unlink-file");
  const btnWriteFile = document.getElementById("btn-write-file");

  // --- AUTHENTICATION ---
  function checkAuth() {
    if (sessionStorage.getItem(AUTH_CACHE_KEY) === "true") {
      lockScreen.classList.add("hidden");
      initializeDashboard();
    } else {
      lockScreen.classList.remove("hidden");
      passcodeField.focus();
    }
  }

  unlockBtn.addEventListener("click", performUnlock);
  passcodeField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performUnlock();
  });

  function performUnlock() {
    const entered = passcodeField.value.trim();
    // Accept standard passcode OR a 40-char GitHub PAT as bypass
    if (entered === DEFAULT_PASSCODE || (entered.startsWith("ghp_") && entered.length >= 30)) {
      sessionStorage.setItem(AUTH_CACHE_KEY, "true");
      if (entered.startsWith("ghp_")) {
        ghTokenInput.value = entered;
        saveGithubConfigToCache();
      }
      lockScreen.classList.add("hidden");
      showToast("Access Granted. Welcome to Blue Pixel Dashboard!", "success");
      initializeDashboard();
    } else {
      loginError.style.display = "block";
      passcodeField.value = "";
      passcodeField.focus();
      // Shake animation
      const lockCard = document.querySelector(".lock-card");
      lockCard.style.animation = "none";
      setTimeout(() => {
        lockCard.style.animation = "shake 0.4s ease-in-out";
      }, 10);
    }
  }

  btnLogout.addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_CACHE_KEY);
    showToast("Logged out successfully.", "info");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  });

  // --- INITIALIZATION ---
  function initializeDashboard() {
    // Clone window.appsData so we don't edit original until saved
    currentApps = JSON.parse(JSON.stringify(window.appsData || []));
    loadGithubConfigFromCache();
    renderDashboard();
    checkLinkedFile();
  }

  // --- DASHBOARD RENDERER ---
  function renderDashboard() {
    // Update stats metrics
    statsTotalApps.textContent = currentApps.length;
    
    const categories = new Set(currentApps.map(app => app.category));
    statsCategories.textContent = categories.size;

    const isModified = localStorage.getItem("appsData") !== null;
    statsLastSaved.textContent = isModified ? "Local Override Active" : "Default Config Loaded";
    statsLastSaved.style.color = isModified ? "var(--accent-primary)" : "var(--text-muted)";

    // Update empty state
    if (currentApps.length === 0) {
      appsTableBody.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";

    // Populate apps table
    appsTableBody.innerHTML = "";
    currentApps.forEach((app) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="table-app-meta">
            <img src="${app.icon}" alt="${app.name} Icon" class="table-app-icon" onerror="this.src='assets/images/logo.png'">
            <div>
              <div class="table-app-name">${app.name}</div>
              <div class="table-app-tagline">${app.tagline}</div>
            </div>
          </div>
        </td>
        <td><span class="category-pill">${app.category}</span></td>
        <td>v${app.version}</td>
        <td>${app.lastUpdated}</td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon btn-edit" title="Edit App" data-id="${app.id}">
              <svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button class="btn-icon btn-clone" title="Clone App" data-id="${app.id}">
              <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="btn-icon btn-delete" title="Delete App" data-id="${app.id}">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </td>
      `;

      // Event Listeners for actions
      tr.querySelector(".btn-edit").addEventListener("click", () => openEditModal(app.id));
      tr.querySelector(".btn-clone").addEventListener("click", () => cloneApp(app.id));
      tr.querySelector(".btn-delete").addEventListener("click", () => deleteApp(app.id));

      appsTableBody.appendChild(tr);
    });
  }

  // --- DYNAMIC LIST INPUT BUILDERS ---
  
  // Add single text input field helper
  function addStringInputRow(container, value = "") {
    const div = document.createElement("div");
    div.className = "dynamic-list-item";
    div.innerHTML = `
      <input type="text" class="admin-input list-input-item" value="${escapeHtml(value)}" required>
      <button type="button" class="btn-icon btn-delete btn-remove-item" title="Remove">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    div.querySelector(".btn-remove-item").addEventListener("click", () => {
      div.remove();
    });
    container.appendChild(div);
  }

  // Add changelog version section helper
  function addChangelogSection(container, entry = { version: "", date: "", notes: [] }) {
    const div = document.createElement("div");
    div.className = "changelog-editor-item";
    
    // Unique ID for notes list binding
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
          <!-- Changelog notes loaded here -->
        </div>
        <button type="button" class="btn-add-item btn-add-changelog-note" style="margin-top:0.5rem">
          <svg style="width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Release Note
        </button>
      </div>
    `;

    const notesContainer = div.querySelector(`#${notesListId}`);
    const btnAddNote = div.querySelector(".btn-add-changelog-note");

    // Populate notes
    if (entry.notes && entry.notes.length > 0) {
      entry.notes.forEach(note => addStringInputRow(notesContainer, note));
    } else {
      addStringInputRow(notesContainer, ""); // add empty row by default
    }

    btnAddNote.addEventListener("click", () => addStringInputRow(notesContainer, ""));
    div.querySelector(".btn-remove-changelog").addEventListener("click", () => {
      div.remove();
    });

    container.appendChild(div);
  }

  // Binding top-level add list items buttons
  btnAddFeature.addEventListener("click", () => addStringInputRow(featuresContainer, ""));
  btnAddScreenshot.addEventListener("click", () => addStringInputRow(screenshotsContainer, ""));
  btnAddChangelog.addEventListener("click", () => addChangelogSection(changelogContainer));

  // --- MODAL CONTROLS ---
  function openAddModal() {
    editingAppId = null;
    modalTitle.textContent = "Add New Application";
    appForm.reset();
    
    // Clear list boxes
    featuresContainer.innerHTML = "";
    screenshotsContainer.innerHTML = "";
    changelogContainer.innerHTML = "";
    
    // Add default single inputs
    addStringInputRow(featuresContainer, "");
    addStringInputRow(screenshotsContainer, "");
    addChangelogSection(changelogContainer, { version: "1.0.0", date: getCurrentFormattedDate(), notes: ["Initial release of the application."] });

    // Set auto ID slug listener
    const nameInput = document.getElementById("app-name");
    const idInput = document.getElementById("app-id");
    idInput.readOnly = false;
    
    nameInput.oninput = () => {
      if (!editingAppId) {
        idInput.value = nameInput.value.toLowerCase().trim().replace(/[^a-z0-9\-]/g, "-").replace(/-+/g, "-");
      }
    };

    appModal.classList.add("active");
  }

  function openEditModal(appId) {
    const app = currentApps.find(a => a.id === appId);
    if (!app) return;

    editingAppId = appId;
    modalTitle.textContent = `Edit Application: ${app.name}`;
    appForm.reset();

    // Disable editing ID slug to avoid routing issues (or keep editable, but better read-only for editing)
    const idInput = document.getElementById("app-id");
    idInput.value = app.id;
    idInput.readOnly = true;
    
    document.getElementById("app-name").oninput = null; // remove dynamic slug binding

    // Populate standard values
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

    // Clear dynamic containers
    featuresContainer.innerHTML = "";
    screenshotsContainer.innerHTML = "";
    changelogContainer.innerHTML = "";

    // Load arrays
    if (app.features && app.features.length > 0) {
      app.features.forEach(val => addStringInputRow(featuresContainer, val));
    } else {
      addStringInputRow(featuresContainer);
    }

    if (app.screenshots && app.screenshots.length > 0) {
      app.screenshots.forEach(val => addStringInputRow(screenshotsContainer, val));
    } else {
      addStringInputRow(screenshotsContainer);
    }

    if (app.changelog && app.changelog.length > 0) {
      app.changelog.forEach(entry => addChangelogSection(changelogContainer, entry));
    } else {
      addChangelogSection(changelogContainer);
    }

    appModal.classList.add("active");
  }

  function closeModal() {
    appModal.classList.remove("active");
  }

  closeModalBtn.addEventListener("click", closeModal);
  btnCancelApp.addEventListener("click", closeModal);
  btnAddApp.addEventListener("click", openAddModal);

  // --- SAVE APP SUBMIT LOGIC ---
  appForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("app-id").value.trim().toLowerCase();
    
    // Check duplication for new items
    if (!editingAppId && currentApps.some(a => a.id === id)) {
      showToast(`Error: An app with ID slug '${id}' already exists!`, "error");
      return;
    }

    // Extract dynamic features list
    const features = Array.from(featuresContainer.querySelectorAll(".list-input-item"))
      .map(input => input.value.trim())
      .filter(val => val !== "");

    // Extract dynamic screenshots list
    const screenshots = Array.from(screenshotsContainer.querySelectorAll(".list-input-item"))
      .map(input => input.value.trim())
      .filter(val => val !== "");

    // Extract dynamic changelogs list
    const changelogItems = Array.from(changelogContainer.querySelectorAll(".changelog-editor-item"));
    const changelog = changelogItems.map(item => {
      const version = item.querySelector(".changelog-ver").value.trim();
      const date = item.querySelector(".changelog-date").value.trim();
      const notes = Array.from(item.querySelectorAll(".list-input-item"))
        .map(input => input.value.trim())
        .filter(val => val !== "");
      
      return { version, date, notes };
    }).filter(entry => entry.version !== "");

    // Build the app data object
    const appObject = {
      id,
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

    if (editingAppId) {
      // Modify
      const idx = currentApps.findIndex(a => a.id === editingAppId);
      if (idx !== -1) {
        currentApps[idx] = appObject;
        showToast(`App '${appObject.name}' updated in working memory.`, "success");
      }
    } else {
      // Add
      currentApps.push(appObject);
      showToast(`App '${appObject.name}' added to working memory.`, "success");
    }

    closeModal();
    renderDashboard();
  });

  // --- QUICK ACTIONS: CLONE & DELETE ---
  function cloneApp(appId) {
    const source = currentApps.find(a => a.id === appId);
    if (!source) return;

    const cloned = JSON.parse(JSON.stringify(source));
    const uniqueId = `${cloned.id}-clone`;
    
    // Ensure slug doesn't exist
    let count = 1;
    let finalId = uniqueId;
    while (currentApps.some(a => a.id === finalId)) {
      finalId = `${uniqueId}-${count}`;
      count++;
    }

    cloned.id = finalId;
    cloned.name = `${cloned.name} (Copy)`;
    
    currentApps.push(cloned);
    showToast(`Cloned '${source.name}' successfully.`, "success");
    renderDashboard();
  }

  function deleteApp(appId) {
    const app = currentApps.find(a => a.id === appId);
    if (!app) return;

    if (confirm(`Are you sure you want to delete '${app.name}'? This will remove it from working memory.`)) {
      currentApps = currentApps.filter(a => a.id !== appId);
      showToast(`Removed '${app.name}' from working memory.`, "info");
      renderDashboard();
    }
  }

  // --- LOCAL PERSISTENCE AND RESETS ---
  btnSaveLocal.addEventListener("click", () => {
    try {
      localStorage.setItem("appsData", JSON.stringify(currentApps));
      // Re-initialize window global so it's fresh if navigated
      window.appsData = currentApps;
      showToast("Saved to browser memory! Go to website pages to test the live preview.", "success");
      renderDashboard();
    } catch (e) {
      console.error(e);
      showToast("Failed to save changes to browser memory.", "error");
    }
  });

  btnResetLocal.addEventListener("click", () => {
    if (confirm("Reset local overrides? This will discard all unpublished edits in this browser and load the original code files.")) {
      localStorage.removeItem("appsData");
      window.location.reload();
    }
  });

  // --- CONFIG CODE EXPORTER ---
  function compileJavascriptFile(data) {
    const formattedJson = JSON.stringify(data, null, 2);
    
    return `/**
 * App Portfolio Data - Blue Pixel Studio
 * Easily extend your portfolio by adding new app objects to this array.
 */
const defaultAppsData = ${formattedJson};

// Expose resolved apps data (checking local storage overrides first)
let appsData = defaultAppsData;
try {
  const storedApps = localStorage.getItem("appsData");
  if (storedApps) {
    appsData = JSON.parse(storedApps);
  }
} catch (e) {
  console.error("Error loading appsData from localStorage:", e);
}

// Export if module environment, otherwise expose to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = appsData;
} else {
  window.appsData = appsData;
}
`;
  }

  btnTriggerExport.addEventListener("click", () => {
    const fileContent = compileJavascriptFile(currentApps);
    exportCodeTextarea.value = fileContent;
    exportModal.classList.add("active");
  });

  closeExportModalBtn.addEventListener("click", () => {
    exportModal.classList.remove("active");
  });

  btnCopyExport.addEventListener("click", () => {
    exportCodeTextarea.select();
    document.execCommand("copy");
    showToast("Configuration JavaScript copied to clipboard!", "success");
  });

  btnDownloadExport.addEventListener("click", () => {
    const code = exportCodeTextarea.value;
    const blob = new Blob([code], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "apps-data.js";
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
    
    showToast("Downloaded 'apps-data.js' config file.", "success");
  });

  // --- GITHUB COMMIT & PUBLISH INTEGRATION ---
  
  // Cache form configurations
  function saveGithubConfigToCache() {
    const config = {
      username: ghUsernameInput.value.trim(),
      repo: ghRepoInput.value.trim(),
      branch: ghBranchInput.value.trim(),
      token: ghTokenInput.value.trim() // Save token temporarily in user's browser storage for quick reuse
    };
    localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(config));
  }

  function loadGithubConfigFromCache() {
    try {
      const cached = localStorage.getItem(GITHUB_CACHE_KEY);
      if (cached) {
        const config = JSON.parse(cached);
        ghUsernameInput.value = config.username || "";
        ghRepoInput.value = config.repo || "";
        ghBranchInput.value = config.branch || "";
        ghTokenInput.value = config.token || "";
      }
    } catch (e) {
      console.warn("Failed to load GitHub credentials cache:", e);
    }
  }

  // Logger helper in terminal simulation window
  function logSync(message, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.className = `sync-log-line ${type}`;
    line.textContent = `[${timestamp}] ${message}`;
    ghSyncLogs.appendChild(line);
    ghSyncLogs.scrollTop = ghSyncLogs.scrollHeight;
  }

  btnGhPublish.addEventListener("click", async () => {
    const username = ghUsernameInput.value.trim();
    const repo = ghRepoInput.value.trim();
    const branch = ghBranchInput.value.trim() || "main";
    const token = ghTokenInput.value.trim();
    const commitMessage = ghMessageInput.value.trim() || "Update app portfolio configuration";

    if (!username || !repo || !token) {
      showToast("Please fill in Username, Repository, and Access Token fields.", "error");
      return;
    }

    // Save configurations
    saveGithubConfigToCache();

    // Prepare indicator & logs
    ghSyncLogs.innerHTML = "";
    ghSyncDot.className = "sync-dot online";
    statsSync.textContent = "Synchronizing...";
    statsSync.style.color = "var(--accent-primary)";
    btnGhPublish.disabled = true;
    btnGhPublish.textContent = "Publishing...";

    logSync("Starting GitHub publishing pipeline...", "info");
    logSync(`Repository target: ${username}/${repo} on branch: ${branch}`, "info");

    const filePath = "assets/js/apps-data.js";
    const apiGetUrl = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}?ref=${branch}`;

    try {
      // 1. Get file SHA from GitHub repository
      logSync(`Fetching current file metadata for '${filePath}'...`, "info");
      
      const getResponse = await fetch(apiGetUrl, {
        method: "GET",
        headers: {
          "Authorization": `token ${token}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (!getResponse.ok && getResponse.status !== 404) {
        throw new Error(`GitHub metadata fetch failed with status: ${getResponse.status}`);
      }

      let fileSha = null;
      if (getResponse.ok) {
        const fileData = await getResponse.json();
        fileSha = fileData.sha;
        logSync(`Found existing file. SHA: ${fileSha}`, "info");
      } else {
        logSync(`No existing config file found at '${filePath}'. Initiating fresh create...`, "info");
      }

      // 2. Compile current apps list to JavaScript file structure
      logSync("Compiling data modifications into JavaScript format...", "info");
      const compiledContent = compileJavascriptFile(currentApps);

      // 3. Base64-encode the content
      // Use standard btoa with encodeURIComponent to support UTF-8 characters safely
      logSync("Converting file layout to Base64 payload...", "info");
      const base64Content = btoa(unescape(encodeURIComponent(compiledContent)));

      // 4. Send PUT request to write file in Github repo
      logSync("Committing changes to GitHub Pages repository...", "info");
      const payload = {
        message: commitMessage,
        content: base64Content,
        branch
      };
      if (fileSha) {
        payload.sha = fileSha;
      }

      const putUrl = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;
      const putResponse = await fetch(putUrl, {
        method: "PUT",
        headers: {
          "Authorization": `token ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify(payload)
      });

      if (!putResponse.ok) {
        const errBody = await putResponse.json().catch(() => ({}));
        throw new Error(errBody.message || `API Commit failed. Status: ${putResponse.status}`);
      }

      const putResult = await putResponse.json();
      const commitHash = putResult.commit.sha.substring(0, 7);

      logSync(`Success! Config file written. Commit: ${commitHash}`, "success");
      logSync("Changes pushed to GitHub. GitHub Pages build will trigger automatically (takes 1-3 mins).", "success");
      
      ghSyncDot.className = "sync-dot online";
      statsSync.textContent = `Pushed (${commitHash})`;
      statsSync.style.color = "var(--success)";
      
      showToast("Config successfully published to GitHub repository!", "success");
      ghMessageInput.value = ""; // clear message input
    } catch (err) {
      console.error(err);
      logSync(`Error: ${err.message}`, "error");
      ghSyncDot.className = "sync-dot error";
      statsSync.textContent = "Sync Failed";
      statsSync.style.color = "#ef4444";
      showToast(`GitHub Publish Failed: ${err.message}`, "error");
    } finally {
      btnGhPublish.disabled = false;
      btnGhPublish.textContent = "Commit & Publish Changes";
    }
  });

  // --- LOCAL FILE SYNC (GITHUB DESKTOP WORKFLOW) ---
  const DB_NAME = "BluePixelAdminDB";
  const STORE_NAME = "FileHandles";
  const KEY_NAME = "appsDataFileHandle";

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function saveFileHandle(handle) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(handle, KEY_NAME);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getFileHandle() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(KEY_NAME);
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function removeFileHandle() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(KEY_NAME);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function checkLinkedFile() {
    if (!('showOpenFilePicker' in window)) {
      localFileStatus.innerHTML = `<span class="sync-dot error"></span> Not Supported in this Browser`;
      btnLinkFile.disabled = true;
      return;
    }
    try {
      const handle = await getFileHandle();
      if (handle) {
        updateFileSyncUI(handle);
      } else {
        updateFileSyncUI(null);
      }
    } catch (e) {
      console.error("Failed to load file handle from DB", e);
      updateFileSyncUI(null);
    }
  }

  function updateFileSyncUI(handle) {
    if (handle) {
      localFileStatus.innerHTML = `<span class="sync-dot online"></span> Linked: <strong style="color:var(--text-primary)">${escapeHtml(handle.name)}</strong>`;
      btnUnlinkFile.style.display = "inline-flex";
      btnLinkFile.textContent = "Change File";
      btnWriteFile.disabled = false;
    } else {
      localFileStatus.innerHTML = `<span class="sync-dot"></span> Not Linked`;
      btnUnlinkFile.style.display = "none";
      btnLinkFile.textContent = "Link apps-data.js File";
      btnWriteFile.disabled = true;
    }
  }

  async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    return false;
  }

  async function writeLocalFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }

  btnLinkFile.addEventListener("click", async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JavaScript Config files (apps-data.js)',
            accept: {
              'text/javascript': ['.js'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false
      });
      
      if (handle) {
        await saveFileHandle(handle);
        updateFileSyncUI(handle);
        showToast("Successfully linked to local repository file!", "success");
      }
    } catch (err) {
      console.error(err);
      if (err.name !== "AbortError") {
        showToast(`Failed to link file: ${err.message}`, "error");
      }
    }
  });

  btnUnlinkFile.addEventListener("click", async () => {
    if (confirm("Unlink local config file?")) {
      await removeFileHandle();
      updateFileSyncUI(null);
      showToast("Local file unlinked.", "info");
    }
  });

  btnWriteFile.addEventListener("click", async () => {
    try {
      const handle = await getFileHandle();
      if (!handle) {
        showToast("Please link your local apps-data.js file first.", "error");
        return;
      }
      
      btnWriteFile.disabled = true;
      btnWriteFile.textContent = "Saving to file...";

      const hasPermission = await verifyPermission(handle, true);
      if (!hasPermission) {
        throw new Error("Write permission denied. Please grant file write permission in the browser pop-up.");
      }

      const compiledContent = compileJavascriptFile(currentApps);
      await writeLocalFile(handle, compiledContent);

      showToast("Local file updated directly! Check GitHub Desktop to commit & push.", "success");
    } catch (err) {
      console.error(err);
      showToast(`Failed to write local file: ${err.message}`, "error");
    } finally {
      btnWriteFile.disabled = false;
      btnWriteFile.textContent = "Save directly to local file";
    }
  });

  // --- GENERAL HELPER FUNCTIONS ---
  function escapeHtml(text) {
    if (typeof text !== "string") return text;
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getCurrentFormattedDate() {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date().toLocaleDateString('en-US', options);
  }

  function showToast(message, type = "success") {
    toastMessage.textContent = message;
    toastNotification.className = `admin-toast toast-${type} active`;
    
    // Clear auto-hide timeout
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    
    window.toastTimeout = setTimeout(() => {
      toastNotification.classList.remove("active");
    }, 4000);
  }

  // Launch login flow
  checkAuth();
});
