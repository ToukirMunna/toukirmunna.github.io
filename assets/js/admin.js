/**
 * Admin Panel Main Coordinator - Toukir Ahmed Portfolio
 * Coordinates state, events, and sub-module operations.
 */

// Master State
let currentApps = [];

// Action Router for row-level clicks
const actionRouter = {
  onEdit: (appId) => {
    const app = currentApps.find(a => a.id === appId);
    if (app) openEditForm(app);
  },
  onClone: (appId) => {
    const source = currentApps.find(a => a.id === appId);
    if (!source) return;

    const cloned = JSON.parse(JSON.stringify(source));
    const uniqueId = `${cloned.id}-clone`;
    
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
    refreshUI();
  },
  onDelete: (appId) => {
    const app = currentApps.find(a => a.id === appId);
    if (!app) return;

    if (confirm(`Are you sure you want to delete '${app.name}'? This will remove it from working memory.`)) {
      currentApps = currentApps.filter(a => a.id !== appId);
      showToast(`Removed '${app.name}' from working memory.`, "info");
      refreshUI();
    }
  },
  onMoveUp: (index) => {
    if (index <= 0) return;
    const temp = currentApps[index];
    currentApps[index] = currentApps[index - 1];
    currentApps[index - 1] = temp;
    showToast(`Moved '${temp.name}' up in layout order.`, "info");
    refreshUI();
  },
  onMoveDown: (index) => {
    if (index >= currentApps.length - 1) return;
    const temp = currentApps[index];
    currentApps[index] = currentApps[index + 1];
    currentApps[index + 1] = temp;
    showToast(`Moved '${temp.name}' down in layout order.`, "info");
    refreshUI();
  },
  onToggleHidden: (appId) => {
    const app = currentApps.find(a => a.id === appId);
    if (!app) return;
    app.hidden = !app.hidden;
    showToast(`'${app.name}' is now ${app.hidden ? 'hidden from public' : 'visible'}.`, "info");
    refreshUI();
  },
  onReorder: (fromIndex, toIndex) => {
    const item = currentApps.splice(fromIndex, 1)[0];
    currentApps.splice(toIndex, 0, item);
    showToast(`Reordered '${item.name}'.`, "info");
    refreshUI();
  }
};

function refreshUI() {
  renderDashboard(currentApps, actionRouter);
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  checkAuth(() => {
    currentApps = JSON.parse(JSON.stringify(window.appsData || []));
    refreshUI();
    checkLinkedFile();
  });

  // 1. Setup Form submissions
  initFormHandlers((appObject) => {
    const editingId = getEditingAppId();
    if (editingId) {
      const idx = currentApps.findIndex(a => a.id === editingId);
      if (idx !== -1) {
        currentApps[idx] = appObject;
        showToast(`App '${appObject.name}' updated in working memory.`, "success");
      }
    } else {
      if (currentApps.some(a => a.id === appObject.id)) {
        showToast(`Error: An app with ID slug '${appObject.id}' already exists!`, "error");
        return;
      }
      currentApps.push(appObject);
      showToast(`App '${appObject.name}' added to working memory.`, "success");
    }
    closeForm();
    refreshUI();
  });

  // 2. Setup Global Button Click Listeners
  const btnSaveLocal = document.getElementById("btn-save-local");
  if (btnSaveLocal) {
    btnSaveLocal.onclick = () => {
      localStorage.setItem("appsData", JSON.stringify(currentApps));
      window.appsData = currentApps;
      showToast("Saved to browser memory! Go to website pages to test the live preview.", "success");
      refreshUI();
    };
  }

  const btnResetLocal = document.getElementById("btn-reset-local");
  if (btnResetLocal) {
    btnResetLocal.onclick = () => {
      if (confirm("Reset local overrides? This will discard all unpublished edits in this browser and load the original code files.")) {
        localStorage.removeItem("appsData");
        window.location.reload();
      }
    };
  }

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.onclick = logout;
  }

  const btnAddApp = document.getElementById("btn-add-app");
  if (btnAddApp) {
    btnAddApp.onclick = openAddForm;
  }

  // 3. Exporter listeners
  const exportModal = document.getElementById("export-modal");
  const exportCodeTextarea = document.getElementById("export-code-textarea");
  const btnTriggerExport = document.getElementById("btn-trigger-export");

  if (btnTriggerExport && exportModal && exportCodeTextarea) {
    btnTriggerExport.onclick = () => {
      exportCodeTextarea.value = compileJavascriptFile(currentApps);
      exportModal.classList.add("active");
      setLastExportTime();
      refreshUI();
    };
  }

  const closeExportModalBtn = document.getElementById("close-export-modal-btn");
  if (closeExportModalBtn && exportModal) {
    closeExportModalBtn.onclick = () => exportModal.classList.remove("active");
  }

  const btnCopyExport = document.getElementById("btn-copy-export");
  if (btnCopyExport && exportCodeTextarea) {
    btnCopyExport.onclick = () => {
      exportCodeTextarea.select();
      document.execCommand("copy");
      showToast("Configuration JavaScript copied to clipboard!", "success");
    };
  }

  const btnDownloadExport = document.getElementById("btn-download-export");
  if (btnDownloadExport && exportCodeTextarea) {
    btnDownloadExport.onclick = () => {
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
      setLastExportTime();
      refreshUI();
      showToast("Downloaded 'apps-data.js' config file.", "success");
    };
  }

  // 4. File link listeners
  const btnLinkFile = document.getElementById("btn-link-file");
  if (btnLinkFile) {
    btnLinkFile.onclick = async () => {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'JavaScript Config files (apps-data.js)',
              accept: { 'text/javascript': ['.js'] },
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
    };
  }

  const btnUnlinkFile = document.getElementById("btn-unlink-file");
  if (btnUnlinkFile) {
    btnUnlinkFile.onclick = async () => {
      if (confirm("Unlink local config file?")) {
        await removeFileHandle();
        updateFileSyncUI(null);
        showToast("Local file unlinked.", "info");
      }
    };
  }

  const btnWriteFile = document.getElementById("btn-write-file");
  if (btnWriteFile) {
    btnWriteFile.onclick = async () => {
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
        setLastExportTime();
        refreshUI();
        showToast("Local file updated directly! Check GitHub Desktop to commit & push.", "success");
      } catch (err) {
        console.error(err);
        showToast(`Failed to write local file: ${err.message}`, "error");
      } finally {
        btnWriteFile.disabled = false;
        btnWriteFile.textContent = "Save directly to local file";
      }
    };
  }

  // --- THEME TOGGLING ---
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

  // Update initial assets
  const initialTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  updateBrandAssets(initialTheme);

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
});
