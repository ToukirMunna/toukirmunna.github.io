/**
 * Configuration Exporter Module - Blue Pixel Admin
 */

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
