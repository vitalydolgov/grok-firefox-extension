// Firefox's built-in chatbot loads Claude, ChatGPT, Gemini, and Mistral as a
// top-level document in the sidebar browser. Grok is not in that list.
// grok.com sends X-Frame-Options: DENY and a frame-ancestors policy, so an
// iframe cannot host it. sidebarAction.setPanel navigates the sidebar
// browser itself, which is the same kind of load the built-in chatbot uses.
//
// Context-menu actions (summarize, explain, quiz, proofread) belong to the
// built-in chatbot and are intentionally not implemented here.

const GROK_PANEL_URL = "https://grok.com/";

function showGrokPanel() {
  return browser.sidebarAction.setPanel({ panel: GROK_PANEL_URL }).then(
    () => {
      console.info("Grok sidebar panel:", GROK_PANEL_URL);
    },
    (error) => {
      console.error("Failed to set the Grok sidebar panel", error);
    }
  );
}

browser.runtime.onInstalled.addListener(showGrokPanel);
browser.runtime.onStartup.addListener(showGrokPanel);
showGrokPanel();
