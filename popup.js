let lb = { start: 0, end: 0, duration: 0 };

const loopBtn = document.getElementById('loop-btn');
if (!loopBtn) throw new Error("No loopBtn found in the document.");
const previouslyLooping = localStorage.getItem('loop') === String(true);
if (previouslyLooping) loopBtn.tLoop();
loopBtn.addEventListener('tloop', async (e) => {
  const loop = e.detail.isLooping;
  localStorage.setItem('loop', String(loop));
  if (loop)
    await await sendRequest({ action: "START_LOOP", lb });
  else
    await await sendRequest({ action: "STOP_LOOP" });
});
const lba = document.getElementById('lba');
if (!lba) throw new Error("No lba found in the document.");
lba.addEventListener('bound-set', async (e) => {
  const start = e.detail.value;
  const a = { lb: { start } };
  if (start === null) a.set = true;
  const response = await await sendRequest({ action: "UPDATE_LOOP_BOUND", ...a });
  lba.setValue(response.bound);
  lb.start = response.bound;
  localStorage.setItem('loopBound', JSON.stringify(lb));
});
const lbb = document.getElementById('lbb');
if (!lbb) throw new Error("No lbb found in the document.");
lbb.addEventListener('bound-set', async (e) => {
  const end = e.detail.value;
  const b = { lb: { end } };
  if (end === null) b.set = true;
  const response = await sendRequest({ action: "UPDATE_LOOP_BOUND", ...b });
  lbb.setValue(response.bound);
  lb.end = response.bound;
  localStorage.setItem('loopBound', JSON.stringify(lb));
});
const resetBtn = document.getElementById('reset-btn');
if (!resetBtn) throw new Error("No reset button found in the document.");
resetBtn.addEventListener('click', async () => {
  lba.setValue(lb.start = 0);
  lbb.setValue(lb.end = lb.duration || 0);
});

(async function initLoadBounds() {
  const saved = localStorage.getItem('loopBound');
  try {
    if (!saved) return;
    lb = JSON.parse(saved);
    if (lb.start >= 0) lba.setValue(lb.start);
    if (lb.end >= 0) lbb.setValue(lb.end);
  } catch (e) {
    console.error("Failed to parse saved loop bound data:", e);
  }
  if (lb.duration <= 0) {
    await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000));
    const response = await sendRequest({ action: "CHECK_DURATION" });
    lb.duration = response.duration;
    if (lb.end <= 0) lb.end = lb.duration;
    lbb.setValue(lb.end);
    localStorage.setItem('loopBound', JSON.stringify(lb));
  }
})();

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
