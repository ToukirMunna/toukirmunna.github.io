/**
 * Admin Form Module — Dynamic List Helpers
 * Handles add/remove rows for features, screenshots, and changelog entries.
 */

import { escapeHtml } from "../helpers.js";

export function addStringInputRow(container, value = "") {
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

export function addScreenshotInputRow(container, value = "") {
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
      const folder = (document.getElementById("app-id")?.value.trim() || "app").toLowerCase();
      textInput.value = `assets/images/${folder}/${file.name}`;
      textInput.dispatchEvent(new Event("input"));
    }
  };

  div.querySelector(".btn-remove-item").addEventListener("click", () => div.remove());
  container.appendChild(div);
}

export function addChangelogRow(container, version = "", date = "", notes = [""]) {
  const div = document.createElement("div");
  div.className = "changelog-form-item";
  div.innerHTML = `
    <div class="changelog-header-inputs">
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label" style="font-size:0.75rem">Version</label>
        <input type="text" class="admin-input cl-version" value="${escapeHtml(version)}" placeholder="e.g. 2.1.0" required>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label" style="font-size:0.75rem">Release Date</label>
        <input type="text" class="admin-input cl-date" value="${escapeHtml(date)}" placeholder="e.g. September 2026" required>
      </div>
      <button type="button" class="btn-icon btn-delete btn-remove-changelog" title="Remove Release" style="margin-top:auto">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    </div>
    <div class="form-group" style="margin-top:0.75rem;margin-bottom:0">
      <label class="form-label" style="font-size:0.75rem">Change Notes (one bullet per line)</label>
      <textarea class="admin-input cl-notes" rows="3" placeholder="What changed in this version?">${notes.map(escapeHtml).join("\n")}</textarea>
    </div>
  `;
  div.querySelector(".btn-remove-changelog").addEventListener("click", () => div.remove());
  container.appendChild(div);
}
