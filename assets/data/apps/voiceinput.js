/**
 * Toukir Studio — App Data: Voice Input via Whisper
 * Category: Productivity
 * Version: 1.0.0
 */

export const voiceinput = {
  "id": "voiceinput",
  "name": "Voice Input via Whisper",
  "tagline": "100% Offline Speech-to-Text IME Powered by On-Device Whisper",
  "shortDescription": "A system-wide keyboard input method running high-accuracy OpenAI Whisper models entirely offline on your phone.",
  "fullDescription": "Voice Input via Whisper brings private, serverless voice dictation to any Android text field. Powered by an optimized on-device whisper.cpp neural engine, audio never leaves your phone's memory. Enjoy instant, accurate speech-to-text without cloud subscriptions, bandwidth latency, or privacy leaks.",
  "icon": "assets/images/voiceinput/voiceinput_icon.webp",
  "banner": "",
  "screenshots": [],
  "features": [
    "Embedded lightweight Whisper GGML model performing real-time speech-to-text on mobile hardware",
    "Registered system Input Method Service (IME) allowing voice typing across any third-party application",
    "Complete data confidentiality: zero audio recordings or text transcripts transmitted to external servers",
    "Intelligent punctuation insertion, auto-capitalization, and customizable text expansion macros",
    "Minimalist mic overlay widget with haptic recording feedback and immediate keyboard switching"
  ],
  "version": "1.0.0",
  "apkSize": "2.6 MB",
  "lastUpdated": "August 10, 2026",
  "downloadUrl": "assets/apks/Voice Input v1.0.0.apk",
  "githubUrl": "",
  "category": "Productivity",
  "architecture": "Kotlin 2.0 • Whisper AI Engine • AudioRecord • Jetpack Compose",
  "compatibility": "Android 10+ (API 29+)",
  "storage": "100% Offline • In-Memory Audio Inference",
  "changelog": [
    {
      "version": "1.0.0",
      "date": "August 10, 2026",
      "notes": [
        "Production release candidate compiled with Golden Stack standard",
        "Optimized for Android 10+ (API 29+) with 100% offline private storage"
      ]
    }
  ],
  "featured": true,
  "hidden": false
};

export default voiceinput;
