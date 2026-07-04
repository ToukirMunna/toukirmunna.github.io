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
      <p>This privacy policy governs your use of the software application <strong>${appName}</strong> ("Application") for mobile devices that was created by <strong>Blue Pixel Studio</strong>.</p>
      
      <h2>1. User Provided Information</h2>
      <p>The Application obtains the information you provide when you download and register the Application. Registration with us is optional. However, please keep in mind that you may not be able to use some of the features offered by the Application unless you register.</p>
      <p>When you register with us and use the Application, you generally provide:</p>
      <ul>
        <li>your name, email address, user name, password and other registration information;</li>
        <li>transaction-related information, such as when you make purchases, respond to any offers, or download or use applications from us;</li>
        <li>information you provide us when you contact us for help;</li>
        <li>information you enter into our system when using the Application, such as contact information and project management information.</li>
      </ul>
      
      <h2>2. Automatically Collected Information</h2>
      <p>In addition, the Application may collect certain information automatically, including, but not limited to, the type of mobile device you use, your mobile devices unique device ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browsers you use, and information about the way you use the Application.</p>
      
      ${isSpecificApp ? `
      <h2>3. Special Permissions Requested by ${appName}</h2>
      <p>This Application utilizes specific system permissions to deliver core features. Here is why they are needed:</p>
      <ul>
        <li><strong>Network State & Access:</strong> Used to check network availability and synchronize data when online.</li>
        <li><strong>Local Storage Read/Write:</strong> Required to cache settings, store application configurations, and enable off-line functionality securely.</li>
        <li><strong>Notifications:</strong> Used only when opt-in enabled to alert you of app events, timers, or alerts.</li>
      </ul>
      ` : ''}

      <h2>4. Does the Application collect precise real time location information of the device?</h2>
      <p>This Application does not collect precise information about the location of your mobile device unless explicitly requested by a core feature (for example, hyperlocal weather readings or location-based shop reporting) and approved by your prompt consent.</p>

      <h2>5. Do third parties see and/or have access to information obtained by the Application?</h2>
      <p>Only aggregated, anonymized data is periodically transmitted to external services to help us improve the Application and our service. We will share your information with third parties only in the ways that are described in this privacy statement.</p>

      <h2>6. Security</h2>
      <p>We are concerned about safeguarding the confidentiality of your information. We provide physical, electronic, and procedural safeguards to protect information we process and maintain.</p>

      <h2>7. Changes</h2>
      <p>This Privacy Policy may be updated from time to time for any reason. We will notify you of any changes to our Privacy Policy by posting the new Privacy Policy here and updating the date at the top of this document.</p>

      <h2>8. Contact Us</h2>
      <p>If you have any questions regarding privacy while using the Application, or have questions about our practices, please contact us via email at <a href="mailto:support@bluepixel.com" style="font-weight:600;color:var(--accent-primary);">support@bluepixel.com</a>.</p>
    </div>
  `;
});
