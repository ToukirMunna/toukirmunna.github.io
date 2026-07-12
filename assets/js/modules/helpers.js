/**
 * Utility Helpers Module - Toukir Ahmed Portfolio Admin
 */

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

/**
 * Returns a human-readable relative time string from an ISO timestamp.
 * e.g. "2 minutes ago", "Just now", "3 hours ago"
 */
function formatRelativeTime(isoString) {
  if (!isoString) return "Never";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 10) return "Just now";
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function showToast(message, type = "success") {
  const toastNotification = document.getElementById("toast-notification");
  const toastMessage = document.getElementById("toast-message");
  
  if (!toastNotification || !toastMessage) return;
  
  toastMessage.textContent = message;
  toastNotification.className = `admin-toast toast-${type} active`;
  
  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  
  window.toastTimeout = setTimeout(() => {
    toastNotification.classList.remove("active");
  }, 4000);
}
