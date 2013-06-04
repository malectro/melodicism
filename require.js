;

/**
 * require
 * basic require script
 * by malectro
 */

if (typeof require !== 'function') {
  var require = (function () {

    var required = {},
        callbacks = {},
        id = 0;

    function require(paths, callback) {
      if (typeof paths === 'string') {
        paths = [paths];
      }

      callback = callback || function () {};

      var firstScript = document.getElementsByTagName('script')[0],
          script, path;

      id++;
      callbacks[id] = {count: paths.length, callback: callback};

      for (var i = 0, l = paths.length; i < l; i++) {
        path = paths[i];
        script = document.createElement('script');

        if (typeof path === 'object') {
          script.type = path[1];
          path = path[0];
        }

        if (path.indexOf('.') < 0) {
          path += '.js';
        }
        script.src = path;

        script.onload = function () {
          require.loaded(id);
        };

        firstScript.parentNode.insertBefore(script, firstScript);
      }

      return id;
    };

    require.loaded = function (id) {
      if (callbacks[id]) {
        console.log(callbacks[id].count);
        callbacks[id].count--;

        if (callbacks[id].count < 1) {
          callbacks[id].callback();
          callbacks[id] = null;
        }
      }
    };

    return require;
  }());
}

