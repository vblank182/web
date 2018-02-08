// Tic-Tac-Toe with JQuery UI
// Jesse Williams

// Holds the state of the board. Each element is either "none", "nought", or "cross".
// Each 3 elements are one row of the board, top to bottom.
var board;
// Board tiles are addressed by (row)-(col), starting with 1-1 at top-left corner.
var squares = ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1", "3-2", "3-3"];

var piecesSpawned;

function init() {
	
	// Hide game over modal
	$('#gameover').modal({ show: false })
	
	// Initialize global variables
	piecesSpawned = 0;
	board = ["none", "none", "none", "none", "none", "none", "none", "none", "none"];
	
	// Spawn first game piece
	spawnPiece("cross");
	
	// For each game square, we will create droppable functionality and set its callback function
	for (square in squares) {
		$( "#"+squares[square] ).droppable({ tolerance: 'fit', drop: function(event, ui) {
				document.getElementById(this.id).style.background = "#ddd";
				var piecetype = ui.draggable[0].classList[0]; 		// get class name of current piece
				updateBoard(this.id, piecetype);					// update board object
				$( "#piece_obj" ).draggable("destroy");				// destroy draggable functionality from current piece
				
				var $this = $(this);
				var offset = $this.offset();
				var width = $this.width();
				var height = $this.height();

				var centerX = offset.left + width / 2;
				var centerY = offset.top + height / 2;
				
				document.getElementById(this.id).appendChild(document.getElementById("piece_obj"));
				document.getElementById("piece_obj").style.left = "1rem";		// move piece to center of square
				document.getElementById("piece_obj").style.top = "1.3rem";
				
				document.getElementById("piece_obj").id = "";		// remove ID of current piece
				
				var state = winCheck();
				if(state != "none") {
					// If win condition is met, end game
					endGame(state);
				}
				else {
					// No AI
					//if(piecetype == "nought") { spawnPiece("cross"); }
					//else { spawnPiece("nought"); }
					
					aiMove();
					
					$( "#"+this.id ).droppable("destroy");				// destroy droppable functionality of this board square
					
					spawnPiece("cross");
					
				}
			}
		});
	}
}

function spawnPiece(type) {
	// type = "nought" or "cross"
	// piece_obj is the currently active (draggable) piece
	// piece_start is the div that holds the piece on spawn
	
	if(piecesSpawned < 9) {
		var icon = "";
		if(type == "cross") { icon = "&times;"; }
		else { icon = "&ocy;"; }
		
		document.getElementById("piece_start").innerHTML += '<div class="' + type + '" id="piece_obj" style="position: absolute">' + icon + '</div>';
		
		
		$( "#piece_obj" ).draggable();
		
		piecesSpawned += 1;
	}
	
	else {
		// If we reach here, all pieces are placed, but no win condition has been triggered. Thus, we have a draw.
		endGame("draw");
	}
}

function updateBoard(id, piecetype) {
	// Receives an element of 'squares' in 'id' and a 'piecetype' (nought or cross). Sets corresponding attribute in 'board'.
	index = squares.indexOf(id);
	board[index] = piecetype;
}

function winCheck() {
	// Given a board state, determines if there is a winner. If so, returns the winner as "nought" or "cross". Returns "none" otherwise.
	
	pieces = ["nought", "cross"];
	
	for (p in pieces) {
		
		// Top row
		if(board[0]==pieces[p] && board[1]==pieces[p] && board[2]==pieces[p]) {
			return pieces[p];
		}
		// Middle row
		if(board[3]==pieces[p] && board[4]==pieces[p] && board[5]==pieces[p]) {
			return pieces[p];
		}
		// Bottom row
		if(board[6]==pieces[p] && board[7]==pieces[p] && board[8]==pieces[p]) {
			return pieces[p];
		}
		
		// Left col
		if(board[0]==pieces[p] && board[3]==pieces[p] && board[6]==pieces[p]) {
			return pieces[p];
		}
		// Middle col
		if(board[1]==pieces[p] && board[4]==pieces[p] && board[7]==pieces[p]) {
			return pieces[p];
		}
		// Right col
		if(board[2]==pieces[p] && board[5]==pieces[p] && board[8]==pieces[p]) {
			return pieces[p];
		}
		
		// TL-BR diagonal
		if(board[0]==pieces[p] && board[4]==pieces[p] && board[8]==pieces[p]) {
			return pieces[p];
		}
		// TR-BL diagonal
		if(board[2]==pieces[p] && board[4]==pieces[p] && board[6]==pieces[p]) {
			return pieces[p];
		}
		
	}
	
	// Nothing matched
	return "none";
	
}

function endGame(state) {
	// state = "nought" or "cross" if there was a win. state = "draw" otherwise.
	// Show win screen. Ask user to start a new game.
	
	if(state == "cross") {
		$('#gameoverText').html("X's won!");
		$('#gameover').modal('show');
	}
	else if(state == "nought") {
		$('#gameoverText').html("O's won!");
		$('#gameover').modal('show');
	}
	else {
		$('#gameoverText').html("Draw!");
		$('#gameover').modal('show');
	}
	
}

function newGame() {
	// Clear all pieces
	$("div").remove(".cross");
	$("div").remove(".nought");
	
	// Reset board tile background colors
	$(".card").css("background", "#ccc");
	
	init();
}

function aiMove() {
	var done = false;
	// Random AI - Takes a random unoccupied square
	while(done == false) {
		rng = Math.floor(Math.random() * 9);  // random number between 0 and 8
		if(board[rng] == "none") {
			
			document.getElementById("piece_start").innerHTML += '<div class="nought" id="piece_obj" style="position: absolute">&ocy;</div>';
			
			// Random wait.
			// Change text to "AI Turn".
			// Animate path to destination.
			
			
			
			document.getElementById(squares[rng]).appendChild(document.getElementById("piece_obj"));
			document.getElementById(squares[rng]).style.background = "#ddd";
			
			document.getElementById("piece_obj").style.left = "1rem";		// move piece to center of square
			document.getElementById("piece_obj").style.top = "1.3rem";
			
			updateBoard(squares[rng], "nought");							// update board object
				
			document.getElementById("piece_obj").id = "";					// remove ID of current piece
			
			
			
			piecesSpawned += 1;
			
			done = true;
			
		}
	}
	
	
	var state = winCheck();
	if(state != "none") {
		// If win condition is met, end game
		endGame(state);
	}
	else if(piecesSpawned >= 9) {
		endGame("draw");
	}
	
}