(function () {

  var root = this;
  var me = root.Melodicism.DroneNode = root.Melodicism.Node.extend();

  var Audio;

  me.color = {r: 200, g: 100, b: 255};
  me.lowColor = {r: 100, g: 50, b: 155};

  me.init = function (options) {
    root.Melodicism.Node.init.call(this, options);
    this.soup = root.Melodicism.Node;

    Audio = this.Audio;

    this.waveType = 'area';
    this.lfoFrequency = 0.5;

    return this;
  };

  me.start = function (offset) {
    var ct = Audio.ctx.currentTime;

    this.currentTime = 0;
    this.startTime = ct;

    this.gainer.gain.setValueAtTime(0, ct);

    this.oscillator = Audio.createOscillator();
    this.oscillator.frequency.value = this.frequency * Math.pow(2, this.location.y / 700);
    this.oscillator.connect(this.gainer);
    this.oscillator.start(ct);

    this.lfo = Audio.createOscillator();
    this.lfo.frequency.value = this.lfoFrequency;
    this.lfo.connect(this.gainer.gain);
    this.lfo.start(ct);
  };

  me.stop = function (offset) {
    this.lfo.disconnect();
    this.soup.stop.call(this, offset);
    this.oscillator.stop(this.Audio.ctx.currentTime + 0.2);
  };

  me.waveDistance = function () {
    return this.waveRadius;
  };

  me.tick = function (currentTime) {
    return;

    if (currentTime - this.currentTime > this.period) {
      var node;

      for (var i = 0, l = this.siblings.length; i < l; i++) {
        node = this.siblings[i];

        if (node !== this && node.affects(this, currentTime)) {
          this.pulseLocation = this.location;
          this.pulse(currentTime);
          l = 0;
        }
      }
    }
  };

  me.pulse = function (ct) {
    this.gainer.gain.setValueAtTime(0, ct);

    for (var i = 0, l = this.envelope.length; i < l; i++) {
      this.gainer.gain.linearRampToValueAtTime(this.envelope[i][0], ct + this.envelope[i][1]);
    }

    this.oscillator = Audio.createOscillator();
    this.oscillator.frequency.value = this.frequency * Math.pow(2, this.location.y / 700);
    this.oscillator.connect(this.gainer);
    this.oscillator.start(ct);
    this.oscillator.stop(ct + this.envelope[i - 1][1]);

    this.currentTime = ct;
  };

}());

