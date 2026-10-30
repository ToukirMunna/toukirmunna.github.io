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
  let lastUpdated = "October 30, 2026";
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

      <h2>5. Google API Services, Google Drive Scopes & Limited Use Policy</h2>
      <p>Certain applications in the Toukir Studio portfolio offer optional, user-initiated cloud backup, sync, and restore capabilities powered by Google Cloud APIs and Google Drive. When you choose to connect your Google Account, the Application requests only the minimal scopes necessary to fulfill user-requested features:</p>
      <ul>
        <li><strong>Google Drive App Data (<code>.../auth/drive.appdata</code>):</strong> Allows the Application to create, read, and update its own private configuration and backup data in a dedicated, hidden application folder in your Google Drive. Other apps cannot access this space, and our apps cannot access any other files in your Drive.</li>
        <li><strong>Google Drive File-Specific Access (<code>.../auth/drive.file</code>):</strong> Used specifically by document tools (such as our PDF reader/library manager) to create a dedicated backup folder in your Google Drive and upload or restore user-selected documents and backups. The Application can only access, modify, or delete files and folders that were explicitly created or opened by the Application itself; it has no access to any other files or folders in your Google Drive.</li>
      </ul>
      <p><strong>Limited Use Requirements Compliance:</strong><br>
      Toukir Studio's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);font-weight:600;text-decoration:underline;">Google API Services User Data Policy</a>, including the Limited Use requirements:</p>
      <ul>
        <li>We only use access to Google user data to provide or improve user-facing features that are prominent in the requesting application's user interface (e.g., user-triggered backup and restore).</li>
        <li>We do <strong>not</strong> transfer or share Google user data with any third parties unless necessary to comply with applicable laws or as part of a merger/acquisition with user consent.</li>
        <li>We do <strong>not</strong> use or transfer Google user data for serving advertisements, including retargeting, personalized, or interest-based advertising.</li>
        <li>We do <strong>not</strong> use or transfer Google user data to train generalized artificial intelligence (AI) and/or machine learning (ML) models.</li>
        <li>We do <strong>not</strong> allow humans to read your Google user data unless you have given explicit affirmative agreement for troubleshooting, or if required for security investigations or legal compliance.</li>
      </ul>
      <p><strong>Revocation & Data Deletion:</strong><br>
      You can disconnect Google Drive access at any time directly within the Application's settings or via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);font-weight:600;">Google Account Third-Party Permissions</a> page. You can delete backed-up data directly from the app or by removing the corresponding backup folder in your Google Drive.</p>

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
