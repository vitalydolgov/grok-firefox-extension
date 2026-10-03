// The sidebar page is destroyed on close. Report the document URL so the
// background can reopen this page instead of the Grok home page. Grok is a
// single-page app, so location changes are not always full loads.

let lastReportedUrl = "";

function reportPanelUrl(closing) {
  const url = location.href;
  if (!closing && url === lastReportedUrl) {
    return;
  }
  lastReportedUrl = url;
  browser.runtime.sendMessage({ type: "panel-url", url, closing }).catch(() => {});
}

reportPanelUrl(false);
window.addEventListener("pageshow", () => reportPanelUrl(false));
window.addEventListener("pagehide", () => reportPanelUrl(true));
window.addEventListener("hashchange", () => reportPanelUrl(false));
setInterval(() => reportPanelUrl(false), 250);
