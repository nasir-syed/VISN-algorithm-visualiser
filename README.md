# VISN-algorithm-visualiser

#### VISN is a dynamic and interactive algorithm visualiser built with modern web technologies, allowing users to visualise, understand, and explore a wide variety of algorithms through animations, step-by-step breakdowns, code snippets, complexity analysis, prerequisites and advantages. 

#### Check it out here: https://nasir-syed.github.io/VISN-algorithm-visualiser/
---

## Key Features 

- **Animated Visualisations**: See algorithms come to life with smooth, real-time animations.
- **User Input**: Customise input to see how algorithms adapt.
- **Step-by-Step Breakdown**: Each step is explained with titles and descriptions as the animation progresses.
- **Code Snippets**: Python implementations of all algorithms for reference and learning.
- **Complexity Analysis**: Understand time and space complexity through clear explanations.
- **Prerequisites & Advantages**: Conditions required (if any) and the advantages are specified.
---

## Technologies & Architecture
### Technologies Used

- **Vue.js** — reactive UI & data-binding
- **HTML5**, **CSS3**, **Vanilla JavaScript (ES6+)**

### Architecture Overview

- **Vue Instance**: Manages UI state, navigation, and reactivity.
- **Animation Controller**: Central control system (`animationController.js`) for play/pause/step/reset.
- **Animation Classes**: Each algorithm implements logic via a dedicated class.
- **DOM Rendering**: Elements (like array items and tree nodes) are dynamically drawn and updated.

---

## Project Structure
```bash
.
├── index.html 
├── main.js 
├── styles.css 
└── animations/
    ├── animationController.js # handles animation logic (play, pause, step)
    ├── animationsParent.js # base class for all animations
    ├── sorting/
    │   ├── bubbleSortAnimation.js
    │   ├── insertionSortAnimation.js
    │   ├── selectionSortAnimation.js
    │   ├── mergeSortAnimation.js
    │   └── quickSortAnimation.js
    └── searching/
        ├── linearSearchAnimation.js
        ├── binarySearchAnimation.js
        ├── depthFirstSearchAnimation.js
        └── breadthFirstSearchAnimation.js
```
---

## How to Run?

#### It's a simple, static frontend project so cloning the repo and opening index.html will suffice.

```bash
git clone https://github.com/nasir-syed/VISN-algorithm-visualiser.git


