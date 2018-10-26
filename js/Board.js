function Board (model, view) {
	this.model = model;
	this.view = view;

	// events
	this.hasMine = new Event(this);
	this.demined = new Event(this);

	// handlers
	this.model.cellOpened.attach(this.checkMine.bind(this));
	this.view.clicked.attach(this.viewClickHandler.bind(this));
	this.view.rightClicked.attach(this.viewRightClickHandler.bind(this));
}

Board.prototype.refresh = function (mines) {
	this.model.clear();
	this.model.setMines(mines);
	this.model.findNeighbors();
	this.view.render();
};

Board.prototype.viewClickHandler = function (sender, args) {
	if (Game.state == GameState.LOST) return;
	this.model.open(args.column, args.row);
};

Board.prototype.viewRightClickHandler = function (sender, args) {
	if (Game.state == GameState.LOST) return;
	this.model.switchFlag(args.column, args.row);
};

Board.prototype.checkMine = function (sender, args) {
	if (args.cell.hasMine) {
		Game.changeState(GameState.LOST);
		this.hasMine.notify();
	} else {
		let opened = this.model.getColumns()*this.model.getRows() - Game.mines;
		if (this.model.openedCount == opened)	{
			Game.changeState(GameState.WIN);
			this.demined.notify();
		}
	}
};

Board.prototype.openAllMines = function () {
	this.model.openAllMines();
};

