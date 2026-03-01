window.addEventListener('unload', async () => {
  await sendRequest({ action: "SAVE" });
});

const loopBtn = /**@type {LoopButton}*/(document.getElementById('loop-btn'));
if (!loopBtn) throw new Error("No loopBtn found in the document.");
loopBtn.addEventListener('tloop', async (e) => {
  await sendRequest({ action: "TOGGLE_LOOP" });
});

const keyboardBtn = /**@type {KeyboardButton}*/(document.getElementById('keyboard-btn'));
if (!keyboardBtn) throw new Error("No keyboardBtn found in the document.");
keyboardBtn.addEventListener('show-keybinds', async (e) => {
  openKeybinds();
});

const lba = /**@type {LoopBoundSide}*/(document.getElementById('lba'));
if (!lba) throw new Error("No lba found in the document.");
lba.addEventListener('bound-set', async (e) => {
  const evt = /**@type {CustomEvent}*/(e);
  const start = evt.detail.value;
  const details = /**@type {UpdateLoopBoundDetails}*/{
    mode: start >= 0 ? 'set' : 'pin',
    lb: { start }
  };
  const response = await sendRequest({ action: "UPDATE_LOOP_BOUND", details });
  if (details.mode === 'pin') lba.setValue(response.lb.start);
});

const lbb = /**@type {LoopBoundSide}*/(document.getElementById('lbb'));
if (!lbb) throw new Error("No lbb found in the document.");
lbb.addEventListener('bound-set', async (e) => {
  const evt = /**@type {CustomEvent}*/(e);
  const end = evt.detail.value;
  const details = /**@type {UpdateLoopBoundDetails}*/{
    mode: end >= 0 ? 'set' : 'pin',
    lb: { end }
  };
  const response = await sendRequest({ action: "UPDATE_LOOP_BOUND", details });
  if (details.mode === 'pin') lbb.setValue(response.lb.end);
});

const resetBtn = /**@type {ResetButton}*/(document.getElementById('reset-btn'));
if (!resetBtn) throw new Error("No reset button found in the document.");
resetBtn.addEventListener('reset', async function reset() {
  const { lb } = await sendRequest({ action: "UPDATE_LOOP_BOUND", details: { mode: 'reset' } });
  lba.setValue(lb.start);
  lbb.setValue(lb.end);
});

const insideIframe = window.self !== window.top; // TEST harness check
if (!insideIframe) {
  // avoid needing content script loaded in all tabs by loading per tab on demand
  document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) throw new Error("tabId not found.");

    try {
      const { loaded } = await sendRequest({ action: 'PING' });
      init();
    } catch (e) { // probably the script was injected yet...
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/content.js"]
      })
      .then(() => {
        init();
        console.debug("Injected content.js into tab:", tab.id);
      })
      .catch(err => console.error("Failed to inject content.js into tab:", tab.id, err));
    }
  });

  // Make UI buttons respond to keybinds. Because it feels satisfying.
  chrome.runtime.onMessage.addListener((/**@type {{ request: TLRequest, lb?: LoopBound, isLooping?: boolean }}*/message, sender, sendResponse) => {
    switch(message.request.action) {
      case 'TOGGLE_LOOP':
        if (typeof message?.isLooping === 'boolean') loopBtn.toggle(message.isLooping);
        break;
      case 'UPDATE_LOOP_BOUND':
        const { mode, lb: rlb } = /**@type {UpdateLoopBoundDetails}*/(message.request.details);
        const { lb } = message;
        if (typeof rlb?.start === 'number' && typeof lb?.start === 'number') {
          if (mode === 'pin') lba.visuallyActivateBtn();
          lba.setValue(lb.start);
        }
        if (typeof rlb?.end === 'number' && typeof lb?.end === 'number') {
          if (mode === 'pin') lbb.visuallyActivateBtn();
          lbb.setValue(lb.end);
        }
        if (mode === 'reset' && typeof lb?.end === 'number') {
          lba.setValue(0);
          lbb.setValue(lb.end);
          resetBtn.visuallyActivateBtn();
        }
        break;
    }
  });
} else { setTimeout(init, 250) }

function openKeybinds() {
  if (!insideIframe) chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  else console.warn("You can't open 'chrome://...' links from inside an iframe :(");
}

/** @arg {TLRequest} request */
async function sendRequest(request) {
  if (insideIframe) {
    return await new Promise((resolve, reject) => {
      window.addEventListener('message', function handleEvent(event) {
        resolve(event.data);
        window.removeEventListener('message', handleEvent);
      });
      window.parent.postMessage(request, '*');
    });
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("Unable to get active tabId.");
  const response = await chrome.tabs.sendMessage(tab.id, request);
  return response;
}

async function init() {
  const { lb, isLooping } = await sendRequest({ action: "CHECK_LOOP_BOUND" });
  lba.setValue(lb.start);
  lbb.setValue(lb.end);
  loopBtn.toggle(isLooping);
}
