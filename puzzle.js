(function () {
  var root = this;
  var me = root.Puzzle = _.ob.extend();
  var Canvas;

  me.Config = [
    '2-possibilities',
    '1-possibilities',
    '2-possibilities'
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

    return this;
  };

  me.solved = function () {
    if (!this._solved) {
      this._solved = true;
    }

    return this._solved;
  };

  me.next = function () {
    this.ready = true;
    setTimeout(root.loadNextPuzzle, 2000);
  };

}.call(Melodicism));

