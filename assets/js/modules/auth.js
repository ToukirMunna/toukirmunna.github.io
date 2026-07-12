/**
 * Authentication Gate Module - Toukir Ahmed Portfolio Admin
 */

const AUTH_CACHE_KEY = "admin_authenticated";
const DEFAULT_PASSCODE = "admin123";

function checkAuth(onUnlockCallback) {
  const lockScreen = document.getElementById("lock-screen");
  const passcodeField = document.getElementById("passcode-input");
  const unlockBtn = document.getElementById("unlock-btn");
  
  if (!lockScreen || !passcodeField || !unlockBtn) return;

  if (sessionStorage.getItem(AUTH_CACHE_KEY) === "true") {
    lockScreen.classList.add("hidden");
    onUnlockCallback();
  } else {
    lockScreen.classList.remove("hidden");
    passcodeField.focus();
    
    // Bind listeners
    unlockBtn.onclick = () => performUnlock(lockScreen, passcodeField, onUnlockCallback);
    passcodeField.onkeydown = (e) => {
      if (e.key === "Enter") performUnlock(lockScreen, passcodeField, onUnlockCallback);
    };
  }
}

function performUnlock(lockScreen, passcodeField, onUnlockCallback) {
  const loginError = document.getElementById("login-error");
  const entered = passcodeField.value.trim();
  
  if (entered === DEFAULT_PASSCODE) {
    sessionStorage.setItem(AUTH_CACHE_KEY, "true");
    lockScreen.classList.add("hidden");
    showToast("Access granted. Welcome to your Portfolio Dashboard!", "success");
    onUnlockCallback();
  } else {
    if (loginError) loginError.style.display = "block";
    passcodeField.value = "";
    passcodeField.focus();
    
    // Shake card
    const lockCard = document.querySelector(".lock-card");
    if (lockCard) {
      lockCard.style.animation = "none";
      setTimeout(() => {
        lockCard.style.animation = "shake 0.4s ease-in-out";
      }, 10);
    }
  }
}

function logout() {
  sessionStorage.removeItem(AUTH_CACHE_KEY);
  showToast("Logged out successfully.", "info");
  setTimeout(() => {
    window.location.reload();
  }, 800);
}
