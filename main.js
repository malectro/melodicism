(function () {
  var root = this;
  var window = root.window;
  var document = root.document;

  var MM = root.Melodicism = {};

  MM.init = function () {
    var canvas = document.getElementById('canvas');

    MM.Controller.init();
    MM.Canvas.init(canvas);
    MM.Audio.init();

    MM.Nodes.init();
    MM.Sounds.onload(MM.start);
    MM.Sounds.load();

    MM.puzzle = MM.Puzzle.create();
  };

  MM.start = function () {
    MM.Canvas.start()
    MM.Audio.start();
  };

  require([
    'Util',
    'controller',
    'canvas',
    'audio',
    'node',
    'sampler_node',
    'bounce_node',
    'drone_node',
    'nodes',
    'sounds',
    'puzzle'
  ], MM.init);
}());

