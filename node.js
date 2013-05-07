(function () {
  var root = this;
  var me = root.Melodicism.Node = {};

  var Audio;

  me.init = function () {
    Audio = root.Melodicism.Audio;

    this.location = {x: 100, y: 100};

    this.envelope = [
      [1, 0.01],
      [0.1, 0.5],
      [0, 1.5]
    ];

    this.period = 2;

    this.frequency = 196;

    this.gainer = Audio.ctx.createGain();
    this.gainer.connect(Audio.master);
  };

  me.start = function () {
    var ct = Audio.ctx.currentTime;

    this.gainer.gain.value = 0;

    for (var i = 0, l = this.envelope.length; i < l; i++) {
      this.gainer.gain.linearRampToValueAtTime(this.envelope[i][0], ct + this.envelope[i][1]);
    }

    this.oscillator = Audio.ctx.createOscillator();
    this.oscillator.frequency.value = this.frequency;
    this.oscillator.connect(this.gainer);
    this.oscillator.start(ct);
    this.oscillator.stop(ct + this.envelope[i - 1][1]);
  };

}());

