/**
 * IndexedDB & LocalStorage Database Module - Toukir Ahmed Portfolio Admin
 *
 * Handles:
 * - File System Access API handle persistence (IndexedDB)
 * - App data draft auto-save (localStorage)
 * - Last export timestamp (localStorage)
 */

// --- IndexedDB: File Handle Persistence ---
const DB_NAME = "PortfolioAdminDB";
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
  const localFileStatus = document.getElementById("local-file-status");
  const btnLinkFile = document.getElementById("btn-link-file");
  
  if (!localFileStatus || !btnLinkFile) return;

  if (!('showOpenFilePicker' in window)) {
    localFileStatus.innerHTML = `<span class="sync-dot error"></span> Not Supported in this Browser`;
    btnLinkFile.disabled = true;
    return;
  }
  
  try {
    const handle = await getFileHandle();
    updateFileSyncUI(handle);
  } catch (e) {
    console.error("Failed to load file handle from DB", e);
    updateFileSyncUI(null);
  }
}

function updateFileSyncUI(handle) {
  const localFileStatus = document.getElementById("local-file-status");
  const btnLinkFile = document.getElementById("btn-link-file");
  const btnUnlinkFile = document.getElementById("btn-unlink-file");
  const btnWriteFile = document.getElementById("btn-write-file");

  if (!localFileStatus || !btnLinkFile || !btnUnlinkFile || !btnWriteFile) return;

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
  if (readWrite) options.mode = 'readwrite';
  if ((await fileHandle.queryPermission(options)) === 'granted') return true;
  if ((await fileHandle.requestPermission(options)) === 'granted') return true;
  return false;
}

async function writeLocalFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

// --- LocalStorage: Export Timestamp ---
const EXPORT_TIMESTAMP_KEY = "adminLastExported";

function setLastExportTime() {
  localStorage.setItem(EXPORT_TIMESTAMP_KEY, new Date().toISOString());
}

function getLastExportTime() {
  return localStorage.getItem(EXPORT_TIMESTAMP_KEY);
}

// --- LocalStorage: Form Draft Auto-save ---
const DRAFT_KEY = "adminFormDraft";

function saveDraft(formData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  } catch (e) {
    console.warn("Could not save form draft:", e);
  }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

function hasDraft() {
  return localStorage.getItem(DRAFT_KEY) !== null;
}
