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
      this.node1,
    ]);

    root.Controller.listen('touch', 'up', this.bound('touchUp'));

    root.Message.send('Hi, this is Melodicism.', 10000);
    root.Message.send("It's a game", 10000);
    root.Message.send("about music.", 10000);
    root.Message.send("Move the <emph>node</emph> left and right to change its tempo.", 10000, this.bound('moveNode'));

    this.step = 1;
    this.ready = false;
    this.bornAt = _.now();

    return this;
  };

  me.solved = function () {
    if (!this._solved) {
      this._solved = this.ready && this.node1.period < 1.01 && this.node1.period > 0.99;

      if (this._solved) {
        this.solvedAt = _.now();
      }
    }

    return this._solved;
  };

  me.touchUp = function () {
    if (this.node1.location.y !== 200 && this.step === 2) {
      this.moveNode2();
    } else if (this.step === 4 && this.node1.period > 0.99 && this.node1.period < 1.01) {
      this.done();
    }
  };

  me.moveNode = function () {
    this.step = 2;
  };

  me.moveNode2 = function () {
    this.step = 3;
    root.Message.send("Pretty neat, huh?", 10000);
    root.Message.send("The beat we're going for isn't to fast or too slow.", 10000, this.bound('moveNode3'));
  };

  me.moveNode3 = function () {
    this.step = 4;
    root.Message.send("Try moving it here.", 10000);
    this.highlights = [
      {x: (0.99 - 0.5) * Canvas.size.width, y: 0, w: 0.02 * Canvas.size.width, h: Canvas.size.height,
        color: {r: 100, g: 0, b: 0}
      }
    ];
  };

  me.done = function () {
    root.Message.send("Groovy. You got it.");
    this.step = 5;
    this.ready = true;
  };

}.call(Melodicism));

