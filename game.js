/*TODO 
 * end condition
*/

//multiplayer vars
let turn = [0];
let scores = [0];
let letterCounts = [2,9,2,2,4,12,2,3,2,9,1,1,4,2,6,8,2,1,6,4,6,4,2,2,1,2,1];
//let letterCounts = [2,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let tiles = [];
let clients = [];
let server;
let serverId;
let ifServer = false;
let myPos = 0;
let myName;
let names = [];
//---------------
let myLetters  = [];
let namePos = [[150,675],[0,150],[150,25],[650,150]];
let scoresPos = [[100,675],[0,100],[100,25],[650,100]];
let allLetters = ' abcdefghijklmnopqrstuvwxyz';
let letterPoints = [0,1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10]
let myScore = 0;
let tempScore = 0;
let checking = false;
let padding = 50;
let tileSize = 40;
let selectedLetter = null;
let endTurnButton;
let dictionary = [];
let tilesChanged = [];
let lettersUsed = [];
let url;
var peer;



class Letter{
	constructor(letter, point,number){
		this.letter = letter;
		this.point = point;
		this.number = number
	}


	draw(){
  		fill(219, 212, 195);
    	rect(50+(40*4)+(40* this.number),685-30,40,40);//my letters
		fill(0,0,0);
    	textSize(32);
		text(this.letter,50+(40*4)+(40* this.number)+5,685);
	    textSize(10);
		text(this.point,50+(40*4)+(40* this.number)+27,685+10);
	}
	highlight(){
		noFill();
		rect(50+(40*4)+(40* this.number),685-30,40,40);//my letters
	}

	setLetter(l){
		this.letter = l.letter;
		this.point = l.point;
		this.number = l.number

	}

}



class Tile{
	constructor(posX,posY,wordMult,letterMult,tileColor){
		this.posX = posX;
		this.posY = posY;
		this.wordMult = wordMult;
		this.letterMult = letterMult;
		this.tileColor = tileColor;
		this.letter = null;
	}

	draw(padding,size){
		fill(this.tileColor)
		rect(this.posX*size+padding,this.posY*size+padding,size,size);
		if(this.letter != null){
			fill(0,0,0);
    		textSize(32);
			text(this.letter.letter,this.posX*size+padding+5,this.posY*size+padding+40-10);
		    textSize(10);
			text(this.letter.point,this.posX*size+padding+27,this.posY*size+padding+40-5);
		}
	}

	setLetter(letter){
		this.letter = new Letter(letter.letter, letter.point,letter.number); 
//		this.letter = letter;
	}
}

//resets tiles if word is wrong
function resetTiles(){
//	print(tilesChanged);
	checking = false;
	tempScore = 0;
	for(let i = 0;i < tilesChanged.length; i++){
//		print(tiles[tilesChanged[i]].letter);
		tiles[tilesChanged[i]].letter = null;
	}	
	tilesChanged = [];
	lettersUsed = [];
	endTurnButton.show();
	//print(tilesChanged);
}

function nextTurn(){
	checking = false;
	myScore += tempScore;
	scores[myPos] = myScore;
	tempScore = 0;
	if (isGameOver()){
		el = createElement('h2',"Game Over!");
		el.position(20, 50);
		return;
	}
	for(let i = 0; i < tilesChanged.length;i++){
			for(let j = 0; j < 7; j++){
				if(myLetters[j].letter == tiles[tilesChanged[i]].letter.letter){
					let newLetter = makeLetter(j);
					while(newLetter == null){
						newLetter = makeLetter(j);
					}
					myLetters[j].setLetter(newLetter);
					break;
				}
			}
	}
	for(let i = 0;i < turn.length;i++){
		if(turn[i] == 1){
			turn[i] = 0;
			turn[(i+1)%turn.length] = 1;
			break;
		}
	}
	if(ifServer){
		sendDataToClients();
	}else{
		sendDataToServer();
	}
	lettersUsed = [];
	tilesChanged = [];
	endTurnButton.hide();
}

function keyPressed() {
	if(selectedLetter != null){
		if(selectedLetter.letter == ' '){
			selectedLetter.letter = key;
		}
	}
}





