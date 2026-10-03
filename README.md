# Grok

The built-in sidebar chatbot does not include Grok. This extension tries to compensate with a sidebar button.

Requires Firefox 142 or newer.

## Install

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Choose `manifest.json` in this folder.

A temporary add-on is removed when Firefox quits. Load it again after the next start.

If the button is missing from the sidebar launcher, turn it on under **Customize sidebar**.

## Behavior

Closing the sidebar unloads the page. Opening it again returns to the last page on grok.com, including a subdomain. You stay signed in.
