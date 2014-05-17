(function () {
  var root = this;
  var soup = root.Melodicism.Node;
  var me = root.Melodicism.SamplerNode = soup.extend();

  var Audio;
  var Canvas;
  var Sounds;

  me.init = function (options) {
    var self = this;

    soup.init.call(this, options);
    this.soup = soup;

    Audio = this.Audio;
    Canvas = root.Melodicism.Canvas;
    Sounds = root.Melodicism.Sounds;

    if (typeof options.src === 'string') {
      this.srces = [options.src];
    } else {
      this.srces = options.src;
    }
    this.onload = options.onload || function () {};
    this.loaded = false;
    this.buffers = {};
    this.bufferArray = [];

    root.Melodicism.Sounds.onload(function () {
      self.load();
    });

    return this;
  };

  me.load = function () {
    var self = this;

    _.each(self.srces, function (src) {
      self.buffers[src] = Sounds.bufferFor(src);
    });

    self.bufferArray = _.toArray(self.buffers);
    self.buffer = self.bufferArray[0];
    self.loaded = true;
  };

  me.pulse = function (ct) {
    this.currentTime = ct;

    if (!this.loaded) {
      return false;
    }

    this.gainer.gain.setValueAtTime(1, ct);

    this.sampler = this.AN.sampler = Audio.ctx.createBufferSource();
    this.sampler.buffer = this.buffer;
    this.sampler.connect(this.gainer);

    if (this.sampler.start) {
      this.sampler.start(ct);
    } else {
      this.sampler.noteOn(ct);
    }

    this.fire('pulse');
  };

  me.updateLocation = function () {
    this.pulseLocation = this.location;
    //this.period = this.periodRange[1] - (this.location.x / Canvas.size.width) * (this.periodRange[1] - this.periodRange[0]);
    this.period = this.periodSteps[this.periodSteps.length - Math.floor(this.periodSteps.length * this.location.x / Canvas.size.width) - 1];
    this.buffer = this.bufferArray[Math.floor(this.bufferArray.length * this.location.y / Canvas.size.height)];
  };

  me.stop = function (offset) {
    var ct = Audio.ctx.currentTime + 0.1;
    this.soup.stop.call(this, offset);

    if (this.sampler) {
      if (this.sampler.stop) {
        this.sampler.stop(ct + 0.001);
      } else {
        this.sampler.noteOff(ct + 0.001);
      }
    }
  };

  me.waveGain = function (currentTime) {
    //hack
    // should probably use an audio analyzer here
    if (currentTime) {
      this.ct = currentTime;
    }
    return _.max(1 - this.timeSincePulse(this.ct) / this.period, 0);
  };

}());

