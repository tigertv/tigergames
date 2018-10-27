function BoardView (model, elementId) {
	this.model = model;
	this.element = document.getElementById(elementId);

	// events
	this.clicked = new Event(this);
	this.rightClicked = new Event(this);

	// model handlers
	this.model.cellOpened.attach(this.updateCell.bind(this));
	this.model.flagSwitched.attach(this.flagHandler.bind(this));
}

BoardView.prototype.flagHandler = function (sender, args) {

	let x = args.column;
	let y = args.row;
	let elem = this.element.rows[y].cells[x];

	if (args.hasFlag) { 
		elem.innerHTML = "<span class='flag'>&#x2691;</span>";
	} else {
		elem.innerHTML = "";
	} 
};

BoardView.prototype.updateCell = function (sender, args) {
	let x = args.column;
	let y = args.row;
	let cell = args.cell;
	let elem = this.element.rows[y].cells[x];
	elem.className = "";

	if (cell.hasMine) { 
		elem.innerHTML = "<span class='bomb'>&#x1f4a3;</span>";
	} else {
		elem.innerHTML = "<span class='number"+cell.neighbors+"'>"+cell.neighbors+"</span>";
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
			cell.className = 'closed';

			cell.onclick = function () {
				_this.clicked.notify({column:j,row:i});				
			};

			cell.oncontextmenu = function () {
				_this.rightClicked.notify({column:j,row:i});				
				return false;
			};
		}
	}
};
