(function () {
  var root = this;

  var me = root.Melodicism.Sounds = {};

  me.srces = [
    'chord1.wav',
    'chord2.wav',
    'kick.wav'
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
    var self = this;
    var count = self.srces.length;

    self.buffers = _.toKeys(self.srces);

    _.each(self.srces, function (src) {
      var request = new XMLHttpRequest();
      request.open('GET', 'sounds/' + src, true);
      request.responseType = 'arraybuffer';

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

}());

