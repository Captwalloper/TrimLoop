/** @type {number | null} */
let loopId = null;
let lb = { start: 0, end: 0 };
function isLooping() { return loopId != null; }

(async function main() {
  const video = await (async function ensureVideoReady(timeoutMs = 10000) {
    const vid = document.querySelector('video');
    if (!vid) throw new Error("No video found in the document.");

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

  lb.end = video.duration;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => handleRequest(request, sendResponse));

  /** @arg {{action: string, lb?: {start?: number, end?: number}, set?: boolean, reset?: boolean}} request @arg {CallableFunction} sendResponse */
  function handleRequest(request, sendResponse) {
    const response = (() => { switch (request.action) {
      case "TOGGLE_LOOP":
        chrome.runtime.sendMessage(toggleLoop());
        return null;
      case "UPDATE_LOOP_BOUND":
        const response = updateLoopBound(request);
        chrome.runtime.sendMessage({ lb, rlb: request.lb, set: request.set, reset: request.reset });
        return response;
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

  /*** @arg {{action: string, lb?: {start?: number, end?: number}, set?: boolean, reset?: boolean}} request */
  function updateLoopBound(request) {
    if (request.set && request.lb) {
      if (request.lb.start >= 0) lb.start = video.currentTime;
      else lb.end = video.currentTime;
    } else if (request.reset) {
      lb.start = 0;
      lb.end = video.duration;
    } else {
      Object.assign(lb, request.lb);
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
    const loop = (now, metadata) => {
      if (metadata.mediaTime  >= effectiveEnd) {
        video.currentTime = start;
      }
      loopId = video.requestVideoFrameCallback(loop);
    };
    loopId = video.requestVideoFrameCallback(loop);
  }

  function stopPreciseLoop() {
    const video = document.querySelector('video');
    if (video !== null && loopId !== null) {
      video.cancelVideoFrameCallback(loopId);
      loopId = null;
      video.pause();
      console.debug("Loop cancelled.");
    }
  }
})();
