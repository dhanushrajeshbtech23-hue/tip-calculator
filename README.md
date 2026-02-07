# Tip Calculator

A one-page tip calculator: enter bill amount and tip percentage to see **tip** and **total** in real time.

## How to run

- **Option A:** Open `index.html` in your browser (double-click or drag into a browser window).
- **Option B:** From the project folder, run a local server, then open the URL (e.g. `http://localhost:3777`):
  - `python -m http.server 3777`
  - or `npx serve -p 3777`

## How to use

1. **Bill amount** — Enter the pre-tip bill (e.g. `42.50`).
2. **Tip percentage** — Enter the tip % (e.g. `15` or `18.5`). Leave blank for 0%.
3. **Tip** and **Total** update automatically as you type.

Inputs are validated (numbers/decimals only; tip 0–100%). Results are shown in dollars with two decimal places.
