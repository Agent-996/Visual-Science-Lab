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

Every practical is interactive. 120 have a **virtual lab**, and the other 32 have the **interactive slides** from the earlier Virtual Science Lab (see below). The virtual labs are built on reusable lab benches:

- **Investigation bench** (`js/investigate.js`, labs in `js/sims/`): change one variable, take readings from magnified scales, thermometers, burettes and meters, and watch the results table and graph (or bar chart) build up. 38 practicals, for example cooling curves, refraction, pressure in liquids and indigestion tablets.
- **Observe-and-test bench** (`js/observe.js`, labs in `js/tests/`): test each sample or watch each step, record what you see by choosing from a list (colours are shown as swatches), then answer conclusion questions. Used for observe-and-test practicals (indicators, precipitates, food tests, magnets), teacher demos (collapsing can, sodium in water) and model and sorting activities (living things, circuit diagrams, tides). 80 practicals.
- **Microscope slides** (`js/microscope.js`): the view down a light microscope at ×40, ×100 and ×400, used by the 8 microscope practicals on the observe-and-test bench.

Two practicals (neutralisation and weight and mass) have their own custom labs in `js/labs/`.

The practical page shows **example results** from its virtual lab under "What you should find": a picture of the finished bench, the results table or graph, and the key results. These are made by running each lab to the end (see below).

**Interactive slides**: the earlier Virtual Science Lab (in `classic/`) has 31 five-slide activities (aim, predict, do it, conclude, check), covering 33 practicals. Each opens directly from its practical page.

In the virtual labs, every answer has a **Fill it in for me** button. There is also a **Fill in readings for me** switch, so students can move through with **Next step** without typing.

The practical list and codes come from the school's Stage 7 and Stage 8 practical lists; practicals marked "Cambridge Scheme of Work" are recommended there, and the rest are standard school practicals. Check every practical against your school's risk assessments before using it in a real lab.

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
js/observe.js           a reusable observe-and-test bench (test each sample, record what you see, conclusion)
js/tests/*.js           virtual labs built on the observe-and-test bench
js/labs/*.js            virtual labs with their own custom steps
labs/*.html             one page per virtual lab
classic/index.html      the earlier Virtual Science Lab slide activities
```

To change a practical's text, edit its entry in `js/data/grade6.js` or `js/data/grade7.js`. In `check` and `predict` questions, the first option is the right answer; the page shuffles the options.

To add a virtual lab for an investigation, copy one of the files in `js/sims/` (for example `diffusion-temperature.js`): describe the scene, the values of the variable you change, what happens in one measurement and the conclusion question. If the variable you change is a list of names (for example metals or surfaces), add `categorical: true` and the results are drawn as a bar chart. Copy its page in `labs/`, then add `"sim": "labs/your-lab.html"` to the practical's entry in the data file. For a practical where students test several samples and record what they see (colours, attract or repel, positive or negative), copy one of the files in `js/tests/` instead (for example `indicator-rainbow.js`): list the samples, what happens in one test and the questions to ask about each sample. Its page loads `js/observe.js`. Labs that need their own sequence of steps live in `js/labs/`.

Adding `?speed=4` to a lab's address makes the simulation run four times faster, which helps when testing.
