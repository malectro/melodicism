(function () {
  var root = this;

  var me = root.Melodicism.Sounds = _.ob.extend();

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

  me.init = function () {
    this.gainer = root.Melodicism.Audio.ctx.createGain();
    this.clip = root.Melodicism.Audio.ctx.createBufferSource();
    this.clipTimeout = 0;
    this._playing = false;
  };

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
    var gainer = this.gainer;

    if (this._playing) {
      this.pauseClip();
    }
    root.Melodicism.Controller.setPlayButtonState('pause');

    gainer.gain.value = 0;
    gainer.connect(root.Melodicism.Audio.ctx.destination);

    root.Melodicism.Audio.silenceNodes();

    var clip = this.clip = root.Melodicism.Audio.ctx.createBufferSource();
    clip.buffer = this.buffers[name];
    clip.connect(gainer);

    if (clip.start) {
      clip.start(when, offset, duration);
    } else {
      clip.noteOn(when, offset, duration);
    }
    this._playing = true;
    this.clipTimeout = setTimeout(me.bound('pauseClip'), duration * 1000);

    gainer.gain.linearRampToValueAtTime(1, ct + 0.4);
    gainer.gain.linearRampToValueAtTime(1, ct + duration - 1);
    gainer.gain.linearRampToValueAtTime(0, ct + duration);
  };

  me.pauseClip = function () {
    var time = root.Melodicism.Audio.ctx.currentTime + 0.2;

    clearTimeout(this.clipTimeout);

    this.gainer.gain.linearRampToValueAtTime(0, time);
    if (this.clip.stop) {
      this.clip.stop(time);
    } else {
      this.clip.noteOff(time);
    }
    this._playing = false;

    root.Melodicism.Controller.setPlayButtonState('play');
    root.Melodicism.Audio.soundNodes();
  };

}());

