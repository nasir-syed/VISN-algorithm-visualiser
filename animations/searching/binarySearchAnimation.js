class BinarySearchAnimation extends AnimationsParent {
  constructor(visualAreaId, originalArray = [64, 34, 25, 12, 22, 11, 90, 5], target = 25) {
    const sortedArray = [...originalArray].sort((a, b) => a - b);
    super(visualAreaId, sortedArray);
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
      left: 0,
      right: arrayCopy.length - 1,
      mid: -1,
      title: `Initialise Binary Search`,
      description: `Searching for ${this.target} in sorted array, set left pointer to 0, right pointer to ${arrayCopy.length - 1}.`
    });

    this.binarySearch(arrayCopy, 0, arrayCopy.length - 1);

    if (!this.found) {
      this.steps.push({
        type: 'not_found',
        array: [...arrayCopy],
        target: this.target,
        title: `Target Not Found`,
        description: `${this.target} is not present in the array, binary search completed.`
      });
    }
  }

  binarySearch(arr, left, right) {
    if (left > right) return;

    const mid = Math.floor((left + right) / 2);

    this.steps.push({
      type: 'calculate_mid',
      array: [...arr],
      target: this.target,
      left: left,
      right: right,
      mid: mid,
      title: `Calculate Middle`,
      description: `Calculate middle index: (${left} + ${right}) / 2 = ${mid}, middle element is ${arr[mid]}.`
    });

    this.steps.push({
      type: 'compare',
      array: [...arr],
      target: this.target,
      left: left,
      right: right,
      mid: mid,
      comparing: arr[mid],
      title: `Compare with Target`,
      description: `Compare ${arr[mid]} with target ${this.target}. ${arr[mid] === this.target ? 'Found match!' : arr[mid] < this.target ? 'Middle is smaller, search right half.' : 'Middle is larger, search left half.'}`
    });

    if (arr[mid] === this.target) {
      this.found = true;
      this.foundIndex = mid;
      this.steps.push({
        type: 'found',
        array: [...arr],
        target: this.target,
        left: left,
        right: right,
        mid: mid,
        foundIndex: mid,
        title: `Target Found!`,
        description: `Found ${this.target} at index ${mid}, binary search completed successfully!`
      });
      return;
    }

    if (arr[mid] < this.target) {
      this.steps.push({
        type: 'search_right',
        array: [...arr],
        target: this.target,
        left: mid + 1,
        right: right,
        oldLeft: left,
        oldRight: right,
        mid: mid,
        title: `Search Right Half`,
        description: `${arr[mid]} < ${this.target}, so target must be in right half, update left pointer to ${mid + 1}.`
      });
      this.binarySearch(arr, mid + 1, right);
    } else {
      this.steps.push({
        type: 'search_left',
        array: [...arr],
        target: this.target,
        left: left,
        right: mid - 1,
        oldLeft: left,
        oldRight: right,
        mid: mid,
        title: `Search Left Half`,
        description: `${arr[mid]} > ${this.target}, so target must be in left half, update right pointer to ${mid - 1}.`
      });
      this.binarySearch(arr, left, mid - 1);
    }
  }

  executeStep(step) {
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('highlight', 'comparing', 'pivot', 'swapping', 'left-pointer', 'right-pointer', 'mid-pointer', 'found-element', 'eliminated');
      }
    });

    switch (step.type) {
      case 'initialise':
        this.animateInitialise(step);
        break;
      case 'calculate_mid':
        this.animateCalculateMid(step);
        break;
      case 'compare':
        this.animateCompare(step);
        break;
      case 'found':
        this.animateFound(step);
        break;
      case 'search_left':
        this.animateSearchLeft(step);
        break;
      case 'search_right':
        this.animateSearchRight(step);
        break;
      case 'not_found':
        this.animateNotFound(step);
        break;
    }
  }

  executeStepBack(stepIndex) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'comparing', 'pivot', 'swapping', 'left-pointer', 'right-pointer', 'mid-pointer', 'found-element', 'eliminated');
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
    // highlight the entire search range
    if (this.elements[step.left]) {
      this.elements[step.left].classList.add('left-pointer');
    }
    if (this.elements[step.right]) {
      this.elements[step.right].classList.add('right-pointer');
    }
    
    // highlight the search range
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }
  }

  animateCalculateMid(step) {
    // show the current search boundaries
    if (this.elements[step.left]) {
      this.elements[step.left].classList.add('left-pointer');
    }
    if (this.elements[step.right]) {
      this.elements[step.right].classList.add('right-pointer');
    }
    if (this.elements[step.mid]) {
      this.elements[step.mid].classList.add('mid-pointer');
    }

    // highlight the current search range
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }

    if (this.elements[step.mid] && typeof anime !== 'undefined') {
      anime({
        targets: this.elements[step.mid],
        scale: [1, 1.2, 1],
        duration: 800,
        easing: 'easeInOutQuad'
      });
    }
  }

  animateCompare(step) {
    // keep the pointers visible
    if (this.elements[step.left]) {
      this.elements[step.left].classList.add('left-pointer');
    }
    if (this.elements[step.right]) {
      this.elements[step.right].classList.add('right-pointer');
    }
    if (this.elements[step.mid]) {
      this.elements[step.mid].classList.add('comparing');
    }

    // highlight the current search range
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }
  }

  animateFound(step) {
    // clear other highlights and show found element
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'left-pointer', 'right-pointer', 'mid-pointer', 'comparing');
      }
    });

    if (this.elements[step.foundIndex]) {
      this.elements[step.foundIndex].classList.add('highlight');
      
      if (typeof anime !== 'undefined') {
        anime({
        targets: this.elements[step.foundIndex],
        scale: [1, 1.2, 1],
        duration: 800,
        easing: 'easeInOutQuad'
      });
      }
    }
  }

  animateSearchLeft(step) {
    // show the eliminated right portion
    for (let i = step.mid; i <= step.oldRight; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('eliminated');
      }
    }

    // show the new search boundaries
    if (this.elements[step.left]) {
      this.elements[step.left].classList.add('left-pointer');
    }
    if (this.elements[step.right]) {
      this.elements[step.right].classList.add('right-pointer');
    }

    // highlight the new search range
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }
  }

  animateSearchRight(step) {
    // show the eliminated left portion
    for (let i = step.oldLeft; i <= step.mid; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('eliminated');
      }
    }

    // show the new search boundaries
    if (this.elements[step.left]) {
      this.elements[step.left].classList.add('left-pointer');
    }
    if (this.elements[step.right]) {
      this.elements[step.right].classList.add('right-pointer');
    }

    // highlight the new search range
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }
  }

  animateNotFound(step) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'left-pointer', 'right-pointer', 'mid-pointer', 'comparing');
        el.classList.add('eliminated');
      }
    });
  }

  renderInitialState() {
    super.renderInitialState();
    
    // add target display
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

window.BinarySearchAnimation = BinarySearchAnimation;
