// Immediate theme initialization to prevent theme flashes
const savedTheme = localStorage.getItem("theme") || 
                   (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.removeAttribute("data-theme");
}

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

  // 4. Populate App Grid on Home Page with Filtering
  const appsGrid = document.querySelector(".apps-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");

  function renderApps(filter = "all") {
    if (!appsGrid || !window.appsData) return;
    appsGrid.innerHTML = ""; // Clear loader/placeholders

    const filteredApps = filter === "all" 
      ? window.appsData 
      : window.appsData.filter(app => app.category.toLowerCase() === filter.toLowerCase());

    if (filteredApps.length === 0) {
      appsGrid.innerHTML = `<div class="loading-placeholder"><p>No applications found in this category.</p></div>`;
      return;
    }

    filteredApps.forEach((app, index) => {
      const card = document.createElement("div");
      card.className = "glass-card app-card reveal tilt-card";
      
      // Delay animation sequence slightly for staggered effect
      card.style.transitionDelay = `${index * 0.05}s`;
      
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
    const revealObserver = new IntersectionObserver((entries, observer) => {
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
    
    newReveals.forEach(el => revealObserver.observe(el));
    setupCardTilt();
  }

  // Setup click listeners for filter buttons
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderApps(btn.getAttribute("data-filter"));
      });
    });
  }

  // Initial render
  if (appsGrid) {
    renderApps("all");
  }

  // 3D Parallax Tilt Handler
  function setupCardTilt() {
    const tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
      
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  // 5. Hero Mockup Parallax Effect
  const heroMockup = document.querySelector(".hero-mockup-wrapper");
  if (heroMockup) {
    document.addEventListener("mousemove", (e) => {
      const amountX = (window.innerWidth / 2 - e.clientX) * 0.015;
      const amountY = (window.innerHeight / 2 - e.clientY) * 0.015;
      
      heroMockup.style.transform = `translate(${amountX}px, ${amountY}px)`;
    });
  }

  // 6. Animate Stat Numbers on About Page
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetNum = parseFloat(target.getAttribute("data-target"));
          const suffix = target.textContent.replace(/[0-9.]/g, "");
          let current = 0;
          const duration = 1500;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = targetNum / steps;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= targetNum) {
              target.textContent = targetNum + suffix;
              clearInterval(timer);
            } else {
              target.textContent = (Number.isInteger(targetNum) ? Math.floor(current) : current.toFixed(1)) + suffix;
            }
          }, stepTime);
          
          observer.unobserve(target);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }
});
