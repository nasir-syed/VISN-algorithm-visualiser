// animation control system (pause play step)
class AnimationController {
  constructor(options = {}) {
    this.state = {
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      progress: 0,
      stepTitle: options.initialTitle || 'Ready to Start',
      stepDescription: options.initialDescription || 'Click play to begin the animation.'
    };
    
    this.steps = []; // contains all the steps of the animation
    this.timeline = null; // the js timer reference
    this.stepDelay = options.stepDelay || 2000; // the delay between each animation step (set to 2 seconds as of rn)
    this.onStateChange = options.onStateChange || (() => {});
    this.onStepExecute = options.onStepExecute || (() => {});
    this.onStepExecuteBack = options.onStepExecuteBack || (() => {});
  }

  // updates the ui with new title and description, call external function to execute appropriate animation
  executeStep(stepIndex) {
    if (stepIndex >= this.steps.length) return;
    
    const step = this.steps[stepIndex];
    this.state.stepTitle = step.title;
    this.state.stepDescription = step.description;
    this.onStateChange(this.state);
    
    // Call the external step execution handler
    this.onStepExecute(step, stepIndex);
  }

  // executes the current step, increments the current step and updates the progress
  // if its the last step then update title and descruption and execute the function passed to onStateChange
  step() {
    if (this.state.currentStep < this.steps.length) {
      this.executeStep(this.state.currentStep);
      this.state.currentStep++;
      this.updateProgress();
    }
    
    if (this.state.currentStep >= this.steps.length) {
      this.state.stepTitle = 'Complete!';
      this.state.stepDescription = 'Animation completed!';
      this.onStateChange(this.state);
    }
  }

  stepBack() {
    if (this.state.currentStep > 0) {
      this.state.currentStep--;
      this.updateProgress();
      
      this.onStepExecuteBack(this.state.currentStep - 1);
      
      if (this.state.currentStep < this.steps.length) {
        const step = this.steps[this.state.currentStep];
        this.state.stepTitle = step.title;
        this.state.stepDescription = step.description;
      } else {
        this.state.stepTitle = 'Ready to Start';
        this.state.stepDescription = 'Click play to begin the animation.';
      }
      this.onStateChange(this.state);
    }
  }

  // execute step for going backwards 
  executeStepBack(stepIndex) {
    if (stepIndex < 0) {
      this.renderInitialState();
      return;
    }
    
    // clear the previous highlights and styling
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('highlight', 'comparing', 'pivot', 'swapping');
        el.style.background = '';
        el.style.borderColor = '';
        el.style.color = '';
      }
    });

    const step = this.steps[stepIndex];
    
    // for going back, we need to restore the array state to what it was at this step
    step.array.forEach((value, index) => {
      if (this.elements[index]) {
        this.elements[index].textContent = value;
      }
    });

    // apply the visual effects for this step
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

  // resets if at the end of the animation, otherwise executes the next step 
  runAnimation() {
    if (this.state.currentStep >= this.steps.length) {
      this.reset();
    }

    const executeNextStep = () => {
      if (!this.state.isPlaying || this.state.currentStep >= this.steps.length) {
        if (this.state.currentStep >= this.steps.length) {
          this.state.isPlaying = false;
          this.state.stepTitle = 'Complete!';
          this.state.stepDescription = 'Animation completed successfully.';
          this.onStateChange(this.state);
        }
        return;
      }

      this.executeStep(this.state.currentStep);
      this.state.currentStep++;
      this.updateProgress();

      this.timeline = setTimeout(executeNextStep, this.stepDelay);
    };

    executeNextStep();
  }

    // calculates the progress depending on what is the current step
  updateProgress() {
    this.state.progress = this.steps.length > 0 ? (this.state.currentStep / this.steps.length) * 100 : 0;
    this.onStateChange(this.state);
  }

  // stores the animation steps in the array and updates the progress bar
  setSteps(steps) {
    this.steps = steps;
    this.updateProgress();
  }

  // starts the animation if in the beginning, if paused then resume the animation
  play() {
    if (this.state.isPaused) {
      this.resume();
      return;
    }

    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.onStateChange(this.state);
    
    this.runAnimation();
  }

  // stops the animation and the timer
  pause() {
    this.state.isPaused = true;
    this.state.isPlaying = false;
    this.onStateChange(this.state);
    
    if (this.timeline) {
      clearTimeout(this.timeline);
      this.timeline = null;
    }
  }

  // continues the animation from the step which it left off of (doesn't restart)
  resume() {
    this.state.isPaused = false;
    this.state.isPlaying = true;
    this.onStateChange(this.state);
    
    this.runAnimation();
  }

  // rewinds to the beginning, setting current step to 0 and resetting other variables (clearing the timer as well)
  reset() {
    this.state.currentStep = 0;
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.stepTitle = 'Ready to Start';
    this.state.stepDescription = 'Click play to begin the animation.';
    this.updateProgress();
    
    if (this.timeline) {
      clearTimeout(this.timeline);
      this.timeline = null;
    }
    
    this.onStateChange(this.state);
  }

  

  // getter methods for accessing state
  getState() {
    return { ...this.state };
  }

  isPlaying() {
    return this.state.isPlaying;
  }

  isPaused() {
    return this.state.isPaused;
  }

  getCurrentStep() {
    return this.state.currentStep;
  }

  getProgress() {
    return this.state.progress;
  }
}


window.AnimationController = AnimationController;
