#!/usr/bin/env python3
"""
Toukir Studio — Data Synchronizer & Modularizer
Splits apps-data.js into modular assets/data/apps/<id>.js files,
generates categories.js, registry.js, and keeps the bundled apps-data.js up to date.
"""

import os
import re
import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "assets" / "data"
APPS_DIR = DATA_DIR / "apps"
APPS_DATA_JS = ROOT_DIR / "assets" / "js" / "apps-data.js"

CATEGORIES = [
    {"id": "Lifestyle", "name": "Lifestyle & Spiritual", "icon": "heart", "description": "Mindfulness, digital counter, and everyday lifestyle companions."},
    {"id": "Productivity", "name": "Productivity & Utilities", "icon": "check-square", "description": "Distraction-free tools for focus, habit tracking, and organization."},
    {"id": "Education", "name": "Education & Learning", "icon": "book-open", "description": "Offline dictionaries, vocabulary builders, and kid-safe learning apps."},
    {"id": "Media", "name": "Audio & Media", "icon": "music", "description": "Clean, local audio players and audio utilities."},
    {"id": "Security", "name": "Privacy & Security", "icon": "shield", "description": "Sandboxed notes, encryption, and local device security."},
    {"id": "Games", "name": "Indie Games", "icon": "gamepad", "description": "Lightweight, offline casual games with zero ads."},
]

def split_to_modular():
    print("Reading assets/js/apps-data.js...")
    content = APPS_DATA_JS.read_text(encoding="utf-8")
    m = re.search(r'const\s+defaultAppsData\s*=\s*(\[\s*\{.*?\}\s*\]);', content, re.DOTALL)
    if not m:
        raise ValueError("Could not parse defaultAppsData from apps-data.js")

    apps = json.loads(m.group(1))
    print(f"Found {len(apps)} apps to modularize.")

    APPS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Write individual app files
    registry_imports = []
    registry_exports = []

    for app in apps:
        app_id = app["id"]
        # sanitize identifier for variable name
        var_name = re.sub(r'[^a-zA-Z0-9]', '_', app_id)
        if var_name[0].isdigit():
            var_name = f"app_{var_name}"

        file_path = APPS_DIR / f"{app_id}.js"
        json_str = json.dumps(app, indent=2, ensure_ascii=False)

        js_content = f"""/**
 * Toukir Studio — App Data: {app.get('name', app_id)}
 * Category: {app.get('category', 'Utility')}
 * Version: {app.get('version', '1.0.0')}
 */

export const {var_name} = {json_str};

export default {var_name};
"""
        file_path.write_text(js_content, encoding="utf-8")
        registry_imports.append(f'import {{ {var_name} }} from "./apps/{app_id}.js";')
        registry_exports.append(f"  {var_name},")

    print(f"Wrote {len(apps)} individual app files to {APPS_DIR}")

    # 2. Write categories.js
    categories_file = DATA_DIR / "categories.js"
    cat_json = json.dumps(CATEGORIES, indent=2, ensure_ascii=False)
    cat_content = f"""/**
 * Toukir Studio — App Categories Taxonomy
 */

export const categories = {cat_json};

export default categories;
"""
    categories_file.write_text(cat_content, encoding="utf-8")
    print(f"Wrote categories taxonomy to {categories_file}")

    # 3. Write registry.js
    registry_file = DATA_DIR / "registry.js"
    reg_content = f"""/**
 * Toukir Studio — Master Apps Registry
 * Aggregates all modular app entries into a unified catalog.
 */

{chr(10).join(registry_imports)}

export const allApps = [
{chr(10).join(registry_exports)}
];

export default allApps;
"""
    registry_file.write_text(reg_content, encoding="utf-8")
    print(f"Wrote master registry to {registry_file}")

def bundle_from_modular():
    """Compiles individual app files back into assets/js/apps-data.js for backward-compatibility."""
    print("Reading modular app files from assets/data/apps/...")
    app_files = sorted(APPS_DIR.glob("*.js"))
    if not app_files:
        print("No modular files found to bundle.")
        return

    apps = []
    for af in app_files:
        content = af.read_text(encoding="utf-8")
        # Extract json object between export const <var> = { ... };
        m = re.search(r'export\s+const\s+\w+\s*=\s*(\{.*?\});\s*(?:export\s+default|\Z)', content, re.DOTALL)
        if m:
            try:
                app_obj = json.loads(m.group(1))
                apps.append(app_obj)
            except Exception as e:
                print(f"Error parsing {af.name}: {e}")
        else:
            print(f"Regex mismatch in {af.name}")

    # Sort so Tasbeeh is first, then rest
    apps.sort(key=lambda x: (0 if x.get("id") == "tasbeeh" else 1, x.get("name", "")))

    print(f"Re-bundling {len(apps)} apps into assets/js/apps-data.js...")
    apps_json = json.dumps(apps, indent=2, ensure_ascii=False)

    bundled_js = f"""/**
 * Toukir Studio — Authoritative App Catalog (Bundled Distribution)
 * Auto-generated from modular records in assets/data/apps/
 * Compatible with direct browser script tags and local storage caching.
 */

const CATALOG_VERSION = "2026.09.09.v4.1.2";

const defaultAppsData = {apps_json};

// Invalidate stale cache if version bumped or missing critical data
const cachedVersion = localStorage.getItem("toukir_apps_version");
if (cachedVersion !== CATALOG_VERSION) {{
  localStorage.setItem("toukir_apps_version", CATALOG_VERSION);
  localStorage.setItem("toukir_apps_data", JSON.stringify(defaultAppsData));
}}

let appsData = JSON.parse(localStorage.getItem("toukir_apps_data")) || defaultAppsData;

// Global browser window attachment
if (typeof window !== "undefined") {{
  window.CATALOG_VERSION = CATALOG_VERSION;
  window.defaultAppsData = defaultAppsData;
  window.appsData = appsData;
}}

// ES module exports when imported as a module
if (typeof exports !== "undefined") {{
  exports.CATALOG_VERSION = CATALOG_VERSION;
  exports.defaultAppsData = defaultAppsData;
  exports.appsData = appsData;
}}
"""
    APPS_DATA_JS.write_text(bundled_js, encoding="utf-8")
    print(f"Successfully updated {APPS_DATA_JS}!")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "bundle":
        bundle_from_modular()
    else:
        split_to_modular()
        bundle_from_modular()
