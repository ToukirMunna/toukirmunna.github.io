/**
 * Configuration Exporter Module - Toukir Ahmed Portfolio Admin
 * Compiles the in-memory apps array into a deployable apps-data.js file string.
 */

function compileJavascriptFile(data) {
  const formattedJson = JSON.stringify(data, null, 2);
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ".");
  const versionStr = `${dateStr}.v${now.getTime()}`;
  
  return `/**
 * App Portfolio Data - Toukir Studio (Toukir Ahmed)
 * Authoritative Catalog for toukir.pro.bd / toukirmunna.github.io
 */
const defaultAppsData = ${formattedJson};

// Initialize localStorage or update to authoritative catalog
(function () {
  const CATALOG_VERSION = "${versionStr}";
  try {
    const currentVersion = localStorage.getItem("appsData_catalog_version");
    const stored = localStorage.getItem("appsData");
    
    let needsRefresh = !stored || currentVersion !== CATALOG_VERSION;
    if (!needsRefresh && stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length !== defaultAppsData.length) {
          needsRefresh = true;
        }
      } catch (_) {
        needsRefresh = true;
      }
    }

    if (needsRefresh) {
      localStorage.setItem("appsData", JSON.stringify(defaultAppsData));
      localStorage.setItem("appsData_catalog_version", CATALOG_VERSION);
      window.appsData = defaultAppsData;
    } else {
      window.appsData = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error loading appsData from localStorage:", e);
    window.appsData = defaultAppsData;
  }
})();
`;
}
