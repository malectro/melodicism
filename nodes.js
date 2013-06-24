(function () {
  var root = this;

  var me = root.Melodicism.Nodes = {};

  var _touchingNode = null;
  var _startDragLocation = null;
  var _startNodeLocation = null;

  me.nodes = [];

  me.init = function () {
    root.Melodicism.Controller.listen('touch', 'down', me.touchDown);
    root.Melodicism.Controller.listen('touch', 'up', me.touchUp);
    root.Melodicism.Controller.listen('move', 'down', me.drag);
  };

  me.touchDown = function (e) {
    if (root.Melodicism.puzzle && !root.Melodicism.puzzle.solved()) {
      var node;
      // intersection check
      // if there's a future problem with perf, we can do some sort of indexing
      for (var i = 0, l = me.nodes.length; i < l; i++) {
        node = me.nodes[i];
        if (node.contains(e)) {
          _touchingNode = node;
          _touchingNode.startDrag();
          _startNodeLocation = node.location;
          _startDragLocation = e;
        }
      }
    }
  };

  me.touchUp = function (e) {
    if (_touchingNode) {
      _touchingNode.location = {
        x: _startNodeLocation.x + e.x - _startDragLocation.x,
        y: _startNodeLocation.y + e.y - _startDragLocation.y
      };
      _touchingNode.endDrag();
      _touchingNode = null;
    }
  };

  me.drag = function (e) {
    if (_touchingNode) {
      _touchingNode.location = {
        x: _startNodeLocation.x + e.x - _startDragLocation.x,
        y: _startNodeLocation.y + e.y - _startDragLocation.y
      };
    }
  };

  me.add = function (node, at) {
    me.nodes.push(node);
    node.start(at);
  };

  me.remove = function (node) {
    me.nodes.splice(me.nodes.indexOf(node), 1);
  };

  me.removeAll = function () {
    _.each(me.nodes, function (node) {
      node.destroy();
    });

    me.nodes = [];
  };

  me.reset = function (nodes) {
    me.removeAll();

    _.each(nodes, function (node) {
      me.add(node, 0);
    });
  };

}());

