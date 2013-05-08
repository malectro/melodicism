(function () {
  var root = this;
  var me = root.Melodicism.Node = {};

  var Audio;

  me.init = function () {
    Audio = root.Melodicism.Audio;

    this.location = {x: 100, y: 100};
    this.radius = 10;
    this.waveRadius = 200;

    this.envelope = [
      [1, 0.01],
      [0.1, 0.5],
      [0, 1.5]
    ];

    this.period = 2;
    this.startTime = 0;
    this.curentTime = 0;
    this.nextTime = 0;
    this.frequency = 196;

    this.gainer = Audio.ctx.createGain();
    this.gainer.connect(Audio.master);
  };

  me.start = function (offset) {
    this.startTime = Audio.ctx.currentTime;
    this.nextTime = this.startTime;
    this.pulse(this.startTime);
  };

  me.tick = function (currentTime) {
    if (currentTime >= this.currentTime) {
      this.nextTime = this.currentTime + this.period;
      this.pulse(this.nextTime);
    }
  };

  me.pulse = function (ct) {
    this.gainer.gain.setValueAtTime(0, ct);

    for (var i = 0, l = this.envelope.length; i < l; i++) {
      this.gainer.gain.linearRampToValueAtTime(this.envelope[i][0], ct + this.envelope[i][1]);
    }

    this.oscillator = Audio.ctx.createOscillator();
    this.oscillator.frequency.value = this.frequency;
    this.oscillator.connect(this.gainer);
    this.oscillator.start(ct);
    this.oscillator.stop(ct + this.envelope[i - 1][1]);

    this.currentTime = ct;
  };

  me.timeSincePulse = function (ct) {
    var lastTime;
    if (ct > this.currentTime) {
      lastTime = this.currentTime;
    } else {
      lastTime = this.currentTime - this.period;
    }

    return ct - lastTime;
  };

  me.contains = function (point) {
    var distance = Math.sqrt(Math.pow(this.location.x - point.x, 2) + Math.pow(this.location.y - point.y, 2));
    return distance < this.radius;
  };

}());

