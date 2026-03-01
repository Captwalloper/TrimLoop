let loopId = /**@type {number | null}*/(null);
let lb = { start: 0, end: 0 };
function isLooping() { return loopId != null; }

(async function main() {
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
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => handleRequest(request, sendResponse));
  
  /** @arg {TLRequest} request @arg {CallableFunction} sendResponse */
  function handleRequest(request, sendResponse) {
    const response = (() => { switch (request.action) {
      case "TOGGLE_LOOP":
        chrome.runtime.sendMessage({ request, ...toggleLoop()});
        return null;
      case "UPDATE_LOOP_BOUND":
        const rsp = updateLoopBound(/**@type {UpdateLoopBoundDetails}*/(request.details));
        chrome.runtime.sendMessage({ request, lb });
        return rsp;
      case "CHECK_LOOP_BOUND":
        return { lb, isLooping: isLooping() };
      default:
        if (Object.hasOwn(request, 'action'))
          console.log(`Unknown action: ${JSON.stringify(request)}`);
        return null;
    }})();
    if (response) sendResponse(response);
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
    if (start > end) {
      console.error("Start must come earlier than end!");
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
