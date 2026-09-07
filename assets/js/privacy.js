/**
 * Privacy Policy Page Script
 * Dynamically loads terms based on app selected, or shows a general suite policy.
 */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const appId = params.get("id");
  
  const titleEl = document.getElementById("privacy-app-title");
  const lastUpdatedEl = document.getElementById("privacy-updated-date");
  const contentEl = document.getElementById("privacy-content");
  
  if (!contentEl) return;
  
  let appName = "Our Apps";
  let lastUpdated = "July 04, 2026";
  let isSpecificApp = false;
  
  // Find app if parameter is provided
  if (appId && window.appsData) {
    const app = window.appsData.find(item => item.id.toLowerCase() === appId.toLowerCase());
    if (app) {
      appName = app.name;
      lastUpdated = app.lastUpdated;
      isSpecificApp = true;
    }
  }
  
  // Populate general headers
  if (titleEl) {
    titleEl.textContent = isSpecificApp ? `${appName} Privacy Policy` : "General Privacy Policy";
  }
  if (lastUpdatedEl) {
    lastUpdatedEl.textContent = lastUpdated;
  }
  
  // Render privacy policy text
  contentEl.innerHTML = `
    <div class="privacy-markdown reveal active">
      <p>This privacy policy governs your use of the software application <strong>${appName}</strong> ("Application") for mobile devices that was developed by <strong>Toukir Ahmed (Toukir Studio)</strong>. The official home of our applications and services is <a href="https://toukir.pro.bd/" style="color:var(--accent-primary);font-weight:600;">toukir.pro.bd</a>.</p>
      
      <h2>1. User Provided Information & Data Isolation</h2>
      <p>Our applications are designed with an offline-first, privacy-by-design architecture. The Application obtains the information you provide when you download and use features. Most applications in our portfolio do not require user registration or accounts. All user-created data (notes, tallies, counters, budgets, and personal configurations) is stored directly on your device inside private sandboxed storage.</p>
      <p>If you contact us directly for support or feedback, we collect your email address and any message information you voluntarily provide solely for the purpose of resolving your inquiry.</p>
      
      <h2>2. Automatically Collected Information</h2>
      <p>The Application does not track your personal identity across third-party apps or websites. Basic diagnostic information (such as operating system version, device model, or crash reports provided through Google Play Core services) may be processed strictly to identify bugs and ensure stability on your device version.</p>
      
      ${isSpecificApp ? `
      <h2>3. System Permissions Requested by ${appName}</h2>
      <p>This Application requests only minimal, necessary system permissions to execute its core offline or utility functions:</p>
      <ul>
        <li><strong>Local Storage Read/Write:</strong> Required to save user preferences, local databases, and cached configurations locally on device without external transmission.</li>
        <li><strong>Network State & Access:</strong> Used exclusively to check internet availability for opt-in sync or web-based companion features.</li>
        <li><strong>Notifications:</strong> Opt-in only, used strictly for user-scheduled alarms, countdowns, or daily habit reminders.</li>
      </ul>
      ` : ''}

      <h2>4. Real-Time Location Information</h2>
      <p>This Application does not collect, monitor, or track precise real-time location data of your mobile device.</p>

      <h2>5. Third-Party Access & Google Cloud Compliance</h2>
      <p>We do not sell, trade, or rent your personal information to third parties. We do not integrate intrusive ad tracking SDKs. Any integration with Google Cloud APIs or Google Play Services adheres strictly to the Google API Services User Data Policy, including Limited Use requirements.</p>

      <h2>6. Security & Data Retention</h2>
      <p>We implement industry-standard procedural, electronic, and physical safeguards to protect local device data. Since data is stored locally in sandboxed application containers, uninstalling the Application cleanly removes all locally stored data from your device.</p>

      <h2>7. Changes & Policy Updates</h2>
      <p>This Privacy Policy may be updated periodically to reflect changes in legal requirements or application enhancements. Any revisions will be published here at <a href="https://toukir.pro.bd/privacy.html" style="color:var(--accent-primary);font-weight:600;">toukir.pro.bd/privacy.html</a> with an updated revision date.</p>

      <h2>8. Developer Contact Information</h2>
      <p>If you have any questions regarding this Privacy Policy, your personal data, or developer compliance inquiries for <strong>Toukir Studio</strong>, please reach out directly:</p>
      <p>
        <strong>Developer:</strong> Toukir Ahmed<br>
        <strong>Official Studio:</strong> Toukir Studio (<a href="https://toukir.pro.bd" style="color:var(--accent-primary);">https://toukir.pro.bd</a>)<br>
        <strong>Support Email:</strong> <a href="mailto:toukirahmhedmunna@gmail.com" style="font-weight:600;color:var(--accent-primary);">toukirahmhedmunna@gmail.com</a>
      </p>
    </div>
  `;
});
