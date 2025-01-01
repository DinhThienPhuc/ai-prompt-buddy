import { DATA, ICON, SUPPORTED_SITES } from "./constants.js";
import { translator } from "./locales.js";
import { areArraysEqual } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listScreen = document.querySelector(".js-template-list");
  const detailScreen = document.querySelector(".js-template-detail");
  const templateName = document.querySelector(".js-template-name");
  const inputFields = document.querySelector(".js-input-fields");
  const preview = document.querySelector(".js-preview");
  const searchButton = document.querySelector(".js-send-prompt");
  const backButton = document.querySelector(".js-back-button");
  const themeToggle = document.querySelector(".js-theme-toggle");
  const languageToggle = document.querySelector(".js-language-toggle");
  const previewLabel = document.querySelector(".js-preview-label");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const currentLanguage =
    document.documentElement.getAttribute("data-language") || "en";

  let validFields = [];

  const updatePreview = (template) => {
    const lang = document.documentElement.getAttribute("data-language");
    let previewText = translator[lang][template.template];

    template.inputFields.forEach((field) => {
      const value =
        document.querySelector(`[data-field-id="${field.id}"]`).value ||
        translator[lang][field.previewPlaceholder];
      previewText = previewText.replace(
        translator[lang][field.previewPlaceholder],
        value,
      );
      if (
        value !== translator[lang][field.previewPlaceholder] &&
        !validFields.includes(field.id)
      ) {
        validFields.push(field.id);
      }
    });
    preview.innerHTML = previewText;

    if (
      !!areArraysEqual(
        template.inputFields.map((field) => field.id),
        validFields,
      )
    ) {
      searchButton.removeAttribute("disabled");
    }
  };

  const showTemplate = (template) => {
    document.documentElement.setAttribute("data-template-id", template.id);
    const lang = document.documentElement.getAttribute("data-language");
    listScreen.style.display = "none";
    detailScreen.style.display = "block";
    templateName.textContent = translator[lang][template.name];

    // ✨ Changed: Create input fields with js- classes
    inputFields.innerHTML = template.inputFields
      .map(
        (field) => `
          <div class="input-group">
            <label class="input-label js-input-label" data-template-input-label="${field.label}">${translator[lang][field.label]}</label>
            <input 
              class="input-field js-input-field" 
              data-field-id="${field.id}"
              data-template-input-placeholder="${field.inputPlaceholder}"
              placeholder="${translator[lang][field.inputPlaceholder]}" 
            />
          </div>
        `,
      )
      .join("");

    // ✨ Changed: Query elements using js- classes
    template.inputFields.forEach((field) => {
      document
        .querySelector(`[data-field-id="${field.id}"]`)
        .addEventListener("input", () => updatePreview(template));
    });

    updatePreview(template);
  };

  // ✨ Site compatibility check
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const currentSite = SUPPORTED_SITES[url.hostname];

  if (!currentSite) {
    // 🚫 Disable functionality for unsupported sites
    searchButton.disabled = true;
    searchButton.title = translator[currentLanguage].unsupportedSite;
    searchButton.innerHTML = `${ICON.SPARKLING} ${translator[currentLanguage].unsupportedSite}`;
    listScreen.style.display = "none";

    // ⚠️ Show warning message
    const warning = document.createElement("div");
    warning.className = "warning-message";
    warning.innerHTML = `
       <p class="warning-message-label js-warning-message-label">${ICON.TRIANGLE_ALERT} <span class="warning-message-label-content">${translator[currentLanguage].warningTitle}</span></p>
       <ul>
         ${Object.entries(SUPPORTED_SITES)
           .map(
             ([domain, site]) =>
               `<li><a href="https://${domain}" target="_blank" rel="noopener noreferrer">${site.name}</a></li>`,
           )
           .join("")}
       </ul>
     `;
    listScreen.parentElement.appendChild(warning);
  } else {
    // ✅ Enable functionality for supported sites
    searchButton.title = `${translator[currentLanguage].sendTo} ${currentSite.name}`;
    searchButton.innerHTML = `${ICON.SPARKLING} ${translator[currentLanguage].sendTo} ${currentSite.name}`;
    listScreen.style.display = "grid";

    // 📝 Render template list
    Object.values(DATA).forEach((template) => {
      const item = document.createElement("div");
      item.className = "template-item js-template-item";
      item.textContent = translator[currentLanguage][template.name];
      item.setAttribute("data-template-name", template.name);
      item.addEventListener("click", () => showTemplate(template));
      listScreen.appendChild(item);
    });
  }

  // Handle back button
  backButton.addEventListener("click", () => {
    listScreen.style.display = "grid";
    detailScreen.style.display = "none";
  });

  // Theme toggle
  const setTheme = (isDark) => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // Initialize theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme === "dark");
  } else {
    setTheme(prefersDark.matches);
  }

  themeToggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(!isDark);
  });

  const updateLanguageContent = (lang) => {
    backButton.innerHTML = `${ICON.CHEVRON_LEFT} ${translator[lang].back}`;
    previewLabel.textContent = translator[lang].preview;

    if (currentSite) {
      searchButton.title = `${translator[lang].sendTo} ${currentSite.name}`;
      searchButton.innerHTML = `${ICON.SPARKLING} ${translator[lang].sendTo} ${currentSite.name}`;
    } else {
      searchButton.title = translator[lang].unsupportedSite;
      searchButton.innerHTML = `${ICON.SPARKLING} ${translator[lang].unsupportedSite}`;
    }

    // Update template list items
    document.querySelectorAll(".js-template-item").forEach((item) => {
      const templateName = item.getAttribute("data-template-name");
      item.innerHTML = translator[lang][templateName];
    });

    // Update input fields
    document.querySelectorAll(".js-input-label").forEach((label) => {
      const labelLanguageKey = label.getAttribute("data-template-input-label");
      label.innerText = translator[lang][labelLanguageKey];
    });

    document.querySelectorAll(".js-input-field").forEach((inputField) => {
      const placeholderLanguageKey = inputField.getAttribute(
        "data-template-input-placeholder",
      );
      inputField.placeholder = translator[lang][placeholderLanguageKey];
    });

    const currentTemplateId =
      document.documentElement.getAttribute("data-template-id");
    const currentTemplate = DATA[currentTemplateId];

    // Update preview
    currentTemplateId && updatePreview(currentTemplate);

    // Update template name
    if (currentTemplate && currentTemplate.name) {
      templateName.textContent = translator[lang][currentTemplate.name];
    }

    // Update warning message
    if (!currentSite) {
      document.querySelector(".js-warning-message-label").innerHTML =
        `${ICON.TRIANGLE_ALERT} <span class="warning-message-label-content">${translator[currentLanguage].warningTitle}</span>`;
    }
  };

  const setLanguage = (isVietnamese) => {
    const lang = isVietnamese ? "vi" : "en";
    document.documentElement.setAttribute("data-language", lang);
    localStorage.setItem("language", lang);
    updateLanguageContent(lang);
  };

  // Initialize language
  const savedLanguage = localStorage.getItem("language") || "en";
  setLanguage(savedLanguage === "vi");

  languageToggle.addEventListener("click", () => {
    const currentLang = document.documentElement.getAttribute("data-language");
    setLanguage(currentLang === "en");
  });

  searchButton.addEventListener("click", async () => {
    const promptContent = preview.innerText;
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const url = new URL(tab.url);
    const currentSite = SUPPORTED_SITES[url.hostname];

    if (!currentSite) {
      return;
    }

    await chrome.tabs.sendMessage(tab.id, {
      action: "updateDOM",
      selector: currentSite.selector,
      html: promptContent,
    });

    setTimeout(async () => {
      await chrome.tabs.sendMessage(tab.id, {
        action: "clickButton",
        selector: currentSite.submitSelector,
      });
    }, 500);

    const lang = document.documentElement.getAttribute("data-language");
    searchButton.innerHTML = `${ICON.SPARKLING} ${translator[lang].sentSuccess}`;
    setTimeout(() => {
      searchButton.innerHTML = `${ICON.SPARKLING} ${translator[lang].sendTo} ${currentSite.name}`;
    }, 2000);
  });
});
