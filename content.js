// Variable stored in the content script's global scope
let activeLoopId = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_LOOP") {
    startPreciseLoop(request.start, request.end);
    sendResponse({ status: "Loop started" });
  } else if (request.action === "STOP_LOOP") {
    stopPreciseLoop();
    sendResponse({ status: "Loop stopped" });
  }
});

/** @arg {number} startTime @arg {number} endTime */
function startPreciseLoop(startTime, endTime) {
  if (endTime <= startTime) {
    console.warn("B must be greater than A");
    return;
  }

  const video = document.querySelector('video');
  if (!video) {
    console.warn("No <video> elements found in the document.");
    return;
  }

  stopPreciseLoop();
  console.info(`Looping from ${startTime} to ${endTime}`);
  video.currentTime = startTime; 
  video.play();

  const loop = (now, metadata) => {
    if (metadata.mediaTime >= endTime) {
      video.currentTime = startTime;
    }
    // Update the scoped variable with the new request ID
    activeLoopId = video.requestVideoFrameCallback(loop);
  };

  activeLoopId = video.requestVideoFrameCallback(loop);
}

function stopPreciseLoop() {
  const video = document.querySelector('video');
  if (video && activeLoopId !== null) {
    video.cancelVideoFrameCallback(activeLoopId);
    activeLoopId = null;
    video.pause();
    console.log("Precise loop cancelled.");
  }
}