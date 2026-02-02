const loopBtn = document.getElementById('loop-btn');
if (!loopBtn) throw new Error("No loopBtn found in the document.");
const previouslyLooping = localStorage.getItem('loop') === String(true);
if (previouslyLooping) loopBtn.tLoop();
loopBtn.addEventListener('tloop', async (e) => {
  await await sendRequest({ action: "TOGGLE_LOOP" });
});

const lba = document.getElementById('lba');
if (!lba) throw new Error("No lba found in the document.");
lba.addEventListener('bound-set', async (e) => {
  const start = e.detail.value;
  const a = { lb: { start } };
  if (start === null) a.set = true;
  const response = await await sendRequest({ action: "UPDATE_LOOP_BOUND", ...a });
  lba.setValue(response.bound);
});

const lbb = document.getElementById('lbb');
if (!lbb) throw new Error("No lbb found in the document.");
lbb.addEventListener('bound-set', async (e) => {
  const end = e.detail.value;
  const b = { lb: { end } };
  if (end === null) b.set = true;
  const response = await sendRequest({ action: "UPDATE_LOOP_BOUND", ...b });
  lbb.setValue(response.bound);
});

const resetBtn = document.getElementById('reset-btn');
if (!resetBtn) throw new Error("No reset button found in the document.");
resetBtn.addEventListener('click', reset);

setTimeout(reset, 5000);

async function reset() {
  const { duration } = await sendRequest({ action: "CHECK_DURATION" });
  lba.setValue(0);
  lbb.setValue(duration ?? 0);
}

/** @arg {{action: string} & Object<string, any>} request */
async function sendRequest(request) {
  const insideIframe = window.self !== window.top;
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
