/**
 * Toukir Studio — Core Theme Controller
 * Manages Dark/Light mode, localStorage persistence, and brand asset synchronization.
 */

// Immediate execution to prevent flash of unstyled theme
(function initTheme() {
  const savedTheme = localStorage.getItem("theme") || 
                     (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
})();

export function updateBrandAssets(theme) {
  const favicon = document.getElementById("favicon");
  const navLogo = document.getElementById("nav-logo");
  const footerLogo = document.querySelector(".footer-logo");
  
  const isDark = theme === "dark";
  if (favicon) favicon.href = isDark ? "assets/images/dark_favicon.png" : "assets/images/light_favicon.png";
  if (navLogo) navLogo.src = isDark ? "assets/images/light_logod.png" : "assets/images/light_logo.png";
  if (footerLogo) footerLogo.src = isDark ? "assets/images/light_logod.png" : "assets/images/light_logo.png";
}

export function setupThemeToggle() {
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
}

// Window global fallback
if (typeof window !== "undefined") {
  window.updateBrandAssets = updateBrandAssets;
  window.setupThemeToggle = setupThemeToggle;
}
