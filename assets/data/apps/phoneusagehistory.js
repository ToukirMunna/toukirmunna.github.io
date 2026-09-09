/**
 * Toukir Studio — App Data: Phone Usage History
 * Category: Productivity
 * Version: 1.0.0
 */

export const phoneusagehistory = {
  "id": "phoneusagehistory",
  "name": "Phone Usage History",
  "tagline": "High-Resolution App Telemetry & Screen Time Analytics",
  "shortDescription": "An uncompromised digital wellbeing monitor providing deep hourly application usage and unlock telemetry.",
  "fullDescription": "Phone Usage History provides transparent, unvarnished insight into how you interact with your phone throughout the day. Interrogating Android's native UsageStatsManager locally, it breaks down screen-on time, app launch frequencies, and notification surges into high-resolution hourly heatmaps.",
  "icon": "assets/images/phoneusagehistory/phoneusagehistory_icon.webp",
  "banner": "",
  "screenshots": [],
  "features": [
    "Comprehensive breakdown of daily and weekly screen time categorized by application and time of day",
    "Hourly heatmaps pinpointing periods of compulsive phone checking and notification triggers",
    "Historical comparison charts tracking your digital detox progress over 30, 60, and 90-day intervals",
    "Privacy-first local computation: usage telemetry is calculated on-device without third-party analytics",
    "Interactive home screen widget displaying current daily screen time against your custom budget"
  ],
  "version": "1.0.0",
  "apkSize": "3.3 MB",
  "lastUpdated": "August 25, 2026",
  "downloadUrl": "assets/apks/Phone Usage History v1.0.0.apk",
  "githubUrl": "",
  "category": "Productivity",
  "architecture": "Kotlin 2.0 • UsageStatsManager • WorkManager • Room SQLite",
  "compatibility": "Android 10+ (API 29+)",
  "storage": "100% Offline • Local Telemetry SQLite Database",
  "changelog": [
    {
      "version": "1.0.0",
      "date": "August 25, 2026",
      "notes": [
        "Production release candidate compiled with Golden Stack standard",
        "Optimized for Android 10+ (API 29+) with 100% offline private storage"
      ]
    }
  ],
  "featured": false,
  "hidden": false
};

export default phoneusagehistory;
