let flaggedBombs = 0;
let uncoveredFields = 0;

// class collecting info about field
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
    }

    unFlagField(){
        this.flag = false;
        flags++;
        if(this.bomb){
            flaggedBombs--;
        }
    }

    hasFlag(){
        return this.flag;
    }
}

// getting field with given location on board
function getField(x, y){
    return fields.find(field => field.getXPosition() == x && field.getYPosition() == y);
}

// generating bombs, bombs cannot spawn on the first clicked field and other directly surrounding it
function generateBombs(startFieldX, startFieldY){
    let startField = getField(startFieldX, startFieldY);

    let startFields = [startField];

    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            startFields.push(getField(startFieldX + i, startFieldY + j));
        }
    }

    let bombs = 0;

    while(bombs < numberOfBombs){
        let x = Math.floor(Math.random() * gameXSize);
        let y = Math.floor(Math.random() * gameYSize);

        let field = getField(x ,y);

        if(!field.hasBomb() && field.countBombsAround() < 6 && !startFields.includes(field)){
            field.setBombed();
            bombs++;
        }
    }
}

// setting event handlers for left and right click
function setHandlers(){
    for(let field of fields){
        document.getElementById(field.getId()).onclick = (e) => {
            fieldClick(field, e.button);
        }
        /* used contextmenu for right click, because click does't want to work with right button
           and I wanted to disable default contextmenu*/
        document.getElementById(field.getId()).oncontextmenu = () =>{
            fieldClick(field, 1);
            return false;
        }
    }
}

/* used when player clicks unflagged bomb
   disables click handlers, shows alert and marks unflagged bombs*/
function lose(){
    clearHandlers();
    for(let field of fields){
        if(field.hasBomb()){
            document.getElementById(field.getId()).classList.add("bomb");
        }
        else{
            document.getElementById(field.getId()).classList.remove("flag");
        }
    }
    alert("you lost");
    clearInterval(timerInterval);
}

// sets click handlers of field to empty ones
function clearHandlers(){
    for(let field of fields){
        document.getElementById(field.getId()).onclick = () => {}
        document.getElementById(field.getId()).oncontextmenu = () => { return false; }
    }
}

// used when player clicks given field
function fieldClick(field, click){
    if(click == 0){
        leftClick(field);
    }
    else if(click == 1){
        rightClick(field);
    }

    if(flaggedBombs == numberOfBombs && uncoveredFields == fields.length - numberOfBombs){
        clearHandlers()
        alert("well done");
        clearInterval(timerInterval);
    }
}

// does nothing when field is flagged
function leftClick(field){
    if(field.hasFlag()){
        return;
    }
    
    if(field.hasBomb()){
        lose()
        return;
    }

    uncover(field);
}

// uncovers field and fields surrounding it when second argument is true
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

// uncovers neiboring fields
function uncoverNeighbors(field){
    let neighbors = !(field.countBombsAround() > 0);

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
}

// (un)flags field
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

    updateFlagCounter();
}

function updateFlagCounter(){
    document.getElementById("flags").innerHTML = flags;
}