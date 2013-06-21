(function () {
  var root = this;
  var me = root.Melodicism.Message = _.ob.extend();

  me.init = function () {
    this.messages = [];
    root.Melodicism.Controller.listen('touch', 'up', me.bound('touchUp'));
  };

  me.send = function (text, time) {
    var msg = document.createElement('message');
    msg.innerHTML = text;
    document.body.appendChild(msg);

    this.messages.push(msg);

    setTimeout(function () {
      msg.className = 'fade';

      setTimeout(function () {
        document.body.removeChild(msg);
      }, 500);
    }, time);
  };

  me.pop = function () {
    var msg = this.messages.shift();
    document.body.removeChild(msg);
  };

  me.touchUp = function () {
    me.pop();
  };
}());

