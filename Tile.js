
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
			textSize(size);
			text(this.letter.letter,this.posX*size+padding + size/10,(this.posY*size+padding)+size/1.25);
		    textSize(size/3);
			text(this.letter.point,this.posX*size+padding+ size*3/4,(this.posY + 2)*size);
		}
	}

	setLetter(letter){
		this.letter = new Letter(letter.letter, letter.point,letter.number); 
//		this.letter = letter;
	}
}