async function checkWords(){
	//check is there is a valid word
	/*if(tilesChanged.length == 0){
		return;
	}*/
	endTurnButton.hide();
	checking = true;
	for(let i = 0; i < 15;i++){
		let word = "";
		let changedWord = false;
		let wordScore = 0;
		let wordMults = 1;
		for(let j = 0; j < 15; j++){
			if(tiles[(i*15) +j].letter != null && j != 14){
				word += tiles[(i*15) +j].letter.letter;
				wordScore += tiles[(i*15) +j].letter.point * tiles[(i*15) +j].letterMult;
				wordMults *= tiles[(i*15) +j].wordMult;
				if(changedWord == false){
					for(let k = 0; k < tilesChanged.length; k++){
						if((i*15) + j == tilesChanged[k]){
							changedWord = true;
							break;
						}
					}
				}
			}else{
				if(word.length > 1){
					const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en_US/" + word);
					
					//print(res.status);
					print(res.status, word);
					ifWord = res.status;
					if(ifWord != 404){
						if(changedWord){
							tempScore += wordScore * wordMults;
						}
						//print("Included");
					}else{
						resetTiles();
						//print("Not Included");
						return;
					}
				}
				word = "";
				wordScore = 0;
				wordMults = 1;
				changedWord = false;
			}
		}
	}
	for(let i = 0; i < 15;i++){
		let word = "";
		let changedWord = false;
		let wordScore = 0;
		let wordMults = 1;
		for(let j = 0; j < 15; j++){
			if(tiles[(j*15) +i].letter != null && j != 14){
				word += tiles[(j*15) +i].letter.letter;
				wordScore += tiles[(j*15) +i].letter.point * tiles[(j*15) +i].letterMult;
				wordMults *= tiles[(j*15) +i].wordMult;
				if(changedWord == false){
					for(let k = 0; k < tilesChanged.length; k++){
						if((j*15) + i == tilesChanged[k]){
							changedWord = true;
							break;
						}
					}
				}
			}else{
				if(word.length > 1){
					const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en_US/" + word);
					
					print(res.status, word);
					ifWord = res.status;
					if(ifWord != 404){
						if(changedWord){
							tempScore += wordScore * wordMults;
						}
						//print("Included");
					}else{
						resetTiles();
						//print("Not Included");
						return;
					}
				}

				word = "";
				wordScore = 0;
				wordMults = 1;
				changedWord = false;
			}
		}
	}

	nextTurn();
	//print("next turn");

}



function sum(arr){
  let sum = 0;
  for(let i =0; i < arr.length;i++){
    sum += arr[i];
  }
  return sum
}


function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function isGameOver(){
	return sum(letterCounts) == 0;
	
}

function makeLetter(i){
	print("is the game over?");
	print(isGameOver());
	let rndNum = int(random(27));
	while(letterCounts[rndNum] <= 0){
		rndNum = int(random(27));
	}
	let letter = allLetters[rndNum];
	letterCounts[rndNum] -= 1;
	return new Letter(letter, letterPoints[rndNum],i);

}


function openServer(){
	ifServer = true;
turn = [1];
peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
	ID = id;
	el = createElement('h2',url.split("?")[0] + "?" + ID);
	el.position(20, 5);
});
		peer.on('connection', function(c) {
			clients.push(c);
			recieveData(c);
			scores.push(0);
			turn.push(0);
			names.push(c.peer);
			print(c.peer + " connected with me"); 
		});		
}


function openClient(){
	ifServer = false;
		peer.on('open', function(){
	
			server = peer.connect(url.split("?")[1],{
				reliable: false
			});
			server.on('open', function() {
				serverId = server.peer;
				print("Connected with " + serverId);

			});
					
			server.on('error', function(err){
				//print("error");
				print(err);
			});
			server.on('data', function(data){
				//start client game
				let json = JSON.parse(data);
				print(json);
				let otherLetters = json.otherLetters;
				let otherNames = json.names;
				if(otherLetters){
					for(let i = 0; i < otherLetters.length;i++){
						let l = new Letter(otherLetters[i].letter,otherLetters[i].point,otherLetters[i].number);
						myLetters.push(l);
					}
				}
				if(otherNames){
					names = otherNames;
					for(let i = 0; i < otherNames.length; i++){
						while(names[0] != myName){
							for(let j = 0; j < names.length-1;j++){
								let temp = names[j];
								names[j] = names[j+1];
								names[j+1] = temp; 
							}
						}
					}
				}
//				print(json.i);
			if(json.letterCounts){
				//print(json);
				turn = json.turn;
				letterCounts = json.letterCounts;
				scores = json.scores;
				myPos = json.i+1;
				if(json.tiles){
					for(let i = 0; i < json.tiles.length; i++){
						if(json.tiles[i].letter){
							tiles[i].setLetter(json.tiles[i].letter);
						}
		
					}
				}
		print(turn);
		if(turn && turn[myPos] == 1){
			endTurnButton.show();	
		}else{	
			endTurnButton.hide();
		}
			}
							

			});
			
		});
		


}



function sendDataToClients(){
	for(let i = 0; i < clients.length; i++){
		//print("ran");
		clients[i].send(JSON.stringify({letterCounts,turn,scores,tiles,i}));
		
	}
}


function sendDataToServer(){
	//print("sent to server");
	server.send(JSON.stringify({letterCounts,turn,scores,tiles}));
}


