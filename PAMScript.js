/* 
PAMScript.js
Pixel Art Maker Project
Array Bootcamp Fall 2021
Katie Greenwald 
*/

//const { getPikaPort } = require("./pikaPort");

const pictureContainer = document.querySelector('.picture-container');
const gridContainer = document.querySelector('.grid-container');
const sizePicker = document.querySelector('.size-picker');
const inputHeight = document.querySelector('.input-height');
const inputWidth = document.querySelector('.input-width');


const paletteContainer = document.querySelector('.palette-container');
const fillButton = document.querySelector('.fill-button');
const clearButton = document.querySelector('.clear-button');
const eraserButton = document.querySelector('.eraser-button');
const saveButton = document.querySelector('.save-button');
const loadButton = document.querySelector('.load-button');

const loadPictureButton = document.querySelector('.load-picture-button');
const addAnImageButton = document.querySelector('.addAnImage');
const addColorButton = document.querySelector('.color-button');


//cursor...an attempt to change the cursor that somehow doesn't work 
document.body.style.cursor = 'Rainbow-Paintbrush.cur';

const loadPikaImg = document.querySelector('.pika-pic');
const loadLinkImg = document.querySelector('.link-pic');
const loadPamImg = document.querySelector('.pam-pic');

//const getPortButton = document.querySelector('.port-button');
// const lib = require('./pikaPort');
// var aPika = [];

//add color variables 
const max = 29;
let count = 0;
let i = 0;

let gridHeight = inputHeight.value;
let gridWidth = inputWidth.value;
// creates a global variable that will house every square we create in the document
const allSquares = [];
// Create Color Palette colors

const paletteColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
var num = paletteColors.length - 1 + count;
let paintColor = 'red'; //paletteColors[num];//'grey';
//if the default color is changed you need to change the square background color in the CSS too 
let defaultColor = ""; //'#EFE4B0'; //'white';
//document.body.style.cursor = crosshair;


function upClick() {
    i++;
    document.getElementsByClassName("up").value = count;
    document.getElementsByClassName("down").value = count;
}

function dwnClick() {
    i--;
    document.getElementsByClassName("up").value = count;
    document.getElementsByClassName("down").value = count;
}



//square.style.hover.backgroundColor = paintColor;

//objective create an image element and append it to picture container
const newImage = document.createElement('img');
pictureContainer.appendChild(newImage);

//objective: add event listener to picture button 
loadPictureButton.addEventListener('click', (e) => {
    e.preventDefault();
    getImageFromApi();
});

//add color button 
addColorButton.addEventListener('click', addColor);

// Make grid
function makeGrid(height, width) {

    allSquares.length = 0;
    //fixes a thing
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
    for (let i = 0; i < height; i++) {
        const row = makeRow();
        gridContainer.appendChild(row);
        for (let j = 0; j < width; j++) {
            const square = makeSquare();
            row.appendChild(square);

            square.addEventListener('click', () => {
                square.style.backgroundColor = paintColor;
            });
            // this does the right click erase but I couldn't figure out how to make it drag and drop too...
            square.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                square.style.backgroundColor = '';
            });
        }
    }
}

// Make rows
function makeRow() {
    const row = document.createElement('div');
    row.classList.add('row');

    return row;
}

// Make squares
function makeSquare() {
    const square = document.createElement('div');
    square.classList.add('square');

    // pushes each div (square) into the global allSquares array so functions can access it directly
    allSquares.push(square);

    return square;
}
//change grid size
function changeGridSize() {
    sizePicker.addEventListener('submit', (e) => {
        e.preventDefault();
        makeGrid(gridHeight, gridWidth);
    });
    inputHeight.addEventListener('change', (e) => {
        gridHeight = e.target.value;
    });
    inputWidth.addEventListener('change', (e) => {
        gridWidth = e.target.value;
    });
}


//fill squares 
function fillSquares() {

    fillButton.addEventListener('click', () => {
        //  const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => (square.style.backgroundColor = paintColor));
    });
}

//clear squares
function clearSquares() {
    clearButton.addEventListener('click', () => {
        // const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => (square.style.backgroundColor = defaultColor));
    });
}



//Create a color circle and append to palette container
function createColorCircleAndAppend(colorHex) {
    const colorCircle = document.createElement('div');
    colorCircle.classList.add('circle');
    colorCircle.style.backgroundColor = colorHex;

    paletteContainer.appendChild(colorCircle);

    colorCircle.addEventListener('click', () => {
        paintColor = colorCircle.style.backgroundColor;
        //document.body.style.cursor = crosshair;
    });

    eraserButton.addEventListener('click', () => {
        paintColor = "";

    });
}

//Create multiple color palette circles
function createColorPalette() {
    for (let i = 0; i < paletteColors.length; i++) {
        let colorHex = paletteColors[i];

        createColorCircleAndAppend(colorHex);
    }
}

