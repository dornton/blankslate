# BlankSlate
<img width="2804" height="1314" alt="image" src="https://github.com/user-attachments/assets/ada3c73c-b819-44fe-8f9b-15ae526b5001" />

Landing page for my project, a burner identity generator! React and Vite, no backend. The Generate
button fills the session card with sample data. Nothing is sent anywhere.
this is just open-source for the front-end obvy im not showing the backend
## Run it
```
npm install
npm run dev
```
Vite prints the local address, usually http://localhost:5173.
To build the static site:
```
npm run build
```

The output lands in `dist/`.


| Path | What it is |
| --- | --- |
| `index.html` | Page shell, fonts, meta tags |
| `src/App.jsx` | The whole page: layout, copy, demo data, timers |
| `src/styles.css` | Design tokens and every style rule |
| `src/components/AsciiField.jsx` | ASCII (React component found in React Bits) |
| `src/components/ScrollVelocity.jsx` | Scroll-reactive band marquee (Also found from react bits lolol) |
| `src/components/TechText.jsx` | Footer wordmark, draws on scroll into view |
| `src/components/MetallicPaint.jsx` | WebGL liquid metal, used on the logo |
| `public/fonts/Acidic.TTF` | Display face for the headline, font found in DaFont (this is where I download majority of my fonts, I find inspo on Pinterest :') |
| `public/blankslate-mark.png` | Trimmed logo with the slash cut out, fed to the metal effect |
| `scripts/` | Helpers that pulled components out of React Bits |
## Limits

This is a front-end demo. There is no backend, no account, no number assignment and no
mail. Every value in the card is invented. Do not wire it to anything that pretends
otherwise without writing the real thing behind it.

## License

The Acidic font came without a license file o.o 
