class BubbleSortAnimation extends AnimationsParent {
  constructor(visualAreaId, originalArray = [64, 34, 25, 12, 22, 11, 90, 5]) {
    super(visualAreaId, originalArray)
    this.generateSteps();
  }
  generateSteps() {
    this.steps = [];
    const arrayCopy = [...this.originalArray];
    this.bubbleSort(arrayCopy);
  }

  bubbleSort(arr) {
    const n = arr.length;
    // start the pass
    for (let i = 0; i < n - 1; i++) {
      this.steps.push({
        type: 'start_pass',
        array: [...arr],
        passNumber: i + 1,
        title: `Pass ${i + 1}`,
        description: `Starting pass ${i + 1}, we'll bubble the largest unsorted element to its correct position.`
      });

      let swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        // compare step
        this.steps.push({
          type: 'compare',
          array: [...arr],
          compareIndices: [j, j + 1],
          passNumber: i + 1,
          title: `Compare Elements`,
          description: `Comparing ${arr[j]} and ${arr[j + 1]}, ${arr[j] > arr[j + 1] ? 'need to swap!' : 'already in correct order.'}`
        });

        if (arr[j] > arr[j + 1]) {
          // swap step
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true
          
          this.steps.push({
            type: 'swap',
            array: [...arr],
            swapIndices: [j, j + 1],
            passNumber: i + 1,
            title: `Swap Elements`,
            description: `Swapped ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`
          });
        }
      }

      // end of pass, mark the sorted element
      this.steps.push({
        type: 'end_pass',
        array: [...arr],
        sortedIndex: n - 1 - i,
        passNumber: i + 1,
        title: `Pass ${i + 1} Complete`,
        description: `Pass ${i + 1} complete! Element ${arr[n - 1 - i]} is now in its final sorted position.`
      });

      if (!swapped) {
        // array is fully sorted !!!
        this.steps.push({
          type: 'complete',
          array: [...arr],
          title: `Sorting Complete!`,
          description: `No swaps needed in this pass, the array is now fully sorted! :)`
        });
        break;
      }
    }
  }

  // executes the animation step
  executeStep(step) {
    // clear any previous highlights
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('highlight', 'comparing', 'swapping', 'sorted');
      }
    });

    switch (step.type) {
      case 'start_pass':
        this.animateStartPass(step);
        break;
      case 'compare':
        this.animateCompare(step);
        break;
      case 'swap':
        this.animateSwap(step);
        break;
      case 'end_pass':
        this.animateEndPass(step);
        break;
      case 'complete':
        this.animateComplete(step);
        break;
    }
  }

  // goes to a previous step
  executeStepBack(stepIndex) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'comparing', 'swapping', 'sorted');
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

  // animation methods that animate the steps by adding certain classes
  animateStartPass(step) {
    const sortedCount = step.passNumber - 1;
    for (let i = 0; i < step.array.length - sortedCount; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }
  }

  animateCompare(step) {
    step.compareIndices.forEach(index => {
      if (this.elements[index]) {
        this.elements[index].classList.add('comparing');
      }
    });
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

  animateEndPass(step) {
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


window.BubbleSortAnimation = BubbleSortAnimation;

