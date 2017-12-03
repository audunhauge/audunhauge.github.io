// @flow


/**
 * @class
 * SortedHash creates a collection indexed on the "id" attribute of it's objects. Also, sets
 * up a linked list to maintain sort-order. This class is used as a light-weight helper
 * for the AsyncAstar class.
 * @param {String} attr is the key whose value will be compared on each object.
 */
var SortedHash = function SortedHash(attr:any) {
    // Initialize the heap,
    this.heap = {};
    // then store a reference to the attr desired,
    this.attr = attr;
    // and create a head pointer that points to null.
    this.head = {
      __next: null
    };
  };
  
  /**
   * @method
   * Push is used to push an object into the heap. If there already is an object
   * with the same id, it will be replaced by this one.
   * @param  {Object} object is the object to store
   */
  SortedHash.prototype.push = function push(object) {
    // Get a reference to the head,
    var currentNode = this.head;
    // declare a flag to be toggled once the object has been placed in order,
    var placed = false;
    // and initialize an empty pointer to the next object.
    object.__next = null;
  
    // While the object has not been placed,
    while (!placed) {
      // check to see if it should go immidiately after the currentNode.
      if (currentNode.__next && currentNode.__next[this.attr] < object[this.attr]) {
        // If it shouldn't, then simply advance the currentNode pointer to the 
        // next object in the linked list.
        currentNode = currentNode.__next;
      } else {
        // But if it should, then insert the object by
        object.__next = currentNode.__next;
        // pointing the __next pointer to the newly inserted object
        currentNode.__next = object;
        // and fliping the placed flag to true.
        placed = true;
      }
    }
  
    // Lastly, ensure that the heap has an indexed reference to the object.
    this.heap[object.id] = object;
  };
  
  /**
   * @method
   * Pop will remove and return the object with the lowest attr attribute
   * @return {Object} The object with the lowest attr attribute
   */
  SortedHash.prototype.pop = function pop() {
    // Get a reference to the head's object
    var ret = this.head.__next;
    // and point the head to the next object.
    this.head.__next = ret && ret.__next;
    // If there actually is an object,
    if (ret)
    // remove it from the heap
      delete this.heap[ret.id];
    // and return a reference to it.
    return ret;
  };