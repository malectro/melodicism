(function () {
  var root = this;
  var name = '3-possibilities';

  var me = root.Puzzle.Puzzles[name] = root.Puzzle.extend();

  me.name = name;

  me.init = function () {
    root.Puzzle.init.call(this);

    Canvas = root.Canvas;

    this.node1 = root.BounceNode.create({
      src: ['chord1.wav', 'chord2.wav'],
      location: {x: root.Canvas.center.x - 10, y: 200},
      periodRange: [2, 6],
      color: {r: 0, g: 255, b: 0},
      lowColor: {r: 0, g: 100, b: 0}
    });

    this.node2 = root.BounceNode.create({
      src: ['chord1.wav', 'chord2.wav'],
      location: {x: root.Canvas.center.x + 300, y: 200},
      periodRange: [2, 6],
      color: {r: 0, g: 255, b: 0},
      lowColor: {r: 0, g: 100, b: 0}
    });

    this.kick = root.SamplerNode.create({
      src: ['kick.wav'],
      location: {x: root.Canvas.center.x - 300, y: 200},
      periodRange: [0.5, 1.5],
      color: {r: 255, g: 0, b: 0},
      lowColor: {r: 200, g: 0, b: 0}
    });

    root.Nodes.reset([
    ]);

    this.addNodes();
    this.enableControls();
    return this;

    root.Message.send("Now that you've got the hang of things, let's see if you can construct a song.", 10000);
    root.Message.send("I'll play it for you first.", null, this.bound('playSong'));

    return this;
  };

  me.playSong = function () {
    root.Sounds.playClip('possibilities.mp3', 0, 23.5, 11);
    setTimeout(this.bound('step2'), 11000);
  };

  me.step2 = function () {
    root.Message.send("If you want to hear it again, you can touch the arrow at the top right.");
    root.Message.send("Anyway, here are the nodes you'll need to complete the song.", null, this.bound('addNodes'));
    root.Message.send("Good luck!", null, this.bound('enableControls'));
  };

  me.addNodes = function () {
    root.Nodes.reset([
      this.node1, this.node2, this.kick
    ]);

    this.node1.on('pulse', this.bound('nodePulsed'));
    this.node2.on('pulse', this.bound('nodePulsed'));
  };

  me.nodePulsed = function () {
    var nodeDiff;
    var kickDiff;

    if (this.kick.period > 0.99 && this.period < 1.01) {
      nodeDiff = Math.abs(this.node1.currentTime - this.node2.currentTime);
      if (nodeDiff > 1.98 && nodeDiff < 2.02) {
        kickDiff = Math.abs(this.node1.currentTime - this.kick.startTime) / this.kick;
        kickDiff = Math.abs(kickDiff - Math.round(kickDiff));
        if (kickDiff < 0.02) {
          this._solved = true;
        }
      }
    } else {

    }
  };

  me.lower = function () {
    root.Nodes.activate();
    this.step = 2;
    this.highlights = [
      {x: 0, y: Canvas.center.y, w: Canvas.size.width, h: Canvas.size.height / 2,
        color: {r: 0, g: 50, b: 0}
      }
    ];
  };

  me.solved = function () {
    if (!this._solved) {
      this._solved = this.ready;
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

    root.Nodes.deactivate();

    this.highlights = [];

    root.Message.send("Good!");
    root.Message.send("It's not the most interesting melody, though.");
    root.Message.send("We're still only playing one note.", null, this.bound('step4'));
    root.Message.send("Here's a second node.");
    root.Message.send("Oops. My bad.");
    root.Message.send("It looks like it's low on energy.", null, this.bound('enableControls'));
    root.Message.send("I wonder how we could we can get it some juice...");
  };

  me.step4 = function () {
    this.node2.on('pulse', this.step5, this);
    root.Nodes.add(this.node2);
  };

  me.step5 = function () {
    root.Message.send("Nice!");
    root.Message.send("I'm guessing we'll see more low-energy nodes in the coming puzzles.", null, this.bound('done'));
    this.node2.off('pulse', this.step5);
  };
}.call(Melodicism));

