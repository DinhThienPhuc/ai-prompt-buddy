const sanitizeHTML = (str) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "updateDOM") {
    try {
      if (!request.selector || !request.html) {
        sendResponse({
          success: false,
          error: "Missing required parameters",
        });
        return true;
      }

      const elements = document.querySelectorAll(request.selector);
      if (elements.length === 0) {
        sendResponse({ success: false, error: "No elements found" });
        return true;
      }

      const sanitizedHTML = sanitizeHTML(request.html);

      elements.forEach((el) => {
        el.innerHTML = sanitizedHTML;
      });

      sendResponse({ success: true });
    } catch (error) {
      sendResponse({
        success: false,
        error: `Failed to update DOM: ${error.message}`,
      });
    }
  }

  if (request.action === "clickButton") {
    try {
      if (!request.selector) {
        sendResponse({
          success: false,
          error: "Missing required parameters",
        });
        return true;
      }

      const button = document.querySelector(request.selector);
      if (!button) {
        sendResponse({ success: false, error: "Button not found" });
        return true;
      }

      button.click();

      sendResponse({ success: true });
    } catch (error) {
      sendResponse({
        success: false,
        error: `Failed to click button: ${error.message}`,
      });
    }
  }
  return true;
});
