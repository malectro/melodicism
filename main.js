(function () {
  var root = this;
  var window = root.window;
  var document = root.document;

  var MM = root.Melodicism = {};

  MM.init = function () {
    var canvas = document.getElementById('canvas');
    MM.Canvas.init(canvas);
    MM.Canvas.start()
  };

  require([
    'Util',
    'canvas'
  ], MM.init);
}());

