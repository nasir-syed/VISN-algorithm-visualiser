class QuickSortAnimation extends AnimationsParent{
  constructor(visualAreaId, originalArray = [64, 34, 25, 12, 22, 11, 90, 5]) {
    super(visualAreaId, originalArray)
    this.generateSteps();
  }

  // clears previous steps, creates a copy of the array and calls the quicksort method on it 
  generateSteps() {
    this.steps = [];
    const arrayCopy = [...this.originalArray];
    this.quickSort(arrayCopy, 0, this.originalArray.length - 1, 0);
  }

  // the quicksort method 
  quickSort(arr, low, high, level) {
    if (low >= high) return;

    // add the partition step
    this.steps.push({
      type: 'start_partition',
      array: [...arr],
      low: low,
      high: high,
      level: level,
      title: `Start Partitioning`,
      description: `Partitioning array from position ${low} to ${high}, we'll choose a pivot and arrange elements.`
    });

    // partition and get the pivot index
    const pivotIndex = this.partition(arr, low, high, level);

    // add the pivot placed step
    this.steps.push({
      type: 'pivot_placed',
      array: [...arr],
      pivotIndex: pivotIndex,
      low: low,
      high: high,
      level: level,
      title: `Pivot Positioned`,
      description: `Pivot ${arr[pivotIndex]} is now in its correct position, elements smaller are on the left, larger on the right.`
    });

    // recursively sort left and right partitions
    this.quickSort(arr, low, pivotIndex - 1, level + 1);
    this.quickSort(arr, pivotIndex + 1, high, level + 1);
  }

  // helper function for the partitioning 
  partition(arr, low, high, level) {
    // choose last element as pivot
    const pivot = arr[high];
    let i = low - 1; 

    // add pivot animation type to the steps 
    this.steps.push({
      type: 'choose_pivot',
      array: [...arr],
      pivotIndex: high,
      pivot: pivot,
      low: low,
      high: high,
      level: level,
      title: `Choose Pivot`,
      description: `Selected ${pivot} as pivot (last element), now we'll rearrange elements around it.`
    });

    // do comparison animation 
    for (let j = low; j < high; j++) {
      this.steps.push({
        type: 'compare',
        array: [...arr],
        compareIndex: j,
        pivotIndex: high,
        pivot: pivot,
        currentElement: arr[j],
        low: low,
        high: high,
        level: level,
        title: `Compare with Pivot`,
        description: `Comparing ${arr[j]} with pivot ${pivot}. ${arr[j] <= pivot ? 'Smaller or equal -> will move to left side.' : 'Larger -> stays on right side.'}`
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          // swap elements
          [arr[i], arr[j]] = [arr[j], arr[i]];
          this.steps.push({
            type: 'swap',
            array: [...arr],
            swapIndices: [i, j],
            pivotIndex: high,
            low: low,
            high: high,
            level: level,
            title: `Swap Elements`,
            description: `Swapped ${arr[j]} and ${arr[i]} to move smaller element to the left partition.`
          });
        }
      }
    }

    // place the pivot in correct position
    if (i + 1 !== high) {
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      this.steps.push({
        type: 'place_pivot',
        array: [...arr],
        pivotIndex: i + 1,
        oldPivotIndex: high,
        pivot: pivot,
        low: low,
        high: high,
        level: level,
        title: `Place Pivot`,
        description: `Moving pivot ${pivot} to its correct position at index ${i + 1}.`
      });
    }

    return i + 1;
  }


  executeStep(step) {
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('highlight', 'comparing', 'pivot', 'swapping');
      }
    });

    switch (step.type) {
      case 'start_partition':
        this.animateStartPartition(step);
        break;
      case 'choose_pivot':
        this.animateChoosePivot(step);
        break;
      case 'compare':
        this.animateCompare(step);
        break;
      case 'swap':
        this.animateSwap(step);
        break;
      case 'place_pivot':
        this.animatePlacePivot(step);
        break;
      case 'pivot_placed':
        this.animatePivotPlaced(step);
        break;
    }
  }

  executeStepBack(stepIndex) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('highlight', 'comparing', 'pivot', 'swapping');
      }
    });

    if (stepIndex < 0) {
      // reset to initial state
      this.renderInitialState();
      return;
    }

    if (stepIndex < this.steps.length) {
      const step = this.steps[stepIndex];
      
      // update array values to the state at this step
      step.array.forEach((value, index) => {
        if (this.elements[index]) {
          this.elements[index].textContent = value;
        }
      });
      
      // re-execute the step 
      this.executeStep(step);
    }
  }

  animateStartPartition(step) {
    // highlight the section being partitioned
    for (let i = step.low; i <= step.high; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }
  }

  animateChoosePivot(step) {
    // highlight the pivot 
    if (this.elements[step.pivotIndex]) {
      this.elements[step.pivotIndex].classList.add('pivot');
    }
  }

  animateCompare(step) {
    // highlight element being compared
    if (this.elements[step.compareIndex]) {
      this.elements[step.compareIndex].classList.add('comparing');
    }
    
    // Keep pivot highlighted
    if (this.elements[step.pivotIndex]) {
      this.elements[step.pivotIndex].classList.add('pivot');
    }
  }

  animateSwap(step) {
    // update the array values first
    step.array.forEach((value, index) => {
      if (this.elements[index]) {
        this.elements[index].textContent = value;
      }
    });

    // highlight swapped elements
    step.swapIndices.forEach(index => {
      if (this.elements[index]) {
        this.elements[index].classList.add('swapping');
      }
    });

    // animate swap with sa cale effect
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

    // keep pivot highlighted
    if (this.elements[step.pivotIndex]) {
      this.elements[step.pivotIndex].classList.add('pivot');
    }
  }

  animatePlacePivot(step) {
    // update array values
    step.array.forEach((value, index) => {
      if (this.elements[index]) {
        this.elements[index].textContent = value;
      }
    });

    // highlight the new pivot position
    if (this.elements[step.pivotIndex]) {
      this.elements[step.pivotIndex].classList.add('pivot');
    }

    // animate pivot movement
    if (this.elements[step.pivotIndex] && typeof anime !== 'undefined') {
      anime({
        targets: this.elements[step.pivotIndex],
        scale: [1, 1.3, 1],
        duration: 800,
        easing: 'easeInOutQuad'
      });
    }
  }

  animatePivotPlaced(step) {
    // highlight the correctly placed pivot 
    if (this.elements[step.pivotIndex]) {
      this.elements[step.pivotIndex].classList.add('highlight');
    }
  }
}



window.QuickSortAnimation = QuickSortAnimation;

