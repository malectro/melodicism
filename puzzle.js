(function () {
  var root = this;
  var me = root.Puzzle = _.ob.extend();
  var Canvas;

  me.Config = [
    '3-possibilities',
    '1-possibilities',
    '2-possibilities',
    '3-possibilities'
  ];
  me.Puzzles = {
  };

  me.ready = false;
  me.highlights = [];
  me.nextPuzzle = null;
  me.step = 0;
  me.bornAt = 0;
  me.level = 0;

  me.init = function () {
    Canvas = root.Canvas;

    this.step = 1;
    this.bornAt = _.now();

    // this is small memory leak
    // fix later
    root.Controller.listen('touch', 'play', this.bound('playClip'));
    root.Controller.listen('touch', 'pause', this.bound('pauseClip'));
    root.Controller.setPlayButtonState('hide');

    return this;
  };

  me.solved = function () {
    if (!this._solved) {
      this._solved = false;
    }

    return this._solved;
  };

  me.setSolved = function () {
    this._solved = true;
    this.solvedAt = _.now();
  };

  me.next = function () {
    this.ready = true;
    setTimeout(root.loadNextPuzzle, 2000);
  };

  me.enableControls = function () {
    root.Nodes.activate();
  };

  me.disableControls = function () {
    root.Nodes.deactivate();
  };

  me.playClip = function () {

  };

  me.pauseClip = function () {

  };

}.call(Melodicism));

