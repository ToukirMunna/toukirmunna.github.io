/**
 * Admin Form Module — Live Image Previews
 * Attaches thumbnail previews to image path inputs.
 */

export function attachImagePreview(inputEl) {
  if (!inputEl || inputEl.dataset.previewAttached) return;
  inputEl.dataset.previewAttached = "true";

  const previewImg = document.createElement("img");
  previewImg.className = "admin-img-preview";
  previewImg.alt = "Preview";
  previewImg.title = "Image preview";

  const updatePreview = () => {
    const path = inputEl.value.trim();
    if (path) {
      previewImg.src = path;
      previewImg.style.display = "block";
    } else {
      previewImg.style.display = "none";
    }
  };

  previewImg.onerror = () => { previewImg.style.display = "none"; };
  inputEl.addEventListener("input", updatePreview);
  inputEl.parentElement.style.position = "relative";
  inputEl.insertAdjacentElement("afterend", previewImg);
  updatePreview();
}
