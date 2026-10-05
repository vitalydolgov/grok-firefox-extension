// Option+Command+J on macOS produces a different character (∆), so Firefox
// does not match the extension command's key="J". Catch the physical key.
// Ctrl+Alt+J is the same chord on Windows and Linux.

const mac = navigator.platform.startsWith("Mac");
let shortcutEnabled = true;

browser.storage.local.get(SHORTCUT_ENABLED_KEY).then((stored) => {
  shortcutEnabled = stored[SHORTCUT_ENABLED_KEY] !== false;
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !Object.hasOwn(changes, SHORTCUT_ENABLED_KEY)) {
    return;
  }
  shortcutEnabled = changes[SHORTCUT_ENABLED_KEY].newValue !== false;
});

function isNewConversationKey(event) {
  if (event.repeat || event.shiftKey || event.code !== "KeyJ") {
    return false;
  }
  if (mac) {
    return event.metaKey && event.altKey && !event.ctrlKey;
  }
  return event.ctrlKey && event.altKey && !event.metaKey;
}

document.addEventListener(
  "keydown",
  (event) => {
    if (!shortcutEnabled || !isNewConversationKey(event)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    browser.runtime.sendMessage({ type: "new-conversation" }).catch(() => {});
  },
  true
);
