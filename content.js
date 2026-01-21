/** @type {number | null} */
let loopId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => handleRequest(request));

/** @arg {{action: string} & Object<string, any>} request */
function handleRequest(request) {
  switch (request.action) {
    case "START_LOOP":
      startPreciseLoop(request.start, request.end);
      break;
    case "STOP_LOOP":
      stopPreciseLoop();
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
    if (metadata.mediaTime >= end) {
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