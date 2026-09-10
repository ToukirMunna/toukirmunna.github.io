#!/usr/bin/env python3
"""
Toukir Studio — Automated Verification Engine
Validates asset links, CSS @import chains, app data integrity, and localhost HTTP responses.
"""

import os
import re
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent

# Force utf-8 stdout on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Terminal Colors & Symbols
USE_UNICODE = sys.stdout.encoding and "utf" in sys.stdout.encoding.lower()
CHECK_CHAR = "✓" if USE_UNICODE else "[PASS]"
CROSS_CHAR = "✗" if USE_UNICODE else "[FAIL]"
WARN_CHAR  = "⚠" if USE_UNICODE else "[WARN]"

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

errors = []
warnings = []
passes = 0

def report_pass(message: str):
    global passes
    passes += 1
    print(f"  {GREEN}{CHECK_CHAR}{RESET} {message}", flush=True)

def report_fail(message: str):
    errors.append(message)
    print(f"  {RED}{CROSS_CHAR}{RESET} {message}", flush=True)

def report_warn(message: str):
    warnings.append(message)
    print(f"  {YELLOW}{WARN_CHAR}{RESET} {message}", flush=True)

def check_html_asset_links():
    print(f"\n{BOLD}{CYAN}1. Checking HTML Asset Links Integrity...{RESET}")
    html_files = list(ROOT_DIR.glob("*.html"))
    if not html_files:
        report_fail("No HTML files found in root!")
        return

    link_pattern = re.compile(r'<(?:link|script|img)\s+[^>]*(?:href|src)=["\']([^"\']+)["\']', re.IGNORECASE)

    for html_file in sorted(html_files):
        content = html_file.read_text(encoding="utf-8", errors="ignore")
        matches = link_pattern.findall(content)
        file_passes = 0
        file_fails = 0

        for target in matches:
            target = target.strip()
            # Ignore external or hash/data links
            if target.startswith(("http://", "https://", "//", "#", "mailto:", "tel:", "data:", "javascript:")):
                continue
            
            # Clean query strings and fragments
            clean_target = target.split("?")[0].split("#")[0]
            if not clean_target:
                continue

            # Resolve path relative to root or relative to html file
            resolved_path = (ROOT_DIR / clean_target).resolve()
            if resolved_path.is_file():
                file_passes += 1
            else:
                file_fails += 1
                report_fail(f"{html_file.name}: Broken asset link '{target}' -> {resolved_path}")

        if file_fails == 0:
            report_pass(f"{html_file.name}: All {file_passes} local asset references exist on disk.")

def check_css_imports():
    print(f"\n{BOLD}{CYAN}2. Checking CSS @import Chains...{RESET}")
    css_files = list((ROOT_DIR / "assets" / "css").rglob("*.css"))
    if not css_files:
        report_fail("No CSS files found in assets/css!")
        return

    import_pattern = re.compile(r'@import\s+(?:url\(["\']?([^"\'\)]+)["\']?\)|["\']([^"\']+)["\']);', re.IGNORECASE)
    total_imports = 0

    for css_file in sorted(css_files):
        content = css_file.read_text(encoding="utf-8", errors="ignore")
        for match in import_pattern.findall(content):
            target = match[0] or match[1]
            if not target or target.startswith(("http://", "https://", "//", "data:")):
                continue

            total_imports += 1
            clean_target = target.split("?")[0]
            resolved = (css_file.parent / clean_target).resolve()
            if resolved.is_file():
                report_pass(f"{css_file.relative_to(ROOT_DIR)} -> @import '{target}' exists.")
            else:
                report_fail(f"{css_file.relative_to(ROOT_DIR)}: Broken @import '{target}' -> {resolved}")

    if total_imports == 0:
        report_pass(f"Scanned {len(css_files)} CSS files (no @import dependencies).")

def check_css_syntax_and_braces():
    print(f"\n{BOLD}{CYAN}3. Checking CSS Brace Balance & Syntax Integrity...{RESET}")
    css_files = list((ROOT_DIR / "assets" / "css").rglob("*.css"))
    total_checked = 0
    syntax_errors = 0

    for css_file in sorted(css_files):
        total_checked += 1
        content = css_file.read_text(encoding="utf-8", errors="ignore")
        lines = content.splitlines()
        depth = 0
        file_err = False

        for idx, line in enumerate(lines, 1):
            depth += line.count('{') - line.count('}')
            if depth < 0:
                report_fail(f"{css_file.relative_to(ROOT_DIR)}: Line {idx} negative brace depth ({depth}): {line.strip()}")
                file_err = True
                syntax_errors += 1
                depth = 0

        if depth != 0:
            report_fail(f"{css_file.relative_to(ROOT_DIR)}: Unclosed brace block (depth ending at {depth})")
            syntax_errors += 1
        elif not file_err:
            report_pass(f"{css_file.relative_to(ROOT_DIR)} ({len(lines)} lines): Perfectly balanced braces.")

