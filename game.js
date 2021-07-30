/*TODO 
--place letters--
--Check for words probably file handling--
--count score ez--
figure out multiplayer

*/

//multiplayer vars
let turn = [1,0,0,0];
let scores = [];
let letterCounts = [2,9,2,2,4,12,2,3,2,9,1,1,4,2,6,8,2,1,6,4,6,4,2,2,1,2,1];
let tiles = [];
var peerid;

//---------------
let myLetters  = [];
let allLetters = ' abcdefghijklmnopqrstuvwxyz';
let letterPoints = [0,1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10]
let myScore = 0;
let tempScore = 0;
let padding = 50;
let tileSize = 40;
let selectedLetter = null;
let endTurnButton;
let dictionary = [];
let tilesChanged = [];
let lettersUsed = [];
let url;
var peer = new Peer();


peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
	ID = id;
	el = createElement('h2',url.split("?")[0] + "?" + ID);
	el.position(20, 5);
});




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
	tempScore = 0;
	for(let i = 0;i < tilesChanged.length; i++){
//		print(tiles[tilesChanged[i]].letter);
		tiles[tilesChanged[i]].letter = null;
	}	
	tilesChanged = [];
	lettersUsed = [];
	//print(tilesChanged);
}

function nextTurn(){
	myScore += tempScore;
	tempScore = 0;
	for(let i = 0; i < tilesChanged.length;i++){
			for(let j = 0; j < 7; j++){
				if(myLetters[j].letter == tiles[tilesChanged[i]].letter.letter){
					myLetters[j].setLetter(makeLetter(j));
					break;
				}
			}
	}
	lettersUsed = [];
	tilesChanged = [];
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
	let alone = [];
	for(let i = 0; i < 15;i++){
		let word = "";
		let changedWord = false;
		let wordScore = 0;
		let wordMults = 1;
		for(let j = 0; j < 15; j++){
			if(tiles[(i*15) +j].letter != null){
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
					
					print(res.status);
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
			if(tiles[(j*15) +i].letter != null){
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
					
					print(res.status);
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

	print("next turn");
	nextTurn();
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

function makeLetter(i){
	let rndNum = int(random(27));
    let letter = allLetters[rndNum];
    letterCounts[rndNum] -= 1;
	return new Letter(letter, letterPoints[rndNum],i);
}



function setup() {
  url = getURL();
	if (url.split("?").length > 1){
		isGreen = true;
		peer.on('open', function(){
	
			conn = peer.connect(url.split("?")[1],{
				reliable: false
			});
			conn.on('open', function() {
				peerid = conn.peer;
				print("Connected with " + peerid);

			});
					
			conn.on('error', function(err){
				print("error");
				print(err);
			});
			
			
		});
		

	}else{

		peer.on('connection', function(c) {
			conn = c;
			peerid = conn.peer;
			print(peerid + " connected with me"); 
		});

		
	}	

if(url.split("?").length > 1){
	var conn = peer.connect(url.split("?")[1]);
	print("connecting");
}
  cnv = createCanvas(700, 700);
  cx = (windowWidth - width) / 2;
  cy = (windowHeight - height) / 2;
  //print(cx,cy);
  cnv.position(cx, cy);
  endTurnButton = createButton('end turn');
  endTurnButton.position(cx+50+(40*4)+(40* 10),655+cy);
  endTurnButton.mousePressed(checkWords);


  for(let i = 0;i<7;i++){
	let letterObj = makeLetter(i);
    myLetters.push(letterObj);
  }
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
	let c3 = tiles[tileNum-15].letter != null;
	let c4 = tiles[tileNum+15].letter != null;
	let c5 = tileNum == 112;
	return c1 || c2 || c3 || c4 || c5;
}


function mousePressed(){
	if(onBoard(mouseX,mouseY)){
		//placing letter
		tilePos = getTilePosition(mouseX,mouseY);
		tileNum = getTileNumber(tilePos);
		print(tileNum);
		if(selectedLetter != null && tiles[tileNum].letter == null && validPlacement(tileNum)){
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
				break
			}
		}
		if(!used){
			selectedLetter =  myLetters[getLetterNum(mouseX,mouseY)];

		}
		
	}
}


function draw() {
  background(220);
  //fill(219, 212, 195);
 

	for(let i = 0; i < tiles.length;i++){
		tiles[i].draw(padding,tileSize);
	}
/*	fill(255,255,255);
      star(7*40+20+50,7*40+20+50,20,8,5);
*/

  for(let i = 0; i < 7; i++){
  	fill(219, 212, 195);
//    rect(50+(40*4)+(40* i),655,40,40);//my letters
    
	rect(5,50+(40*4)+(40* i),40,40);  
    rect(655,50+(40*4)+(40* i),40,40);  
    rect(50+(40*4)+(40* i),5,40,40);
	myLetters[i].draw();
	textSize(32);
  }
	text(myScore, 50+(40*4)+(40* 8),685);
	


	if(selectedLetter != null){
		selectedLetter.highlight();
	}


  //letters[0] = 'd';
  //print(letters);
  //print(allLetters.length);
  //print(letterCounts.length);
  //print(letterPoints.length);
  //print(sum(letterCounts));
  
}