function startGame(){
	//make my letters
	for(let i = 0;i<7;i++){
		let letterObj = makeLetter(i);
	    myLetters.push(letterObj);
	}
	//send data for then to make their letters
	for(let i = 0;i < clients.length;i++){
		//make letters for others
		let otherLetters = [];
		for(let i = 0;i<7;i++){
			let letterObj = makeLetter(i);
			otherLetters.push(letterObj);
		}
		clients[i].send(JSON.stringify({otherLetters,names}))
	}
	endTurnButton.show();
	startGameBtn.hide();

}

function setName(){
  myName = input.value();
  input.value('');
  peer = new Peer(myName);
  names.push(myName);
  url = getURL();
	if (url.split("?").length > 1){//if it is a client link
		openClient();
	}else{//if it is a server link
		openServer();
  	startGameBtn = createButton('start game');
  	startGameBtn.position(50,100);
  	startGameBtn.mousePressed(startGame);
	}	
	input.remove();
	button.remove();

}


function setup() {
//resolve networking
  input = createInput();
  input.position(20, 65);
  button = createButton('submit');
  button.position(input.x + input.width, 65);
  button.mousePressed(setName);
  cnv = createCanvas(700, 700);
  cx = (windowWidth - width) / 2;
  cy = (windowHeight - height) / 2;
  cnv.position(cx, cy);
  endTurnButton = createButton('end turn');
  endTurnButton.position(cx+50+(40*4)+(40* 10),655+cy);
  endTurnButton.mousePressed(checkWords);
  endTurnButton.hide();

  if(ifServer){
  	startGameBtn = createButton('start game');
  	startGameBtn.position(50,100);
  	startGameBtn.mousePressed(startGame);
  }

//making letters

//  print(letterCounts);
//  print(allLetters);
//  print(myLetters);
   for (let j = 0; j < 15; j++){
    for (let i = 0; i < 15; i++) {
		tileColor = color(235, 173, 75);
		wordMult = 1;
		letterMult = 1;
      //fill(219, 212, 195);
      if((i == 0 || i == 14 || i == 7) && (j == 0 || j == 14 || j == 7)){
		  tileColor = color(255,0,0);//Triple word score
		  wordMult = 3;
      }else if(( j == 0||i == 0 || i == 14 || j == 14) && (j == 3 || j == 11 || i == 3 || i == 11) ){
		  tileColor = color(79, 211, 255);//Double letter score
		  letterMult = 2;
      }else if((i == j) || (i == 14-j)){ 
        if((i > 0 && i < 5) || (i > 9 && i < 14)){
			tileColor = color(255, 79, 252);//Double word score
			wordMult = 2;
        }else if(i == 5 || j == 5 || i ==9){
			tileColor = color(50, 109, 168);//Triple letter score
			letterMult = 3;
        }else if(i == 6 || i == 8){
			tileColor = color(79, 211, 255);//Double letter score  
			letterMult = 2;
        }
      }else if(i == j - 4 || j == i - 4 || i == 10 - j || j == 18 - i){
        if(i == 1 || i == 13 || j == 1 || j == 13){
          tileColor = color(50, 109, 168);//Triple letter score
		  letterMult = 3;
        }else if(i >1 && i < 4 || i < 13 && i > 10|| j >1 && j < 4 || j < 13 && j > 10){
          tileColor = color(79, 211, 255);//Double letter score  
		  letterMult = 2;
        }
      }

	if(i == j && i == 7){
      tileColor = color(255,0,0);
	  tile = new Tile(i,j,wordMult,letterMult, tileColor);
	  }else{
		tile = new Tile(i,j,wordMult,letterMult, tileColor);
	}	
      tiles.push(tile);
    }
    
  }
	tiles[112].wordMult = 1;
	tiles[112].letterMult = 1;
	if(ifServer){
		getDataFromClient();

	}
}

function onBoard(posX,posY){
	return posX > 50 && posX < 650 && posY > 50 && posY < 650;
}

function getTilePosition(posX, posY){
	let tileNum = [Math.floor((posX-padding)/tileSize),Math.floor((posY-padding)/tileSize)];
	return tileNum;	
}

function getTileNumber(position){
	return position[1]*15+position[0]; 
}

function getLetterNum(posX,posY){
	tilePos = getTilePosition(posX,posY);
	return tilePos[0]-4;
}

function isLetter(posX,posY){
		tilePos = getTilePosition(posX,posY);
		return tilePos[1] == 15 && tilePos[0] > 3 && tilePos[0] < 11;
}


function validPlacement(tileNum){
        let c1 = tiles[tileNum+1].letter != null;
        let c2 = tiles[tileNum-1].letter != null;
        let c3 = true;
        if(225 - tileNum <= 15){
                c3 = false;
        }else{
                c3 = tiles[tileNum+15].letter != null;
        }
        let c4 = true;
        if(tileNum <= 15){
                c4 = false;

        }else{
                c4 = tiles[tileNum-15].letter != null;
        }
        let c5 = tileNum == 112;
        return c1 || c2  || c3 || c4 || c5;

}


