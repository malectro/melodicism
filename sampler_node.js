(function () {
  var root = this;
  var me = root.Melodicism.SamplerNode = root.Melodicism.Node.extend();

  var Audio;

  me.init = function (options) {
    root.Melodicism.Node.init.call(this, options);
    this.soup = root.Melodicism.Node;

    Audio = this.Audio;

    this.onload = options.onload || function () {};
    this.src = options.src;
    this.loaded = false;

    this.load();

    return this;
  };

  me.load = function () {
    var self = this;
    var request = new XMLHttpRequest();

    request.open('GET', this.src, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function () {
      Audio.ctx.decodeAudioData(request.response, function (buffer) {
        self.buffer = buffer;
        self.onload();
        self.loaded = true;
        console.log("Loaded " + self.src);
      }, function () {

      });
    }

    request.send();
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

  me.tick = function (currentTime) {
    if (this.active && Math.abs(currentTime - this.currentTime) < 0.01) {
      this.pulseLocation = this.location;
    }

    if (this.active && currentTime >= this.currentTime) {
      this.nextTime = this.currentTime + this.period;
      this.pulse(this.nextTime);
    }
  };

}());

