(function () {
  var root = this;
  var me = root.Melodicism.Node = {};

  var Audio;

  me.init = function () {
    Audio = root.Melodicism.Audio;

    this.location = {x: 0, y: 0};

    this.gainer = Audio.ctx.createGain();
    this.gainer.connect(Audio.master);

    this.oscillator = Audio.ctx.createOscillator();
    this.oscillator.frequency.value = 196;
    this.oscillator.connect(this.gainer);
  };

  me.start = function () {
    var ct = Audio.ctx.currentTime;

    this.gainer.gain.value = 0;
    this.gainer.gain.linearRampToValueAtTime(1, ct + 0.01);
    this.gainer.gain.linearRampToValueAtTime(0.4, ct + 1.5);
    this.gainer.gain.linearRampToValueAtTime(0, ct + 1);
    this.oscillator.start(ct);
    this.oscillator.stop(ct + 1);
  };

}());