function mousePressed(){
//	print(mouseX,mouseY);

	if(onBoard(mouseX,mouseY) && turn && turn[myPos] == 1 && !checking){
		//placing letter
//		print("on board");
		tilePos = getTilePosition(mouseX,mouseY);
		tileNum = getTileNumber(tilePos);
		if(selectedLetter != null && tiles[tileNum].letter == null && validPlacement(tileNum)){
			//print(tileNum);
			tiles[tileNum].setLetter(selectedLetter);
			tilesChanged.push(tileNum);
			
//			selectedLetter.setLetter(makeLetter(selectedLetter.number));
//			selectedLetter.letter = "#";
			lettersUsed.push(selectedLetter.number);
			selectedLetter = null;
		
		}

	}else if(isLetter(mouseX,mouseY)){
		let used = false;
		let lNum = getLetterNum(mouseX,mouseY);
		for(let i = 0; i < lettersUsed.length; i++){
			if(lNum == lettersUsed[i]){
				used = true;
				break;
			}
		}
		if(!used){
			selectedLetter =  myLetters[getLetterNum(mouseX,mouseY)];

		}
		
	}
}


function getDataFromServer(){
	server.on('data',function(data){
		let json = JSON.parse(data);
		turn = json.turn;
		//print("run");
		print(json);
		letterCounts = json.letterCounts;
		scores = json.scores;
		myPos = json.i+1;
		if(json.tiles){
			for(let i = 0; i < json.tiles.length; i++){
				if(json.tiles[i].letter){
					tiles[i].setLetter(json.tiles[i].letter);
				}

			}
		}
		if(turn && turn[myPos] == 1){
			endTurnButton.show();	
		}else{	
			endTurnButton.hide();
		}
	});

}
function recieveData(conn){
	conn.on('data',function(data){
			//print("client");
			let json = JSON.parse(data);
			turn = json.turn;
			letterCounts = json.letterCounts;
			scores = json.scores;
			print(json);
			if(json.tiles){
				for(let i = 0; i < json.tiles.length; i++){
					if(json.tiles[i].letter){
						tiles[i].setLetter(json.tiles[i].letter);
					}
	
				}
			}
			sendDataToClients();
	if(turn[myPos] == 1){
		endTurnButton.show();
	}else{
		endTurnButton.hide();
	}

		});
}
function getDataFromClient(){
	for(let i = 0; i < clients.length; i++){
		clients[i].on('data',function(data){
			//print("client");
			let json = JSON.parse(data);
			turn = json.turn;
			letterCounts = json.letterCounts;
			scores = json.scores;
			if(json.tiles){
				for(let i = 0; i < json.tiles.length; i++){
					if(json.tiles[i].letter){
						tiles[i].setLetter(json.tiles[i].letter);
					}
	
				}
			}
			sendDataToClients();
		});
	}
	if(turn[myPos] == 1){
		endTurnButton.show();
	}else{
		endTurnButton.hide();
	}
}



function draw() {
  background(220);
  //fill(219, 212, 195);
	if(server){
//		getDataFromServer();
	}else{
	//	getDataFromClient();
	}
	for(let i = 0; i < tiles.length;i++){
		tiles[i].draw(padding,tileSize);
	}
/*	fill(255,255,255);
      star(7*40+20+50,7*40+20+50,20,8,5);
*/

  for(let i = 0; i < myLetters.length; i++){
  	fill(219, 212, 195);
//    rect(50+(40*4)+(40* i),655,40,40);//my letters
    
	rect(5,50+(40*4)+(40* i),40,40);  
    rect(655,50+(40*4)+(40* i),40,40);  
    rect(50+(40*4)+(40* i),5,40,40);
	if(myLetters[i]){
		myLetters[i].draw();
	}
	textSize(32);
  }
	textSize(32);
	text(myScore, 50+(40*4)+(40* 8),685);
	


	if(selectedLetter != null){
		selectedLetter.highlight();
	}
	textSize(20);
	for(let i = 0; i < names.length;i++){
		//print(scores,myPos);
		if(turn[(i+myPos)%turn.length] == 1){
			fill(255,0,0);
		}else{
			fill(0,0,0);
		}
		text(names[i],namePos[i][0],namePos[i][1]);	
		fill(0,0,0);
		text(scores[(i+myPos)%scores.length],scoresPos[i][0],scoresPos[i][1]);	

	}

  //letters[0] = 'd';
  //print(letters);
  //print(allLetters.length);
  //print(letterCounts.length);
  //print(letterPoints.length);
  //print(sum(letterCounts));
  
}
