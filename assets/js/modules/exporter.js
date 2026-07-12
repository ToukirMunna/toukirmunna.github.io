/**
 * Configuration Exporter Module - Toukir Ahmed Portfolio Admin
 * Compiles the in-memory apps array into a deployable apps-data.js file string.
 */

function compileJavascriptFile(data) {
  const formattedJson = JSON.stringify(data, null, 2);
  
  return `/**
 * App Portfolio Data - Toukir Ahmed
 * Easily extend your portfolio by adding new app objects to this array.
 * Fields: id, name, tagline, shortDescription, fullDescription, icon,
 *         screenshots, features, version, apkSize, lastUpdated,
 *         downloadUrl, githubUrl, category, changelog,
 *         featured (bool), hidden (bool)
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
