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
    _nodes = root.Melodicism.Nodes.nodes;

    _drawTime = _.now() / 1000;
  };

  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (func) {
      setTimeout(func, 20);
    };

  me.resize = function () {
    me.size = {
      height: document.height,
      width: document.width
    };

    _.extend(_canvas, me.size);
  };

  me.draw = function () {
    // draw the shit!
    var currentTime = Audio.ctx.currentTime;
    var node;

    var color;

    _nodes = root.Melodicism.Nodes.nodes;

    _ctx.clearRect(0, 0, 100000000, 100000000);

    // draw grid
    _ctx.shadowBlur = 0;
    _ctx.strokeStyle = 'rgb(100, 100, 100)';
    _ctx.lineWidth = 0.6;
    for (var j = 50; j < _canvas.height; j += 50) {
      _ctx.beginPath();
      _ctx.moveTo(0, j);
      _ctx.lineTo(_canvas.width, j);
      _ctx.stroke();
      _ctx.closePath();
    }

    for (var j = 50; j < _canvas.width; j += 50) {
      _ctx.beginPath();
      _ctx.moveTo(j, 0);
      _ctx.lineTo(j, _canvas.height);
      _ctx.stroke();
      _ctx.closePath();
    }

    // draw nodes
    for (var i = 0, l = _nodes.length; i < l; i++) {
      node = _nodes[i];

      _ctx.shadowColor = me.rgbOb(node.color);
      _ctx.shadowBlur = node.gainer.gain.value * 50;

      _ctx.beginPath();
      _ctx.arc(node.location.x, node.location.y, node.getRadius(), 0, 2 * Math.PI);
      _ctx.fillStyle = me.rgbOb(node.currentColor());
      _ctx.fill();

      color = Math.floor(node.gainer.gain.value * 255);

      _ctx.beginPath();
      _ctx.arc(node.pulseLocation.x, node.pulseLocation.y, node.waveDistance(currentTime), 0, 2 * Math.PI);
      _ctx.strokeStyle = me.rgbOb(node.waveColor());
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

  me.rgbOb = function (ob) {
    return me.rgb(ob.r, ob.g, ob.b);
  };

}());

