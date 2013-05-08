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
    var node;
    // intersection check
    // if there's a future problem with perf, we can do some sort of indexing
    for (var i = 0, l = me.nodes.length; i < l; i++) {
      node = me.nodes[i];
      if (node.contains(e)) {
        _touchingNode = node;
        _startNodeLocation = node.location;
        _startDragLocation = e;
      }
    }
  };

  me.touchUp = function (e) {
    if (_touchingNode) {
      _touchingNode.location = {
        x: _startNodeLocation.x + e.x - _startDragLocation.x,
        y: _startNodeLocation.y + e.y - _startDragLocation.y
      };
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

  me.add = function (node) {
    me.nodes.push(node);
  };

  me.remove = function (node) {
    me.nodes.splice(me.nodes.indexOf(node), 1);
  };

}());
