class Letter{
	constructor(letter, point,position){
		this.letter = letter;
		this.point = point;
		this.position = position
	}


	draw(){
  		fill(219, 212, 195);
    	rect(50+(40*4)+(40* this.position),685-30,40,40);//my letters
		fill(0,0,0);
    	textSize(32);
		text(this.letter,50+(40*4)+(40* this.position)+5,685);
	    textSize(10);
		text(this.point,50+(40*4)+(40* this.position)+27,685+10);
	}
	highlight(){
		noFill();
		rect(50+(40*4)+(40* this.position),685-30,40,40);//my letters
	}

	setLetter(l){
		this.letter = l.letter;
		this.point = l.point;
		this.position = l.position;

	}

}
