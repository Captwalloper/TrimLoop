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
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 4px;
        }
        input {
          flex: 3;
          background: transparent;
          border: none;
          color: #3b82f6;
          font-weight: bold;
          max-width: 60px;
          outline: none;
          font-size: 1.25rem;
          overflow: elipsis;
        }
        button {
          flex: 1;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 5px;
          cursor: pointer;
          font-size: 1.25rem;
          transition: background 0.2s;
        }
        button:hover { background: #2563eb; }
        hr {
          width: 100%;
          height: 1px;
        }
      </style>
      <div class="container">
        <input type="number" step="0.1" value="${this._value}">
        <hr>
        <button alt="Set to current video timestamp">SET</button>
      </div>
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

  // Public method to update the value from outside
  setValue(newValue) {
    this._value = newValue;
    this.shadowRoot.querySelector('input').value = newValue;
  }

  getValue() {
    return this._value;
  }
}

customElements.define('loop-bound-side', LoopBoundSide);
