(function () {
  var root = this;
  var me = root.Puzzle = _.ob.extend();

  me.init = function () {
    root.Nodes.reset([
      root.SamplerNode.create({src: ['kick.wav'],
        location: {x: 600, y:100},
        period: 1,
        color: {r: 255, g: 0, b: 0}
      })
    ]);

    root.Message.send('Hi, this is Melodicism.', 10000);
    root.Message.send("It's a game.", 10000);
    root.Message.send("About music.", 10000);
  };

}.call(Melodicism));

