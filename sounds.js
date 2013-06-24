(function () {
  var root = this;

  var me = root.Melodicism.Sounds = {};

  me.srces = [
    'chord1.wav',
    'chord2.wav',
    'kick.wav'
  ];
  me.clips = [
    'possibilities.mp3'
  ];
  me.buffers = {};
  me.bufferArray = [];

  me.onloads = [];

  me.onload = function (func) {
    if (me.loaded) {
      func();
    } else {
      me.onloads.push(func);
    }
  };

  me.done = function () {
    _.each(me.onloads, function (func) {
      func();
    });

    me.onloads = [];
  };

  me.bufferFor = function (sound) {
    return this.buffers[sound];
  };

  me.load = function () {
    this.loadSrces(this.srces, 'sounds');
    this.loadSrces(this.clips, 'clips');
  };

  me.loadSrces = function (srces, type) {
    var self = this;
    var count = srces.length;

    _.each(srces, function (src) {
      var request = new XMLHttpRequest();
      request.open('GET', type + '/' + src, true);
      request.responseType = 'arraybuffer';

      self.buffers[src] = null;

      // Decode asynchronously
      request.onload = function () {
        root.Melodicism.Audio.ctx.decodeAudioData(request.response, function (buffer) {
          self.buffers[src] = buffer;
          count--;
          console.log("Loaded " + src);

          if (count < 1) {
            self.loaded = true;
            self.bufferArray = _.toArray(self.buffers);
            self.done();
          }
        }, function () {

        });
      }

      request.send();
    });
  };

  me.playClip = function (name, when, offset, duration) {
    var Audio = root.Melodicism.Audio;
    var ct = Audio.ctx.currentTime;
    var gainer = root.Melodicism.Audio.ctx.createGain();
    gainer.gain.value = 0;
    gainer.connect(root.Melodicism.Audio.ctx.destination);

    var clip = root.Melodicism.Audio.ctx.createBufferSource();
    clip.buffer = this.buffers[name];
    clip.connect(gainer);
    clip.start(when, offset, duration);

    gainer.gain.linearRampToValueAtTime(1, ct + 0.4);
    gainer.gain.linearRampToValueAtTime(1, ct + duration - 1);
    gainer.gain.linearRampToValueAtTime(0, ct + duration);
  };

}());

