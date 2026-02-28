class KeyHint extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
    const commandName = this.getAttribute('command-name');
    let display = '';
    try {
      let cmds = await chrome.commands.getAll();
      const cmd = cmds.find(c => c.name == commandName);
      if (!cmd) console.warn(`No command key found for ${commandName}`);
      const isMac = navigator.userAgentData?.platform === "macOS";
      display = cmd.shortcut.replace('ctrl', isMac ? '⌘' : 'ctrl');
    } catch(err) {
      console.error(`Failed to determine hint for command: ${commandName}\n${err}`);
    }

    this.parentElement.title = display;
  }
}
customElements.define('key-hint', KeyHint);