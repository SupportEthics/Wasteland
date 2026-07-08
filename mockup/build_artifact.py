#!/usr/bin/env python3
"""Build a self-contained single-file version of the mock-up (images inlined as
data URIs) for publishing as a claude.ai Artifact, which blocks external requests.

Usage: python3 build_artifact.py [output.html]
"""
import base64
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "index.html")
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "wasteland-warden-mockup.html")

html = open(SRC, encoding="utf-8").read()

def data_uri(name):
    with open(os.path.join(HERE, "assets", f"{name}.webp"), "rb") as f:
        return "data:image/webp;base64," + base64.b64encode(f.read()).decode()

# static <img src> and CSS url() references (title, arena, hero portraits)
html = re.sub(r"assets/(\w+)\.webp", lambda m: data_uri(m.group(1)), html)

# dynamic refs all go through IMG_SRC/SHEET_SRC: swap them for an inlined asset map
chars = ["ranger", "brute", "scout", "medic",
         "raider", "shambler", "crawler", "juggernaut", "sporewalker"]
entries = [f"'{c}':'{data_uri(c)}'" for c in chars]
entries += [f"'sheet_{c}':'{data_uri('sheet_' + c)}'" for c in chars]
asset_map = "const ASSET={" + ",".join(entries) + "};\n"
html = html.replace("const IMG_SRC = k => 'assets/'+k+'.webp';",
                    "const IMG_SRC = k => ASSET[k];")
html = html.replace("const SHEET_SRC = k => 'assets/sheet_'+k+'.webp';",
                    "const SHEET_SRC = k => ASSET['sheet_'+k];")
html = html.replace("<script>\n", "<script>\n" + asset_map, 1)

# Artifacts are wrapped in a doctype/head/body skeleton at publish time:
# keep only <title> + <style> + body content.
title = re.search(r"<title>.*?</title>", html, re.S).group(0)
style = re.search(r"<style>.*?</style>", html, re.S).group(0)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
open(OUT, "w", encoding="utf-8").write(f"{title}\n{style}\n{body}\n")
print(OUT, f"{os.path.getsize(OUT)//1024}KB")
