class ResetButton extends HTMLElement {
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
          width: fit-content;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          margin: 1%;
          background: #1e293b;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 0 #0f172a;
          transition: all 0.1s ease;
          cursor: pointer;

          &.is-active {
            transform: translateY(3px);
            box-shadow: inset 4px 4px 8px #000, 
                        inset -4px -4px 8px #333;
            border-color: #3b82f6;
          }

          &:active {
            transform: translateY(3px);
            box-shadow: inset 4px 4px 8px #000, 
                        inset -4px -4px 8px #333;
            border-color: #3b82f6;
          }
        }
        svg {
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.75px;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      </style>
      <button alt="Reset">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M6.35 6.35C7.8 4.9 9.79 4 12 4c4.42 0 7.99 3.58 7.99 8s-3.57 8-7.99 8c-3.73 0-6.84-2.55-7.73-6h2.08c.82 2.33 3.04 4 5.65 4 3.31 0 6-2.69 6-6s-2.69-6-6-6c-1.66 0-3.14.69-4.22 1.78L11 11H4V4l2.35 2.35z"/>
        </svg>
      </button>
    `;
  }
  
  connectedCallback() {
    const btn = this._getBtn();
    btn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('reset', {
        bubbles: true,
        composed: true
      }));
    });
  }

  simulateActive() {
    this._getBtn().classList.toggle('is-active', true);
    setTimeout(() => {this._getBtn().classList.toggle('is-active', false)}, 200);
  }

  _getBtn() {
    const btn = this.shadowRoot.querySelector('button');
    if (!btn) throw new Error("Couldn't find reset button's button.");
    return btn;
  }
}

customElements.define('reset-button', ResetButton);