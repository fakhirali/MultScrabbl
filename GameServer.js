class Server{
    constructor(Name){

        this.turns = [];
        this.playersData = [];
        this.url = getURL();
        this.Name = Name;
        this.peer = new Peer(Name);
        this.addPlayer(Name);
        this.openConnections();
    }



    openConnections(){
        this.peer.on('open', function(id) {
            console.log('My peer ID is: ' + id);
            el = createElement('h2',url.split("?")[0] + "?" + id);
            el.position(20, 5);
        });
        this.peer.on('connection', function(connection) {
            this.playersConnection.push(connection);
            this.recieveDataFromPlayer(connection);
            this.addPlayer(connection);
            print(connection.peer + " connected with me"); 
        });	
    }

    addPlayer(Connection){
        this.scores.push(0);
        this.turns.push(0);
        this.playersData.push(new PlayerData(turns.length, Connection.peer, Connection))
    }


    makeAllLetters(){
        letters = [];
        for(let i =0 ;i < 7;i ++){
            letters.push(this.makeLetter(i));
        }
        return letters
    }


    makeLetter(position){
        print(isGameOver());
        let rndNum = int(random(27));
        while(this.letterCounts[rndNum] <= 0){
            rndNum = int(random(27));
        }
        let letter = this.allLetters[rndNum];
        this.letterCounts[rndNum] -= 1;
        return new Letter(letter, this.letterPoints[rndNum],position);
    
    }

    sendDataToPlayers(){
        for(let pos = 0; pos < this.playersConnection.length; pos++){
            //print("ran");
            this.playersConnection[pos].send(JSON.stringify({letterCounts,turns,scores,tiles}));
            
        }
    }

    sendDataToPlayer(indx){
        this.playersData[indx].connection.send(JSON.stringify({letterCounts,turns,scores,tiles}));
    }


    recieveDataFromPlayer(conn){
        conn.on('data',function(data){
            //playerScore, playerPos
            let json = JSON.parse(data);
        });
    }
}