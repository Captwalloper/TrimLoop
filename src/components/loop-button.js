const html = String.raw; // For intellisense

/** Baseclass for TrimLoop button centric controls @abstract */
class TrimLoopButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const baseStyle = new CSSStyleSheet();
    baseStyle.replaceSync(html`
      button.is-active {
        transform: translateY(3px);
        box-shadow: inset 4px 4px 8px #000, 
                    inset -4px -4px 8px #333;
        border-color: #3b82f6;
      }
    `);
    if (!this.shadowRoot) throw new Error("No shadow root found in the component... somehow...");
    this.shadowRoot.adoptedStyleSheets.push(baseStyle);
    const btn = this._getBtn();
    btn.addEventListener('click', () => {
      this.onBtnClick();
    });
  }

  /** Hook for the contained button's click event; override as needed. @abstract */
  onBtnClick() {}

  /** Visually show activation of the contained button -- without onclick effects. @arg durationMs Activation duration in milliseconds. */
  visuallyActivateBtn(durationMs = 200) {
    const btn = this._getBtn();
    btn.classList.toggle('is-active', true);
    setTimeout(() => { btn.classList.toggle('is-active', false) }, durationMs);
  }

  /** @protected */
  _getBtn() {
    if (!this.shadowRoot) throw new Error("No shadow root found in the component... somehow...");
    const btn = this.shadowRoot.querySelector('button');
    if (!btn) throw new Error("Couldn't find button."); // TODO: identify component better
    return btn;
  }
}

class LoopButton extends TrimLoopButton {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) throw new Error("No shadow root found in the component... somehow...");
    this.shadowRoot.innerHTML = html`
      <style>
        :host { 
          font-family: sans-serif; 
          display: grid;
          place-items: center; 
        }
        button {
          width: fit-content;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          margin: 2%;
          background: #1e293b;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 0 #0f172a;
          transition: all 0.1s ease;
          cursor: pointer;
        }
        svg {
          transition: transform 0.5s ease-in;
          transform-origin: center;
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2px;
          stroke-linecap: round;
          stroke-linejoin: round;

          &:hover {
            transform: rotate(360deg);
          }
        }
      </style>
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M17 1l4 4-4 4"></path>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <path d="M7 23l-4-4 4-4"></path>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
      </button>
    `;
  }
  
  onBtnClick() {
    this._getBtn().classList.toggle('is-active');
    this.dispatchEvent(new CustomEvent('tloop', {
      bubbles: true,
      composed: true
    }));
  }

  /** @arg {boolean} isActive */
  toggle(isActive) {
    this._getBtn().classList.toggle('is-active', isActive);
  }
}

customElements.define('loop-button', LoopButton);