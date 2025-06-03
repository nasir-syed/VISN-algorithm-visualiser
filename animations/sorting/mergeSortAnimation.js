class MergeSortAnimation extends AnimationsParent{
  constructor(visualAreaId, originalArray = [64, 34, 25, 12, 22, 11, 90, 5]) {
    super(visualAreaId, originalArray)
    // prepares the animation steps 
    this.generateSteps();
  }

  // clears the existing steps, creates a copy of the array and calls mergesort on it
  generateSteps() {
    this.steps = [];
    const arrayCopy = [...this.originalArray];
    this.mergeSort(arrayCopy, 0, this.originalArray.length - 1, 0);
  }

  // the one and only mergesort algorithm itself
  mergeSort(arr, left, right, level) {
    if (left >= right) return arr;

    // Add divide step for the animation
    this.steps.push({
      type: 'divide',
      array: [...arr],
      left: left,
      right: right,
      level: level,
      title: `Divide: Split array`,
      description: `Splitting array from position ${left} to ${right} into smaller pieces.`
    });

    const mid = Math.floor((left + right) / 2);
    
    // recursively sort the left and right subarrays/halves 
    this.mergeSort(arr, left, mid, level + 1);
    this.mergeSort(arr, mid + 1, right, level + 1);
    
    
    this.merge(arr, left, mid, right, level);
    
    return arr;
  }

  // merges the two sorted subarrays
  merge(arr, left, mid, right, level) {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    
    this.steps.push({
      type: 'compare',
      array: [...arr],
      leftArray: leftArray,
      rightArray: rightArray,
      left: left,
      mid: mid,
      right: right,
      level: level,
      title: `Compare: Merge sorted pieces`,
      description: `Comparing and merging two sorted pieces: [${leftArray.join(', ')}] and [${rightArray.join(', ')}]`
    });

    let i = 0, j = 0, k = left;
    const mergedArray = [...arr];

    while (i < leftArray.length && j < rightArray.length) {
      if (leftArray[i] <= rightArray[j]) {
        mergedArray[k] = leftArray[i];
        i++;
      } else {
        mergedArray[k] = rightArray[j];
        j++;
      }
      k++;
    }

    while (i < leftArray.length) {
      mergedArray[k] = leftArray[i];
      i++;
      k++;
    }

    while (j < rightArray.length) {
      mergedArray[k] = rightArray[j];
      j++;
      k++;
    }

    for (let x = left; x <= right; x++) {
      arr[x] = mergedArray[x];
    }

    this.steps.push({
      type: 'merge',
      array: [...arr],
      left: left,
      right: right,
      level: level,
      title: `Merge: Combined sorted pieces`,
      description: `Successfully merged into: [${arr.slice(left, right + 1).join(', ')}]`
    });
  }


  // execute the step provided based on its type, clear and previous highlights as well
  executeStep(step) {
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('highlight', 'comparing');
        
      }
    });

    if (step.type === 'divide') {
      this.animateDivide(step);
    } else if (step.type === 'compare') {
      this.animateCompare(step);
    } else if (step.type === 'merge') {
      this.animateMerge(step);
    }
  }

  executeStepBack(stepIndex) {
  Object.values(this.elements).forEach(el => {
    if (el && el.classList) {
      el.classList.remove('highlight', 'comparing');
    }
  });

  if (stepIndex < 0) {
    this.renderInitialState();
    return;
  }

  if (stepIndex < this.steps.length) {
    const step = this.steps[stepIndex];
    this.executeStep(step); // re-render the state at this step
  }
}

  // animates the divide step by highlighting the section being divided
  animateDivide(step) {
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('highlight');
      }
    }

    // move the elements downward to better show the division
    const yOffset = step.level * (this.elementSize.height + 20) + 60;
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i] && typeof anime !== 'undefined') {
        anime({
          targets: this.elements[i],
          translateY: yOffset - 60, 
          duration: 200,
          easing: 'easeInOutQuad'
        });
      }
    }
  }

  // animates the compare step by adding highlights to the elements being compared
  animateCompare(step) {
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i]) {
        this.elements[i].classList.add('comparing');
      }
    }
  }

  //animates the merge step by highlighting the merged section 
  animateMerge(step) {
    step.array.forEach((value, index) => {
      if (this.elements[index]) {
        this.elements[index].textContent = value;
        if (index >= step.left && index <= step.right) {
          this.elements[index].classList.add('highlight');
        }
      }
    });

    // animate the elements moving into final positions
    for (let i = step.left; i <= step.right; i++) {
      if (this.elements[i] && typeof anime !== 'undefined') {
        anime({
          targets: this.elements[i],
          scale: [1.2, 1],
          duration: 300,
          easing: 'easeInOutQuad'
        });
      }
    }
  }
}


window.MergeSortAnimation = MergeSortAnimation;
