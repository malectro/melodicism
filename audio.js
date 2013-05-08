(function () {
  var root = this;
  var me = root.Melodicism.Audio = {};

  var _nodes;

  var _interval = null;
  var _tickTime = 0;

  me.init = function () {
    me.ctx = new webkitAudioContext();
    me.fixForOldVersions();

    me.master = me.ctx.createDynamicsCompressor();
    me.master.connect(me.ctx.destination);

    root.Melodicism.Controller.listen('pauseplay', 'down', me.pausePlay);
  };

  me.tick = function () {
    var currentTime = me.ctx.currentTime;

    _nodes = root.Melodicism.nodes;

    for (var i = 0, l = _nodes.length; i < l; i++) {
      _nodes[i].tick(currentTime);
    }
  };

  me.start = function () {
    _tickTime = _.now();
    _interval = setInterval(me.tick, 10);
  };

  me.stop = function () {
    clearInterval(_interval);
    _interval = null;
  };

  me.pausePlay = function () {
    if (_interval) {
      me.stop();
    } else {
      me.start();
    }
  };

  me.fixForOldVersions = function () {
    me.ctx.createGain = me.ctx.createGain || me.ctx.createGainNode;
    me.ctx.createDelay = me.ctx.createDelay || me.ctx.createDelayNode;
  };

  me.createOscillator = function () {
    if (!me.oscillator) {
      me.oscillator = me.ctx.createOscillator();
      me.oscillator.start = me.oscillator.start || me.oscillator.noteOn;
      me.oscillator.stop = me.oscillator.start || me.oscillator.noteOff;
    }

    return me.oscillator;
  };
}());

