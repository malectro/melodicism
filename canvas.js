(function () {
  var root = this;

  var me = root.Melodicism.Canvas = {};

  var Audio;
  var _nodes;
  var _puzzle;

  var _canvas;
  var _ctx;

  var _drawTime = 0;
  var _animating = false;

  var _gradients = {};

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

    me.center = {
      x: me.size.width / 2,
      y: me.size.height / 2
    };

    _.extend(_canvas, me.size);
  };

  me.draw = function () {
    // draw the shit!
    var currentTime = Audio.ctx.currentTime;
    var node;

    var color;

    _nodes = root.Melodicism.Nodes.nodes;
    _puzzle = root.Melodicism.puzzle;

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

    // draw highlights
    if (_puzzle) {
      var rect;
      for (var i = 0, l = _puzzle.highlights.length; i < l; i++) {
        rect = _puzzle.highlights[i];
        _ctx.fillStyle = me.rgbOb(rect.color);
        _ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      }
    }

    // draw nodes
    for (var i = 0, l = _nodes.length; i < l; i++) {
      node = _nodes[i];

      _ctx.shadowColor = me.rgbOb(node.color);
      _ctx.shadowBlur = node.gainer.gain.value * 50;

      color = Math.floor(node.gainer.gain.value * 255);

      _ctx.save();
      if (node.waveType === 'rippler') {
        _ctx.beginPath();
        _ctx.globalAlpha = node.waveGain(currentTime);
        _ctx.arc(node.pulseLocation.x, node.pulseLocation.y, node.waveDistance(currentTime), 0, 2 * Math.PI);
        _ctx.strokeStyle = me.rgbOb(node.waveColor());
        _ctx.lineWidth = 1;
        _ctx.stroke();
      } else if (node.waveType === 'area') {
        _ctx.globalAlpha = node.waveGain(currentTime);
        _ctx.translate(node.location.x, node.location.y);
        _ctx.fillStyle = me.radialGradient(node.waveColor(), node.getRadius(), node.waveDistance(currentTime));
        //_ctx.fillStyle = 'blue';
        _ctx.beginPath();
        _ctx.arc(0, 0, node.waveDistance(currentTime), 0, 2 * Math.PI);
        _ctx.fill();
      }
      _ctx.restore();

      _ctx.beginPath();
      _ctx.arc(node.location.x, node.location.y, node.getRadius(), 0, 2 * Math.PI);
      _ctx.fillStyle = me.rgbOb(node.currentColor());
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

  me.rgba = function (r, g, b, a) {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };

  me.rgbOb = function (ob) {
    return me.rgb(ob.r, ob.g, ob.b);
  };

  me.rgbaOb = function (ob) {
    return me.rgba(ob.r, ob.g, ob.b, ob.a);
  };

  me.radialGradient = function (color, fromRadius, toRadius) {
    var rgbColor = me.rgbOb(color);
    var key = rgbColor + toRadius;
    var gradient = _gradients[key];

    if (!gradient) {
      gradient = _ctx.createRadialGradient(0, 0, fromRadius, 0, 0, toRadius);
      gradient.addColorStop(0, rgbColor);
      gradient.addColorStop(1, me.rgbaOb(_.extend(color, {a: 0.0})));
      _gradients[key] = gradient;
    }

    return gradient;
  };

}());

