class AnimationsParent {
  constructor(visualAreaId, originalArray) {
    this.visualAreaId = visualAreaId; // where the animation is rendered
    this.originalArray = [...originalArray]; // array of numbers provided
    this.currentArray = [...originalArray]; // copy of the array 
    this.elements = {}; // the dom references for the array items 
    this.steps = []; // steps for the animation
    this.elementSize = this.getElementSize(); // assign appropriate sizes according to the device the user is on
    
  }

  // different sizes for different screens (gotta make the animation look good on every device :) )
  getElementSize() {
    const isMobile = window.innerWidth <= 1000;
    const isSmallMobile = window.innerWidth <= 480;

    if (isSmallMobile) {
      return { width: 30, height: 25, spacing: 35, fontSize: 10, levelSpacing: 30 };
    } else if (isMobile) {
      return { width: 35, height: 30, spacing: 40, fontSize: 12, levelSpacing: 35 };
    } else {
      return { width: 60, height: 40, spacing: 80, fontSize: 18, levelSpacing: 50 };
    }
  }

  // gets the start position of the animation elements
  getStartPosition() {
    const visualArea = document.getElementById(this.visualAreaId);
    if (!visualArea) return { x: 50, y: 50 };

    const containerWidth = visualArea.clientWidth;
    const totalArrayWidth = (this.originalArray.length - 1) * this.elementSize.spacing + this.elementSize.width;
    const startX = Math.max(20, (containerWidth - totalArrayWidth) / 2);
    const startY = 40;

    return { x: startX, y: startY };
  }

  // renders the initial state (wow)
  renderInitialState() {
    const visualArea = document.getElementById(this.visualAreaId);
    if (!visualArea) return;

    this.elementSize = this.getElementSize();
    visualArea.innerHTML = '';
    const startPos = this.getStartPosition();

    this.originalArray.forEach((value, index) => {
      const element = document.createElement('div');
      element.className = 'array-element';
      element.textContent = value;
      element.style.left = `${startPos.x + index * this.elementSize.spacing}px`;
      element.style.top = `${startPos.y}px`;
      element.style.width = `${this.elementSize.width}px`;
      element.style.height = `${this.elementSize.height}px`;
      element.style.fontSize = `${this.elementSize.fontSize}px`;
      element.id = `element-${index}`;
      visualArea.appendChild(element);
      this.elements[index] = element;
    });
  }

  // retreive the animation steps
  getSteps() {
    return this.steps;
  }

  // resets the animation and re-renders it 
  reset() {
    this.currentArray = [...this.originalArray];
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.className = 'array-element';
        el.style.transform = '';
      }
    });
    this.renderInitialState();
  }
  
  handleResize() {
    this.elementSize = this.getElementSize();
    this.renderInitialState();
  }
}
