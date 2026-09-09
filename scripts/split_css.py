#!/usr/bin/env python3
"""
Toukir Studio — CSS Modularizer
Splits monolithic styles.css into structured base, components, sections, and pages files.
"""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
CSS_DIR = ROOT_DIR / "assets" / "css"
STYLES_CSS = CSS_DIR / "styles.css"

def modularize_css():
    print("Reading styles.css...")
    content = STYLES_CSS.read_text(encoding="utf-8")
    lines = content.splitlines(keepends=True)

    # 1. base/variables.css (Lines 1 to 75)
    variables_css = "".join(lines[0:75])
    (CSS_DIR / "base" / "variables.css").write_text(variables_css, encoding="utf-8")

    # 2. base/reset.css (Lines 75 to 140)
    reset_css = "".join(lines[75:140])
    (CSS_DIR / "base" / "reset.css").write_text(reset_css, encoding="utf-8")

    # 3. base/layout.css (.container + scroll animations lines 140-148 and 1392-1404)
    layout_css = """/* --- GLOBAL CONTAINER & SCROLL ANIMATIONS --- */
.container {
  width: 90%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Scroll Animations */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
"""
    (CSS_DIR / "base" / "layout.css").write_text(layout_css, encoding="utf-8")

    # 4. components/pills.css (lines 149-161, 1663-1676)
    pills_css = """/* --- BADGES & PILL TAGS --- */
.category-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-primary);
  background: var(--accent-light);
  border: 1px solid rgba(47, 128, 237, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  letter-spacing: -0.1px;
}

.studio-pill {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: var(--accent-light);
  color: var(--accent-primary);
  border: 1px solid rgba(37, 99, 235, 0.25);
  margin-left: 0.4rem;
  vertical-align: middle;
}

.spotlight-flagship-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.25rem 0.65rem;
  border-radius: 100px;
}

.spotlight-tag {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  background: var(--skill-bg);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}
"""
    (CSS_DIR / "components" / "pills.css").write_text(pills_css, encoding="utf-8")

    # 5. components/buttons.css (lines 162-200, 1490-1524, 1694-1732)
    buttons_css = "".join(lines[162:200]) + "\n" + "".join(lines[1490:1524]) + "\n" + "".join(lines[1771:1818])
    (CSS_DIR / "components" / "buttons.css").write_text(buttons_css, encoding="utf-8")

    # 6. components/cards.css (lines 201-217)
    cards_css = "".join(lines[201:217])
    (CSS_DIR / "components" / "cards.css").write_text(cards_css, encoding="utf-8")

    # 7. components/navbar.css (lines 217-353)
    navbar_css = "".join(lines[217:353])
    (CSS_DIR / "components" / "navbar.css").write_text(navbar_css, encoding="utf-8")

    # 8. components/footer.css (lines 1326-1392)
    footer_css = "".join(lines[1326:1392])
    (CSS_DIR / "components" / "footer.css").write_text(footer_css, encoding="utf-8")

    # 9. components/lightbox.css (lines 2580 to end)
    lightbox_css = "".join(lines[2580:])
    (CSS_DIR / "components" / "lightbox.css").write_text(lightbox_css, encoding="utf-8")

    # 10. sections/hero.css (lines 353-462, 1404-1490, 465-508)
    hero_css = "".join(lines[353:462]) + "\n" + "".join(lines[1404:1490]) + "\n" + "".join(lines[465:508])
    (CSS_DIR / "sections" / "hero.css").write_text(hero_css, encoding="utf-8")

    # 11. sections/spotlight.css (lines 1533-1683)
    spotlight_css = "".join(lines[1533:1683])
    (CSS_DIR / "sections" / "spotlight.css").write_text(spotlight_css, encoding="utf-8")

    # 12. sections/manifesto.css (lines 508-605)
    manifesto_css = "".join(lines[508:605])
    (CSS_DIR / "sections" / "manifesto.css").write_text(manifesto_css, encoding="utf-8")

    # 13. sections/founder.css (lines 1693-1770)
    founder_css = "".join(lines[1693:1770])
    (CSS_DIR / "sections" / "founder.css").write_text(founder_css, encoding="utf-8")

    # 14. sections/feedback.css (lines 1279-1326)
    feedback_css = "".join(lines[1279:1326])
    (CSS_DIR / "sections" / "feedback.css").write_text(feedback_css, encoding="utf-8")

    # 15. pages/catalog.css (lines 713-817, 1818-2237)
    catalog_css = "".join(lines[713:817]) + "\n" + "".join(lines[1818:2237])
    (CSS_DIR / "pages" / "catalog.css").write_text(catalog_css, encoding="utf-8")

    # 16. pages/app-details.css (lines 977-1279, 2237-2369)
    app_details_css = "".join(lines[977:1279]) + "\n" + "".join(lines[2237:2369])
    (CSS_DIR / "pages" / "app-details.css").write_text(app_details_css, encoding="utf-8")

    # 17. pages/about.css (lines 817-977)
    about_css = "".join(lines[817:977])
    (CSS_DIR / "pages" / "about.css").write_text(about_css, encoding="utf-8")

    # 18. base/responsive.css (lines 605-713, 2369-2580)
    responsive_css = "/* --- GLOBAL RESPONSIVE BREAKPOINTS --- */\n" + "".join(lines[605:713]) + "\n" + "".join(lines[2369:2580])
    (CSS_DIR / "base" / "responsive.css").write_text(responsive_css, encoding="utf-8")

    # Now write master styles.css with clean @imports
    master_css = """/* ==========================================================================
   TOUKIR STUDIO — MASTER STYLESHEET
   Modular 7-1 CSS Architecture
   ========================================================================== */

/* 1. Base / Design Tokens */
@import 'base/variables.css';
@import 'base/reset.css';
@import 'base/layout.css';

/* 2. Components */
@import 'components/navbar.css';
@import 'components/buttons.css';
@import 'components/cards.css';
@import 'components/pills.css';
@import 'components/footer.css';
@import 'components/lightbox.css';

/* 3. Sections */
@import 'sections/hero.css';
@import 'sections/spotlight.css';
@import 'sections/manifesto.css';
@import 'sections/founder.css';
@import 'sections/feedback.css';

/* 4. Page Specifics */
@import 'pages/catalog.css';
@import 'pages/app-details.css';
@import 'pages/about.css';

/* 5. Responsive Overrides */
@import 'base/responsive.css';
"""
    STYLES_CSS.write_text(master_css, encoding="utf-8")
    print("Modularized styles.css successfully into 17 files!")

if __name__ == "__main__":
    modularize_css()
