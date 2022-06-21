let xSize, ySize, numberOfBombs;

function generate(xSize, ySize, bombs){
    this.xSize = xSize;
    this.ySize = ySize;
    this.numberOfBombs = bombs;

    let container = document.getElementsByClassName("container")[0];
    let buttons = document.getElementById("buttons");
    container.removeChild(buttons);


    let board = document.createElement("div");
    board.id = "board";

    container.appendChild(board);

    for(let i = 0; i < ySize; i++){
        let row = document.createElement("div");
        row.classList.add("row");

        for(let j = 0; j < xSize; j++){
            let field = document.createElement("div");
            field.id = getId(j,i);
            field.classList.add("field");
            row.appendChild(field);
        }

        board.appendChild(row);
    }
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