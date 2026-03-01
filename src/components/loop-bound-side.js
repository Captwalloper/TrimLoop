class LoopBoundSide extends TrimLoopButton {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) throw new Error("No shadow root found in the component... somehow...");
    this.shadowRoot.innerHTML = html`
      <style>
        :host { font-family: sans-serif; }
        span {
          align-items: center;
          background: #4c5974;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 4px;
        }
        input {
          background: transparent;
          border: none;
          color: #3b82f6;
          font-weight: bold;
          max-width: 70px;
          outline: none;
          font-size: 1.25rem;
          overflow: elipsis;
        }
        button {
          background-color: transparent;
          border: none;
          border-radius: 6px;
          padding: 5px;
          cursor: pointer;
          font-size: 1.25rem;
          transition: background 0.2s;

          &:hover { background: #2563eb; }
        }
        svg {
          width: 24px;
          height: 24px;
          filter: drop-shadow(2px 4px 3px rgba(0,0,0,0.3));
          transition: transform 0.2s ease;

          rect {
            fill: #ff4d4d; 
            stroke: #b30000;
            stroke-width: 1;
          }
        }
      </style>
      <span>
        <input type="number" step="0.1">
        <button alt="Set to current video timestamp">
          <svg class="physical-pin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect class="pin-needle" x="48" y="40" width="4" height="50" rx="2" />
            <circle class="pin-head" cx="50" cy="35" r="20" />
            <circle class="pin-highlight" cx="44" cy="28" r="6" />
          </svg>
        </button>
      </span>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    this._getInput().addEventListener('input', (e) => {
      this._fireBoundSetEvent(this.getValue());
    });
  }

  onBtnClick() {
    this.visuallyActivateBtn();
    this._fireBoundSetEvent(-1); // set based on video timestamp
  }

  /** @arg {number} newValue */
  setValue(newValue) {
    if (isNaN(newValue)) throw Error(`newValue must be a number, was ${newValue}`);
    this._value = newValue;
    this._getInput().value = String(newValue);
  }

  getValue() {
    const rawValue = this._getInput().value;
    return Number(rawValue);
  }

  /** @private @arg {number | null} value */
  _fireBoundSetEvent(value) {
    this.dispatchEvent(new CustomEvent('bound-set', {
      detail: { value },
      bubbles: true,
      composed: true,
      cancelable: true
    }));
  }

  /** @private */
  _getInput() {
    if (!this.shadowRoot) throw new Error("No shadow root found in the component... somehow...");
    const input = this.shadowRoot.querySelector('input');
    if (!input) throw new Error("Couldn't find loop bound's input.");
    return input;
  }
}

customElements.define('loop-bound-side', LoopBoundSide);
