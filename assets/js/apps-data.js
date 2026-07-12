/**
 * App Portfolio Data - Toukir Ahmed
 * Easily extend your portfolio by adding new app objects to this array.
 * Fields: id, name, tagline, shortDescription, fullDescription, icon,
 *         screenshots, features, version, apkSize, lastUpdated,
 *         downloadUrl, githubUrl, category, changelog,
 *         featured (bool), hidden (bool)
 */
const defaultAppsData = [
  {
    "id": "tasbeeh",
    "name": "Tasbeeh",
    "tagline": "Elegant Islamic Tasbeeh & Adhkar for Muslim",
    "shortDescription": "A minimal, elegant Tasbeeh counter and Adhkar companion designed for daily spiritual mindfulness.",
    "fullDescription": "Tasbeeh is a beautifully simple digital counter and Dhikr tracking application. Designed to encourage spiritual reflection, the app offers custom counter presets, audio and haptic feedback, a collection of authentic daily supplications, and historical tracking to help you visualize your consistency. Designed with a peaceful AMOLED-friendly layout that minimizes battery drain.",
    "icon": "assets/images/tasbeeh/tasbeeh_icon.webp",
    "banner": "assets/images/tasbeeh/tasbeeh_banner.webp",
    "screenshots": [
      "assets/images/tasbeeh/Tasbeeh_01.webp",
      "assets/images/tasbeeh/Tasbeeh_02.webp",
      "assets/images/tasbeeh/Tasbeeh_03.webp",
      "assets/images/tasbeeh/Tasbeeh_04.webp",
      "assets/images/tasbeeh/Tasbeeh_05.webp",
      "assets/images/tasbeeh/Tasbeeh_06.webp",
      "assets/images/tasbeeh/Tasbeeh_07.webp"
    ],
    "features": [
      "Custom counter limits with haptic patterns and pleasant audio cues",
      "Comprehensive library of daily Adhkar and Duas with translations and audio",
      "Streak tracker and historical calendar logs to build daily habits",
      "Customizable themes including a dark slate mode for evening readings",
      "Responsive widget layout for easy home screen access"
    ],
    "version": "1.2.0",
    "apkSize": "9.9 MB",
    "lastUpdated": "June 15, 2026",
    "downloadUrl": "assets/apks/Tasbeeh v20260707.apk",
    "githubUrl": "",
    "category": "Lifestyle",
    "changelog": [
      {
        "version": "1.2.0",
        "date": "June 15, 2026",
        "notes": [
          "Added streak tracker and historical calendar dashboard",
          "Calibrated haptic feedback engine patterns for a softer tap feel",
          "Fully optimized AMOLED black theme to reduce battery draw"
        ]
      },
      {
        "version": "1.0.0",
        "date": "April 20, 2026",
        "notes": [
          "Initial release of the Tasbeeh digital counter",
          "Integrated standard library of authentic daily supplications"
        ]
      }
    ],
    "featured": true,
    "hidden": false
  },
  {
    "id": "littlemind",
    "name": "LittleMind",
    "tagline": "Playful Kids Learning & Games",
    "shortDescription": "An interactive, child-friendly educational dashboard featuring spelling games, basic math, and logic puzzles.",
    "fullDescription": "LittleMind is a safe, colorful, and engaging learning ecosystem built specifically for early childhood development. Combining gamified spelling challenges, drawing boards, and basic logic quizzes, it nurtures curiosity without distracting advertisements. Engineered with large touch targets and child-friendly visuals.",
    "icon": "assets/images/littlemind/littlemind_icon.webp",
    "banner": "assets/images/littlemind/littlemind_banner.webp",
    "screenshots": [
      "assets/images/littlemind/littlemind_01.webp",
      "assets/images/littlemind/littlemind_02.webp",
      "assets/images/littlemind/littlemind_03.webp",
      "assets/images/littlemind/littlemind_04.webp",
      "assets/images/littlemind/littlemind_05.webp",
      "assets/images/littlemind/littlemind_06.webp",
      "assets/images/littlemind/littlemind_07.webp",
      "assets/images/littlemind/LittleMind_08.webp",
      "assets/images/littlemind/LittleMind_09.webp",
      "assets/images/littlemind/LittleMind_10.webp",
      "assets/images/littlemind/LittleMind_11.webp",
      "assets/images/littlemind/LittleMind_12.webp"
    ],
    "features": [
      "Over 50 interactive learning levels across spelling, counting, and shapes",
      "Full voice-guided cues and encouraging reward sound effects",
      "100% ad-free, secure sandbox setting to protect kids",
      "Comprehensive parent dashboard to monitor completion progress",
      "Support for up to three child profiles with custom avatars"
    ],
    "version": "2.0.1",
    "apkSize": "42.0 MB",
    "lastUpdated": "July 02, 2026",
    "downloadUrl": "assets/apks/LittleMind v20260105.apk",
    "githubUrl": "",
    "category": "Education",
    "changelog": [
      {
        "version": "2.0.1",
        "date": "July 02, 2026",
        "notes": [
          "Improved parent zone security with advanced pin validation",
          "Enhanced touch sensitivity calibration on drawing boards"
        ]
      },
      {
        "version": "1.5.0",
        "date": "May 14, 2026",
        "notes": [
          "Added spelling challenge modes with full vocal voiceovers",
          "Enabled multi-child avatar profile saving options"
        ]
      }
    ],
    "featured": true,
    "hidden": false
  },
  {
    "id": "expense",
    "name": "Expense Tracker Pro",
    "tagline": "Daily Finance & Smart Budgeting",
    "shortDescription": "A clean financial manager providing automated category budgets, analytics, and visual reports.",
    "fullDescription": "Expense Tracker takes the stress out of personal wealth management. Easily log transactions under smart categories, establish recurring monthly budgets, and analyze spending habits with interactive vector charts. Designed for high efficiency and speed, ensuring you can track transactions in seconds.",
    "icon": "assets/images/expense/ExpenseTracker_icon.png",
    "banner": "assets/images/expense/ExpenseTracker_banner.webp",
    "screenshots": [
      "assets/images/expense/ExpenseTracker_01.webp",
      "assets/images/expense/ExpenseTracker_02.webp",
      "assets/images/expense/ExpenseTracker_03.webp",
      "assets/images/expense/ExpenseTracker_04.webp",
      "assets/images/expense/ExpenseTracker_05.webp",
      "assets/images/expense/ExpenseTracker_06.webp",
      "assets/images/expense/ExpenseTracker_07.webp"
    ],
    "features": [
      "Quick transaction logging via persistent status notifications",
      "Elegant interactive SVG charts detailing monthly and category trends",
      "Dynamic monthly budgets with automated alerts as limits approach",
      "Secure data exporting supporting CSV and spreadsheet formats",
      "Zero network requirements - data is saved securely in a local database"
    ],
    "version": "1.8.3",
    "apkSize": "3.4 MB",
    "lastUpdated": "May 29, 2026",
    "downloadUrl": "assets/apks/Expense Tracker v20260307.apk",
    "githubUrl": "https://github.com/example/expense-tracker-android",
    "category": "Finance",
    "changelog": [
      {
        "version": "1.8.3",
        "date": "May 29, 2026",
        "notes": [
          "Optimized SVG canvas rendering speeds for entry graphs",
          "Added push notification triggers when budget limits reach 80%",
          "Added local CSV backup storage import mechanisms"
        ]
      },
      {
        "version": "1.0.0",
        "date": "January 15, 2026",
        "notes": [
          "Initial release featuring category expenses and local SQLite logs"
        ]
      }
    ],
    "featured": false,
    "hidden": false
  },
  {
    "id": "eesypos",
    "name": "EesyPOS",
    "tagline": "Small Business Point of Sale",
    "shortDescription": "An advanced, offline Point of Sale solution detailing inventory systems, PDF invoices, and revenue reporting.",
    "fullDescription": "EesyPOS is a complete retail management system that turns any Android tablet or phone into a business register. Perform fast checkouts, scan barcodes with device cameras, manage item stocks, generate invoice PDFs, and analyze daily revenue logs locally. Perfect for small boutiques, kiosks, and retail cafes.",
    "icon": "assets/images/eesypos/easypos_icon.png",
    "banner": "assets/images/eesypos/EasyPOS_banner.png",
    "screenshots": [
      "assets/images/eesypos/EasyPOS_01.webp",
      "assets/images/eesypos/EasyPOS_02.webp",
      "assets/images/eesypos/EasyPOS_03.webp",
      "assets/images/eesypos/EasyPOS_04.webp",
      "assets/images/eesypos/EasyPOS_05.webp",
      "assets/images/eesypos/EasyPOS_06.webp",
      "assets/images/eesypos/EasyPOS_07.webp",
      "assets/images/eesypos/EasyPOS_08.webp",
      "assets/images/eesypos/EasyPOS_09.webp",
      "assets/images/eesypos/EasyPOS_10.webp",
      "assets/images/eesypos/EasyPOS_11.webp",
      "assets/images/eesypos/EasyPOS_12.webp"
    ],
    "features": [
      "Fast retail register checkout supporting custom discounts and tax rates",
      "Inventory tracking system with automatic low-stock notifications",
      "PDF invoice generation with thermal Bluetooth receipt printer support",
      "Sales reports detailing top-performing items and profit margins",
      "100% offline-first local SQLite database for maximum reliability"
    ],
    "version": "3.4.0",
    "apkSize": "4.3 MB",
    "lastUpdated": "June 29, 2026",
    "downloadUrl": "assets/apks/EasyPOS v20260707.apk",
    "githubUrl": "",
    "category": "Business",
    "changelog": [
      {
        "version": "3.4.0",
        "date": "June 29, 2026",
        "notes": [
          "Implemented native Bluetooth drivers for standard 58mm thermal printers",
          "Added inventory database bulk import via custom excel files",
          "Created tax structures templates for retail shop configurations"
        ]
      },
      {
        "version": "3.0.0",
        "date": "March 11, 2026",
        "notes": [
          "Refactored POS check-out screen into a layout designed for tablets",
          "Added real-time out of stock notifications engine"
        ]
      }
    ],
    "featured": false,
    "hidden": false
  },
  {
    "id": "kido",
    "name": "Kido Player",
    "tagline": "Safe Kids Video & Parental Control",
    "shortDescription": "A kid-safe media player featuring passcode parental suites, custom folder sandboxes, and input locks.",
    "fullDescription": "Kido Player gives parents peace of mind while their children stream video content. Inspired by child-focused streaming platforms, it offers a colorful kids interface alongside a passcode-protected parental suite. Whitelist specific video folders, lock screen inputs, and set timers to limit screen usage.",
    "icon": "assets/images/kido/kidoplayer_icon.png",
    "banner": "assets/images/kido/kido_banner.webp",
    "screenshots": [
      "assets/images/kido/KidoPlayer_01.webp",
      "assets/images/kido/KidoPlayer_02.webp",
      "assets/images/kido/KidoPlayer_03.webp",
      "assets/images/kido/KidoPlayer_04.webp",
      "assets/images/kido/KidoPlayer_05.webp",
      "assets/images/kido/KidoPlayer_06.webp"
    ],
    "features": [
      "Passcode-protected settings panel for managing folders and limits",
      "Total touch screen lock to prevent accidental app exits or taps",
      "Adjustable sleep timer that automatically pauses playback upon expiry",
      "Clean local media player engine supporting all popular formats",
      "Animated playful buttons and dynamic color profiles kids love"
    ],
    "version": "1.1.2",
    "apkSize": "14.9 MB",
    "lastUpdated": "June 10, 2026",
    "downloadUrl": "assets/apks/KidoPlayer v20260703.apk",
    "githubUrl": "",
    "category": "Entertainment",
    "changelog": [
      {
        "version": "1.1.2",
        "date": "June 10, 2026",
        "notes": [
          "Added adjustable sleep countdown timer settings",
          "Improved parent screen lock mechanisms on low-tier devices",
          "Fixed audio desynchronization bug when loading local MKV folders"
        ]
      },
      {
        "version": "1.0.0",
        "date": "March 05, 2026",
        "notes": [
          "Initial sandbox release featuring whitelist video folder scanning"
        ]
      }
    ],
    "featured": false,
    "hidden": false
  },
  {
    "id": "shopping",
    "name": "My Shopping List",
    "tagline": "Smart Grocery & Shopping Planner",
    "shortDescription": "A feature-rich grocery planner with live sharing, item pricing, and organized category lists.",
    "fullDescription": "My Shopping List is the easiest way to organize lists, plan grocery runs, and shop together. Create shareable lists that sync instantly, automatically group items by supermarket aisle, add budget calculations, and store customer loyalty cards. Optimized for speed and clarity in busy aisles.",
    "icon": "assets/images/shopping/shopping-icon.png",
    "banner": "",
    "screenshots": [
      "assets/images/shopping/shopping-screen1.png",
      "assets/images/shopping/shopping-screen2.png",
      "assets/images/shopping/shopping-screen3.png"
    ],
    "features": [
      "Real-time list synchronization with friends and family",
      "Smart category sorting that automatically groups items by aisle",
      "Loyalty card organizer to store barcoded customer cards",
      "Shopping budget calculator showing running cart totals",
      "Lightweight, offline-capable database that operates in poor signal areas"
    ],
    "version": "2.2.0",
    "apkSize": "9.5 MB",
    "lastUpdated": "July 01, 2026",
    "downloadUrl": "#download-shopping-apk",
    "githubUrl": "https://github.com/example/shopping-list-android",
    "category": "Productivity",
    "featured": false,
    "hidden": false,
    "changelog": [
      {
        "version": "2.2.0",
        "date": "July 01, 2026",
        "notes": [
          "Implemented cloud sync for real-time item tracking across users",
          "Created loyalty card barcode wallet organizer utility",
          "Added budget calculator display with preview values in shopping cart"
        ]
      },
      {
        "version": "2.0.0",
        "date": "May 02, 2026",
        "notes": [
          "Introduced automated aisle sorting categories algorithm"
        ]
      }
    ]
  },
  {
    "id": "my-diary",
    "name": "My Diary",
    "tagline": "Personal Journal & Secure Private Notes",
    "shortDescription": "A beautiful, secure diary app to write down your thoughts, memories, and daily reflections with fingerprint lock.",
    "fullDescription": "My Diary is your personal space to express yourself freely and securely. Write down thoughts, log daily moods, track habits, and preserve memories with attached photos. Features AES-256 encryption and biometric lock to keep your secrets private, customized writing fonts, and scheduled reminders so you never miss a day's entry.",
    "icon": "assets/images/my-diary/mydiay_icon.png",
    "banner": "assets/images/my-diary/mydiary_banner.webp",
    "screenshots": [
      "assets/images/my-diary/MyDiary_01.webp",
      "assets/images/my-diary/MyDiary_02.webp",
      "assets/images/my-diary/MyDiary_03.webp",
      "assets/images/my-diary/MyDiary_04.webp",
      "assets/images/my-diary/MyDiary_05.webp",
      "assets/images/my-diary/MyDiary_06.webp",
      "assets/images/my-diary/MyDiary_07.webp",
      "assets/images/my-diary/MyDiary_08.webp",
      "assets/images/my-diary/MyDiary_09.webp",
      "assets/images/my-diary/MyDiary_10.webp",
      "assets/images/my-diary/MyDiary_11.webp",
      "assets/images/my-diary/MyDiary_12.webp",
      "assets/images/my-diary/MyDiary_13.webp",
      "assets/images/my-diary/MyDiary_14.webp"
    ],
    "features": [
      "Biometric fingerprint security and custom PIN lock pattern",
      "Daily mood tracking calendar with emotional trend analytics",
      "Rich text editor with customizable fonts, backgrounds, and mood emojis",
      "Auto-backup integrations supporting secure local file exports",
      "Custom daily writing notification alarms"
    ],
    "version": "1.0.2",
    "apkSize": "14.7 MB",
    "lastUpdated": "May 03, 2026",
    "downloadUrl": "assets/apks/My Diary v20260503.apk",
    "githubUrl": "",
    "category": "Lifestyle",
    "changelog": [
      {
        "version": "1.0.2",
        "date": "May 03, 2026",
        "notes": [
          "Initial release featuring mood journal logs and biometric lock security"
        ]
      }
    ],
    "featured": true,
    "hidden": false
  },
  {
    "id": "screentime-launcher",
    "name": "ScreenTime Launcher",
    "tagline": "Minimalist App Launcher & Focus Companion",
    "shortDescription": "A minimalist home screen launcher designed to curb digital addiction, track screen limits, and promote focus.",
    "fullDescription": "ScreenTime Launcher replaces your default home screen with a clean, text-based minimalist layout that helps you stay focused. Define daily app usage limits, block distracting social media feeds, track usage trends, and embrace digital detox. Designed to reduce screen time and improve productivity through intentional phone usage.",
    "icon": "assets/images/screentime-launcher/screentime.png",
    "banner": "",
    "screenshots": [
      "assets/images/screentime-screen1.png",
      "assets/images/screentime-screen2.png",
      "assets/images/screentime-screen3.png"
    ],
    "features": [
      "Text-based minimalist layout to eliminate visual clutter",
      "App usage blocking guards with custom passcode locks",
      "Real-time screen usage trends and focus metrics dashboard",
      "Quick shortcut gestures for productive workflows",
      "AMOLED-friendly layout designed for low eye strain and battery usage"
    ],
    "version": "1.1.0",
    "apkSize": "14.7 MB",
    "lastUpdated": "July 01, 2026",
    "downloadUrl": "assets/apks/ScreenTIme Launcher v20260701.apk",
    "githubUrl": "",
    "category": "Productivity",
    "changelog": [
      {
        "version": "1.1.0",
        "date": "July 01, 2026",
        "notes": [
          "Initial release featuring minimalist layout and app usage limiting tools"
        ]
      }
    ],
    "featured": false,
    "hidden": true
  }
];

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
