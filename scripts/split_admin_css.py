#!/usr/bin/env python3
"""
Toukir Studio — Admin CSS Modularizer
Splits monolithic admin.css into structured files under assets/css/admin/
"""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
ADMIN_CSS_DIR = ROOT_DIR / "assets" / "css" / "admin"
ADMIN_CSS = ROOT_DIR / "assets" / "css" / "admin.css"

def modularize_admin_css():
    print("Reading admin.css...")
    content = ADMIN_CSS.read_text(encoding="utf-8")
    lines = content.splitlines(keepends=True)

    ADMIN_CSS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. layout.css (Lines 1 to 200)
    (ADMIN_CSS_DIR / "layout.css").write_text("".join(lines[0:200]), encoding="utf-8")

    # 2. dashboard.css (Lines 200 to 248 + 583 to 742)
    dashboard_css = "".join(lines[200:248]) + "\n" + "".join(lines[582:742])
    (ADMIN_CSS_DIR / "dashboard.css").write_text(dashboard_css, encoding="utf-8")

    # 3. table.css (Lines 248 to 382)
    (ADMIN_CSS_DIR / "table.css").write_text("".join(lines[248:382]), encoding="utf-8")

    # 4. modal.css (Lines 382 to 582)
    (ADMIN_CSS_DIR / "modal.css").write_text("".join(lines[382:582]), encoding="utf-8")

    # 5. dark.css (Lines 742 to end)
    (ADMIN_CSS_DIR / "dark.css").write_text("".join(lines[742:]), encoding="utf-8")

    # Rewrite master admin.css
    master_admin_css = """/* ==========================================================================
   TOUKIR STUDIO — ADMIN PORTAL MASTER STYLESHEET
   Modular Architecture
   ========================================================================== */

@import 'admin/layout.css';
@import 'admin/dashboard.css';
@import 'admin/table.css';
@import 'admin/modal.css';
@import 'admin/dark.css';
"""
    ADMIN_CSS.write_text(master_admin_css, encoding="utf-8")
    print("Modularized admin.css into 5 files under assets/css/admin/!")

if __name__ == "__main__":
    modularize_admin_css()
