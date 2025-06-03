new Vue({
  el: '#app',
  data: {
    sidebarSection: 'intro',
    sidebarCollapsed: true,
    links: {
      Sorting: [
        { id: 'bubble', label: 'Bubble Sort' },
        { id: 'insertion', label: 'Insertion Sort' },
        { id: 'selection', label: 'Selection Sort' },
        { id: 'quick', label: 'Quick Sort' },
        { id: 'merge', label: 'Merge Sort' },
      ],
      Searching: [
        {id: 'linear', label: 'Linear Search'},
        { id: 'binary', label: 'Binary Search' },
        { id: 'depth', label: 'Depth-First Search' },
        { id: 'breadth', label: 'Breadth-First Search' },
      ]
    },
    animationState: {
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      progress: 0,
      stepTitle: 'Ready to Start',
      stepDescription: 'Select an algorithm and click play to begin the animation.'
    },
    userInputs: Array(8).fill(''),
    userTarget: '',
    inputSubmitted: false,
    showInputAgain: false, 
    animationController: null,
    mergeSortAnimation: null,
    quickSortAnimation: null,
    bubbleSortAnimation: null,
    insertionSortAnimation: null,
    selectionSortAnimation: null,
    linearSearchAnimation: null,
    binarySearchAnimation: null,
    breadthFirstSearchAnimation: null,
    depthFirstSearchAnimation: null,
    currentAnimation: null,
    currentUserArray: null,
  },
  mounted() {
    this.$nextTick(() => {
      this.inputNavigation()
      this.initialiseCurrentAnimation();
    });
  },
  watch: {
    sidebarSection(newSection) {
      this.$nextTick(() => {  
        
        const mainContent = document.querySelector('.main-content');
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });

        if (typeof Prism !== 'undefined') {
          Prism.highlightAll();
        }
        this.sidebarCollapsed = true
        this.resetUserInputs();
        this.initialiseCurrentAnimation();
      });

      
    },
    sidebarCollapsed() {
      this.handleWindowResize();
      
    }
  },
  methods: {
    handleSidebarClick(event, section) {
      document.querySelectorAll('.sidebar-links a').forEach(link => {
        link.classList.remove('active')
      })

      event.target.classList.add('active')
      this.sidebarSection = section
    },

    handleWindowResize() {
      if (this.currentAnimation) {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.currentAnimation.handleResize();
        }, 250);
      }
    },

    handleInput(index = '', target = '') {
      if (index !== '') {
        const val = this.userInputs[index];
        // allow negative sign and digits only, up to two digits
        if (!/^[-]?\d{0,2}$/.test(val)) {
          this.userInputs[index] = val.slice(0, -1); 
        }
      }

      if (target) {
        const val = this.userTarget;
        if (!/^[-]?\d{0,2}$/.test(val)) {
          this.userTarget = val.slice(0, -1); 
        }
      }

      this.inputNavigation();

    },

    inputNavigation() {
      this.$nextTick(() => {
        const userInputs = document.getElementsByClassName('user-box');

        Array.from(userInputs).forEach((uinput) => {
          uinput.addEventListener("keyup", (event) => {
            const cursorAtEnd = uinput.selectionStart === uinput.value.length;
            if (
              (event.keyCode === 13 || uinput.value.length >= 2) &&
              cursorAtEnd
            ) {
              if (uinput.nextElementSibling) {
                uinput.nextElementSibling.focus();
              }
            }

            if (event.keyCode === 37 && uinput.selectionStart === 0) {
              if (uinput.previousElementSibling) {
                uinput.previousElementSibling.focus();
              }
            }
          });
        });
      });
    },

    resetUserInputs() {
      this.userInputs = Array(8).fill('');
      this.userTarget = '';
      this.currentUserArray = null;
    },

    submitUserInput() {
      const parsedInputs = this.userInputs.map(val => parseInt(val, 10));

      const isValid = parsedInputs.every(
        val => Number.isInteger(val) && val >= -99 && val <= 99
      );

      if (!isValid) {
        return;
      }

      this.currentUserArray = parsedInputs;

      // for search algorithms, also store the target value
      if (this.isSearchAlgorithm(this.sidebarSection)) {
        const parsedTarget = parseInt(this.userTarget, 10);
        if (!Number.isInteger(parsedTarget) || parsedTarget < -99 || parsedTarget > 99) {
          return;
        }
        this.userTarget = parsedTarget;
      }

      this.clearPrevAnimation();

      this.$nextTick(() => {
        this.initialiseCurrentAnimation();
        this.resetUserInputs()
      });
    },

    isSearchAlgorithm(sectionId) {
      const searchAlgorithms = ['binary', 'depth', 'breadth'];
      return searchAlgorithms.includes(sectionId);
    },

    clearPrevAnimation() {
      const visualArea = document.getElementById('visualArea');
      if (visualArea) {
        visualArea.innerHTML = '';
      }
      
      if (this.animationController) {
        this.animationController.reset();
        this.animationController = null;
      }
      
      // clear animation references
      this.currentAnimation = null;
      this.mergeSortAnimation = null;
      this.quickSortAnimation = null;
      this.bubbleSortAnimation = null;
      this.insertionSortAnimation = null;
      this.selectionSortAnimation = null;
      this.linearSearchAnimation = null;
      this.binarySearchAnimation = null;
      this.breadthFirstSearchAnimation = null;
      this.depthFirstSearchAnimation = null;
      
      this.animationState = {
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
        progress: 0,
        stepTitle: 'Ready to Start',
        stepDescription: 'Enter new numbers to run the animation.'
      };
    },

    initialiseAnimation({ AnimationClass, description, delay }) {
      const arrayToUse = (this.sidebarSection === 'depth' || this.sidebarSection === 'breadth') ? [10, 5, 15, 3, 7, 12, 18, 2] : this.currentUserArray || [83, 41, 24, 3, 12, 11, 95, 5];
      
      let animationInstance;
      
      // for search algorithms, pass both array and target
      if (this.isSearchAlgorithm(this.sidebarSection)) {
        const targetToUse = this.userTarget !== '' ? this.userTarget : 12;
        animationInstance = new AnimationClass('visualArea', arrayToUse, targetToUse);
      } else {
        // for sorting algorithms, only pass the array
        animationInstance = new AnimationClass('visualArea', arrayToUse);
      }
      
      this.currentAnimation = animationInstance;

      this.animationController = new AnimationController({
        initialTitle: 'Ready to Start',
        initialDescription: description,
        stepDelay: delay,
        onStateChange: (state) => {
          this.animationState = { ...state };
        },
        onStepExecute: (step, stepIndex) => animationInstance.executeStep(step),
        onStepExecuteBack: (stepIndex) => animationInstance.executeStepBack(stepIndex),
      });

      this.animationController.setSteps(animationInstance.getSteps());
      animationInstance.renderInitialState();

      const className = AnimationClass.name;

      switch(className){
        case 'BubbleSortAnimation':
          this.bubbleSortAnimation = animationInstance;
          break;
        case 'InsertionSortAnimation':
          this.insertionSortAnimation = animationInstance;
          break;
        case 'SelectionSortAnimation':
          this.selectionSortAnimation = animationInstance;
          break;
        case 'MergeSortAnimation':
          this.mergeSortAnimation = animationInstance;
          break;
        case 'QuickSortAnimation':
          this.quickSortAnimation = animationInstance;
          break;
        case 'LinearSearchAnimation':
          this.linearSearchAnimation = animationInstance;
          break;
        case 'BinarySearchAnimation':
          this.binarySearchAnimation = animationInstance;
          break;
        case 'BreadthFirstSearchAnimation':
          this.breadthFirstSearchAnimation = animationInstance;
          break;
        case 'DepthFirstSearchAnimation':
          this.depthFirstSearchAnimation = animationInstance;
          break;
      }
    },

    // initialises the appropriate animation based on current section
    initialiseCurrentAnimation() {
      if (this.animationController) {
        this.animationController.reset();
      }

      const section = this.sidebarSection;
      const animationMap = {
        merge: {
          AnimationClass: MergeSortAnimation,
          description: 'Merge Sort works by dividing the array into smaller pieces, sorting them, then merging them back together.',
        },
        quick: {
          AnimationClass: QuickSortAnimation,
          description: 'Quick Sort works by selecting a pivot element and partitioning the array around it, then recursively sorting the partitions.',
        },
        bubble: {
          AnimationClass: BubbleSortAnimation,
          description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if needed.',
        },
        insertion: {
          AnimationClass: InsertionSortAnimation,
          description: 'Insertion Sort builds the sorted array one element at a time.',
        },
        selection: {
          AnimationClass: SelectionSortAnimation,
          description: 'Selection Sort repeatedly finds the minimum element and moves it to the beginning.',
        },
        linear: {
          AnimationClass: LinearSearchAnimation,
          description: 'Linear Search checks each element of the list one by one until a match is found or the entire list has been searched. ',
        },
        binary: {
          AnimationClass: BinarySearchAnimation,
          description: 'Binary Search efficiently finds a target value in a sorted array by repeatedly dividing the search space in half.',
        },
        breadth: {
          AnimationClass: BreadthFirstSearchAnimation,
          description: 'Breadth First Search (BFS) is a graph traversal algorithm that explores nodes level by level, visiting all neighbors before moving deeper.',
        },
        depth: {
          AnimationClass: DepthFirstSearchAnimation,
          description: 'Depth First Search (DFS) is a graph traversal algorithm that starts at a root node and explores one path completely before backtracking and trying alternative paths.',
        }
      };

      const config = animationMap[section];
      if (config) {
        this.initialiseAnimation(config, delay = 2000);
      } else if (section !== 'intro') {
        console.error(`Error: No animation configuration found for section "${section}"`);
      }
    },

    togglePlayPause() {
      if (!this.animationState.isPlaying || this.animationState.isPaused) {
        if (this.animationController) {
          this.animationController.play();
        }
      } else {
          if (this.animationController) {
          this.animationController.pause();
        }
      }
   },

    resetAnimation() {
      if (this.animationController && this.currentAnimation) {
        this.animationController.reset();
        this.currentAnimation.reset();
      }
    },

    stepAnimation() {
      if (this.animationController) {
        this.animationController.step();
      }
    },

    stepBackAnimation() {
      if (this.animationController) {
        this.animationController.stepBack();
      }
    } 
  }
});