def check_app_data():
    print(f"\n{BOLD}{CYAN}4. Checking App Data Integrity & Schemas...{RESET}")
    apps_data_file = ROOT_DIR / "assets" / "js" / "apps-data.js"
    modular_apps_dir = ROOT_DIR / "assets" / "data" / "apps"

    if apps_data_file.is_file():
        content = apps_data_file.read_text(encoding="utf-8", errors="ignore")
        # Extract defaultAppsData count
        id_matches = re.findall(r'["\']?id["\']?\s*:\s*["\']([^"\']+)["\']', content)
        unique_ids = list(dict.fromkeys(id_matches))
        if len(unique_ids) >= 30:
            report_pass(f"apps-data.js contains {len(unique_ids)} registered application IDs.")
        else:
            report_warn(f"apps-data.js only found {len(unique_ids)} registered IDs.")

    if modular_apps_dir.is_dir():
        app_modules = list(modular_apps_dir.glob("*.js"))
        if app_modules:
            report_pass(f"Found {len(app_modules)} modular app files in assets/data/apps/.")
            for app_mod in app_modules:
                mod_content = app_mod.read_text(encoding="utf-8", errors="ignore")
                for field in ["id", "name", "version", "category"]:
                    if f'"{field}"' not in mod_content and f"'{field}'" not in mod_content and f"{field}:" not in mod_content:
                        report_fail(f"{app_mod.name}: Missing required field '{field}'")
        else:
            report_warn("Modular apps directory exists but has no .js files yet.")

def check_javascript_modules():
    print(f"\n{BOLD}{CYAN}5. Checking JavaScript ES Modules & Import Integrity...{RESET}")
    js_files = list((ROOT_DIR / "assets" / "js").rglob("*.js"))
    import_pattern = re.compile(r'(?:import|from)\s+["\']([^"\']+\.js)["\']', re.IGNORECASE)
    total_imports = 0

    for js_file in sorted(js_files):
        content = js_file.read_text(encoding="utf-8", errors="ignore")
        for match in import_pattern.findall(content):
            total_imports += 1
            clean_target = match.split("?")[0].split("#")[0]
            resolved = (js_file.parent / clean_target).resolve()
            if resolved.is_file():
                report_pass(f"{js_file.relative_to(ROOT_DIR)} -> import '{match}' exists on disk.")
            else:
                report_fail(f"{js_file.relative_to(ROOT_DIR)}: Broken import '{match}' -> {resolved}")

    # Run node --check if node is installed
    import shutil
    import subprocess
    if shutil.which("node"):
        main_js = ROOT_DIR / "assets" / "js" / "main.js"
        if main_js.is_file():
            result = subprocess.run(["node", "--check", str(main_js)], capture_output=True, text=True)
            if result.returncode == 0:
                report_pass("node --check on assets/js/main.js: Syntax validated successfully.")
            else:
                report_fail(f"node --check failed: {result.stderr.strip()}")


def check_localhost_http():
    print(f"\n{BOLD}{CYAN}6. Checking Local Server Smoke Test (port 8000)...{RESET}", flush=True)
    base_url = "http://127.0.0.1:8000"

    endpoints = [
        "/",
        "/projects.html",
        "/app.html?id=tasbeeh",
        "/about.html",
        "/privacy.html",
        "/assets/css/core.css",
        "/assets/css/pages/home.css",
        "/assets/css/pages/catalog.css",
        "/assets/css/pages/app-details.css",
        "/assets/css/pages/about.css",
        "/assets/css/pages/privacy.css",
        "/assets/css/styles.css",
        "/assets/js/apps-data.js",
        "/assets/images/tasbeeh/tasbeeh_banner.webp",
        "/assets/images/tasbeeh/tasbeeh_icon.webp",
    ]

    for ep in endpoints:
        url = f"{base_url}{ep}"
        try:
            req = urllib.request.Request(url, method="HEAD")
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status == 200:
                    report_pass(f"HTTP 200 OK: {ep}")
                else:
                    report_fail(f"HTTP {resp.status}: {ep}")
        except urllib.error.HTTPError as e:
            report_fail(f"HTTP Error {e.code}: {ep}")
        except Exception as e:
            report_warn(f"Could not connect to {url} ({e}). (Is server.py running?)")
            break

def main():
    print(f"\n{BOLD}=================================================={RESET}")
    print(f"{BOLD}    TOUKIR STUDIO — VERIFICATION SUITE{RESET}")
    print(f"{BOLD}=================================================={RESET}")

    check_html_asset_links()
    check_css_imports()
    check_css_syntax_and_braces()
    check_app_data()
    check_javascript_modules()
    check_localhost_http()

    print(f"\n{BOLD}--------------------------------------------------{RESET}")
    print(f"{BOLD}SUMMARY:{RESET} {GREEN}{passes} Passed{RESET} | {RED}{len(errors)} Errors{RESET} | {YELLOW}{len(warnings)} Warnings{RESET}")
    print(f"{BOLD}--------------------------------------------------{RESET}")

    if errors:
        print(f"\n{RED}{BOLD}Verification FAILED with {len(errors)} error(s).{RESET}\n")
        sys.exit(1)
    else:
        print(f"\n{GREEN}{BOLD}Verification PASSED successfully!{RESET}\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
