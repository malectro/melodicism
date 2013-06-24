(function () {

  var root = this;
  var me = root.Melodicism.BounceNode = root.Melodicism.SamplerNode.extend();

  var Audio;

  me.color = {r: 100, g: 100, b: 255};
  me.lowColor = {r: 50, g: 50, b: 155};

  me.start = function (offset) {
    this.currentTime = 0;
  };

  me.tick = function (currentTime) {
    if (currentTime - this.currentTime > this.period) {
      var node;
      this.siblings = root.Melodicism.Nodes.nodes;

      for (var i = 0, l = this.siblings.length; i < l; i++) {
        node = this.siblings[i];

        if (node !== this && node.affects(this, currentTime)) {
          console.log('hit');
          this.updateLocation();
          this.pulse(currentTime);
          l = 0;
        }
      }
    }
  };

}());

