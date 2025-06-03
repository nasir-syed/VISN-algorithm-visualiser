class DepthFirstSearchAnimation extends AnimationsParent {
  constructor(visualAreaId, originalArray = [10, 5, 15, 3, 7, 12, 18], target = 4) {
    super(visualAreaId, originalArray);
    this.target = target;
    this.tree = this.buildTree(originalArray);
    this.generateSteps();
  }

  buildTree(values) {
    // filter out empty values and create a binary search tree
    const validValues = values.filter(val => val !== null && val !== undefined && val !== '');
    if (validValues.length === 0) return null;

    const nodes = {};
    const root = { value: validValues[0], left: null, right: null, id: 0 };
    nodes[0] = root;

    // build a binary search tree (bst) from the values
    for (let i = 1; i < validValues.length; i++) {
      const newNode = { value: validValues[i], left: null, right: null, id: i };
      nodes[i] = newNode;
      this.insertIntoBST(root, newNode);
    }

    return { root, nodes };
  }

  insertIntoBST(root, newNode) {
    if (newNode.value < root.value) {
      if (root.left === null) {
        root.left = newNode;
      } else {
        this.insertIntoBST(root.left, newNode);
      }
    } else {
      if (root.right === null) {
        root.right = newNode;
      } else {
        this.insertIntoBST(root.right, newNode);
      }
    }
  }

  generateSteps() {
    this.steps = [];
    if (!this.tree || !this.tree.root) return;

    const stack = [this.tree.root];
    const visited = new Set();

    this.steps.push({
      type: 'start',
      stack: [this.tree.root.id],
      visited: [],
      current: null,
      target: this.target,
      title: 'Start DFS',
      description: `Starting Depth-First Search for target value ${this.target}, we begin with the root node on our stack.`
    });

    while (stack.length > 0) {
      const current = stack.pop();
      
      if (visited.has(current.id)) continue;
      
      this.steps.push({
        type: 'visit',
        stack: stack.map(n => n.id),
        visited: Array.from(visited),
        current: current.id,
        target: this.target,
        title: 'Visit Node',
        description: `Visiting node ${current.value}. ${current.value === this.target ? 'Found target!' : 'Not the target, continue searching deeper.'}`
      });

      visited.add(current.id);

      if (current.value === this.target) {
        this.steps.push({
          type: 'found',
          stack: stack.map(n => n.id),
          visited: Array.from(visited),
          current: current.id,
          target: this.target,
          title: 'Target Found!',
          description: `Successfully found target value ${this.target} at node ${current.value}!`
        });
        return;
      }

      if (current.right && !visited.has(current.right.id)) {
        stack.push(current.right);
      }
      if (current.left && !visited.has(current.left.id)) {
        stack.push(current.left);
      }

      if (stack.length > 0) {
        this.steps.push({
          type: 'push',
          stack: stack.map(n => n.id),
          visited: Array.from(visited),
          current: current.id,
          target: this.target,
          title: 'Add to Stack',
          description: `Added children of node ${current.value} to the stack, the stack now contains: ${stack.map(n => n.value).join(', ')}`
        });
      }
    }

    this.steps.push({
      type: 'not_found',
      stack: [],
      visited: Array.from(visited),
      current: null,
      target: this.target,
      title: 'Target Not Found',
      description: `Depth-First Search completed, target value ${this.target} was not found in the tree.`
    });
  }

  renderInitialState() {
    const visualArea = document.getElementById(this.visualAreaId);
    if (!visualArea || !this.tree) return;

    visualArea.innerHTML = '';
    this.elements = {};

    const layout = this.calculateTreeLayout();
    
    this.renderConnections(visualArea, layout);
    
    // render nodes
    Object.values(this.tree.nodes).forEach(node => {
      const pos = layout[node.id];
      if (pos) {
        const element = document.createElement('div');
        element.className = 'tree-node';
        element.textContent = node.value;
        element.style.left = `${pos.x - 25}px`;
        element.style.top = `${pos.y - 25}px`; 
        element.id = `node-${node.id}`;
        visualArea.appendChild(element);
        this.elements[node.id] = element;
      }
    });
  }

  calculateTreeLayout() {
    if (!this.tree || !this.tree.root) return {};
    
    const layout = {};
    
    const visualArea = document.getElementById(this.visualAreaId);
    if (!visualArea) return layout;
    
    const containerRect = visualArea.getBoundingClientRect();
    const containerWidth = containerRect.width || visualArea.offsetWidth || 1200;
    const containerHeight = containerRect.height || visualArea.offsetHeight || 250;
    
    this.calculateNodePositions(
      this.tree.root, 
      containerWidth / 2,     // start at center horizontally
      45,                     
      containerWidth / 4,     // initial horizontal offset
      60,                     
      layout
    );

    return layout;
  }

  // NEW METHOD: Proper BST positioning
  calculateNodePositions(node, x, y, xOffset, yOffset, layout) {
    if (!node) return;
    
    layout[node.id] = { x, y };
    
    // Position left child to the left with reduced offset
    if (node.left) {
      this.calculateNodePositions(
        node.left, 
        x - xOffset, 
        y + yOffset, 
        xOffset / 2.5, 
        yOffset, 
        layout
      );
    }
    
    // Position right child to the right with reduced offset
    if (node.right) {
      this.calculateNodePositions(
        node.right, 
        x + xOffset, 
        y + yOffset, 
        xOffset / 2.5, 
        yOffset, 
        layout
      );
    }
  }

  // REMOVED: getTreeLevels method is no longer needed

  renderConnections(visualArea, layout) {
    if (!this.tree || !this.tree.root) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';       
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
    visualArea.appendChild(svg);

    const targetDisplay = document.createElement('div');
    targetDisplay.className = 'target-display';
    targetDisplay.textContent = `Target: ${this.target}`;
    targetDisplay.style.position = 'absolute';
    targetDisplay.style.top = '10px';
    targetDisplay.style.left = '20px';
    targetDisplay.style.color = '#b3e9e8';
    targetDisplay.style.fontWeight = 'bold';
    targetDisplay.style.fontSize = `${this.getElementSize().fontSize}px` ;
    targetDisplay.id = 'target-display';
    visualArea.appendChild(targetDisplay);

    Object.values(this.tree.nodes).forEach(node => {
      const parentPos = layout[node.id];
      if (!parentPos) return;

      if (node.left) {
        const childPos = layout[node.left.id];
        if (childPos) {
          this.createConnection(svg, parentPos, childPos);
        }
      }
      
      if (node.right) {
        const childPos = layout[node.right.id];
        if (childPos) {
          this.createConnection(svg, parentPos, childPos);
        }
      }
    });

  }

  createConnection(svg, from, to) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.x);
    line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x);
    line.setAttribute('y2', to.y);
    line.setAttribute('stroke', '#666');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  }

  executeStep(step) {
    Object.values(this.elements).forEach(el => {
      if (el && el.classList) {
        el.classList.remove('current-node', 'visited-node', 'in-stack', 'found-node');
      }
    });

    // highlight the visited nodes
    step.visited.forEach(nodeId => {
      if (this.elements[nodeId]) {
        this.elements[nodeId].classList.add('visited-node');
      }
    });

    // highlight the nodes in stack
    step.stack.forEach(nodeId => {
      if (this.elements[nodeId]) {
        this.elements[nodeId].classList.add('in-stack');
      }
    });

    // highlight the current node
    if (step.current !== null && this.elements[step.current]) {
      this.elements[step.current].classList.add('current-node');
    }

    // handle found state
    if (step.type === 'found' && step.current !== null) {
      if (this.elements[step.current]) {
        this.elements[step.current].classList.add('found-node');
      }
    }
  }

  executeStepBack(stepIndex) {
    Object.values(this.elements).forEach(el => {
      if (el) {
        el.classList.remove('current-node', 'visited-node', 'in-stack', 'found-node');
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
}

window.DepthFirstSearchAnimation = DepthFirstSearchAnimation;