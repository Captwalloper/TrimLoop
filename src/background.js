chrome.commands.onCommand.addListener((command) => {
  console.debug(`Command triggered: ${command}`);
  switch (command) {
    case "toggle-loop":
      sendMessage({ action: 'TOGGLE_LOOP' });
      break;
    case "set-start": 
      sendMessage({ action: 'UPDATE_LOOP_BOUND', details: /**@type {UpdateLoopBoundDetails}*/({ mode: 'pin', lb: { start: 1 } })});
      break;
    case "set-end":
      sendMessage({ action: 'UPDATE_LOOP_BOUND', details: /**@type {UpdateLoopBoundDetails}*/({ mode: 'pin', lb: { end: 1 } })});
      break;
    case "reset-loop-bounds":
      sendMessage({ action: 'UPDATE_LOOP_BOUND', details: /**@type {UpdateLoopBoundDetails}*/({ mode: 'reset' })});
      break;
    default:
      console.warn('Unknown command');
      break;
  }
});

/** @arg {TLRequest} request*/
function sendMessage(request) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const tabId = tabs.find(x => true)?.id;
    if (!tabId) throw new Error('Unable to determine tabId.');
    chrome.tabs.sendMessage(tabId, request);
  });
}