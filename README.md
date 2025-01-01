# AI Prompt Buddy

A Chrome extension that helps generate structured prompts for AI platforms like ChatGPT, Claude, and Gemini. Provides predefined templates for learning, writing, interviewing and more.

## Features

- **Pre-built Prompt Templates**

  - Complex Topic Decoder
  - Learning Acceleration Blueprint
  - Knowledge Web Builder
  - Book Mastery System
  - Problem-Solving Framework
  - Case Study Analyzer
  - Writing Enhancement System
  - Interview Success Accelerator
  - Language Learning Optimizer
  - Hobby Mastery Roadmap

- **Bilingual Support**

  - English and Vietnamese languages
  - Persistent language preference

- **Theme Options**

  - Light/Dark modes
  - System preference detection
  - Persistent theme preference

- **AI Platform Integration**
  - ChatGPT
  - Claude
  - Gemini

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DinhThienPhuc/ai-prompt-buddy.git
```

2. Load the extension in Chrome:

- Open Chrome and navigate to chrome://extensions/
- Enable "Developer mode"
- Click "Load unpacked"
- Select the ai-prompt-buddy directory

## Usage

- Click the AI Prompt Buddy extension icon in Chrome
- Select a prompt template
- Fill in the required fields
- Preview the generated prompt
- Click "Send" to insert the prompt into the active AI chat

## Project Structure

```
ai-prompt-buddy/
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── popup/
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   ├── constants.js
│   ├── locales.js
│   └── utils.js
└── scripts/
    ├── background.js
    └── content.js
```

## Developments

The extension is built with vanilla JavaScript and uses:

- Chrome Extension Manifest V3
- CSS custom properties for theming
- Content scripts for AI platform integration

Key files:

- `popup.js` - Main extension logic
- `locales.js` - Translation strings
- `constants.js` - Template definitions
- `content.js` - Content script for DOM manipulation

## License

MIT

## Author

@DinhThienPhuc
