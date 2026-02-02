/** @type {number | null} */
let loopId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => handleRequest(request, sendResponse));

/** @arg {{action: string} & Object<string, any>} request @arg {CallableFunction} sendResponse */
function handleRequest(request, sendResponse) {
  switch (request.action) {
    case "START_LOOP":
      startPreciseLoop(request.lb.start, request.lb.end);
      break;
    case "STOP_LOOP":
      stopPreciseLoop();
      break;
    case "UPDATE_LOOP_BOUND":
      const boundSide = Object.keys(request.lb)[0]; // TODO fix: assumes 1 key, but sometimes there's set
      if (request.set) {
        const video = document.querySelector('video');
        if (!video) {
          console.error("No <video> elements found in the document.");
          return;
        }
        request.lb[boundSide] = video.currentTime;
      } 
      sendResponse({ bound: request.lb[boundSide] });
      break;
    case "CHECK_DURATION":
      const video = document.querySelector('video');
      if (!video) {
        console.error("No <video> elements found in the document.");
        return;
      }
      sendResponse({ duration: video.duration });
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


