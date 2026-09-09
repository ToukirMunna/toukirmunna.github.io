/**
 * Admin Form Module — Draft Manager
 * Persists uncommitted modal changes to localStorage to prevent data loss.
 */

const DRAFT_KEY = "admin_app_form_draft";

export function saveDraft(getPayloadFn, editingAppId) {
  try {
    const payload = getPayloadFn();
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      appId: editingAppId,
      timestamp: Date.now(),
      data: payload
    }));
  } catch (e) {
    // Quota exceeded or private browsing
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Drafts older than 7 days expire
    if (Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) {
      clearDraft();
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}