// create drag and draw feature 
function dragAndDraw() {
    gridContainer.addEventListener('mouseover', addStyle);

    gridContainer.addEventListener('mousedown', () => {
        down = true;
        gridContainer.addEventListener('mouseup', () => {
            down = false;
        });

        gridContainer.addEventListener('mouseover', (e) => {
            if (e.target.className === "square" && down) {
                e.target.style.backgroundColor = paintColor;
            }
        });
    });
}

// create a function that saves each square background color to local storage
function save() {
    saveButton.addEventListener('click', () => {
        const gridArray = [];
        // const allSquares = document.querySelectorAll('.square');
        for (let i = 0; i < allSquares.length; i++) {
            const squareColors = allSquares[i];
            gridArray.push(squareColors.style.backgroundColor);
        }

        const gridInfo = {
            grid: gridArray,
            //an attempt to save the palette colors too...
            palette: paletteColors,
            height: gridHeight,
            width: gridWidth

        }
        console.log(gridInfo);
        // console.log("gridInfo");
        localStorage.setItem('gridSave', JSON.stringify(gridInfo));
    });
}


//A function that loads the save
function load() {
    loadButton.addEventListener('click', () => {
        const savedGridInfo = JSON.parse(localStorage.getItem('gridSave'));
        console.log(savedGridInfo);
        makeGrid(savedGridInfo.height, savedGridInfo.width);

        for (let i = 0; i < allSquares.length; i++) {
            allSquares[i].style.backgroundColor = savedGridInfo.grid[i];
        }

    });
}

//fetch random image from API
function getImageFromApi() {
    //I tried so many apis and various things but so far I haven't managed to get anything but the dog one to work
    const fetchRequest = fetch('https://dog.ceo/api/breeds/image/random'); //'https://source.unsplash.com/random'); // //'https://acnhapi.com'

    fetchRequest.then(function(response) {
        return response.json();
    }).then(function(data) {
        //console.log(data);
        newImage.src = data.message;
    });
}

//a function that adds a style where you can see the color before the click...at least 
// when the canvas is blank, for some reason i can't get it to work other wise
function addStyle() {

    var styles =
        `
.square:hover {
 background-color: ` + paintColor + `; 
border: 1.1px solid black;
z-index: 2;

}

`
    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

}

function addCursorStyle() {

    var cur =
        `
        body {
            cursor: url(paintBrush.png), auto;
        }
`
    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = cur;
    document.head.appendChild(styleSheet)

}
//


//add color function 
function addColor() {

    //I made it so that you can only use one method to add one color at a time 
    if (count < max) {
        var clr = document.getElementById("myColor").value;
        var clr2 = document.getElementById("hex").value;

        if (clr2 !== "#") {
            paletteColors.push(clr2);
            createColorCircleAndAppend(clr2);

        } else {

            paletteColors.push(clr);
            createColorCircleAndAppend(clr);
        }

        count = count + 1;
    } else { alert("Sorry, you can't add any more colors."); }
}

// I tried to figure out how to use the require library because I had obnoxiously long arrays...but 
//couldn't figure it out, this code is remnants of that 
// function getPorts() {
//     // const lib = require('./pikaPort');
//     // getPortButton.addEventListener('click', () => {


//     //     aPika = lib.getPikaPort();
//     //     console.log(aPika);


//         for (let i = 0; i < allSquares.length; i++) {
//             allSquares[i].style.backgroundColor = aPika[i];
//         }


//     //});

//}


// this the load pika function which loads the pika image onto the canvas 
function loadPika() {


    loadPikaImg.addEventListener('click', () => {


        makeGrid(20, 20);
        //const allSquares = document.querySelectorAll('.squares');

        //  makeGrid(savedPikaInfo.height, savedPikaInfo.width);
        for (let i = 0; i < allSquares.length; i++) {
            allSquares[i].style.backgroundColor = pikaPort[i]; //savedPikaInfo.pikaPort[i];
        }
        console.log(pikaPort);
    });
}

// this the load link function which loads the link image onto the canvas and adds some 
// new colors to the color palette
var linkCount = 0;

function loadLink() {


    loadLinkImg.addEventListener('click', () => {


        makeGrid(20, 20);
        for (let i = 0; i < allSquares.length; i++) {
            allSquares[i].style.backgroundColor = linkPort[i]; //savedPikaInfo.pikaPort[i];
        }

        if (linkCount == 0) {
            createColorCircleAndAppend("rgb(38, 242, 229)");
            createColorCircleAndAppend("rgb(38, 242, 116)");
            createColorCircleAndAppend("rgb(188, 145, 73)");
            linkCount++;
        }

    });
}

// this the load pam function which loads the pam image onto the canvas 
//and adds a new color to the color palette 
var pamCount = 0;

