// The sidebar page is destroyed on close. Report the document URL so the
// background can reopen this page instead of the Grok home page. Grok is a
// single-page app, so location changes are not always full loads.
//
// This script also runs in ordinary grok.com tabs. The background tells those
// documents to stop; only the sidebar should update the restored page.

let lastReportedUrl = "";
let track = true;
let timer = 0;

function stopTracking() {
  track = false;
  if (timer) {
    clearInterval(timer);
    timer = 0;
  }
}

function reportPanelUrl(closing) {
  if (!track) {
    return;
  }
  const url = location.href;
  if (!closing && url === lastReportedUrl) {
    return;
  }
  browser.runtime
    .sendMessage({ type: "panel-url", url, closing })
    .then((response) => {
      if (response && response.sidebar === false) {
        stopTracking();
        return;
      }
      lastReportedUrl = url;
    })
    .catch(() => {});
}

reportPanelUrl(false);
window.addEventListener("pageshow", () => reportPanelUrl(false));
window.addEventListener("pagehide", () => reportPanelUrl(true));
window.addEventListener("hashchange", () => reportPanelUrl(false));
timer = setInterval(() => reportPanelUrl(false), 250);
