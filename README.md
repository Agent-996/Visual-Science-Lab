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

Practicals marked **Interactive** also have a virtual lab bench where students use the equipment and take their own readings:

| Interactive practical | Grade · Unit | Codes |
| --- | --- | --- |
| [Neutralisation drop by drop](labs/neutralisation.html) | Grade 6 · Unit 8 Changes to materials | 7Cc.04, 7TWSa.02 |
| [Weight and mass with a newtonmeter](labs/weight-and-mass.html) | Grade 6 · Unit 3 Forces and energy | 7Pf.03, 7TWSc.04, 7TWSa.05 |

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
js/labkit.js            toolkit for interactive labs: step guide, answer checking, magnified scales, graphs
js/labs/*.js            one script per interactive lab
labs/*.html             one page per interactive lab
```

To change a practical's text, edit its entry in `js/data/grade6.js` or `js/data/grade7.js`. In `check` and `predict` questions, the first option is the right answer; the page shuffles the options.

To add an interactive lab, copy one of the pages in `labs/` and its script in `js/labs/`, change the steps and the drawing, then add `"sim": "labs/your-lab.html"` to the practical's entry in the data file.

Adding `?speed=4` to a lab's address makes the simulation run four times faster, which helps when testing.
