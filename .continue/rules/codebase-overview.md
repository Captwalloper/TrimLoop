---
description: Provides an overview of the TrimLoop codebase.
---

# Project Tech Stack/Architecture

TrimLoop is designed to be a simple chrome extension for both personal and public use.
The language is ES latest, vanilla JS, as well as latests HTML and CSS.
The only targest browser is latest chrome.
NPM, nodejs, and other such complexities are specifically excluded.

# File Structure

## TrimLoop a.k.a. root
The main project folder is 'TrimLoop', the root folder.
Many configuration files are stored at root, such as .eslintrc.json, .markdownlint.json, and TrimLoop.code-workspace.
Besides them, the main project files are also stored here:
* popup.js        Main popup page script file.
* loop-bound.js   Defines UI custom element.
* loop-button.js  Defines UI custom element.
* popup.html      Popup HTML file.
* content.js      Content script.
* background.js   Background script.

## /docs
A subfolder for documentation.

### /docs/dev
A subfolder for scatterbrained notes and mock-ups.

## /test
A subfolder for tests.
The current test setup is just to run a test.html file in the browser.
test.mp4 is a short test video. DO NOT attempt to read this file, as that would waste context tokens.
Some tests are run programmatically.
Others are run manually.