class SelectionSortAnimation extends AnimationsParent{
  constructor(visualAreaId, originalArray = [64, 34, 25, 12, 22, 11, 90, 5]) {
    super(visualAreaId, originalArray)
    this.generateSteps();
  }

  generateSteps() {
    this.steps = [];
    const arrayCopy = [...this.originalArray];
    this.selectionSort(arrayCopy);
  }

  selectionSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      this.steps.push({
        type: 'start_iteration',
        array: [...arr],
        currentIndex: i,
        iteration: i + 1,
        title: `Iteration ${i + 1}`,
        description: `Finding the minimum element from position ${i} to the end of the array.`
      });

      let minIndex = i;
      
      this.steps.push({
        type: 'set_min',
        array: [...arr],
        minIndex: minIndex,
        currentIndex: i,
        title: `Initial Minimum`,
        description: `Starting with ${arr[i]} at position ${i} as our current minimum.`
      });

      for (let j = i + 1; j < n; j++) {
        this.steps.push({
          type: 'compare',
          array: [...arr],
          compareIndex: j,
          minIndex: minIndex,
          currentIndex: i,
          title: `Compare with Minimum`,
          description: `Comparing ${arr[j]} with current minimum ${arr[minIndex]}. ${arr[j] < arr[minIndex] ? 'Found new minimum!' : 'Current minimum is still smaller.'}`
        });

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
          this.steps.push({
            type: 'new_min',
            array: [...arr],
            minIndex: minIndex,
            currentIndex: i,
            title: `New Minimum Found`,
            description: `${arr[minIndex]} at position ${minIndex} is now our new minimum.`
          });
        }
      }

      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        this.steps.push({
          type: 'swap',
          array: [...arr],
          swapIndices: [i, minIndex],
          currentIndex: i,
          title: `Swap with Minimum`,
          description: `Swapping ${arr[minIndex]} from position ${minIndex} with ${arr[i]} at position ${i}.`
        });
      }

      this.steps.push({
        type: 'place_sorted',
        array: [...arr],
        sortedIndex: i,
        title: `Element Sorted`,
        description: `${arr[i]} is now in its correct sorted position at index ${i}.`
      });
    }

    this.steps.push({
      type: 'complete',
      array: [...arr],
      title: `Sorting Complete!`,
      description: `Selection sort complete! All elements are now in their correct sorted positions.`
    });
  }

  executeStep(step) {
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('highlight', 'comparing', 'minimum', 'swapping', 'sorted', 'current');
      }
    });

    switch (step.type) {
      case 'start_iteration':
        this.animateStartIteration(step);
        break;
      case 'set_min':
        this.animateSetMin(step);
        break;
      case 'compare':
        this.animateCompare(step);
        break;
      case 'new_min':
        this.animateNewMin(step);
        break;
      case 'swap':
        this.animateSwap(step);
        break;
      case 'place_sorted':
        this.animatePlaceSorted(step);
        break;
      case 'complete':
        this.animateComplete(step);
        break;
    }
  }

  executeStepBack(stepIndex) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'comparing', 'minimum', 'swapping', 'sorted', 'current');
      }
    });

    if (stepIndex < 0) {
      this.renderInitialState();
      return;
    }

    if (stepIndex < this.steps.length) {
      const step = this.steps[stepIndex];
      
      step.array.forEach((value, index) => {
        if (this.elements[index]) {
          this.elements[index].textContent = value;
        }
      });
      
      this.executeStep(step);
    }
  }

  animateStartIteration(step) {
    if (this.elements[step.currentIndex]) {
      this.elements[step.currentIndex].classList.add('current');
    }

    for (let i = step.currentIndex; i < step.array.length; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }
  }

  animateSetMin(step) {
    if (this.elements[step.minIndex]) {
      this.elements[step.minIndex].classList.add('minimum');
    }
    if (this.elements[step.currentIndex]) {
      this.elements[step.currentIndex].classList.add('current');
    }
  }

  animateCompare(step) {
    if (this.elements[step.compareIndex]) {
      this.elements[step.compareIndex].classList.add('comparing');
    }
    if (this.elements[step.minIndex]) {
      this.elements[step.minIndex].classList.add('minimum');
    }
    if (this.elements[step.currentIndex]) {
      this.elements[step.currentIndex].classList.add('current');
    }
  }

  animateNewMin(step) {
    if (this.elements[step.minIndex]) {
      this.elements[step.minIndex].classList.add('minimum');
    }
    if (this.elements[step.currentIndex]) {
      this.elements[step.currentIndex].classList.add('current');
    }
  }

  animateSwap(step) {
    step.array.forEach((value, index) => {
      if (this.elements[index]) {
        this.elements[index].textContent = value;
      }
    });

    step.swapIndices.forEach(index => {
      if (this.elements[index]) {
        this.elements[index].classList.add('swapping');
      }
    });

    step.swapIndices.forEach(index => {
      if (this.elements[index] && typeof anime !== 'undefined') {
        anime({
          targets: this.elements[index],
          scale: [1, 1.2, 1],
          duration: 600,
          easing: 'easeInOutQuad'
        });
      }
    });
  }

  animatePlaceSorted(step) {
    if (this.elements[step.sortedIndex]) {
      this.elements[step.sortedIndex].classList.add('sorted');
    }
  }

  animateComplete(step) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.add('sorted');
      }
    });
  }
}

window.SelectionSortAnimation = SelectionSortAnimation;
