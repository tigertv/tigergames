function HexagonBoardView (model, elementId) {
	this.model = model;
	this.element = document.getElementById(elementId);

	// events
	this.clicked = new Event(this);
	this.rightClicked = new Event(this);

	// model handlers
	this.model.cellOpened.attach(this.updateCell.bind(this));
	this.model.flagSwitched.attach(this.flagHandler.bind(this));
}

HexagonBoardView.prototype.flagHandler = function (sender, args) {
	let x = args.column;
	let y = args.row;
	let elem = document.getElementsByClassName('hex-in3')[this.model.getRows()*y+x];

	if (args.hasFlag) { 
		elem.innerHTML = "<span class='flag'>&#x2691;</span>";
	} else {
		elem.innerHTML = "";
	} 
};

HexagonBoardView.prototype.updateCell = function (sender, args) {
	let x = args.column;
	let y = args.row;
	let cell = args.cell;

	let elem = document.getElementsByClassName('hex-in3')[this.model.getRows()*y+x];
	elem.classList.remove("closed");
	
	if (cell.hasMine) { 
		elem.innerHTML = "<span class='bomb'>&#x1f4a3;</span>";
	} else {
		elem.innerHTML = "<span class='number"+cell.neighbors+"'>"+cell.neighbors+"</span>";
	}
};

HexagonBoardView.prototype.render = function () {
	let _this = this;
	this.element.innerHTML = "";

	for (let j = 0; j < this.model.getRows(); j++) {
			let elem2 = this.element;
			let newEl2 = document.createElement("div");
			newEl2.className = 'hex-row';
			elem2.appendChild(newEl2);

		for (let i = 0; i < this.model.getColumns(); i++) {
			let elem = newEl2;
			let newEl = document.createElement("div");
			newEl.className = 'hex-item';
			elem.appendChild(newEl);

			elem = newEl;
			newEl = document.createElement("div");
			newEl.className = 'hex-in hex-in1';
			elem.appendChild(newEl);

			elem = newEl;
			newEl = document.createElement("div");
			newEl.className = 'hex-in hex-in2';
			elem.appendChild(newEl);

			elem = newEl;
			newEl = document.createElement("div");
			newEl.className = 'hex-in hex-in3 closed';
			elem.appendChild(newEl);

			const el = newEl;

			newEl.onclick = function () {
				_this.clicked.notify({column:i,row:j});				
			};
			
			newEl.oncontextmenu = function () {
				_this.rightClicked.notify({column:i,row:j});				
				return false;
			};
		}
	}
};
