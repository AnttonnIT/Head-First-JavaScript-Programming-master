var model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLenght: 3,
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] }
        ],

            // original hard-coded values for ship locations
/*
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],
*/


    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var locations = ship.locations;
            var index = locations.indexOf(guess);

            if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;

            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
         view.displayMiss(guess);
         view.displayMessage("You missed.");
         return false;
    }, 
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLenght; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        } 
        return true;
    },
    generateShiplocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
    
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
            col = Math.floor(Math.random() * this.boardSize);
    
        }
    
        var newShipLocations = [];
        for (var i = 0; i < this.shipLenght; i++) {
            if (direction === 1) {
    
                newShipLocations.push(row + "" + (col +i));
    
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false;
    }

};

var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea")
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};
/*
view.displayMiss("00");
view.displayHit("34");
view.displayHit("12");
view.displayHit("26");
view.displayMiss("55");
view.displayMiss("25");

view.displayMessage("Tap tap, is this thing on?") 
*/
// test

/*
model.fire("53"); // miss

model.fire("06"); // hit
model.fire("16"); // hit
model.fire("26"); // hit

model.fire("34"); // hit
model.fire("24"); // hit
model.fire("44"); // hit

model.fire("12"); // hit
model.fire("11"); // hit
model.fire("10"); // hit
*/


// testing parseGuess
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var row = alphabet.indexOf(guess.charAt(0));
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}
/* Test
console.log("Testing parseGuess");
console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0")); // null
console.log(parseGuess("A7")); // null
*/


var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
};
/* test
controller.processGuess("A0"); // miss

controller.processGuess("A6"); // hit
controller.processGuess("B6"); // hit
controller.processGuess("C6"); // hit

controller.processGuess("C4"); // hit
controller.processGuess("D4"); // hit
controller.processGuess("E4"); // hit

controller.processGuess("B0"); // hit
controller.processGuess("B1"); // hit
controller.processGuess("B2"); // hit
*/


function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeydown = handleKeyPress;

    model.generateShiplocations();
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase(); 
    controller.processGuess(guess);

    guessInput.value = "";

}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

