const shortcutBox = document.getElementById("shortcut-enabled");
let shortcutPreferenceLoaded = false;

function showShortcutEnabled(enabled) {
  shortcutBox.checked = enabled;
}

browser.storage.local.get(SHORTCUT_ENABLED_KEY).then((stored) => {
  if (shortcutPreferenceLoaded) {
    return;
  }
  showShortcutEnabled(stored[SHORTCUT_ENABLED_KEY] !== false);
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !Object.hasOwn(changes, SHORTCUT_ENABLED_KEY)) {
    return;
  }
  shortcutPreferenceLoaded = true;
  showShortcutEnabled(changes[SHORTCUT_ENABLED_KEY].newValue !== false);
});

shortcutBox.addEventListener("change", () => {
  shortcutPreferenceLoaded = true;
  browser.storage.local
    .set({ [SHORTCUT_ENABLED_KEY]: shortcutBox.checked })
    .catch((error) => {
      console.error("Failed to store the shortcut preference", error);
    });
});
