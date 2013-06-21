(function () {
  var root = this;
  var me = root.Melodicism.Message = _.ob.extend();

  me.init = function () {
    this.active = null;
    this.messages = [];
    this.timeout = 0;

    root.Melodicism.Controller.listen('touch', 'up', me.bound('touchUp'));
  };

  me.send = function (text, time) {
    var msg = {text: text, time: time};
    this.messages.push(msg);

    if (!this.active) {
      this.next();
    }
  };

  me.next = function () {
    var msg = this.messages.shift();

    if (msg) {
      var msgEl = this.active = document.createElement('message');
      msgEl.innerHTML = msg.text;
      document.body.appendChild(msgEl);

      this.timeout = setTimeout(this.bound('pop'), msg.time);
    } else {
      this.active = null;
    }
  };

  me.pop = function () {
    var self = this;
    var msgEl = this.active;
    msgEl.className = 'fade';

    clearTimeout(this.timeout);

    setTimeout(function () {
      document.body.removeChild(msgEl);
      self.next();
    }, 200);
  };

  me.touchUp = function () {
    me.pop();
  };
}());

