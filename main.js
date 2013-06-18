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

    MM.Nodes.add(MM.SamplerNode.create({src: 'sounds/chord1.wav'}));

    MM.Nodes.add(MM.BounceNode.create({location: {x: 400, y: 100}}));
    //MM.Nodes.add(MM.DroneNode.create({location: {x: 200, y: 200}}));

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
    'drone_node',
    'sampler_node',
    'nodes'
  ], MM.init);
}());

