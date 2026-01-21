const startBtn = document.getElementById("startBtn");
if (!startBtn) throw new Error("No startBtn found in the document.");
startBtn.addEventListener("click", async () => { 
  /** @type {HTMLInputElement | null} */ // @ts-ignore
  const startIn = document.getElementById('start');
  if (!startIn) throw new Error("No startIn found in the document.");
  /** @type {HTMLInputElement | null} */ // @ts-ignore
  const endIn = document.getElementById('end');
  if (!endIn) throw new Error("No endIn found in the document.");

  const start = parseFloat(startIn.value);
  const end = parseFloat(endIn.value);

  await sendRequest({ action: "START_LOOP", start, end }); 
});

const stopBtn = document.getElementById("stopBtn");
if (!stopBtn) throw new Error("No stopBtn found in the document.");
stopBtn.addEventListener("click", async () => { 
  await sendRequest({ action: "STOP_LOOP" });
});

/** @arg {{action: string} & Object<string, any>} request */
async function sendRequest(request) {
  const insideIframe = window.self !== window.top;
  if (insideIframe) { //TEST
    window.parent.postMessage(request, '*');
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, request);
}