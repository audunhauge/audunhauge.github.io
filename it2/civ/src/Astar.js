// @flow


declare function SortedHash(s:string):any;


var AsyncAstar = function(options) {
  
  // Declare a reference to the new object to be used in callbacks.
  var self = this;

  // Set member references to the initial value,
  this.initial = options.initial;
  // the neighbors function,
  this.neighbors = options.neighbors;
  // the heuristic (subsituting it with a placeholder if nessessary),
  this.heuristic = options.heuristic || function() {
    return 0;
  };
  // and the onComplete method.
  this.onComplete = options.onComplete;

  // Initialize a new SortedHash that compares objects based on the
  // "__score" attribute
  this.unresolved = new SortedHash("__score");
  // and a native hash.
  this.resolved = {};

  // Setup the helper attributes by finding the initial heuristic,
  this.initial.__h = this.heuristic(this.initial);
  // setting the depth to 0,
  this.initial.__depth = 0;
  // finding the composite "score",
  this.initial.__score = this.initial.__depth + this.initial.__h;
  // and seting the parent to null.
  this.initial.__parent = null;

  // Add the initial state to the unresolved hash,
  this.unresolved.push(this.initial);
  // set the solved flag to false,
  this.solved = false;
  // and if there is a timeout,
  if (options.timeout) {
    // determine the timeout time,
    this.timeoutTime = options.timeout + Date.now();
    // and set the timeout function pointer
    this.onTimeout = options.onTimeout;
  }

  // Launch the solve function asynchronously 
  setTimeout(function() {
    self.solve();
  }, 0);
};

/**
 * @method
 * isTimedOut will determine if the system has timed out
 * @return {Boolean} True if the system has a timeout and the time has passed the threashold.
 */
AsyncAstar.prototype.isTimedOut = function() {
  if (this.timeoutTime) {
    return this.timeoutTime <= Date.now();
  } else {
    return false;
  }
};

/**
 * @method
 * Solve will recursively run the a-star algorithm on the unresolved list.
 */
AsyncAstar.prototype.solve = function() {
  var self = this;
  // First, declare a holder for a neighbor state,
  var neighborState;
  // and get the lowest-scored unresolved state.
  var currentState = this.unresolved.pop();

  // If there is a state to resolve, there has not been a solution, and the system is not
  // timed out,
  if (currentState && !this.solved && !this.isTimedOut()) {
    // find its neighbors,
    var neighbors = this.neighbors(currentState);
    // and add it to the resolved hash.
    this.resolved[currentState.id] = currentState;

    // For each neighbor, and while the solver has not timed out,
    for (var n = 0; !this.isTimedOut() && !this.solved && n < neighbors.length; n++) {
      // set the neighborState to the current iteration's neighbor.
      neighborState = neighbors[n];
      // Set the neighbor's parent to the currentState,
      neighborState.__parent = currentState;
      // find the heuristic,
      neighborState.__h = this.heuristic(neighborState);
      // set the depth to be one more than the parent,
      neighborState.__depth = currentState.__depth + 1;
      // and set the composite score.
      neighborState.__score = neighborState.__depth + neighborState.__h;

      // If the neighbor is in the win state,
      if (neighborState.state == 1) {
        // declare an empty path array,
        var path = [];
        // and set the pointer to the win-state.
        var pointer = neighborState;

        // While the pointer is not-null,
        while (pointer) {
          // push onto the path, the pointer's action,
          path.push(pointer.action);
          // and point the pointer to the pointer's parent.
          pointer = pointer.__parent;
        }

        // After the path has been created,
        // set the solved flag to true,
        this.solved = true;
        // and return the solution to the user's defined callback.
        this.onComplete({
          success: true,
          actions: path.reverse(),
          cost: path.length - 1
        });

        // If the neighbor is not in the win state,
      } else {
        // and it is already resolved,
        if (this.resolved[neighborState.id]) {
          // check to see if this path to the same state is more effecient (lower depth).
          if (neighborState.__depth < this.resolved[neighborState.id].__depth) {
            // If it is, then update the resolved hash's entry to the better version.
            this.resolved[neighborState.id].__parent = neighborState.__parent;
            this.resolved[neighborState.id].__h = neighborState.__h;
            this.resolved[neighborState.id].__depth = neighborState.__depth;
            this.resolved[neighborState.id].__score = neighborState.__score;
          }

          // If the state is imposible to win from,
        } else if (neighborState.state == -1) {
          // add it to the resolved hash.
          this.resolved[neighborState.id] = neighborState;

          // Otherwise, assume that the neighbor is a resolvable state.
        } else {
          // If it already is in the unresolved heap,
          if (this.unresolved.heap[neighborState.id] && neighborState.__depth < this.unresolved.heap[neighborState.id].__depth) {
            // update the unresolved heap with the better depth.
            this.unresolved.heap[neighborState.id].__parent = neighborState.__parent;
            this.unresolved.heap[neighborState.id].__h = neighborState.__h;
            this.unresolved.heap[neighborState.id].__depth = neighborState.__depth;
            this.unresolved.heap[neighborState.id].__score = neighborState.__score;

            // If it is not in then unresolved list,
          } else {
            // then push it in.
            this.unresolved.push(neighborState);
          }
        }
      }
    }

    // Run the next iteration in this one's place
    setImmediate(function() {
      self.solve();
    });
  } else {
    // At this point the solution has been found, there is no solution, or the system
    // timed out.

    // If the system timed out
    if (this.isTimedOut()) {
      // notify the user if possible.
      if (this.onTimeout)
        this.onTimeout();
      // If the system did not time out, but there is no solution,
    } else if (!this.solved) {
      // notify the user that the puzzle does not have a solution.
      this.onComplete({
        success: false,
        actions: [],
        cost: 0
      });
    }
  }
};