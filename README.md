# A-level Economics Diagrams

Interactive revision diagrams for Edexcel A Economics. Click a button and the
diagram redraws, with a chain of analysis, an evaluation point and real
examples beside it.

Made by Syed, with Claude.

## What it covers

- **Micro, section 3.4:** perfect competition, monopoly (including price
  discrimination and natural monopoly), monopolistic competition, oligopoly,
  contestable markets.
- **Macro, section 4.1:** globalisation, trade, protectionism, trading blocs,
  exchange rates, balance of payments.

It is for quick review after revision, not a replacement for class notes.

## Files

| File | What it is |
|---|---|
| `index.html` | The page itself |
| `style.css` | Colours, fonts and layout, including light and dark mode |
| `app.js` | Every diagram, the notes for each button, and the calculators |
| `favicon.svg` | The icon in the browser tab |

There is no build step. Open `index.html` in a browser to run it locally.

## Updating the site

Edit the files, then upload the changed ones to this repository
(Add file, Upload files, Commit changes). GitHub Pages republishes
within a minute or two.

The notes for every button live in `app.js`, in the object called `V`.
Each entry has a title, a lead line, a chain of analysis and an evaluation
point.
