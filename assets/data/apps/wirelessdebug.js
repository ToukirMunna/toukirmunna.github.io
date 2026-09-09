/**
 * Toukir Studio — App Data: Wireless Debug Tile
 * Category: Productivity
 * Version: 1.0.0
 */

export const wirelessdebug = {
  "id": "wirelessdebug",
  "name": "Wireless Debug Tile",
  "tagline": "One-Tap Android Quick Settings Tile for Wireless ADB Pairing",
  "shortDescription": "Toggle and display your wireless ADB connection IP and port directly from your Android Quick Settings shade.",
  "fullDescription": "Wireless Debug Tile eliminates the frustration of digging through Android Developer Options to find your Wi-Fi debugging port. Adding a dedicated Quick Settings tile to your notification shade, it reveals your device's current IP address and ADB port with a single swipe, facilitating instantaneous development connectivity.",
  "icon": "assets/images/wirelessdebug/wirelessdebug_icon.webp",
  "banner": "",
  "screenshots": [],
  "features": [
    "Quick Settings TileService integration displaying live IP address and ADB port right in notification shade",
    "1-tap copy of the complete 'adb connect <ip>:<port>' command string directly to system clipboard",
    "Automatic Wi-Fi network change listener updating IP addresses dynamically without manual app opens",
    "Sub-1MB ultra-lean APK footprint with zero background battery drain when tile is idle",
    "Dedicated developer utility with no unnecessary runtime permissions or telemetry trackers"
  ],
  "version": "1.0.0",
  "apkSize": "~12 MB (In Dev)",
  "lastUpdated": "Active Development",
  "downloadUrl": "",
  "githubUrl": "",
  "category": "Productivity",
  "architecture": "Kotlin 2.0 • Quick Settings TileService • Shell ADB Bridge",
  "compatibility": "Android 11+ (API 30+)",
  "storage": "100% Offline • System Quick Settings Tile",
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

export default wirelessdebug;
