
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