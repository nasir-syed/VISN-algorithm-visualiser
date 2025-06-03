class InsertionSortAnimation extends AnimationsParent {
  constructor(visualAreaId, originalArray = [64, 34, 25, 12, 22, 11, 90, 5]) {
    super(visualAreaId, originalArray);
    this.generateSteps();
  }

  // clears previous steps, creates a copy of the array and calls the insertion sort method on it 
  generateSteps() {
    this.steps = [];
    const arrayCopy = [...this.originalArray];
    this.insertionSort(arrayCopy);
  }

  // the insertion sort algorithm 
  insertionSort(arr) {

    this.steps.push({
      type: 'initial',
      array: [...arr],
      sortedUpTo: 0,
      title: 'Initial Array',
      description: "Starting with the first element as sorted, we'll insert each remaining element into its correct position."
    });

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;

      this.steps.push({
        type: 'select_key',
        array: [...arr],
        keyIndex: i,
        keyValue: key,
        sortedUpTo: i - 1,
        title: 'Select Key Element',
        description: `Selected ${key} as the key element, now we'll find its correct position in the sorted portion.`
      });

      // find the correct position for the key
      while (j >= 0 && arr[j] > key) {

        // add comparison step
        this.steps.push({
          type: 'compare',
          array: [...arr],
          keyIndex: i,
          keyValue: key,
          compareIndex: j,
          compareValue: arr[j],
          sortedUpTo: i - 1,
          title: 'Compare Elements',
          description: `Comparing ${key} with ${arr[j]}. Since ${arr[j]} > ${key}, we need to shift ${arr[j]} to the right.`
        });

        // shift element to the right
        arr[j + 1] = arr[j];
        
        // add shift step
        this.steps.push({
          type: 'shift',
          array: [...arr],
          keyValue: key,
          shiftedIndex: j + 1,
          shiftedValue: arr[j + 1],
          originalKeyIndex: i,
          sortedUpTo: i - 1,
          title: 'Shift Element',
          description: `Shifted ${arr[j + 1]} one position to the right to make space for ${key}.`
        });

        j--;
      }

      // insert the key at its correct position
      arr[j + 1] = key;
      
      // add insert step
      this.steps.push({
        type: 'insert',
        array: [...arr],
        insertIndex: j + 1,
        insertValue: key,
        originalKeyIndex: i,
        sortedUpTo: i,
        title: 'Insert Key',
        description: `Inserted ${key} at position ${j + 1}, the sorted portion now extends to position ${i}.`
      });
    }

    // add the final sorted step
    this.steps.push({
      type: 'complete',
      array: [...arr],
      sortedUpTo: arr.length - 1,
      title: 'Sorting Complete',
      description: 'All elements have been inserted into their correct positions and the array is now fully sorted!! :)'
    });
  }

  executeStep(step) {
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('highlight', 'comparing', 'key-element', 'shifting', 'sorted');
      }
    });

    switch (step.type) {
      case 'initial':
        this.animateInitial(step);
        break;
      case 'select_key':
        this.animateSelectKey(step);
        break;
      case 'compare':
        this.animateCompare(step);
        break;
      case 'shift':
        this.animateShift(step);
        break;
      case 'insert':
        this.animateInsert(step);
        break;
      case 'complete':
        this.animateComplete(step);
        break;
    }
  }

  executeStepBack(stepIndex) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'comparing', 'key-element', 'shifting', 'sorted');
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
      
      // re-execute the step 
      this.executeStep(step);
    }
  }

  animateInitial(step) {
    // highlight the the first element as sorted
    if (this.elements[0]) {
      this.elements[0].classList.add('sorted');
    }
  }

  animateSelectKey(step) {
    // highlight the sorted portion
    for (let i = 0; i <= step.sortedUpTo; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('sorted');
      }
    }

    // highlight the key element
    if (this.elements[step.keyIndex]) {
      this.elements[step.keyIndex].classList.add('key-element');
    }
  }

  animateCompare(step) {
    // highlight the sorted portion
    for (let i = 0; i <= step.sortedUpTo; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('sorted');
      }
    }

    // highlight the key element
    if (this.elements[step.keyIndex]) {
      this.elements[step.keyIndex].classList.add('key-element');
    }

    // highlight the element being compared
    if (this.elements[step.compareIndex]) {
      this.elements[step.compareIndex].classList.add('comparing');
    }
  }

  animateShift(step) {
    // update array values first
    step.array.forEach((value, index) => {
      if (this.elements[index]) {
        this.elements[index].textContent = value;
      }
    });

    // uighlight sorted portion
    for (let i = 0; i <= step.sortedUpTo; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('sorted');
      }
    }

    // uighlight the shifted element
    if (this.elements[step.shiftedIndex]) {
      this.elements[step.shiftedIndex].classList.add('shifting');
    }

    // animate shift with scale effect
    if (this.elements[step.shiftedIndex] && typeof anime !== 'undefined') {
      anime({
        targets: this.elements[step.shiftedIndex],
        scale: [1, 1.1, 1],
        duration: 400,
        easing: 'easeInOutQuad'
      });
    }
  }

  animateInsert(step) {
    // update array values
    step.array.forEach((value, index) => {
      if (this.elements[index]) {
        this.elements[index].textContent = value;
      }
    });

    // highlight sorted portion (now including the newly inserted element :) )
    for (let i = 0; i <= step.sortedUpTo; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('sorted');
      }
    }

    // highlight the inserted element
    if (this.elements[step.insertIndex]) {
      this.elements[step.insertIndex].classList.add('shifting');
    }

    // animate insertion with scale effect
    if (this.elements[step.insertIndex] && typeof anime !== 'undefined') {
      anime({
        targets: this.elements[step.insertIndex],
        scale: [1, 1.3, 1],
        duration: 600,
        easing: 'easeInOutQuad'
      });
    }
  }

  animateComplete(step) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.add('sorted');
      }
    });

    // a celebration effect !!!
    Object.values(this.elements).forEach((el, index) => {
      if (el && typeof anime !== 'undefined') {
        anime({
          targets: el,
          scale: [1, 1.2, 1],
          duration: 800,
          delay: index * 100,
          easing: 'easeInOutQuad'
        });
      }
    });
  }
}


window.InsertionSortAnimation = InsertionSortAnimation;
