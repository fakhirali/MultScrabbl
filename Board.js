class Board{
    constructor(){
        this.letterCounts = [2,9,2,2,4,12,2,3,2,9,1,1,4,2,6,8,2,1,6,4,6,4,2,2,1,2,1];
        this.allLetters = ' abcdefghijklmnopqrstuvwxyz';
        this.tiles = [];
        this.makeTiles();
        this.scoresPos = [[100,675],[0,100],[100,25],[650,100]];
        this.padding = 50;
        this.tileSize = 40;

    }

    makeTiles(){
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
              this.tiles.push(tile);
            }
            
          }
            this.tiles[112].wordMult = 1;
            this.tiles[112].letterMult = 1;
    }
}