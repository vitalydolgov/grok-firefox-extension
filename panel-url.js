var GROK_HOME = "https://grok.com/";
var PANEL_URL_KEY = "panelUrl";
// Absent or any value other than false keeps the sidebar shortcut.
var SHORTCUT_ENABLED_KEY = "shortcutEnabled";

// Firefox drops the sidebar document when the panel closes and loads
// sidebarAction's panel URL the next time it opens. Only the Grok app on
// the default HTTPS port is a place we can restore. Fragments are dropped so
// a one-time token in the hash is not stored or replayed.
function grokPanelUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname;
    if (url.protocol !== "https:" || url.port !== "") {
      return null;
    }
    if (host !== "grok.com" && host !== "www.grok.com") {
      return null;
    }
    url.username = "";
    url.password = "";
    url.hash = "";
    return url.href;
  } catch (error) {
    return null;
  }
}
