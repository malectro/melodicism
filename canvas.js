(function () {
  var root = this;

  var me = root.Melodicism.Canvas = {};

  var _canvas;
  var _ctx;

  var _drawTime = 0;
  var _animating = false;

  me.init = function (canvas) {
    me.canvas = _canvas = canvas;
    me.ctx = _ctx = canvas.getContext('2d');

    me.resize();
    window.addEventListener('resize', _.debounce(me.resize, 100));

    _drawTime = _.now();
  };

  me.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (func) {
      setTimeout(func, 20);
    };

  me.resize = function () {
    _.extend(_canvas, {
      height: document.height,
      width: document.width
    });
  };

  me.draw = function () {
    // draw the shit!
    var currentTime = _.now();

    _drawTime = currentTime;

    if (_animating) {
      requestAnimationFrame(me.draw, _canvas);
    }
  }

  me.start = function () {
    _animating = true;
    me.draw();
  };

  me.stop = function () {
    _animating = false;
  };

}());

