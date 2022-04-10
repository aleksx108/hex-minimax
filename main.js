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
    constructor(radius, color){
        this.sides = 6;
        this.radius = radius;
        this.rotation = absolutePolyRotation;
        this.points = {};
        this.strokeColor = color;
        this.center = null;
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

    }

    fill(color){
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(this.points[i].x ,this.points[i].y);

        }
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();

    }

    }

init();

function init() {
    ctx.fillStyle = "#d4d4d4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hexGrid = drawGrid(11,11,80,80);
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
    for (let j = 1; j <= columns; j++) {
        for (let i = 1; i <= rows; i++) {
            grid[counter] = {
                id: counter,
                hex: new hex(r, 'black')
            }

            console.log(counter);
            grid[counter].hex.draw(x,y)
            
            x =  grid[counter].hex.points[5].x ;
            y =  grid[counter].hex.points[5].y + r;
            counter++;
        }
        x = initialX-(11*j)+ r*2 * j; //quick fix
        y = initialY;

    }
    return grid;

}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // console.log("Coordinate x: " + x, 
    //             "Coordinate y: " + y);
    return {'x': x, 'y': y};
}


function getClosestCenter(coord, hay){
    let needle = coord;
    closestHex = {
        'hex':{
            'center' : {
                'x': 0, 'y': 0
            }
        }
    };

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

    closestHex.hex.fill('#0062ff'); //#e82323

    console.log(needle);
    console.log(closestHex.hex);
}

let canvasElem = document.querySelector("canvas");
  
canvasElem.addEventListener("mousedown", function(e)
{
    getClosestCenter(getMousePosition(canvasElem, e), hexGrid);
});