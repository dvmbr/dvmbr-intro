# dvmbr-intro

A lightweight, customizable intro splash web component for your web projects.

## Features

- Pure Web Component (no dependencies)
- Animated intro text: each character appears in sequence with a vertical motion and blur-to-sharp transition, creating a smooth and modern reveal effect. When the intro ends, the whole intro scales up slightly while fading away for a polished exit animation.
- Easy to use in any framework or vanilla JS
- Customizable text via attribute
- Font and style encapsulation via Shadow DOM

## Installation

```
npm install dvmbr-intro
```

## Usage

### 1. Import and Register the Component

Import once in your app entry point (e.g. `main.js`, `index.ts`, etc):

```js
import "dvmbr-intro";
// or, if you want manual registration:
// import { defineDvmbrIntro } from 'dvmbr-intro';
// defineDvmbrIntro();
```

### 2. Add the Tag to Your HTML

```html
<dvmbr-intro text="WELCOME"></dvmbr-intro>
```

- The `text` attribute sets the intro text (3~11 characters recommended).
- If `text` is omitted, the default is `DVMBR`.

### 3. Example (React, Vue, Vanilla)

**React/Vue/Vanilla:**

```jsx
// In your App or main file
import "dvmbr-intro";

function App() {
  return (
    <>
      <dvmbr-intro text="HELLO" />
      <h1>My App</h1>
    </>
  );
}
```

**Plain HTML:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import "dvmbr-intro";
    </script>
  </head>
  <body>
    <dvmbr-intro text="DVMBR"></dvmbr-intro>
    <h1>My Site</h1>
  </body>
</html>
```

## Options

| Attribute       | Type   | Default | Description                         |
| --------------- | ------ | ------- | ----------------------------------- |
| text            | string | DVMBR   | Intro text (3~11 chars recommended) |
| textColor       | string | #fff    | Text color (CSS color value)        |
| backgroundColor | string | #111    | Background color (CSS color value)  |

## Notes

- The intro will only show once per session (uses `sessionStorage`).
- Font is loaded and encapsulated in Shadow DOM.
- Animation and style are fully isolated from your app.

## License

MIT
