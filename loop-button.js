class LoopButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = html`
      <style>
        :host { font-family: sans-serif; }
        button {
          width: fit-content;
          aspect-ratio: 1 / 1;
          border-radius: 50%;

          margin: 2%;
          background: #1e293b;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 0 #0f172a; /* A solid "bottom" to give it height */
          transition: all 0.1s ease;
          cursor: pointer;
        }
        button.is-active {
          transform: translateY(3px); /* Moves the button down */
          /* Pressed-in look */
          box-shadow: inset 4px 4px 8px #000, 
                      inset -4px -4px 8px #333;
          border-color: #3b82f6; /* Optional: glow color to show it's "On" */
        }
        svg {
          transition: transform 0.5s ease-in;
          transform-origin: center;
        }
        svg:hover {
          transform: rotate(360deg);
        }
      </style>
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 1l4 4-4 4"></path>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <path d="M7 23l-4-4 4-4"></path>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
      </button>
    `;
  }
  
  connectedCallback() {
    const btn = this.shadowRoot.querySelector('button');
    if (!btn) {
      console.error("Couldn't find loop button's button.");
      return;
    }
    this.toggleLoop = function() {
      const isLooping = btn.classList.toggle('is-active');
      this.dispatchEvent(new CustomEvent('tloop', {
        detail: { isLooping },
        bubbles: true,
        composed: true
      }));
    };
    btn.addEventListener('click', () => {
      this.tLoop();
    });
  }

  tLoop() {
    this.toggleLoop();
  }
}

customElements.define('loop-button', LoopButton);