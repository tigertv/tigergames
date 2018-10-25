function BoardView (model) {
	this.model = model;
	this.element = document.getElementById("board");

	// events
	this.clicked = new Event(this);

	// model handlers
	this.model.cellOpened.attach(this.updateCell.bind(this));
}

BoardView.prototype.updateCell = function (sender, args) {
	let x = args.column;
	let y = args.row;
	let cell = args.cell;
	let elem = this.element.rows[y].cells[x];
	
	if (cell.hasMine) { 
		elem.innerHTML = "<span class='bomb'>&#x1f4a3;</span>";
	} else {
		elem.innerHTML = cell.neighbors;
	}
};

BoardView.prototype.render = function () {
	this.element.innerHTML = "";

	let _this = this;

	// add click handlers to the cells in the table
	for (let i = 0; i<this.model.getRows(); i++) {
		let row = this.element.insertRow();
		for (let j = 0; j<this.model.getColumns(); j++) {
			let cell = row.insertCell();
			cell.onclick = function () {
				_this.clicked.notify({column:j,row:i});				
			};
		}
	}
};
