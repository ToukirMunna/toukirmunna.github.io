/**
 * Toukir Studio — App Data: Encrypta
 * Category: Security
 * Version: 1.0.0
 */

export const encrypta = {
  "id": "encrypta",
  "name": "Encrypta",
  "tagline": "Hardware-Backed AES-256 File & Secret Encryption Vault",
  "shortDescription": "Encrypt sensitive documents, personal photos, and confidential text using military-grade AES-256-GCM cryptography.",
  "fullDescription": "Encrypta is an unyielding cryptographic vault engineered for privacy purists. Utilizing the Android Keystore to generate and isolate non-exportable hardware-backed keys, Encrypta encrypts any file or text note using authenticated AES-256-GCM. Unencrypted data never touches external storage.",
  "icon": "assets/images/encrypta/encrypta_icon.webp",
  "banner": "",
  "screenshots": [],
  "features": [
    "Authenticated AES-256-GCM encryption with cryptographic keys sealed inside Android Hardware Keystore",
    "Universal file encrypter protecting PDFs, images, archives, and spreadsheets with custom passphrases",
    "Secure text shredder allowing encrypted messaging and confidential note storage",
    "Zero-knowledge architecture: no telemetry, no master keys, and zero telemetry endpoints",
    "Biometric authentication gateway guarding access to the encryption and decryption workbench"
  ],
  "version": "1.0.0",
  "apkSize": "~12 MB (In Dev)",
  "lastUpdated": "Active Development",
  "downloadUrl": "",
  "githubUrl": "",
  "category": "Security",
  "architecture": "Kotlin 2.0 • Jetpack Compose • AES-256-GCM • Android Keystore",
  "compatibility": "Android 10+ (API 29+)",
  "storage": "100% Offline • Hardware Keystore Sealed Storage",
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

export default encrypta;
