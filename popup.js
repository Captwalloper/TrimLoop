const resetBtn = document.getElementById('reset-btn');
if (!resetBtn) throw new Error("No reset button found in the document.");
resetBtn.addEventListener('reset', async function reset() {
  const { lb } = await sendRequest({ action: "UPDATE_LOOP_BOUND", reset: true });
  lba.setValue(lb.start);
  lbb.setValue(lb.end);
});

const loopBtn = document.getElementById('loop-btn');
if (!loopBtn) throw new Error("No loopBtn found in the document.");
loopBtn.addEventListener('tloop', async (e) => {
  await await sendRequest({ action: "TOGGLE_LOOP" });
});

const keyboardBtn = document.getElementById('keyboard-btn');
if (!keyboardBtn) throw new Error("No keyboardBtn found in the document.");
keyboardBtn.addEventListener('show-keybinds', async (e) => {
  openKeybinds();
});

const lba = document.getElementById('lba');
if (!lba) throw new Error("No lba found in the document.");
lba.addEventListener('bound-set', async (e) => {
  const start = e.detail.value;
  const a = { lb: { start } };
  if (start === null) a.set = true;
  const response = await await sendRequest({ action: "UPDATE_LOOP_BOUND", ...a });
  lba.setValue(response.lb.start);
});

const lbb = document.getElementById('lbb');
if (!lbb) throw new Error("No lbb found in the document.");
lbb.addEventListener('bound-set', async (e) => {
  const end = e.detail.value;
  const b = { lb: { end } };
  if (end === null) b.set = true;
  const response = await sendRequest({ action: "UPDATE_LOOP_BOUND", ...b });
  lbb.setValue(response.lb.end);
});

const insideIframe = window.self !== window.top;
if (!insideIframe) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (Object.hasOwn(message, 'isLooping'))
      loopBtn.toggle(message.isLooping);
    else if (message.reset) {
      lba.setValue(message.lb.start);
      lbb.setValue(message.lb.end);
      resetBtn.simulateActive();
    } else if (message.set) {
      if (message.rlb.start >= 0) {
        lba.setValue(message.lb.start)
        lba.simulateActive();
      }
      else if (message.rlb.end >=0) {
        lbb.setValue(message.lb.end);
        lbb.simulateActive();
      }
    }
  });
}

function openKeybinds() {
  if (!insideIframe) chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  else console.warn("You can't open 'chrome://' links from inside an iframe... :(");
}

/** @arg {{action: string} & Object<string, any>} request */
async function sendRequest(request) {
  if (insideIframe) { //TEST
    return await new Promise((resolve, reject) => {
      window.addEventListener('message', function handleEvent(event) {
        resolve(event.data);
        window.removeEventListener('message', handleEvent);
      });
      window.parent.postMessage(request, '*');
    });
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id, request);
  return response;
}

async function init() {
  const { lb, isLooping } = await sendRequest({ action: "CHECK_LOOP_BOUND" });
  lba.setValue(lb.start);
  lbb.setValue(lb.end);
  loopBtn.toggle(isLooping);
}

setTimeout(init, 100);
