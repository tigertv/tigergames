var GameState = {"PLAYING":1, "WIN":2, "LOST":3, "STOPPED": 4};

var Game = {
	board: null,
	view: null,
	state: GameState.STOPPED, 
	mines: 0,

	start: function(){
		if (!GameState.STOPPED)	return;

		this.prepareBoard();
		this.state = GameState.PLAYING;
	},

	restart : function () {
		if (this.mines <= 0) return;
		this.state = GameState.PLAYING;
		this.board.refresh(this.mines);
	},

	prepareBoard: function() {
		var level = document.getElementById("level").value;
		var size = 0;

		switch (level) {
			case 'beginner':
				size = 8;
				this.mines = 10;
				break;

			case 'intermediate':
				size = 16;
				this.mines = 40;
				break;

			case 'expert':
				size = 25;
				this.mines = 99;
				break;

			default:
				// TODO: wrong level
				break;
		}

		let model = new BoardModel(size,size);
		let view = new BoardView(model);
		this.board = new Board(model, view);

		this.board.refresh(this.mines);
	},

	changeState: function(state) {
		this.state = state;
		if (state == GameState.WIN) {
			alert("You win!");
		}
	},
};
