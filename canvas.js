(function () {
  var root = this;

  var me = root.Melodicism.Canvas = {};

  var Audio;
  var _nodes;

  var _canvas;
  var _ctx;

  var _drawTime = 0;
  var _animating = false;

  me.init = function (canvas) {
    me.canvas = _canvas = canvas;
    me.ctx = _ctx = canvas.getContext('2d');

    me.resize();
    window.addEventListener('resize', _.debounce(me.resize, 100));

    Audio = root.Melodicism.Audio;
    _nodes = root.Melodicism.nodes;

    _drawTime = _.now() / 1000;
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
    var currentTime = Audio.ctx.currentTime;
    var node;

    _nodes = root.Melodicism.nodes;

    _ctx.clearRect(0, 0, 100000000, 100000000);

    for (var i = 0, l = _nodes.length; i < l; i++) {
      node = _nodes[i];

      _ctx.beginPath();
      _ctx.shadowColor = 'white';
      _ctx.shadowBlur = node.gainer.gain.value * 50;
      _ctx.arc(node.location.x, node.location.y, 10, 0, 2 * Math.PI);
      _ctx.fillStyle = 'white';
      _ctx.fill();
    }

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

