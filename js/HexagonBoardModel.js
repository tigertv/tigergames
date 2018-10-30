function Cell () {
	this.hasMine = false;
	this.isOpen = false;
	this.hasFlag = false;
	this.neighbors = 0;
}

var HexagonBoardModel = (function() {
	var _width = 0;
	var _height = 0;
	var _cells = 0;

	function HexagonBoardModel (width, height) {
		_width = width;
		_height = height;
		this.openedCount = 0;
		this.cellOpened = new Event(this);
		this.flagSwitched = new Event(this);

		_cells = new Array(this.width);

		for (var i = 0; i<_width; i++) {
			_cells[i] = new Array(_height);
			for (var j = 0; j<_height; j++) {
				_cells[i][j] = new Cell();
			}
		}
	}

	HexagonBoardModel.prototype.getRows = function () {
		return _height;
	};

	HexagonBoardModel.prototype.getColumns= function () {
		return _width;
	};

	HexagonBoardModel.prototype.clear = function () {
		for (var i = 0; i<_width; i++) {
			for (var j = 0; j<_height; j++) {
				_cells[i][j].isOpen = false;
				_cells[i][j].hasMine = false;
				_cells[i][j].hasFlag = false;
				_cells[i][j].neighbors = 0;
			}
		}
		this.openedCount = 0;
	};
	
	HexagonBoardModel.prototype.setMines = function (bombs) {
		while (bombs > 0) {
			var i = Math.floor(Math.random() * _width);
			var j = Math.floor(Math.random() * _height);
			if (_cells[i][j].hasMine) continue;
			_cells[i][j].hasMine = true;
			bombs--;
		}
	};

	HexagonBoardModel.prototype.findNeighbors = function () {
		for (var i = 0; i<_width; i++) {
			for (var j = 0; j<_height; j++) {
				_cells[i][j].neighbors = this.getBombsAround(i, j);
			}
		}
	};

	HexagonBoardModel.prototype.getBombsAround = function (column, row) {
		var bombs = 0;
		for (var i = column-1;i<column+2;i++) {
			if (i<0 || i>=_cells.length) continue;
			for (var j = row-1;j<row+2;j++) {
				if (j<0 || j>=_cells[i].length || (i == column && j == row)) continue;
				if ( j%2 == 0 && (i==(column-1) && (j==(row-1) || j==(row+1)) ) ) continue;
				if ( j%2 == 1 && (i==(column+1) && (j==(row-1) || j==(row+1)) ) ) continue;
				if (_cells[i][j].hasMine) bombs++;
			}
		}
		return bombs;
	};

	HexagonBoardModel.prototype.open = function (column, row) {
		//TODO: check bounds
		if (_cells[column][row].isOpen) return;
		if (_cells[column][row].hasFlag) return;

		_cells[column][row].isOpen = true;
		this.openedCount++;

		let result;

		if (_cells[column][row].hasMine) {
			result = -1;
		} else {
			result = _cells[column][row].neighbors;

			if (result == 0) {
				// open empty spots
				for (let i = column-1;i<column+2;i++) {
					if (i<0 || i>=_cells.length) continue;
					for (let j = row-1;j<row+2;j++) {
						if (j<0 || j>=_cells[i].length || (i == column && j == row)) continue;
						if ( j%2 == 0 && (i==(column-1) && (j==(row-1) || j==(row+1)) ) ) continue;
						if ( j%2 == 1 && (i==(column+1) && (j==(row-1) || j==(row+1)) ) ) continue;
						this.open(i,j);
					}
				}
			}
		}

		this.cellOpened.notify({column: column, row: row, cell: _cells[column][row]});
	};

	HexagonBoardModel.prototype.switchFlag = function (column, row) {
		if (_cells[column][row].isOpen) return; 
		if (_cells[column][row].hasFlag) {
			_cells[column][row].hasFlag = false;
		} else {
			_cells[column][row].hasFlag = true;
		}
		this.flagSwitched.notify({column: column, row: row, hasFlag: _cells[column][row].hasFlag});
	};

	HexagonBoardModel.prototype.openAllMines = function () {
		for (let i = 0; i<_width; i++) {
			for (let j = 0; j<_height; j++) {
				if (!_cells[i][j].hasMine || _cells[i][j].isOpen) continue; 

				_cells[i][j].hasFlag = false;
				_cells[i][j].isOpen = false;
				this.cellOpened.notify({column: i, row: j, cell: _cells[i][j]});
			}
		}
		this.openedCount = 0;
	};

	return HexagonBoardModel;
})();
