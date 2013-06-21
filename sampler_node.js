(function () {
  var root = this;
  var soup = root.Melodicism.Node;
  var me = root.Melodicism.SamplerNode = soup.extend();

  var Audio;
  var Sounds;

  me.init = function (options) {
    var self = this;

    soup.init.call(this, options);
    this.soup = soup;

    Audio = this.Audio;
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

    self.loaded = true;
    self.bufferArray = _.toArray(self.buffers);
    self.buffer = self.bufferArray[0];
  };

  me.pulse = function (ct) {
    this.currentTime = ct;

    if (!this.loaded) {
      return false;
    }

    this.gainer.gain.setValueAtTime(1, ct);

    this.sampler = Audio.ctx.createBufferSource();
    this.sampler.buffer = this.buffer;
    this.sampler.connect(this.gainer);
    this.sampler.start(ct);
  };

  me.updateLocation = function () {
    this.pulseLocation = this.location;
    this.buffer = this.bufferArray[Math.floor(this.bufferArray.length * this.location.y / 700)];
  };

  me.stop = function (offset) {
    var ct = Audio.ctx.currentTime + 0.1;
    this.soup.stop.call(this, offset);

    if (this.sampler) {
      this.sampler.stop(ct + 0.001);
    }
  };

  me.waveGain = function (currentTime) {
    //hack
    // should probably use an audio analyzer here
    return 1 - this.timeSincePulse(currentTime) / this.period;
  };

}());

