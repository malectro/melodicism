(function () {
  var root = this;

  var me = root.Melodicism.Controller = _.ob.extend();

  var document = root.document;
  var _events = [
    'pauseplay',
    'touch',
    'move'
  ];
  var _eventHash = {};
  var _touching = false;

  // PC controller events
  var _pcKeys = {
    '37': 'left',
    '38': 'up',
    '39': 'right',
    '40': 'down',
    '32': 'pauseplay',
    '16': 'enter'
  };

  function _keydown(e) {
    if (me.fire(_pcKeys[e.which], 'down')) {
      e.preventDefault();
    }
  }

  function _keyup(e) {
    if (me.fire(_pcKeys[e.which], 'up')) {
      e.preventDefault();
    }
  }

  function _mousedown(e) {
    if (me.fire('touch', 'down', e)) {
      e.preventDefault();
    }
    _touching = true;
  }

  function _mouseup(e) {
    if (me.fire('touch', 'up', e)) {
      e.preventDefault();
    }
    _touching = false;
  }

  function _mousemove(e) {
    if (_touching && me.fire('move', 'down', e)) {
      e.preventDefault();
    } else if (me.fire('move', 'up', e)) {
      e.preventDefault();
    }
  }

  function _touchedPlay(e) {
    if (this.className === 'pause') {
      this.className = 'play';
      me.fire('touch', 'pause', e);
    } else {
      this.className = 'pause';
      me.fire('touch', 'play', e);
    }

    e.stopPropagation();
  }

  me.fire = function (eventName, state, e) {
    var event = _eventHash[eventName];
    if (event) {
      var funcs = event[state];
      for (var i = 0, l = funcs.length; i < l; i++) {
        funcs[i](e);
      }
      return true;
    }
  };

  me.listen = function (event, type, func) {
    if (_eventHash[event][type].indexOf(func) < 0) {
      _eventHash[event][type].push(func);
    }
  };

  me.forget = function (event, type, func) {
    var index = _eventHash[event][type].indexOf(func);
    if (index >= 0) {
      _eventHash[event][type].splice(index, 1);
    }
  };

  me.setPlayButtonState = function (state) {
    document.getElementById('pauseplay').className = state;
  };

  me.init = function () {
    _events.forEach(function (event) {
      _eventHash[event] = {
        down: [],
        up: [],
        pause: [],
        play: []
      };
    });

    document.body.addEventListener('keydown', _keydown);
    document.body.addEventListener('keyup', _keyup);

    if ('ontouchstart' in document.documentElement) {
      document.body.addEventListener('touchstart', _mousedown);
      document.body.addEventListener('touchmove', _mousemove);
      document.body.addEventListener('touchend', _mouseup);
      document.getElementById('pauseplay').addEventListener('touchstart', _touchedPlay);
    } else {
      document.body.addEventListener('mousedown', _mousedown);
      document.body.addEventListener('mousemove', _mousemove);
      document.body.addEventListener('mouseup', _mouseup);
      document.getElementById('pauseplay').addEventListener('mousedown', _touchedPlay);
    }
  };

}());

