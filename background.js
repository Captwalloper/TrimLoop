chrome.commands.onCommand.addListener((command) => {
  console.log(`Command triggered: ${command}`);
  if (command === "run-feature-x") {
    // Your custom logic here
    doSomethingCool();
  }
});

function doSomethingCool() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    // Example: change the tab's title or send a message
    console.log("Feature X is running on tab:", tabs[0].id);
  });
}