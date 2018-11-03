function TruncatedSquareBoardView (model, elementId) {
	this.model = model;
	this.element = document.getElementById(elementId);

	// events
	this.clicked = new Event(this);
	this.rightClicked = new Event(this);

	// model handlers
	this.model.cellOpened.attach(this.updateCell.bind(this));
	this.model.flagSwitched.attach(this.flagHandler.bind(this));
}

TruncatedSquareBoardView.prototype.flagHandler = function (sender, args) {
	let x = args.column;
	let y = args.row;
	let elem = document.getElementsByClassName('tr-sq-item')[this.model.getRows()*y+x];

	if (args.hasFlag) { 
		elem.innerHTML = "<span class='flag'>&#x2691;</span>";
	} else {
		elem.innerHTML = "";
	} 
};

TruncatedSquareBoardView.prototype.updateCell = function (sender, args) {
	let x = args.column;
	let y = args.row;
	let cell = args.cell;

	let elem = document.getElementsByClassName('tr-sq-item')[this.model.getRows()*y+x];
	elem.classList.remove("closed");
	
	if (cell.hasMine) { 
		elem.innerHTML = "<span class='bomb'>&#x1f4a3;</span>";
	} else {
		if (cell.neighbors == 0) {
			elem.innerHTML = "<span class='number"+cell.neighbors+"'></span>";
		} else {
			elem.innerHTML = "<span class='number"+cell.neighbors+"'>"+cell.neighbors+"</span>";
		}
	}
};

TruncatedSquareBoardView.prototype.render = function () {
	let _this = this;
	this.element.innerHTML = "";

	for (let j = 0; j < this.model.getRows(); j++) {
		let elem2 = this.element;
		let newEl2 = document.createElement("div");
		newEl2.className = 'tr-sq-row';
		elem2.appendChild(newEl2);

		for (let i = 0; i < this.model.getColumns(); i++) {

			let elem;
			let newEl;

			if ((i+j)%2 == 0) {
				elem = newEl2;
				newEl = document.createElement("div");
				newEl.className = 'tr-sq-one';
				elem.appendChild(newEl);

				elem = newEl;
				newEl = document.createElement("div");
				newEl.className = 'tr-sq-two tr-sq-item closed';
				elem.appendChild(newEl);

			} else {
				elem = newEl2;
				newEl = document.createElement("div");
				newEl.className = 'tr-sq-bl tr-sq-item closed';
				elem.appendChild(newEl);
			}

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
