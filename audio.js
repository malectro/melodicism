(function () {
  var root = this;
  var me = root.Melodicism.Audio = {};

  var _interval = null;
  var _tickTime = 0;

  me.init = function () {
    me.ctx = new webkitAudioContext();
    me.master = me.ctx.createDynamicsCompressor();
    me.master.connect(me.ctx.destination);
  };

  me.tick = function () {

  };

  me.start = function () {
    _tickTime = _.now();
    _interval = setInterval(me.tick, 10);
  };

  me.stop = function () {
    clearInterval(_interval);
    _interval = null;
  };
}());

