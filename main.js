(function () {
  var root = this;
  var window = root.window;
  var document = root.document;

  var MM = root.Melodicism = {};

  MM.init = function () {
    var canvas = document.getElementById('canvas');
    MM.Canvas.init(canvas);

    MM.Audio.init();

    MM.Node.init();

    MM.nodes = [MM.Node];

    MM.Node.start();
    MM.Canvas.start()
    MM.Audio.start();
  };

  require([
    'Util',
    'canvas',
    'audio',
    'node'
  ], MM.init);
}());

