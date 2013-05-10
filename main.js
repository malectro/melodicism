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

    MM.Nodes.add(MM.Node.create());
    MM.Nodes.add(MM.Node.create({location: {x: 500, y: 100}}));
    MM.Nodes.add(MM.BounceNode.create({location: {x: 400, y: 100}}));
    MM.Nodes.add(MM.BounceNode.create({location: {x: 300, y: 200}}));

    MM.Canvas.start()
    MM.Audio.start();
  };

  require([
    'Util',
    'controller',
    'canvas',
    'audio',
    'node',
    'bounce_node',
    'nodes'
  ], MM.init);
}());

