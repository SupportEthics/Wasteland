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

# the only remaining image asset is the title key art (all characters are code-drawn)
html = re.sub(r"assets/(\w+)\.webp", lambda m: data_uri(m.group(1)), html)

# Artifacts are wrapped in a doctype/head/body skeleton at publish time:
# keep only <title> + <style> + body content.
title = re.search(r"<title>.*?</title>", html, re.S).group(0)
style = re.search(r"<style>.*?</style>", html, re.S).group(0)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
open(OUT, "w", encoding="utf-8").write(f"{title}\n{style}\n{body}\n")
print(OUT, f"{os.path.getsize(OUT)//1024}KB")
