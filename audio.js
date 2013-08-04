(function () {
  var root = this;
  var me = root.Melodicism.Audio = {};

  var _nodes;

  var _interval = null;
  var _tickTime = 0;

  me.init = function () {
    me.ctx = new webkitAudioContext();
    me.fixForOldVersions();

    me.masterGain = me.ctx.createGain();
    me.masterGain.gain.setValueAtTime(1.0, me.ctx.currentTime);
    me.masterGain.connect(me.ctx.destination);

    me.master = me.ctx.createDynamicsCompressor();
    me.master.connect(me.masterGain);

    root.Melodicism.Controller.listen('pauseplay', 'down', me.pausePlay);
    root.Melodicism.Controller.listen('touch', 'down', me.enableAudio);
  };

  me.enableAudio = function () {
    var node = me.createOscillator();

    if (node.noteOn) {
      node.connect(me.ctx.destination);
      node.noteOn(0);
      node.noteOff(0);
    }

    _.defer(function () {
      root.Melodicism.Controller.forget('touch', 'down', me.enableAudio);
    });
  };

  me.tick = function () {
    var currentTime = me.ctx.currentTime;

    _nodes = root.Melodicism.Nodes.nodes;

    for (var i = 0, l = _nodes.length; i < l; i++) {
      _nodes[i].tick(currentTime);
    }
  };

  me.start = function () {
    _tickTime = _.now();
    _interval = setInterval(me.tick, 10);
    me.masterGain.gain.linearRampToValueAtTime(0.6, me.ctx.currentTime + 0.2);
  };

  me.stop = function () {
    clearInterval(_interval);
    _interval = null;
    me.masterGain.gain.linearRampToValueAtTime(0, me.ctx.currentTime + 0.2);
  };

  me.soundNodes = function () {
    me.masterGain.gain.linearRampToValueAtTime(0.6, me.ctx.currentTime + 0.2);
  };

  me.silenceNodes = function () {
    me.masterGain.gain.linearRampToValueAtTime(0, me.ctx.currentTime + 0.2);
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
    var oscillator = me.ctx.createOscillator();

    // this caused memory issues. need a better solution for safari
    //oscillator.start = oscillator.start || oscillator.noteOn;
    //oscillator.stop = oscillator.start || oscillator.noteOff;

    return oscillator;
  };
}());

