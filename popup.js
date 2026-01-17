const startBtn = document.getElementById("startBtn");
if (!startBtn) throw new Error("No startBtn found in the document.");
startBtn.addEventListener("click", async () => { 
  /** @type {HTMLInputElement} */ // @ts-ignore
  const startIn = document.getElementById('start');
  if (!startIn) throw new Error("No startIn found in the document.");
  /** @type {HTMLInputElement} */ // @ts-ignore
  const endIn = document.getElementById('end');
  if (!endIn) throw new Error("No endIn found in the document.");

  const start = parseFloat(startIn.value);
  const end = parseFloat(endIn.value);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: "START_LOOP",
    start: start,
    end: end
  });
});

const stopBtn = document.getElementById("stopBtn");
if (!stopBtn) throw new Error("No stopBtn found in the document.");
stopBtn.addEventListener("click", async () => { 
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "STOP_LOOP" });
});