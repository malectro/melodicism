(function () {
  var root = this;
  var me = root.Melodicism.Puzzle = _.ob.extend();

  var Nodes;

  me.init = function () {
    Nodes = root.Melodicism.Nodes;

    Nodes.reset([
      root.Melodicism.SamplerNode.create({src: ['kick.wav'],
        location: {x: 600, y:100},
        period: 1,
        color: {r: 255, g: 0, b: 0}
      })
    ]);
  };

}());

