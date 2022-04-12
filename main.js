const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


var sizeWidth = window.outerWidth - 200;
var sizeHeight = window.outerHeight -200;

//Setting the canvas site and width to be responsive 
canvas.width = sizeWidth;
canvas.height = sizeHeight;
canvas.style.width = sizeWidth;
canvas.style.height = sizeHeight;

const a = 6;
const r = 40;
const absolutePolyRotation = 90 * Math.PI/180;

    class hex {
    constructor(radius, color, counter, weight = null){
        this.sides = 6;
        this.radius = radius;
        this.rotation = absolutePolyRotation;
        this.points = {};
        this.strokeColor = color;
        this.center = null;
        this.isFilled = false;
        this.playerFilled = false;
        this.idInGrid = counter;
        this.neighbors = {}; //todo add all hexes with any point matching this points
        this.weight = weight;
        this.neighborCount = 0;
    }

    draw(x,y){
        ctx.beginPath();
        let centerX = 0;
        let centerY = 0;
        for (var i = 0; i < 6; i++) {
            this.points[i] = {
                'x' : x + this.radius * Math.cos(this.rotation + (2 * Math.PI / this.sides) * i),
                'y' : y + this.radius * Math.sin(this.rotation + (2 * Math.PI / this.sides) * i)
            };
            
            ctx.lineTo(this.points[i].x ,this.points[i].y);
            centerX += this.points[i].x;
            centerY += this.points[i].y;

        }

        ctx.strokeStyle = this.strokeColor;
        this.center = {'x':centerX/6,'y':centerY/6};

        ctx.closePath();
        ctx.stroke();

        //debug = draw hex id
        ctx.font = '26px serif';
        ctx.strokeText(this.weight, this.center.x, this.center.y);

    }

    fill(color, filledByPlayer){
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(this.points[i].x ,this.points[i].y);

        }
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();

        this.isFilled = true;

        if(filledByPlayer == true){
            this.playerFilled = true;
        }

    }

}

init();

function init() {
    ctx.fillStyle = "#d4d4d4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hexGrid = drawGrid(5,5,80,80);
}

//todo
function drawGridBorders(startX, startY){
    ctx.beginPath();
    ctx.lineTo(startX-80 ,startY-50);
    ctx.lineTo(startX+730 ,startY-50);
    ctx.lineTo(startX+1130 ,startY+660);
    ctx.lineTo(startX+300 ,startY+660);
    ctx.strokeStyle = 'red';
    ctx.closePath();
    ctx.stroke();
}

function drawGrid(columns, rows, startGridX, startGridY){
    // drawGridBorders(startGridX,startGridY);
    grid = [];
    initialX = x = startGridX;
    initialY = y = startGridY;
    counter = 1;
    previousRowFirstHex = null;
    for (let j = 1; j <= columns; j++) {
        for (let i = 1; i <= rows; i++) {
            
            if(i < columns/2+1){
                weight = Math.abs(i);
            }
            else{
                weight = Math.abs(columns - i+1);
            }

            if(j < rows/2+1){
                weight += Math.abs(j);
            }else{
                weight += Math.abs(rows - j+1);
            }
            
            grid[counter] = {
                id: counter,
                hex: new hex(r, 'black',counter, weight)
            }

            if(i == 1){
                previousRowFirstHex = grid[counter];
            }

            // console.log(counter);
            grid[counter].hex.draw(x,y)
            
            x =  grid[counter].hex.points[5].x ;
            y =  grid[counter].hex.points[5].y + r;
            counter++;

        }
        x = initialX-(11*j)+ r*2 * j; //quick fix - not correct or precize calculation
        y = initialY;

    }
    setHexesNeighbors(grid);
    return grid;

}


