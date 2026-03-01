# TrimLoop

A simple Chrome extension that lets you easily create A-B loops in your browser for videos both on the web and offline.

## User Notes

### Guide

TODO

## Dev Notes

### Local Dev

1. Download or clone this repository.
2. Open Google Chrome.
3. Navigate to `chrome://extensions/`.
4. Enable **Developer mode** (toggle in the top right corner).
5. Click **Load unpacked**.
6. Select the `TrimLoop` folder.

### Testing

- Open `test.html` in chrome

### Tech Stack

- **Language:** ES Latest (ES6+)
- **Styling:** CSS3
- **Structure:** HTML5
- **Target Browser:** Google Chrome (Latest)
- **Build Tools:** None (Vanilla JS, no Node.js/NPM required)

### File Structure

```
TrimLoop/
├── Readme.md                 # This file
├── .jsconfig.json            # Leverages TS language server for intellisense
├── .eslintrc.json            # ESLint configuration
├── .markdownlint.json        # Markdown linting configuration
├── TrimLoop.code-workspace   # VS Code workspace file
├── /srv                      # Source
│   ├── popup.js                   # Popup controller
│   ├── popup.html                 # Popup UI
│   ├── background.js              # Background script (keybinds)
│   ├── content.js                 # Content script (chrome tab interaction)
│   └── /components                # Web components for UI
├── /docs                      # Documentation
│   └── /dev                       # Development notes and mock-ups
└── /test                      # Tests
    ├── test.html                  # Test runner
    └── test.mp4                   # Test video (for manual testing)
```