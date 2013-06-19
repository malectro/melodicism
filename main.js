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

    MM.Nodes.add(MM.SamplerNode.create({
      src: ['chord1.wav', 'chord2.wav'],
      period: 8,
      waveType: 'area'
    }), 0);
    MM.Nodes.add(MM.SamplerNode.create({
      src: ['chord1.wav', 'chord2.wav'],
      location: {x: 400, y:100},
      period: 8,
      waveType: 'area'
    }), 4);
    MM.Nodes.add(MM.SamplerNode.create({src: ['kick.wav'],
      location: {x: 600, y:100},
      period: 1,
      color: {r: 255, g: 0, b: 0}
    }), 0);

    //MM.Nodes.add(MM.BounceNode.create({location: {x: 400, y: 100}}));
    //MM.Nodes.add(MM.DroneNode.create({location: {x: 200, y: 300}}));
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
    'bounce_node',
    'drone_node',
    'sampler_node',
    'nodes',
    'sounds'
  ], MM.init);
}());

