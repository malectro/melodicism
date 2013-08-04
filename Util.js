(function () {
  var me = window._ = Util = {};


  /**
   * OBJECT METHODS
   */

  /**
   * create
   * create a new object that inherits from the parent
   */
  me.create = function (parent, inits) {
    function f() {};
    f.prototype = parent;
    return me.extend(new f, {parent: parent}, inits);
  };

  /**
   * extend
   * add any number of properties to an object
   */
  me.extend = function (target) {
    for (var i = 1, l = arguments.length; i < l; i++) {
      for (var j in arguments[i]) {
        target[j] = arguments[i][j];
      }
    }

    return target;
  };

  /**
   * ob
   * basic object with built-in create and extend methods
   */
  me.ob = (function () {
    var ob = {};

    ob.extend = function () {
      return _.create(this);
    };

    ob.create = function (options) {
      return _.create(this).init(options);
    };

    ob.init = function () {
      return this;
    };

    ob.soup = function (method) {
      this.parent[method].apply(this, Array.prototype.slice.call(arguments, 1));
    };

    ob.bound = function (method) {
      return me.bind(this[method], this);
    };

    return ob;
  }());


  /**
   * FUNCTION METHODS
   */

  me.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  /**
   * defer
   */
  me.defer = function (func, ms) {
    ms = ms || 0;
    setTimeout(func, ms);
  };

  /**
   * debounce
   */
  me.debounce = function (func, wait) {
    var timeout = 0,
        context;

    function apply(args) {
      func.apply(context, args);
    }

    return function () {
      if (timeout) {
        clearTimeout(timeout);
      }
      context = this;
      timeout = setTimeout(apply, wait, arguments);
    }
  };

  /**
   * throttle
   */
  me.throttle = function (func, interval) {
    var time = 0,
        timeout,
        result,
        args,
        context;

    function delay() {
      time = me.now();
      timeout = 0;
      result = func.apply(context, args);
    }

    return function () {
      var currentTime = me.now(),
          leftover = interval - currentTime + time;

      args = arguments;
      context = this;

      if (leftover < 1) {
        clearTimeout(timeout);
        timeout = 0;
        time = currentTime;
        result = func.apply(context, args);
      }
      else if (!timeout) {
        timeout = setTimeout(delay, leftover);
      }

      return result;
    };
  };


  /**
   * UTILILTY METHODS
   */
  me.now = function () {
    return new Date - 0;
  };


  /**
   * MATH
   */

  /**
   * powerOf2
   * test if the number is a power of 2
   */
  me.powerOf2 = function (number) {
    return number > 0 && ((number - 1) & number === 0);
  }

  /**
   * max
   */
  me.max = function (a, b) {
    if (a > b) {
      return a;
    }
    return b;
  };

  /**
   * min
   */
  me.min = function (a, b) {
    if (a < b) {
      return a;
    }
    return b;
  };

  /**
   * limit
   */
  me.limit = function (a, l, h) {
    if (a < l) {
      return l;
    }
    if (a > h) {
      return h;
    }
    return a;
  };


  /**
   * STRING METHODS
   */

  /**
   * stamp
   * replace variables in a string with the contents
   * of an object
   */
  me.stamp = function (string, object) {
    var newString = string;

    for (var i in object) {
      newString = newString.replace(new RegExp(i, "g"), object[i]);
    }

    return newString;
  };


  /**
   * LIST METHODS
   */

  /**
   * last
   * get the last element in an array
   */
  me.last = function (arr) {
    return arr[arr.length - 1];
  };

  /**
   * each
   */
  me.each = function (arr, func) {
    if (arr.length === +arr.length) {
      Array.prototype.forEach.call(arr, func);
    } else {
      for (var i in arr) {
        if (arr.hasOwnProperty(i)) {
          func(arr[i], i);
        }
      }
    }
  };

  /**
   * toKeys
   */
  me.toKeys = function (arr, func) {
    var map = {};

    func = func || function () { return null };

    Array.prototype.forEach.call(arr, function (val) {
      map[val] = func(val);
    });

    return map;
  };

  /**
   * search
   */
  me.search = function (arr, func) {
    var index = -1;

    _.each(arr, function (el, i) {
      if (func(el)) {
        index = i;
      }
    });

    return index;
  };

  /**
   * weed
   */
  me.weed = function (arr, func) {
    var newArr = [];

    _.each(arr, function (el) {
      if (!func(el)) {
        newArry.push(el);
      }
    });

    return newArr;
  };

  /**
   * toArray
   */
  me.toArray = function (ob) {
    var arr = [];
    for (var i in ob) {
      arr.push(ob[i]);
    }
    return arr;
  };


  /**
   * DOM METHODS
   */

  /**
   * text
   * get the inner text of a node
   */
  me.text = function (node) {
    var text = '',
        children = node.childNodes;

    for (var i = 0, l = children.length; i < l; i++) {
      if (children[i].nodeType === node.TEXT_NODE) {
        text += children[i].textContent;
      }
    }

    return text;
  };

}());


