const html = String.raw; // For intellisense

class LoopBoundSide extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._value = this.getAttribute('value') || 0;

    // Build Structure
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
          &:active {
            transform: translateY(3px);
            box-shadow: inset 4px 4px 8px #000, 
                        inset -4px -4px 8px #333;
            border-color: #3b82f6;
          }
          &.is-active {
            transform: translateY(3px);
            box-shadow: inset 4px 4px 8px #000, 
                        inset -4px -4px 8px #333;
            border-color: #3b82f6;
          }
        }
        svg {
          width: 24px;
          height: 24px;
          filter: drop-shadow(2px 4px 3px rgba(0,0,0,0.3));
          transition: transform 0.2s ease;

          rect {
            fill: #ff4d4d; /* Bright red plastic */
            stroke: #b30000;
            stroke-width: 1;
          }
        }
      </style>
      <span>
        <input type="number" step="0.1" value="${this._value}">
        <button alt="Set to current video timestamp">
          <!-- <svg viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg> -->
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
    const btn = this.shadowRoot.querySelector('button');
    const input = this.shadowRoot.querySelector('input');

    function fireBoundSetEvent(ctx, val) {
      ctx.dispatchEvent(new CustomEvent('bound-set', {
        detail: { value: val},
        bubbles: true,
        composed: true,
        cancelable: true
      }));
    }

    btn.addEventListener('click', () => {
      fireBoundSetEvent(this, null);
    });

    input.addEventListener('input', (e) => {
      this._value = e.target.value;
      fireBoundSetEvent(this, Number(this._value));
    });
  }

  simulateActive() {
    this._getBtn().classList.toggle('is-active', true);
    setTimeout(() => {this._getBtn().classList.toggle('is-active', false)}, 200);
  }

  /** @arg {number} newValue */
  setValue(newValue) {
    if (isNaN(newValue)) throw Error(`newValue must be a number, was ${newValue}`);
    this._value = newValue;
    this.shadowRoot.querySelector('input').value = newValue;
  }

  getValue() {
    return this._value;
  }

  _getBtn() {
    const btn = this.shadowRoot.querySelector('button');
    if (!btn) throw new Error("Couldn't find reset button's button.");
    return btn;
  }
}

customElements.define('loop-bound-side', LoopBoundSide);
