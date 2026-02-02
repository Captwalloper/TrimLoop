/** @type {number | null} */
let loopId = null;
let lb = { start: 0, end: 0, duration: 0 };

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => handleRequest(request, sendResponse));

/** @arg {{action: string} & Object<string, any>} request @arg {CallableFunction} sendResponse */
function handleRequest(request, sendResponse) {
  switch (request.action) {
    case "TOGGLE_LOOP":
      function isLooping() { return loopId != null; }
      if (!isLooping())
        startPreciseLoop(lb.start, lb.end);
      else 
        stopPreciseLoop();
      break;
    case "UPDATE_LOOP_BOUND":
      if (request.set) {
        const boundSide = Object.keys(request.lb)[0];
        const video = document.querySelector('video');
        if (!video) {
          console.error("No <video> elements found in the document.");
          return;
        }
        lb[boundSide] = video.currentTime;
        sendResponse({ bound: request.lb[boundSide] });
      } else {
        Object.assign(lb, request.lb);
      }
      break;
    case "CHECK_DURATION":
      const video = document.querySelector('video');
      if (!video) {
        console.error("No <video> elements found in the document.");
        return;
      }
      sendResponse({ duration: video.duration });
      break;
    default:
      console.log(`Unknown action: ${request.action}`);
      break;
  }
}

/** @arg {number} start @arg {number} end */
function startPreciseLoop(start, end) {
  if (start > end) {
    console.error("Start must come earlier than end!");
    return;
  }

  const video = document.querySelector('video');
  if (!video) {
    console.error("No <video> elements found in the document.");
    return;
  }

  stopPreciseLoop();
  console.info(`Looping from ${start} to ${end}`);
  video.currentTime = start; 
  video.play();

  const loop = (now, metadata) => {
    if (video.currentTime >= end) {
      video.currentTime = start;
    }
    loopId = video.requestVideoFrameCallback(loop);
    if (video.paused) video.play(); // chrome pauses when reaching duration; force play
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


