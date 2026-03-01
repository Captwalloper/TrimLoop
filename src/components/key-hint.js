class KeyHint extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
    const commandName = this.getAttribute('command-name');
    try {
      // @ts-ignore
      const isMac = navigator.userAgentData?.platform === "macOS";
      let cmds = await chrome.commands.getAll();
      const cmd = cmds.find(c => c.name == commandName);
      if (!cmd?.shortcut) throw new Error(`No command key found for ${commandName}`);
      const display = cmd.shortcut.replace('ctrl', isMac ? '⌘' : 'ctrl');
      if (!this.parentElement) throw new Error(`No parent element found for keyhint component!`);
      this.parentElement.title = display;
    } catch(err) {
      console.error(`Failed to determine hint for command: ${commandName}\n${err}`);
    }
  }
}
customElements.define('key-hint', KeyHint);