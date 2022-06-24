let flaggedBombs = 0;
let uncoveredFields = 0;

class Field{
    constructor(positionX, positionY){
        this.positionX = positionX;
        this.positionY = positionY;
        this.bomb = false;
        this.flag = false;
    }

    getId(){
        return `${this.positionX}-${this.positionY}`;
    }

    getXPosition(){
        return this.positionX;
    }

    getYPosition(){
        return this.positionY;
    }

    hasBomb(){
        return this.bomb;
    }

    setBombed(){
        this.bomb = true;
    }

    countBombsAround(){
        let sum = 0;

        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                try{
                    let field = getField(this.positionX + i, this.positionY + j);
                    if(field.hasBomb()){
                        sum++;
                    }
                }
                catch{}                
            }
        }
        return sum;
    }

    flagField(){
        this.flag = true;
        flags--;
        if(this.bomb){
            flaggedBombs++;
        }
        updateFlagCounter();
    }

    unFlagField(){
        this.flag = false;
        flags++;
        if(this.bomb){
            flaggedBombs--;
        }
        updateFlagCounter();
    }

    hasFlag(){
        return this.flag;
    }
}

function getField(x, y){
    return fields.find(field => field.getXPosition() == x && field.getYPosition() == y);
}

function generateBombs(){
    let bombs = 0;

    while(bombs < numberOfBombs){
        let x = Math.floor(Math.random() * gameXSize);
        let y = Math.floor(Math.random() * gameYSize);

        let field = getField(x ,y);

        if(!field.hasBomb() && field.countBombsAround() < 6){
            field.setBombed();
            bombs++;
        }
    }
}

function setHandlers(){
    for(let field of fields){
        document.getElementById(field.getId()).onclick = (e) => {
            fieldClick(field, e.button);
        }
        document.getElementById(field.getId()).oncontextmenu = () =>{
            rightClick(field);
            return false;
        }
    }
}

function fieldClick(field, click){
    if(click == 0){
        leftClick(field);
    }
    else if(click == 2){
        rightClick(field);
    }

    if(flaggedBombs == numberOfBombs && uncoveredFields == fields.length - numberOfBombs){
        alert("well done");
        clearInterval(timerInterval);
    }
}

function leftClick(field){
    if(field.hasFlag()){
        return;
    }
    
    let container = document.getElementById(field.getId());
    
    if(field.hasBomb()){
        container.classList.add("bomb");
        alert("you lost");
        clearInterval(timerInterval);
        return;
    }

    uncover(field);
}

function uncover(field, neighbors = true){
    uncoveredFields++;

    if(field.hasBomb()){
        return;
    }
    let container = document.getElementById(field.getId());
    container.classList.add("empty");

    let bombs = field.countBombsAround();
    if(bombs > 0){
        container.innerHTML = bombs;
        return;
    }
    if(neighbors){
        uncoverNeighbors(field);
    }

}

function uncoverNeighbors(field){
    let neighbors = !(field.countBombsAround() > 0);

    if(neighbors){
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                try{
                    let nextField = getField(field.getXPosition() + i, field.getYPosition() + j);
                    if(document.getElementById(nextField.getId()).classList.contains("empty")){
                        continue;
                    }
                    uncover(nextField, neighbors)
                }
                catch{}
            }
        }

        return;
    }

    for(let i = -1; i < 2; i += 2){
        try{
            let nextField = getField(field.getXPosition() + i, field.getYPosition());
            if(document.getElementById(nextField.getId()).classList.contains("empty")){
                continue;
            }
            uncover(nextField, neighbors)
        }
        catch{}

        try{
            let nextField = getField(field.getXPosition(), field.getYPosition() + i);
            if(document.getElementById(nextField.getId()).classList.contains("empty")){
                continue;
            }
            uncover(nextField, neighbors)
        }
        catch{}
    }
}

function rightClick(field){
    let container = document.getElementById(field.getId());
    if(container.classList.contains("empty")){
        return;
    }

    if(!field.hasFlag()){
        container.classList.add("flag");
        field.flagField();
    }
    else{
        container.classList.remove("flag");
        field.unFlagField();
    }
}

function updateFlagCounter(){
    document.getElementById("flags").innerHTML = flags;
}