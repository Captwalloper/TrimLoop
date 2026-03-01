class ResetButton extends TrimLoopButton {
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
          margin: 1%;
          background: #1e293b;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 0 #0f172a;
          transition: all 0.1s ease;
          cursor: pointer;
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

  onBtnClick() {
    this.visuallyActivateBtn();
    this.dispatchEvent(new CustomEvent('reset', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('reset-button', ResetButton);