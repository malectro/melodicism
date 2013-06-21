(function () {
  var root = this;
  var me = root.Melodicism.Message = _.ob.extend();

  me.send = function (text, time) {
    var msg = document.createElement('message');
    msg.innerHTML = text;
    document.body.appendChild(msg);

    setTimeout(function () {
      msg.className = 'fade';

      setTimeout(function () {
        document.body.removeChild(msg);
      }, 500);
    }, time);
  };
}());

