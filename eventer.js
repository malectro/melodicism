(function () {
  var root = this;
  var me = root.Eventer = _.ob.extend();

  me.init = function () {
    this.events = {};
  };

  me.on = function (name, callback, context) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push({
      callback: callback,
      context: context
    });
  };

  me.off = function (name, callback, context) {
    var events = this.events[name];
    if (events) {
      events = _.weed(events, function (event) {
        return event.callback === callback;
      });

      this.events[name] = events;
    }
  };

  me.fire = function (name) {
    var events = this.events[name];
    var context;

    if (events) {
      for (var i = 0, l = events.length; i < l; i++) {
        context = events[i].context || root;
        events[i].apply(root, Array.prototype.slice.call(arguments, 1));
      }
    }
  };

}.call(Melodicism));

