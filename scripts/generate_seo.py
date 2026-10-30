import os
import re
from datetime import date

today = date.today().isoformat()

# Extract app IDs from apps-data.js
apps_data_path = os.path.join("assets", "js", "apps-data.js")
app_ids = []
if os.path.exists(apps_data_path):
    with open(apps_data_path, "r", encoding="utf-8") as f:
        content = f.read()
    app_ids = re.findall(r'["\']id["\']:\s*["\']([^"\']+)["\']', content)

print(f"Loaded {len(app_ids)} app IDs: {app_ids}")

# Build sitemap.xml
urls = [
    {"loc": "https://toukir.pro.bd/", "lastmod": today, "changefreq": "weekly", "priority": "1.0"},
    {"loc": "https://toukir.pro.bd/projects.html", "lastmod": today, "changefreq": "weekly", "priority": "0.9"},
    {"loc": "https://toukir.pro.bd/about.html", "lastmod": today, "changefreq": "monthly", "priority": "0.8"},
    {"loc": "https://toukir.pro.bd/privacy.html", "lastmod": today, "changefreq": "monthly", "priority": "0.7"},
]

for app_id in app_ids:
    urls.append({
        "loc": f"https://toukir.pro.bd/app.html?id={app_id}",
        "lastmod": today,
        "changefreq": "monthly",
        "priority": "0.8"
    })

xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]

for entry in urls:
    xml_lines.append("  <url>")
    xml_lines.append(f"    <loc>{entry['loc']}</loc>")
    xml_lines.append(f"    <lastmod>{entry['lastmod']}</lastmod>")
    xml_lines.append(f"    <changefreq>{entry['changefreq']}</changefreq>")
    xml_lines.append(f"    <priority>{entry['priority']}</priority>")
    xml_lines.append("  </url>")

xml_lines.append("</urlset>")
xml_content = "\n".join(xml_lines) + "\n"

with open("sitemap.xml", "w", encoding="utf-8", newline="\n") as f:
    f.write(xml_content)
print(f"Generated sitemap.xml with {len(urls)} entries.")

# Build robots.txt
robots_content = """User-agent: *
Allow: /

Sitemap: https://toukir.pro.bd/sitemap.xml
"""

with open("robots.txt", "w", encoding="utf-8", newline="\n") as f:
    f.write(robots_content)
print("Generated robots.txt successfully.")
