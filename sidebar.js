const GROK_PANEL_URL = "https://grok.com/";

const status = document.getElementById("status");
const openTab = document.getElementById("open-tab");

// Shown only until the background (or this page) points the sidebar at
// grok.com. Once that navigation starts, this document is replaced.
browser.sidebarAction.setPanel({ panel: GROK_PANEL_URL }).catch((error) => {
  console.error(error);
  status.textContent = "Grok could not open in the sidebar.";
  openTab.hidden = false;
  openTab.addEventListener("click", (event) => {
    event.preventDefault();
    browser.tabs.create({ url: GROK_PANEL_URL });
  });
});
