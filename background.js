// Firefox's built-in chatbot loads Claude, ChatGPT, Gemini, and Mistral as a
// top-level document in the sidebar browser. Grok is not in that list.
// grok.com sends X-Frame-Options: DENY and a frame-ancestors policy, so an
// iframe cannot host it. sidebarAction.setPanel navigates the sidebar
// browser itself, which is the same kind of load the built-in chatbot uses.
//
// Closing the sidebar unloads that document. The next open loads whatever
// URL was last passed to setPanel, so navigation inside Grok has to be
// recorded and applied after the panel closes. Applying it while the panel
// is open calls SidebarController.show, which reloads the page.
//
// Context-menu actions (summarize, explain, quiz, proofread) belong to the
// built-in chatbot and are intentionally not implemented here.

let panelUrl = GROK_HOME;
let wasOpen = false;
let applyChain = Promise.resolve();

function rememberPanelUrl(value) {
  const next = grokPanelUrl(value);
  if (!next || next === panelUrl) {
    return;
  }
  panelUrl = next;
  browser.storage.local.set({ [PANEL_URL_KEY]: next }).catch((error) => {
    console.error("Failed to store the Grok sidebar URL", error);
  });
}

function applySavedPanel() {
  const run = applyChain.then(async () => {
    // panelUrl can change while setPanel is in flight. Read it again after
    // each attempt so a slow home-page write cannot clobber a later page.
    for (let attempt = 0; attempt < 4; attempt++) {
      const desired = panelUrl;
      const current = grokPanelUrl(await browser.sidebarAction.getPanel({}));
      if (current === desired) {
        return;
      }
      await browser.sidebarAction.setPanel({ panel: desired });
    }
  });
  applyChain = run.catch((error) => {
    console.error("Failed to set the Grok sidebar panel", error);
  });
  return applyChain;
}

async function noteClosed() {
  const isOpen = await browser.sidebarAction.isOpen({});
  const closed = wasOpen && !isOpen;
  wasOpen = isOpen;
  if (closed) {
    await applySavedPanel();
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (!message || message.type !== "panel-url") {
    return undefined;
  }
  rememberPanelUrl(message.url);
  if (!message.closing) {
    wasOpen = true;
    return undefined;
  }
  return browser.sidebarAction.isOpen({}).then((isOpen) => {
    wasOpen = isOpen;
    if (!isOpen) {
      return applySavedPanel();
    }
    return undefined;
  });
});

async function init() {
  const stored = await browser.storage.local.get(PANEL_URL_KEY);
  const saved = grokPanelUrl(stored[PANEL_URL_KEY]);
  if (saved) {
    panelUrl = saved;
  }
  try {
    wasOpen = await browser.sidebarAction.isOpen({});
  } catch (error) {
    console.error(error);
  }
  await applySavedPanel();
  console.info("Grok sidebar panel:", panelUrl);
  setInterval(() => {
    noteClosed().catch((error) => {
      console.error(error);
    });
  }, 250);
}

init().catch((error) => {
  console.error("Failed to restore the Grok sidebar panel", error);
});
