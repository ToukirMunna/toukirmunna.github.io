#!/usr/bin/env python3
"""
Toukir Studio — CSS Bundler
Combines modular CSS components into a single zero-waterfall styles.css"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS_DIR = os.path.join(ROOT, "assets", "css")

CSS_ORDER = [
    "base/variables.css",
    "base/reset.css",
    "base/layout.css",
    "components/navbar.css",
    "components/buttons.css",
    "components/cards.css",
    "components/pills.css",
    "components/footer.css",
    "components/lightbox.css",
    "sections/hero.css",
    "sections/spotlight.css",
    "sections/manifesto.css",
    "sections/founder.css",
    "sections/feedback.css",
    "pages/catalog.css",
    "pages/app-details.css",
    "pages/about.css",
    "base/responsive.css",
]

def build():
    header = """/* ======================================================================
   TOUKIR STUDIO — PRODUCTION BUNDLED STYLESHEET
   Zero-chaining, single-request stylesheet combining modular components.
   ====================================================================== */\n\n"""
    parts = [header]
    for rel in CSS_ORDER:
        full = os.path.join(CSS_DIR, rel)
        if os.path.exists(full):
            with open(full, "r", encoding="utf-8") as f:
                parts.append(f"/* === MODULE: {rel} === */\n" + f.read().strip() + "\n\n")
    bundled = "".join(parts)
    out = os.path.join(CSS_DIR, "styles.css")
    with open(out, "w", encoding="utf-8") as f:
        f.write(bundled)
    print(f"Built {out} {len(bundled):} bytes")

if __name__ == "__main__":
    build()
