import "./style.css";

const ATTRS = {
  text: "text",
  textColor: "text-color",
  backgroundColor: "background-color",
} as const;

const DEFAULTS = {
  text: "DVMBR",
  textColor: "#fff",
  backgroundColor: "#000",
  introKey: "dvmbr_intro_seen",
  cooldownMs: 24 * 60 * 60 * 1000,
  hideDelayMs: 1300,
  fadeDurationMs: 600,
  maxLength: 11,
  minLength: 3,
} as const;

type IntroOptions = {
  text: string;
  textColor: string;
  backgroundColor: string;
};

class DvmbrIntro extends HTMLElement {
  shadow: ShadowRoot;
  private _text: string = DEFAULTS.text;
  private _textColor: string = DEFAULTS.textColor;
  private _bgColor: string = DEFAULTS.backgroundColor;
  private _hasRendered = false;
  private _loadHandler?: () => void;
  private sanitizeText(text: string) {
    const cleaned = text.replace(/\s+/g, "");

    if (
      cleaned.length > DEFAULTS.maxLength ||
      cleaned.length < DEFAULTS.minLength
    ) {
      console.warn(
        `[dvmbr-intro] text length out of bounds (min ${DEFAULTS.minLength}, max ${DEFAULTS.maxLength}): "${cleaned}"`,
      );
    }

    return cleaned.slice(0, DEFAULTS.maxLength);
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["text"];
  }

  connectedCallback() {
    this._text = this.getAttribute("text") || DEFAULTS.text;
    this._textColor = this.getAttribute("text-color") || DEFAULTS.textColor;
    this._bgColor =
      this.getAttribute("background-color") || DEFAULTS.backgroundColor;

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
    if (oldValue === newValue) return;

    if (!this._hasRendered) return;

    if (
      name === ATTRS.text ||
      name === ATTRS.textColor ||
      name === ATTRS.backgroundColor
    ) {
      sessionStorage.removeItem(DEFAULTS.introKey);
      this.renderIntro();
    }
  }

  private getOptions(): IntroOptions {
    return {
      text: this.getAttribute(ATTRS.text) || DEFAULTS.text,
      textColor: this.getAttribute(ATTRS.textColor) || DEFAULTS.textColor,
      backgroundColor:
        this.getAttribute(ATTRS.backgroundColor) || DEFAULTS.backgroundColor,
    };
  }

  private initIntro() {
    const introWrapper = this.shadow.getElementById("intro-wrapper");
    const intro = this.shadow.getElementById("intro");
    const lastSeen = sessionStorage.getItem(DEFAULTS.introKey);
    const now = Date.now();

    let shouldShowIntro = true;

    if (lastSeen) {
      const diff = now - Number(lastSeen);
      if (diff < DEFAULTS.cooldownMs) shouldShowIntro = false;
    }

    if (!shouldShowIntro) {
      introWrapper?.classList.add("hidden");
      return;
    }

    sessionStorage.setItem(DEFAULTS.introKey, now.toString());

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      intro?.classList.add("hide");
      document.body.style.overflow = "";

      setTimeout(() => {
        if (intro) intro.style.display = "none";
      }, DEFAULTS.fadeDurationMs);
    }, DEFAULTS.hideDelayMs);
  }

  private renderIntro() {
    const { text, textColor, backgroundColor } = this.getOptions();
    const safeText = this.sanitizeText(text);

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
          color: ${textColor};
          background: ${backgroundColor};
          font-size: clamp(5rem, 14vw, 10rem);
          font-weight: 900;
          letter-spacing: -0.08em;
          text-shadow: 0 0 20px
            color-mix(in srgb, ${textColor} 10%, transparent);
          opacity: 1;
          transform: scale(1);
          transition:
            opacity ${DEFAULTS.fadeDurationMs}ms ease,
            transform ${DEFAULTS.fadeDurationMs}ms ease;
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
          <div class="intro-word" aria-label="${safeText}">
            ${[...safeText]
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
