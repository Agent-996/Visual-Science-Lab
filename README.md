# Visual-Science-Lab
Visual Labs for practical alternatives

Virtual science practicals that students can do in the browser. Each lab has real equipment to use, readings the student takes themselves, a results table, a graph or calculation, and feedback at every step. It is aimed at GCSE students (ages 14–16) and the parents helping them.

## Labs

| Lab | Subject | What the student does |
| --- | --- | --- |
| [Acid–alkali titration](labs/titration.html) | Chemistry | Fills a burette, pipettes 25.0 cm³ of sodium hydroxide, chooses an indicator, titrates to concordant results and calculates the concentration. |
| [Force and extension of a spring](labs/hookes-law.html) | Physics | Hangs 100 g masses on a spring, reads a pointer against a ruler, plots force against extension, finds the limit of proportionality and the spring constant. |
| [Osmosis in potato](labs/osmosis.html) | Biology | Cuts and weighs potato cylinders, leaves them in sucrose solutions for 24 hours, calculates percentage change in mass and estimates the concentration inside potato cells. |

Every run uses new hidden values (the unknown concentration, the spring constant, the potato's concentration), so a student can repeat a lab and get different results.

## Putting the site online with GitHub Pages

1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the **main** branch and the **/ (root)** folder, then click **Save**.

After a minute or two the site is live at `https://agent-996.github.io/Visual-Science-Lab/`.

## Running it on your own computer

The site is plain HTML, CSS and JavaScript with no build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## How it is built

```
index.html            the list of labs
css/style.css         shared styles
js/labkit.js          shared toolkit: step guide, answer checking, magnified scales, graphs
js/labs/*.js          one script per practical (the equipment, the science model and the steps)
labs/*.html           one page per practical
```

Each practical is a list of steps. A step has a title, an instruction, a "why do we do this?" explanation and an `enter` function that sets up the buttons, equipment and answer boxes for that step. To add a new practical, copy one of the pages in `labs/` and its script in `js/labs/`, then change the steps and the drawing.

Adding `?speed=4` to a lab's address makes the simulation run four times faster, which helps when testing.
