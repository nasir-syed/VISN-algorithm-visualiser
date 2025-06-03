class LinearSearchAnimation extends AnimationsParent {
  constructor(visualAreaId, originalArray = [64, 34, 25, 12, 22, 11, 90, 5], target = 25) {
    super(visualAreaId, originalArray);
    this.target = target;
    this.found = false;
    this.foundIndex = -1;
    this.generateSteps();
  }

  setTarget(target) {
    this.target = target;
    this.found = false;
    this.foundIndex = -1;
    this.generateSteps();
  }

  generateSteps() {
    this.steps = []
    const arrayCopy = [...this.originalArray];
    this.found = false;
    this.foundIndex = -1;
    
    this.steps.push({
      type: 'initialise',
      array: [...arrayCopy],
      target: this.target,
      currentIndex: -1,
      title: `Initialise Linear Search`,
      description: `Searching for ${this.target} in the array, we'll check each element one by one from left to right.`
    });

    // linear search through the array
    for (let i = 0; i < arrayCopy.length; i++) {

      // add compare steo
      this.steps.push({
        type: 'compare',
        array: [...arrayCopy],
        target: this.target,
        currentIndex: i,
        comparing: arrayCopy[i],
        title: `Check Element at Index ${i}`,
        description: `Comparing ${arrayCopy[i]} with target ${this.target}. ${arrayCopy[i] === this.target ? 'Found match!' : 'No match, continue to next element.'}`
      });

      if (arrayCopy[i] === this.target) {
        this.found = true;
        this.foundIndex = i;

        // add found step
        this.steps.push({
          type: 'found',
          array: [...arrayCopy],
          target: this.target,
          currentIndex: i,
          foundIndex: i,
          title: `Target Found!`,
          description: `Found ${this.target} at index ${i}, linear search completed successfully in ${i + 1} comparison${i === 0 ? '' : 's'}.`
        });
        return;
      }
    }

    // if we reach this point, then the target was not found :(
    if (!this.found) {
      this.steps.push({
        type: 'not_found',
        array: [...arrayCopy],
        target: this.target,
        title: `Target Not Found`,
        description: `${this.target} is not present in the array, searched through all ${arrayCopy.length} elements without finding a match.`
      });
    }
  }

  executeStep(step) {
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('highlight', 'comparing', 'found-element', 'searched', 'current-element');
      }
    });

    switch (step.type) {
      case 'initialise':
        this.animateInitialise(step);
        break;
      case 'compare':
        this.animateCompare(step);
        break;
      case 'found':
        this.animateFound(step);
        break;
      case 'not_found':
        this.animateNotFound(step);
        break;
    }
  }

  executeStepBack(stepIndex) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'comparing', 'found-element', 'searched', 'current-element');
      }
    });

    if (stepIndex < 0) {
      this.renderInitialState();
      return;
    }

    if (stepIndex < this.steps.length) {
      const step = this.steps[stepIndex];
      this.executeStep(step);
    }
  }

  animateInitialise(step) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.add('highlight');
      }
    });
  }

  animateCompare(step) {
    for (let i = 0; i < step.currentIndex; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('searched');
      }
    }

    if (this.elements[step.currentIndex]) {
      this.elements[step.currentIndex].classList.add('comparing');
      this.elements[step.currentIndex].classList.add('current-element');
      
      if (typeof anime !== 'undefined') {
        anime({
          targets: this.elements[step.currentIndex],
          scale: [1, 1.2, 1],
          duration: 800,
          easing: 'easeInOutQuad'
        });
      }
    }

    for (let i = step.currentIndex + 1; i < this.originalArray.length; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }
  }

  animateFound(step) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'comparing', 'current-element');
      }
    });

    for (let i = 0; i <= step.foundIndex; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('searched');
      }
    }

    if (this.elements[step.foundIndex]) {
      this.elements[step.foundIndex].classList.remove('searched');
      this.elements[step.foundIndex].classList.add('found-element');
      
      if (typeof anime !== 'undefined') {
        anime({
          targets: this.elements[step.foundIndex],
          scale: [1, 1.3, 1],
          duration: 1000,
          easing: 'easeInOutQuad'
        });
      }
    }
  }

  animateNotFound(step) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'comparing', 'current-element');
        el.classList.add('searched');
      }
    });
  }

  renderInitialState() {
    super.renderInitialState();
    const visualArea = document.getElementById(this.visualAreaId);
    if (visualArea) {
      const targetDisplay = document.createElement('div');
      targetDisplay.className = 'target-display';
      targetDisplay.textContent = `Target: ${this.target}`;
      targetDisplay.style.position = 'absolute';
      targetDisplay.style.top = '10px';
      targetDisplay.style.left = '20px';
      targetDisplay.style.color = '#b3e9e8';
      targetDisplay.style.fontWeight = 'bold';
      targetDisplay.style.fontSize = `${this.getElementSize().fontSize}px`;
      targetDisplay.id = 'target-display';
      visualArea.appendChild(targetDisplay);
    }
  }
}

window.LinearSearchAnimation = LinearSearchAnimation;
