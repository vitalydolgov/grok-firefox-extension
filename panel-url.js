var GROK_HOME = "https://grok.com/";
var PANEL_URL_KEY = "panelUrl";

// Firefox drops the sidebar document when the panel closes and loads
// sidebarAction's panel URL the next time it opens. Only an https Grok URL
// is a place we can restore.
function grokPanelUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname;
    if (url.protocol !== "https:") {
      return null;
    }
    if (host !== "grok.com" && !host.endsWith(".grok.com")) {
      return null;
    }
    url.username = "";
    url.password = "";
    return url.href;
  } catch (error) {
    return null;
  }
}
