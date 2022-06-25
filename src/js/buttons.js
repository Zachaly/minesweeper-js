let gameXSize, gameYSize, numberOfBombs, flags;
let fields = [];
let timerInterval;

// generates board and creates fields
function generate(xSize, ySize, bombs){
    gameXSize = xSize;
    gameYSize = ySize;
    numberOfBombs = bombs;
    flags = bombs;

    let container = document.getElementsByClassName("container")[0];
    let buttons = document.getElementById("buttons");
    container.removeChild(buttons);


    let board = document.createElement("div");
    board.id = "board";

    container.appendChild(board);

    for(let i = 0; i < gameYSize; i++){
        let row = document.createElement("div");
        row.classList.add("row");

        for(let j = 0; j < gameXSize; j++){
            let field = document.createElement("div");
            field.id = getId(j,i);
            field.classList.add("field");
            row.appendChild(field);

            fields.push(new Field(j, i));
        }

        board.appendChild(row);
    }

    for(let field of fields){
        document.getElementById(field.getId()).onclick = () => {
            firstClick(field);
        }
    }

    updateFlagCounter();
}

// first click spawns the bombs and starts timer
function firstClick(field){
    generateBombs(field.getXPosition(), field.getYPosition());
    setHandlers();
    leftClick(field);

    document.getElementById("time").innerHTML = 0;

    timerInterval = setInterval(() => {
        let timer = document.getElementById("time");
        timer.innerHTML = parseInt(timer.innerHTML) + 1;
    }, 1000);
}

function getId(x, y){
    return `${x}-${y}`;
}

document.getElementById("small").onclick = () => {
    generate(8, 8, 10);
}

document.getElementById("medium").onclick = () => {
    generate(16, 16, 40);
}

document.getElementById("large").onclick = () =>{
    generate(30, 16, 99);
}