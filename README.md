# Visual-Science-Lab
Visual Labs for practical alternatives

Every Grade 6 and Grade 7 science practical from Cambridge Lower Secondary Science (framework 0893), in one website students can use in the browser.

- **Grade 6 = Cambridge Stage 7:** 79 practicals across 9 units.
- **Grade 7 = Cambridge Stage 8:** 73 practicals across 9 units.

Every practical has its own page with:

- learning objectives ("I can…") tagged with the 0893 framework codes, each code explained (e.g. 7Cp = Stage 7 Chemistry: properties of materials)
- key words in English and Chinese
- equipment, safety and the method
- a prediction question, what you should find, and (for some) a fill-the-gap conclusion
- check-your-understanding questions with a score

Every practical page also has two activities built from its data: **pick the equipment** from a tray (with items from other practicals mixed in) and **put the method in order**.

Interactive versions come in two kinds:

**Virtual labs**: a lab bench where students use the equipment and take their own readings, with a results table and graph.

| Virtual lab | Grade · Unit | Codes |
| --- | --- | --- |
| [Cooling curve of stearic acid](labs/cooling-curve.html) | Grade 6 · 2 Materials and their structure | 7Cm.06 |
| [Percentage of oxygen in air](labs/oxygen-in-air.html) | Grade 6 · 2 Materials and their structure | 7ESp.03 |
| [Weight and mass with a newtonmeter](labs/weight-and-mass.html) | Grade 6 · 3 Forces and energy | 7Pf.03 |
| [Woodlice choice chamber](labs/woodlice.html) | Grade 6 · 4 Grouping and identifying organisms | 7Bp.01 |
| [Thermal conductivity rods](labs/thermal-conductors.html) | Grade 6 · 5 Properties of materials | 7Cp.05 |
| [Reflection of sound from different surfaces](labs/sound-reflection.html) | Grade 6 · 6 Earth physics | 7Ps.02 |
| [Yeast activity at different temperatures](labs/yeast-temperature.html) | Grade 6 · 7 Microorganisms in the environment | 7Be.01 |
| [Neutralisation drop by drop](labs/neutralisation.html) | Grade 6 · 8 Changes to materials | 7Cc.04 |
| [Current in a series circuit](labs/series-current.html) | Grade 6 · 9 Electricity | 7Pe.03 |
| [Breathing rate before and after exercise](labs/breathing-rate.html) | Grade 7 · 1 Respiration | 8Bs.03 |
| [Diffusion rate and temperature](labs/diffusion-temperature.html) | Grade 7 · 3 Forces and energy | 8Pf.07 |
| [Turning effects: opening a door](labs/turning-effect.html) | Grade 7 · 3 Forces and energy | 8Pf.04 |
| [Pressure in liquids: water jets](labs/liquid-pressure.html) | Grade 7 · 3 Forces and energy | 8Pf.06 |
| [Purity and boiling point](labs/boiling-point.html) | Grade 7 · 5 Materials and their structure | 8Cm.04 |
| [Refraction through a glass block](labs/refraction.html) | Grade 7 · 6 Light | 8Ps.02 |
| [Crater formation](labs/craters.html) | Grade 7 · 6 Light | 8ESs.02 |

**Interactive slides**: the earlier Virtual Science Lab (in `classic/`) has 31 five-slide activities (aim, predict, do it, conclude, check). Each opens directly from its practical page.

In the interactive labs, every answer box has a **Fill it in for me** button. There is also a **Fill in readings for me** switch, so students can move through with **Next step** without typing.

More interactive labs are added unit by unit. The practical list and codes come from the school's Stage 7 and Stage 8 practical lists; practicals marked "Cambridge Scheme of Work" are recommended there, and the rest are standard school practicals. Check every practical against your school's risk assessments before using it in a real lab.

## Putting the site online with GitHub Pages

1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the **main** branch and the **/ (root)** folder, then click **Save**.

After a minute or two the site is live at `https://agent-996.github.io/Visual-Science-Lab/`.

## Running it on your own computer

The site is plain HTML, CSS and JavaScript with no build step. Serve the folder and open it in a browser:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

Everything the site needs, including its fonts, is inside this folder. Nothing loads from Google or any other outside service, so the site also works offline and in places where those services are blocked.

## How it is built

```
index.html              the list of practicals: grade switch, subject filter, search
practical.html          one page for any practical: practical.html#g6-onion
css/style.css           shared styles
js/curriculum.js        grades, units, subjects and what each framework code means
js/data/grade6.js       the 79 Grade 6 practicals (objectives, key words, method, questions…)
js/data/grade7.js       the 73 Grade 7 practicals
js/home.js              draws the list of practicals
js/practical.js         draws one practical's page
js/labkit.js            toolkit for virtual labs: step guide, answer checking, magnified scales, graphs
js/investigate.js       a reusable investigation bench (change a variable, measure, table, graph, conclusion)
js/sims/*.js            virtual labs built on the investigation bench (one short file each)
js/labs/*.js            virtual labs with their own custom steps
labs/*.html             one page per virtual lab
classic/index.html      the earlier Virtual Science Lab slide activities
```

To change a practical's text, edit its entry in `js/data/grade6.js` or `js/data/grade7.js`. In `check` and `predict` questions, the first option is the right answer; the page shuffles the options.

To add a virtual lab for an investigation, copy one of the files in `js/sims/` (for example `diffusion-temperature.js`): describe the scene, the values of the variable you change, what happens in one measurement and the conclusion question. If the variable you change is a list of names (for example metals or surfaces), add `categorical: true` and the results are drawn as a bar chart. Copy its page in `labs/`, then add `"sim": "labs/your-lab.html"` to the practical's entry in the data file. Labs that need their own sequence of steps live in `js/labs/`.

Adding `?speed=4` to a lab's address makes the simulation run four times faster, which helps when testing.