function setHexesNeighbors(hay){
    neighborCount = 0;
    for(let i = 1; i < hay.length; i++){ // 1st element
        for(let j = 1; j < hay.length; j++){ // all elements
            for(let k = 1; k < a; k++){ //1st element all points
                for(let g = 1; g < a; g++){ // all element each points

                    if(i != j){//check if not self , round number to first two digits, because the hex grid points are not accurate enough
                        if( Number(String(Math.round(hay[i].hex.points[k].x)).slice(0, 2)) == Number(String(Math.round(hay[j].hex.points[g].x)).slice(0, 2)) ){ //1st point x coordinates match all elemnent x coordinates
                            if( Number(String(Math.round(hay[i].hex.points[k].y)).slice(0, 2)) == Number(String(Math.round(hay[j].hex.points[g].y)).slice(0, 2)) ){ // 1st point y coordinates match all elemnent y coordinates
                                hay[i].hex.neighbors[j] = hay[j].hex;
                            }
                        }
                    }
                }
            }
            neighborCount = Object.keys(hay[i].hex.neighbors).length;
        }
        hay[i].hex.neighborCount = neighborCount;
        neighborCount = 0;
        // console.log(hexGrid);
    }
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // console.log("Coordinate x: " + x, 
    //             "Coordinate y: " + y);
    return {'x': x, 'y': y};
}


function getClosestCenter(coord, hay, color){
    let needle = coord;
    closestHex = {
        'hex':{
            'center' : {
                'x': 0, 'y': 0
            }
        }
    };


    //todo change from checking center but if click coordinates are between all hex 6 points !!!!!!!! That will be more precise
    for(let i = 1; i < hay.length; i++){
        if(Math.abs(needle.x - hay[i].hex.center.x) <= Math.abs(needle.x - closestHex.hex.center.x)){
            if(Math.abs(needle.y - hay[i].hex.center.y) <= Math.abs(needle.y - closestHex.hex.center.y)){
                closestHex = hay[i];
            }
        }

        //debug center
        // ctx.beginPath();
        // ctx.arc(hay[i].hex.center.x, hay[i].hex.center.y, 20, 0, 2 * Math.PI);
        // ctx.fillStyle = 'blue';
        // ctx.fill();
    }

    //debug click
    // ctx.beginPath();
    // ctx.arc(needle.x, needle.y, 20, 0, 2 * Math.PI);
    // ctx.fillStyle = 'red';
    // ctx.fill();

    closestHex.hex.fill(color, true);

    // console.log(needle);
    return closestHex.hex;
}

let canvasElem = document.querySelector("canvas");
  
canvasElem.addEventListener("mousedown", function(e)
{
    //player move
    currentHex = getClosestCenter(getMousePosition(canvasElem, e), hexGrid, '#0062ff');
    // console.log('closestCenterReturn',currentHex);
    res = minimax(currentHex, 1, false);
    // console.log('minimax return',res);
    //ai move
    bestHexAiDecision = bestMove(minimax(currentHex, 1, true)); 
    getClosestCenter(bestHexAiDecision, hexGrid, '#e82323');
});


function bestMove(hex){

    return {'x': hex.center.x, 'y': hex.center.y};
}

function minimax(currentHex, depth, maximizePlayer){
    gameOver = false;

    if (depth == 0 || gameOver == true){
        if(maximizePlayer == false){
            console.log('bestWeight',currentHex.weight);

        }
        return currentHex;
    }

    if (maximizePlayer == true){
        maxEvaluation = -Infinity;

        for(let i = 0; i < currentHex.neighborCount; i++){
            neighborId = Object.keys(currentHex.neighbors)[i];
            evaluation = minimax(currentHex.neighbors[neighborId], depth-1, true)
            maxEvaluation = currentHex.neighbors[neighborId].weight > maxEvaluation ? currentHex.neighbors[neighborId] : maxEvaluation ;
        }
        return maxEvaluation;
    }

    if (maximizePlayer == false){
        minEvaluation = +Infinity;
        // console.log(currentHex.neighborCount);
        for(let i = 0; i < currentHex.neighborCount; i++){
            neighborId = Object.keys(currentHex.neighbors)[i];
            evaluation = minimax(currentHex.neighbors[neighborId], depth-1, false)
            minEvaluation = currentHex.neighbors[neighborId].weight < minEvaluation ? currentHex.neighbors[neighborId] : minEvaluation ;
        }
        return minEvaluation;
    }

}