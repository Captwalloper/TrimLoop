chrome.commands.onCommand.addListener((command) => {
  console.debug(`Command triggered: ${command}`);
  switch (command) {
    case "toggle-loop":
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "TOGGLE_LOOP" });
      });
      break;
    case "set-start": 
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "UPDATE_LOOP_BOUND", lb: { start: 0 },  set: true });
      });
      break;
    case "set-end":
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "UPDATE_LOOP_BOUND", lb: { end: 0 },set: true });
      });
      break;
    case "reset-loop-bounds":
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "UPDATE_LOOP_BOUND", reset: true });
      });
      break;
    default:
      console.warn('Unknown command');
      break;
  }
});