function loadPam() {


    loadPamImg.addEventListener('click', () => {


        makeGrid(20, 20);
        for (let i = 0; i < allSquares.length; i++) {
            allSquares[i].style.backgroundColor = pamPort[i]; //savedPikaInfo.pikaPort[i];
        }
        if (pamCount == 0) {
            var newColor = '#EFE4B0';
            createColorCircleAndAppend(newColor);
            pamCount++;
        }

    });
}


//this function adds the image using the link provided 
function addImage() {
    //var aImg = getElementsByClassName(".addAnImage");

    //var aimg = document.getElementById('.aImg');
    var img = document.getElementsByClassName("imgLink").value;
    var link = "https://stackoverflow.com/questions/2735881/adding-images-to-an-html-document-with-javascript"; //document.getElementById("imgLink").value;

    if (link !== "https://") {
        addAnImageButton.addEventListener('click', () => {
            var img = document.createElement('img');
            img.src = document.getElementById("imgLink").value;
            /* 
                        document.getElementById('body').appendChild(img);
                        down.innerHTML = "Image Element Added."; 
                      
                     var a =    document.getElementById('aImg').appendChild(a); */

            document.getElementById("aImg").src = img.src;
        });
    }



}


//this function uploads a file from the users computer on to the canvas 
window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('.myImg');
            img.onload = () => {
                URL.revokeObjectURL(img.src); // no longer needed, free memory
            }

            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        }
    });
});



//this is my init function which initializes most of the functions so they can work 

function init() {
    makeGrid(gridHeight, gridWidth);
    fillSquares();
    clearSquares();
    changeGridSize();
    createColorPalette();
    dragAndDraw();
    save();
    load();
    loadPika();
    loadLink();
    loadPam();
    //addImage();

    //getPorts();
    //takeshot();
    // getImageFromApi();
    addCursorStyle();

}

init();




//one of my failed print images
// $(function() {
//     $("#btnSave").click(function() {
//         html2canvas($("#target"), {
//             onrendered: function(canvas) {
//                 theCanvas = canvas;
//                 document.body.appendChild(canvas);

//                 // Convert and download as image 
//                 Canvas2Image.saveAsPNG(canvas);
//                 $("#output").append(canvas);
//                 // Clean up 
//                 //document.body.removeChild(canvas);
//             }
//         });
//     });
// });



// Define the function 
// to screenshot the div
function takeshot() {
    let div =
        document.getElementById('target');

    // Use the html2canvas
    // function to take a screenshot
    // and append it
    // to the output div
    html2canvas(div).then(
        function(canvas) {
            document
                .getElementById('output')
                .appendChild(canvas);
        })
}



//functions to make the DIV elements draggable:
dragElement(document.getElementById("mydiv"));
dragElement(document.getElementById("adiv"));
dragElement(document.getElementById("pika"));


function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}






//my obnoxiously long arrays...

var pikaPort = ["purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple", "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "purple",
    "purple",
    "purple",
    "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "purple",
    "yellow",
    "yellow",
    "purple",
    "purple",
    "purple",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "red",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "black",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "red",
    "red",
    "red",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "blue",
    "yellow",
    "red",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "yellow",
    "black",
    "yellow",
    "orange",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "blue",
    "yellow",
    "red",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "black",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "red",
    "red",
    "red",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "red",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "purple",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "yellow",
    "purple",
    "yellow",
    "purple",
    "yellow",
    "yellow",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "yellow",
    "purple",
    "yellow",
    "purple",
    "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "blue",
    "purple",
    "purple",
    "green",
    "purple",
    "purple",
    "purple",
    "yellow",
    "yellow",
    "purple",
    "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "blue",
    "yellow",
    "blue",
    "green",
    "green",
    "green",
    "purple",
    "yellow",
    "yellow",
    "yellow",
    "purple",
    "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "blue",
    "purple",
    "purple",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "green",
    "green",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "purple",
    "green",
    "green"
];


var linkPort = ["rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "orange",
    "orange",
    "orange",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "orange",
    "orange",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "orange",
    "orange",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "orange",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "orange",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "orange",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "orange",
    "orange",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "orange",
    "orange",
    "orange",
    "orange",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(188, 145, 73)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(188, 145, 73)",
    "rgb(188, 145, 73)",
    "orange",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 229)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)",
    "rgb(38, 242, 116)"
];

var pamPort = ["rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "",
    "",
    "",
    "",
    "rgb(239, 228, 176)",
    "red",
    "rgb(239, 228, 176)",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "",
    "",
    "",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "",
    "",
    "",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "",
    "red",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "",
    "red",
    "rgb(239, 228, 176)",
    "red",
    "rgb(239, 228, 176)",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "",
    "",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "",
    "red",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "red",
    "",
    "red",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "",
    "rgb(239, 228, 176)",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "",
    "red",
    "",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "",
    "red",
    "red",
    "red",
    "",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "",
    "red",
    "",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "",
    "",
    "",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "red",
    "red",
    "red",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "",
    "red",
    "",
    "",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "rgb(239, 228, 176)",
    "",
    "red",
    "",
    "red",
    "red"
];