/**
 * Toukir Studio — App Data: PulseDeck
 * Category: Productivity
 * Version: 1.0.0
 */

export const pulsedeck = {
  "id": "pulsedeck",
  "name": "PulseDeck",
  "tagline": "Real-Time System Metrics & Multiplatform Hardware Telemetry",
  "shortDescription": "A cross-platform system monitor displaying real-time CPU frequencies, thermal loads, and memory velocity.",
  "fullDescription": "PulseDeck is a lightweight hardware telemetry dashboard developed using Kotlin Multiplatform. Monitoring device thermal throttling, core frequencies, RAM allocation, and battery discharge rates, PulseDeck provides hardware enthusiasts and developers with clean, real-time diagnostic performance metrics.",
  "icon": "assets/images/pulsedeck/pulsedeck_icon.webp",
  "banner": "",
  "screenshots": [],
  "features": [
    "Real-time per-core CPU frequency meters with thermal throttling and temperature alert graphs",
    "Detailed RAM utilization velocity distinguishing active applications, cached pages, and zRAM swaps",
    "Battery discharge telemetry estimating current draw in milliamperes and time-to-empty metrics",
    "Shared Kotlin Multiplatform (KMP) core logic ensuring consistent telemetry calculation across devices",
    "Low-overhead monitoring service consuming less than 1% CPU utilization while actively polling"
  ],
  "version": "1.0.0",
  "apkSize": "~12 MB (In Dev)",
  "lastUpdated": "Active Development",
  "downloadUrl": "",
  "githubUrl": "",
  "category": "Productivity",
  "architecture": "Kotlin Multiplatform (KMP) • Jetpack Compose • SQLite • Coroutines",
  "compatibility": "Android 10+ (API 29+)",
  "storage": "100% Offline • Local Hardware Telemetry",
  "changelog": [
    {
      "version": "1.0.0",
      "date": "Active Development",
      "notes": [
        "Active architectural development under Golden Stack (Kotlin 2.0 + Jetpack Compose)",
        "Release APK pipeline scheduled for upcoming release cycle"
      ]
    }
  ],
  "featured": false,
  "hidden": false
};

export default pulsedeck;
