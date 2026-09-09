/**
 * Toukir Studio — Lightbox Controller
 * Standalone, touch-enabled fullscreen image viewer with zoom, swipe gestures, and keyboard navigation.
 */

export function setupLightbox(imageSources) {
  if (!imageSources || imageSources.length === 0) return;

  const modal = document.getElementById("lightbox-modal");
  const imgEl = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const counter = document.getElementById("lightbox-counter");

  if (!modal || !imgEl) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function showImage(index) {
    if (index < 0) index = imageSources.length - 1;
    if (index >= imageSources.length) index = 0;
    currentIndex = index;

    imgEl.src = imageSources[currentIndex];
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${imageSources.length}`;
    }
  }

  function openLightbox(index) {
    showImage(index);
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.focus();
  }

  function closeLightbox() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Click bindings
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  // Click outside to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("lightbox-content")) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  // Touch Swipe Gestures
  modal.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showImage(currentIndex - 1); // Swiped right
      else showImage(currentIndex + 1); // Swiped left
    }
  }, { passive: true });

  return {
    open: openLightbox,
    close: closeLightbox,
    show: showImage
  };
}

if (typeof window !== "undefined") {
  window.setupLightbox = setupLightbox;
}
