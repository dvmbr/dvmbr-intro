import "./style.css";

class DvmbrIntro extends HTMLElement {
  shadow: ShadowRoot;
  private _text: string = "DVMBR";
  private _hasRendered = false;
  private _loadHandler?: () => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["text"];
  }

  connectedCallback() {
    this._text = this.getAttribute("text") || "DVMBR";

    const start = () => {
      if (this._hasRendered) return;
      this._hasRendered = true;
      this.renderIntro();
    };

    if (document.readyState === "complete") {
      start();
      return;
    }

    this._loadHandler = start;
    window.addEventListener("load", this._loadHandler, { once: true });
  }

  disconnectedCallback() {
    if (this._loadHandler) {
      window.removeEventListener("load", this._loadHandler);
      this._loadHandler = undefined;
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name !== "text" || oldValue === newValue) return;

    this._text = newValue || "DVMBR";

    // 초기 연결/초기 파싱 단계에서는 다시 렌더하지 않음
    if (!this._hasRendered) return;

    sessionStorage.removeItem("dvmbr_intro_seen");
    this.renderIntro();
  }

  private initIntro() {
    const introWrapper = this.shadow.getElementById("intro-wrapper");
    const intro = this.shadow.getElementById("intro");

    const INTRO_KEY = "dvmbr_intro_seen";
    const LIMIT = 24 * 60 * 60 * 1000;
    const lastSeen = sessionStorage.getItem(INTRO_KEY);
    const now = Date.now();

    let shouldShowIntro = true;

    if (lastSeen) {
      const diff = now - Number(lastSeen);
      if (diff < LIMIT) shouldShowIntro = false;
    }

    if (!shouldShowIntro) {
      introWrapper?.classList.add("hidden");
      return;
    }

    sessionStorage.setItem(INTRO_KEY, now.toString());

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      intro?.classList.add("hide");
      document.body.style.overflow = "";

      setTimeout(() => {
        if (intro) intro.style.display = "none";
      }, 600);
    }, 1300);
  }

  private renderIntro() {
    const text = this._text;

    this.shadow.innerHTML = /* HTML */ `
      <style>
        #intro-wrapper {
          position: relative;
        }

        #intro-wrapper.hidden {
          display: none;
        }

        #intro {
          height: 100dvh;
          width: 100dvw;
          font-family: "SpaceGrotesk", sans-serif;
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          color: #fff;
          font-size: clamp(5rem, 14vw, 10rem);
          font-weight: 900;
          letter-spacing: -0.08em;
          text-shadow: 0 0 20px
            color-mix(in srgb, currentColor 10%, transparent);
          opacity: 1;
          transform: scale(1);
          transition:
            opacity 0.6s ease,
            transform 0.6s ease;
        }

        #intro.hide {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        .intro-word {
          display: flex;
          gap: 0.02em;
          font-size: clamp(5rem, 14vw, 10rem);
          font-weight: 900;
          letter-spacing: -0.08em;
          text-shadow: 0 0 20px
            color-mix(in srgb, currentColor 10%, transparent);
        }

        .intro-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(24px);
          filter: blur(8px);
          animation: intro-char 0.6s ease forwards;
        }

        @keyframes intro-char {
          from {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      </style>

      <div id="intro-wrapper">
        <section id="intro">
          <div class="intro-word" aria-label="${text}">
            ${[...text]
              .map(
                (c, i) =>
                  `<span class="intro-char" style="animation-delay:${(i * 0.08).toFixed(2)}s">${c.toUpperCase()}</span>`,
              )
              .join("")}
          </div>
        </section>
      </div>
    `;

    this.initIntro();
  }
}

export function defineDvmbrIntro() {
  if (!customElements.get("dvmbr-intro")) {
    customElements.define("dvmbr-intro", DvmbrIntro);
  }
}
