(function () {
  var root = this;
  var name = '1-possibilities';

  var me = root.Puzzle.Puzzles[name] = root.Puzzle.extend();

  me.name = name;

  me.init = function () {
    root.Puzzle.init.call(this);

    Canvas = root.Canvas;

    this.node1 = root.SamplerNode.create({
      src: ['kick.wav'],
      location: {x: root.Canvas.center.x - 10, y: 200},
      periodRange: [0.5, 2],
      beatSeconds: 0.8202,
      beatSteps: [0.5, 1, 2, 4],
      color: {r: 255, g: 0, b: 0},
      lowColor: {r: 200, g: 0, b: 0}
    });

    root.Nodes.reset([
      this.node1
    ]);

    root.Controller.listen('touch', 'up', this.bound('touchUp'));

    root.Message.send('Hi, this is Melodicism.', 10000);
    root.Message.send("It's a game", 10000);
    root.Message.send("about music.", 10000, this.bound('enableControls'));
    root.Message.send("Move the <emph>node</emph> left and right to change its tempo.", 10000, this.bound('moveNode'));

    return this;
  };

  me.solved = function () {
    if (!this._solved) {
      this._solved = this.ready && this.node1.period > 0.8201 && this.node1.period < 0.8203;

      if (this._solved) {
        this.solvedAt = _.now();
      }
    }

    return this._solved;
  };

  me.touchUp = function () {
    if (this.node1.location.y !== 200 && this.step === 2) {
      this.moveNode2();
    } else if (this.step === 4 && this.node1.period > 0.8201 && this.node1.period < 0.8203) {
      this.done();
    }
  };

  me.enableControls = function () {
    root.Nodes.activate();
  };

  me.moveNode = function () {
    this.step = 2;
  };

  me.moveNode2 = function () {
    this.step = 3;
    root.Message.send("Pretty neat, huh?", 10000);
    root.Message.send("Notice how the beat starts playing at the exact time you drop the node.");
    root.Message.send("The beat we're going for isn't too fast or too slow.", 10000, this.bound('moveNode3'));
  };

  me.moveNode3 = function () {
    this.step = 4;
    root.Message.send("Try moving it here.", 10000);
    this.highlights = [{
        x: Canvas.size.width / 2,
        y: 0,
        w: Canvas.size.width / 4,
        h: Canvas.size.height,
        color: {r: 100, g: 0, b: 0}
    }];
  };

  me.done = function () {
    this.highlights = [];
    root.Message.send("Groovy. You got it.");
    root.Nodes.deactivate();
    this.step = 5;
    this.next();
  };
}.call(Melodicism));

