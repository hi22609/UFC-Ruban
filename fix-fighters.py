#!/usr/bin/env python3
"""
Replace fighter SVGs with modern CSS-based silhouettes
"""
import re

filepath = r"C:\Users\owedo\.openclaw\workspace\ruban-work\ufc-ruban\website\index.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# New fighter visual (CSS-based)
new_visual = '''
<div class="fighter-visual fighter-visual--topuria">
  <div class="fighter-silhouette"></div>
  <div class="fighter-glow"></div>
  <div class="fighter-emoji">🦅</div>
</div>
'''

new_visual_2 = '''
<div class="fighter-visual fighter-visual--gaethje">
  <div class="fighter-silhouette gaethje"></div>
  <div class="fighter-glow"></div>
  <div class="fighter-emoji">💀</div>
</div>
'''

# Remove old SVG blocks (everything between <svg> and </svg>)
content = re.sub(r'<svg class="fighter-svg fighter-svg--topuria".*?</svg>', new_visual.strip(), content, flags=re.DOTALL)
content = re.sub(r'<svg class="fighter-svg fighter-svg--gaethje".*?</svg>', new_visual_2.strip(), content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fighter visuals replaced with CSS art")
print(f"File: {filepath}")
