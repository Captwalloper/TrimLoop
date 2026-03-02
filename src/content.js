(async function main() {
  const storageKey = 'trimLoopContentsData';
  let { loopId, lb } = await (async function load() {
    const stored = /**@type {ContentData | undefined}}*/((await chrome.storage.local.get(storageKey))[storageKey]);
    return stored ? stored : { loopId: null, lb: { start: 0, end: 0 } };
  })();
  function isLooping() { return loopId != null; }
  
  const video = await (async function ensureVideoReady(timeoutMs = 10000) {
    const vid = document.querySelector('video');
    if (!vid) {
      console.debug("No video found in the document.");
      const nullVid = document.createElement('video');
      nullVid.title = "Intellisense wouldn't let me return null here...";
      return nullVid;
    }

    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
        if (vid.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          lb.end = vid.duration;
          return vid;
        }
        
        await new Promise(resolve => setTimeout(resolve, 10)); // sleep 10ms
    }
    throw new Error("Video load timed out.");
  })();
  if (video.title === "Intellisense wouldn't let me return null here...") return;

  lb.end = video.duration;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleRequest(request, sendResponse)
    .catch(e => console.debug(`${e}`)); // Perhaps the popup was closed. 
    return true;
  });
  
  /** @arg {TLRequest} request @arg {CallableFunction} sendResponse */
  async function handleRequest(request, sendResponse) {

    function respondToPopupOrKeybind(/**@type {{ [key: string]: any }}*/message) { sendResponse(message); }
    async function promptPopupToRespond(/**@type {PromptPopup}*/message) { await chrome.runtime.sendMessage(message); } 

    const response = await (async () => { switch (request.action) {
      case "TOGGLE_LOOP":
        await promptPopupToRespond({ request, ...toggleLoop()});
        return {};
      case "UPDATE_LOOP_BOUND":
        const rsp = updateLoopBound(/**@type {UpdateLoopBoundDetails}*/(request.details));
        await promptPopupToRespond({ request, lb });
        return rsp;
      case "CHECK_LOOP_BOUND":
        return { lb, isLooping: isLooping() };
      case "PING":
        return { isloaded: true };
      case "SAVE":
        chrome.storage.local.set({ [storageKey]: /**@type {ContentData}*/{ lb, loopId } });
        return {};
      default:
        if (Object.hasOwn(request, 'action'))
          console.log(`Unknown action: ${JSON.stringify(request)}`);
        return {};
    }})();
    respondToPopupOrKeybind(response);
  }

  function toggleLoop() {
    const looping = isLooping();
    if (!looping)
      startPreciseLoop(lb.start, lb.end);
    else 
      stopPreciseLoop();

    return { isLooping: !looping };
  }

  /** @arg {UpdateLoopBoundDetails} details */
  function updateLoopBound(details) {
    switch(details.mode) {
      case "set":
        Object.assign(lb, details.lb);
        break;
      case "reset":
        lb.start = 0;
        lb.end = video.duration;
        break;
      case "pin":
        if (typeof details.lb?.start === 'number') lb.start = video.currentTime;
        if (typeof details.lb?.end === 'number') lb.end = video.currentTime;
        break;
    }
    return { lb };
  }

  /** @arg {number} start @arg {number} end */
  function startPreciseLoop(start, end) {
    if (start < 0) {
      console.error("Start must be a positive number!");
      return;
    } else if (start > end) {
      console.error("Start must come earlier than end!");
      return;
    } else if (start > video.duration) {
      console.error("Start must be less than video duration.");
      return;
    } else if (end > video.duration) {
      console.error("End must be less than video duration.");
      return;
    }

    console.debug(`Looping from ${start} to ${end}`);
    video.currentTime = start; 
    video.play();

    const effectiveEnd = Math.min(end, video.duration - 0.12);
    const loop = /**@type {VideoFrameRequestCallback}*/((now, metadata) => {
      if (metadata.mediaTime  >= effectiveEnd) {
        video.currentTime = start;
      }
      loopId = video.requestVideoFrameCallback(loop);
    });
    loopId = video.requestVideoFrameCallback(loop);
  }

  function stopPreciseLoop() {
    if (loopId !== null) {
      video.cancelVideoFrameCallback(loopId);
      loopId = null;
      video.pause();
      console.debug("Loop cancelled.");
    }
  }
})();
