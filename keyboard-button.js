class KeyboardButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = html`
      <style>
        :host { 
          font-family: sans-serif; 
          display: grid;
          place-items: center; 
        }
        button {
          width: auto;
          aspect-ratio: auto;
          border-radius: 25%;
          margin: 1%;
          background: #1e293b;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 0 #0f172a;
          transition: all 0.1s ease;
          cursor: pointer;

          &:active {
            transform: translateY(3px);
            box-shadow: inset 4px 4px 8px #000, 
                        inset -4px -4px 8px #333;
            border-color: #3b82f6;
          }
        }
        svg {
          width: 30px;
          height: 30px;
          fill: none;
          stroke: #4285f4; 
          stroke-width: 1.5px;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: all 0.3s ease;
          vertical-align: middle;

          rect {
            stroke-width: 2px;
            opacity: 0.9;
          }

          path {
            opacity: 0.7;
          }

          &:hover {
            stroke: #ffffff;
            filter: drop-shadow(0 0 4px rgba(66, 133, 244, 0.6));
            transform: translateY(-1px);
          }
        }
      </style>
      <button alt="Reset">
        <svg viewBox="0 0 48 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="5" width="40" height="14" rx="4" ry="2" />
          <path d="M12 9h4m6 0h4m6 0h4M10 12h6m4 0h6m4 0h8M14 15h20" />
        </svg>
      </button>
    `;
  }
  
  connectedCallback() {
    const btn = this._getBtn();
    btn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('show-keybinds', {
        bubbles: true,
        composed: true
      }));
    });
  }

  _getBtn() {
    const btn = this.shadowRoot.querySelector('button');
    if (!btn) throw new Error("Couldn't find reset button's button.");
    return btn;
  }
}

customElements.define('keyboard-button', KeyboardButton);