# Slaude Economics

Interactive revision diagrams for Edexcel A Economics. Click a button and the
diagram redraws, with a chain of analysis, an evaluation point and real
examples beside it. Then draw the diagram yourself on the practice board.

Made by Syed, with Claude.

Live site: https://syedmominraza.github.io/econ-diagrams/

## Pages

| Page | What it is |
|---|---|
| `index.html` | Home: live demo, how to use it, the spec index for Themes 1 to 4, about |
| `learn.html` | The diagrams and notes. Micro (3.1 to 3.4, except monopsony), Macro (4.1), Year 12 (externalities, AD/AS) and Evaluation points |
| `practice.html` | The practice board: build a diagram from movable pieces, then reveal the answer |

## Files

| File | What it is |
|---|---|
| `style.css` | Colours, fonts and the diagram page layout, including light and dark mode |
| `site.css` | Header, footer, home page, spec index and practice board |
| `site.js` | Light and dark mode, shared by every page |
| `app.js` | Every diagram, the notes for each button, and the calculators |
| `spec.js` | The spec index: sections, spec points and which notes cover them |
| `home.js` | Builds the spec index on the home page |
| `practice.js` | The practice board and its questions |
| `favicon.svg` | The icon in the browser tab |

There is no build step. Open `index.html` through a local web server to run it
(the live demo and practice answers load `learn.html` in a frame).

## Links into the notes

`learn.html#profit` opens the exact note with that id. `learn.html#monopoly` or `learn.html#costs`
opens a topic, and `learn.html#macro` opens the Macro half.
`practice.html#q=tariff` opens a practice question.

## Updating the site

Edit the files, then commit and push, or upload the changed files on GitHub.
When you change a `.css` or `.js` file, raise the `?v=` number where the pages
link to it, so browsers fetch the new copy.
