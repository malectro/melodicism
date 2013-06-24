(function () {
  var root = this;
  var name = '2-possibilities';

  var me = root.Puzzle.Puzzles[name] = root.Puzzle.extend();

  me.name = name;

  me.init = function () {
    root.Puzzle.init.call(this);

    Canvas = root.Canvas;

    this.node1 = root.SamplerNode.create({
      src: ['chord1.wav', 'chord2.wav'],
      location: {x: root.Canvas.center.x - 10, y: 200},
      periodRange: [2, 6],
      color: {r: 0, g: 255, b: 0},
      lowColor: {r: 0, g: 200, b: 0}
    });

    root.Nodes.reset([
      this.node1
    ]);

    root.Controller.listen('touch', 'up', this.bound('touchUp'));

    root.Message.send("Now let's add some melody.", 10000);
    root.Message.send("This node can play two chords.", 10000, this.bound('lower'));
    root.Message.send("Try moving it to the lower region and hear how it changes.", 10000);

    return this;
  };

  me.lower = function () {
    this.step = 2;
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
    if (this.step === 2 && this.node1.buffer === this.node1.bufferArray[1]) {
      this.step3();
    }
  };

  me.step3 = function () {
    this.step = 3;

    root.Message.send("Good!", 10000);
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
    this.next();
  };
}.call(Melodicism));
