(function () {
  var root = this;
  var me = root.Melodicism.Node = root.Melodicism.Eventer.extend();

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
    root.Melodicism.Eventer.init.call(this);

    this.Audio = Audio = root.Melodicism.Audio;
    this.siblings = root.Melodicism.Nodes.nodes;

    this.waveType = 'rippler';

    this.AN = {};

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
    this.periodRange = [1, 4];
    this.startTime = 0;
    this.curentTime = 0;
    this.ct = 0;
    this.nextTime = 0;
    this.frequency = 196;

    this.gainer = this.AN.gainer = Audio.ctx.createGain();
    this.gainer.connect(Audio.master);

    this.active = true;

    return _.extend(this, options);
  };

  me.destroy = function () {
    this.stop();

    // not sure if this could cause popping
    _.each(this.AN, function (audioNode) {
      audioNode.disconnect();
    });
  };

  me.start = function (offset) {
    offset = offset || 0;

    this.startTime = Audio.ctx.currentTime + offset;
    this.nextTime = this.startTime;
    this.updateLocation();
    this.pulse(this.startTime);
  };

  me.stop = function (offset) {
    var ct = Audio.ctx.currentTime + 0.1;
    this.gainer.gain.linearRampToValueAtTime(0, ct);
    this.gainer.gain.cancelScheduledValues(ct + 0.001);
  };

  me.updateLocation = function () {
    this.pulseLocation = this.location;
    this.oscillator.frequency.value = this.frequency * Math.pow(2, this.location.y / 700);
  };

  me.tick = function (currentTime) {
    if (this.active && Math.abs(currentTime - this.currentTime) < 0.01) {
      this.updateLocation();
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

    this.oscillator = this.AN.oscillator = Audio.createOscillator();
    this.oscillator.frequency.value = this.frequency * Math.pow(2, this.location.y / 700);
    this.oscillator.connect(this.gainer);
    this.oscillator.start(ct);
    this.oscillator.stop(ct + this.envelope[i - 1][1]);

    this.currentTime = ct;

    this.fire('pulse');
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

  me.waveGain = function (currentTime) {
    if (currentTime) {
      this.ct = currentTime;
    }
    return this.gainer.gain.value;
  };

  me.contains = function (point) {
    var distance = Math.sqrt(Math.pow(this.location.x - point.x, 2) + Math.pow(this.location.y - point.y, 2));
    return distance < this.radius;
  };

  me.affects = function (node, currentTime) {
    if (node.active && this.waveGain() > 0.2) {
      var distance = Math.sqrt(Math.pow(this.location.x - node.location.x, 2) + Math.pow(this.location.y - node.location.y, 2)),
          waveDistance = this.waveDistance(currentTime);

      return distance - node.radius < waveDistance && distance + node.radius > waveDistance;
    }

    return false;
  };

  me.currentColor = function () {
    var waveGain = this.waveGain();
    return {
      r: Math.floor(waveGain * (this.color.r - this.lowColor.r) + this.lowColor.r),
      g: Math.floor(waveGain * (this.color.g - this.lowColor.g) + this.lowColor.g),
      b: Math.floor(waveGain * (this.color.b - this.lowColor.b) + this.lowColor.b)
    };
  };

  me.waveColor = function () {
    var waveGain = this.waveGain();
    return {
      r: Math.floor(waveGain * this.color.r),
      g: Math.floor(waveGain * this.color.g),
      b: Math.floor(waveGain * this.color.b)
    };
  };

  me.getRadius = function () {
    if (this.active) {
      return this.radius;
    } else {
      return this.radius * 1.2;
    }
  };

  me.startDrag = function () {
    this.active = false;
    this.stop();
  };

  me.endDrag = function () {
    this.active = true;
    this.start();
  };

}());

