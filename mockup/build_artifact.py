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

# static <img src> and CSS url() references
html = re.sub(r"assets/(\w+)\.webp", lambda m: data_uri(m.group(1)), html)

# dynamic sprite swaps in JS: route through an inlined asset map
sprites = ["ranger", "brute", "scout", "medic",
           "raider", "shambler", "crawler", "juggernaut", "sporewalker"]
asset_map = "const ASSET={" + ",".join(f"{s}:'{data_uri(s)}'" for s in sprites) + "};\n"
html = html.replace("`assets/${state.hero}.webp`", "ASSET[state.hero]")
html = html.replace("`assets/${key}.webp`", "ASSET[key]")
html = html.replace('src="assets/${t.k}.webp"', 'src="${ASSET[t.k]}"')
html = html.replace("<script>\n", "<script>\n" + asset_map, 1)

# Artifacts are wrapped in a doctype/head/body skeleton at publish time:
# keep only <title> + <style> + body content.
title = re.search(r"<title>.*?</title>", html, re.S).group(0)
style = re.search(r"<style>.*?</style>", html, re.S).group(0)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
open(OUT, "w", encoding="utf-8").write(f"{title}\n{style}\n{body}\n")
print(OUT, f"{os.path.getsize(OUT)//1024}KB")
