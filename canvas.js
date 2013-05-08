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

    root.Melodicism.Controller.listen('pauseplay', 'down', me.pausePlay);

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

    var color;

    _nodes = root.Melodicism.nodes;

    _ctx.clearRect(0, 0, 100000000, 100000000);

    for (var i = 0, l = _nodes.length; i < l; i++) {
      node = _nodes[i];

      color = Math.floor(node.gainer.gain.value * 150 + 105);

      _ctx.shadowColor = 'white';
      _ctx.shadowBlur = node.gainer.gain.value * 50;

      _ctx.beginPath();
      _ctx.arc(node.location.x, node.location.y, node.radius, 0, 2 * Math.PI);
      _ctx.fillStyle = me.rgb(color, color, color);
      _ctx.fill();

      _ctx.beginPath();
      _ctx.arc(node.pulseLocation.x, node.pulseLocation.y, Math.floor(node.waveRadius * node.timeSincePulse(currentTime) / node.period + node.radius), 0, 2 * Math.PI);
      _ctx.strokeStyle = me.rgb(color, color, color);
      _ctx.lineWidth = 1;
      _ctx.stroke();
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

  me.pausePlay = function () {
    if (_animating) {
      me.stop();
    } else {
      me.start();
    }
  };

  me.rgb = function (r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
  };

}());

