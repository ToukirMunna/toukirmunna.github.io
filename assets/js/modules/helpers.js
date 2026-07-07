/**
 * Utility Helpers Module - Blue Pixel Admin
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
