(function () {
  var root = this;
  var me = root.Melodicism.Node = {};

  var Audio;

  me.color = {r: 100, g: 255, b: 100};
  me.lowColor = {r: 0, g: 155, b: 0};

  me.extend = function () {
    return _.create(this);
  };

  me.create = function (options) {
    return _.create(this).init(options);
  };

  me.init = function (options) {
    this.Audio = Audio = root.Melodicism.Audio;
    this.siblings = root.Melodicism.Nodes.nodes;

    this.location = {x: 100, y: 100};
    this.pulseLocation = this.location;
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

    this.active = true;

    return _.extend(this, options);
  };

  me.start = function (offset) {
    this.startTime = Audio.ctx.currentTime;
    this.nextTime = this.startTime;
    this.pulse(this.startTime);
  };

  me.tick = function (currentTime) {
    if (this.active && Math.abs(currentTime - this.currentTime) < 0.01) {
      this.pulseLocation = this.location;
      this.oscillator.frequency.value = this.frequency * Math.pow(2, this.location.y / 700);
    }

    if (this.active && currentTime >= this.currentTime) {
      this.nextTime = this.currentTime + this.period;
      this.pulse(this.nextTime);
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

  me.timeSincePulse = function (ct) {
    var lastTime,
        timeSince;

    if (ct > this.currentTime) {
      lastTime = this.currentTime;
    } else {
      lastTime = this.currentTime - this.period;
    }

    timeSince = ct - lastTime;

    return timeSince;
  };

  me.waveDistance = function (currentTime) {
    return Math.floor(this.waveRadius * this.timeSincePulse(currentTime) / this.period + this.radius);
  };

  me.contains = function (point) {
    var distance = Math.sqrt(Math.pow(this.location.x - point.x, 2) + Math.pow(this.location.y - point.y, 2));
    return distance < this.radius;
  };

  me.affects = function (node, currentTime) {
    if (node.active && this.gainer.gain.value > 0) {
      var distance = Math.sqrt(Math.pow(this.location.x - node.location.x, 2) + Math.pow(this.location.y - node.location.y, 2)),
          waveDistance = this.waveDistance(currentTime);

      return distance - node.radius < waveDistance && distance + node.radius > waveDistance;
    }

    return false;
  };

  me.currentColor = function () {
    return {
      r: Math.floor(this.gainer.gain.value * (this.color.r - this.lowColor.r) + this.lowColor.r),
      g: Math.floor(this.gainer.gain.value * (this.color.g - this.lowColor.g) + this.lowColor.g),
      b: Math.floor(this.gainer.gain.value * (this.color.b - this.lowColor.b) + this.lowColor.b)
    };
  };

  me.waveColor = function () {
    return {
      r: Math.floor(this.gainer.gain.value * this.color.r),
      g: Math.floor(this.gainer.gain.value * this.color.g),
      b: Math.floor(this.gainer.gain.value * this.color.b)
    };
  };

  me.startDrag = function () {
    this.active = false;
  };

  me.endDrag = function () {
    this.active = true;
    this.start();
  };

}());

