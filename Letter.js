class Letter{
	constructor(letter, point,number){
		this.letter = letter;
		this.point = point;
		this.number = number
	}


	draw(tileSize){
  		fill(219, 212, 195);
		rect((this.number+5)*tileSize,16*tileSize,tileSize,tileSize);
		fill(0,0,0);
    	textSize(tileSize);
//		text(this.letter,50+(tileSize*4)+(tileSize* this.number)+5,685);
		text(this.letter,(this.number+5)*tileSize,17*tileSize - (tileSize/4));

	    textSize(tileSize/3);
		text(this.point,(this.number+5)*tileSize + tileSize*3/4, 17*tileSize - (tileSize/4)+tileSize/4);
	}
	highlight(){
		noFill();
		rect((this.number+5)*tileSize,16*tileSize,tileSize,tileSize);
	}

	setLetter(l){
		this.letter = l.letter;
		this.point = l.point;
		this.number = l.number

	}

}
