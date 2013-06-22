(function () {
  var root = this;
  var me = root.Puzzle = _.ob.extend();
  var Canvas;

  me.ready = false;
  me.highlights = [];

  me.init = function () {
    Canvas = root.Canvas;

    this.node1 = root.SamplerNode.create({
      src: ['kick.wav'],
      location: {x: root.Canvas.center.x - 5, y: 200},
      periodRange: [0.5, 1.5],
      color: {r: 255, g: 0, b: 0},
      lowColor: {r: 200, g: 0, b: 0}
    });

    root.Nodes.reset([
      this.node1
    ]);

    root.Message.send('Hi, this is Melodicism.', 10000);
    root.Message.send("It's a game", 10000);
    root.Message.send("about music.", 10000);
    root.Message.send("Move the node left and right to change its tempo.", 10000, me.bound('moveNode'));

    this.ready = true;

    return this;
  };

  me.solved = function () {
    return this.ready && this.node1.period < 1.01 && this.node1.period > 0.99;
  };

  me.moveNode = function () {
    this.highlights = [
      {x: (0.99 - 0.5) * Canvas.size.width, y: 0, w: 0.02 * Canvas.size.width, h: Canvas.size.height,
        color: {r: 150, g: 0, b: 0}
      }
    ];
  };

}.call(Melodicism));

