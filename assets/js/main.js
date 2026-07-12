// Immediate theme initialization to prevent theme flashes
const savedTheme = localStorage.getItem("theme") || 
                   (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.removeAttribute("data-theme");
}

// Featured and hidden flags are now stored on each app object (featured: true, hidden: true).
// The admin panel controls these — no hardcoded IDs needed here.

document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle click handler
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // 1. Navigation Sticky Behavior
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      
      // Toggle body scroll lock
      if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // 4. Populate App Grid — supports 'featured' (homepage) and 'all' (projects page) modes
  const appsGrid = document.querySelector(".apps-grid");
  if (appsGrid && window.appsData) {
    const mode = appsGrid.dataset.mode || "all"; // data-mode="featured" or "all"
    
    let appsToRender = window.appsData;
    if (mode === "featured") {
      // Homepage: show only featured, non-hidden apps (in array order)
      appsToRender = window.appsData.filter(app => app.featured && !app.hidden);
    } else {
      // Projects page: show all non-hidden apps
      appsToRender = window.appsData.filter(app => !app.hidden);
    }

    appsGrid.innerHTML = ""; // Clear loader/placeholders

    appsToRender.forEach((app, index) => {
      const card = document.createElement("div");
      card.className = "glass-card app-card reveal";
      
      // Delay animation sequence slightly for staggered effect
      card.style.transitionDelay = `${index * 0.08}s`;
      
      card.innerHTML = `
        <div class="app-card-header">
          <img src="${app.icon}" alt="${app.name} Icon" class="app-card-icon" onerror="this.src='assets/images/logo.png'">
          <div>
            <h3 class="app-card-title">${app.name}</h3>
            <div><span class="category-pill">${app.category}</span></div>
          </div>
        </div>
        <p class="app-card-desc">${app.shortDescription}</p>
        <div class="app-card-footer">
          <span class="app-card-meta">v${app.version}</span>
          <a href="app.html?id=${app.id}" class="btn-link">
            View Details 
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      `;
      
      appsGrid.appendChild(card);
    });
    
    // Trigger observer again to include new cards
    const newReveals = appsGrid.querySelectorAll(".reveal");
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    });
    
    newReveals.forEach(el => cardObserver.observe(el));
  }
});
