const textContainer = document.getElementById("text");
const checkboxElement = document.querySelector(".checkbox");
const gridSizeElement = document.getElementById("grid-size");
const gridSizePicker = document.querySelector(".grid-range");
const colorButton = document.getElementById("color-btn");
const randomColorButton = document.getElementById("random-btn");
const eraserButton = document.getElementById("eraser-btn");
const clearButton = document.getElementById("clear-btn");
const gridContainer = document.getElementById("grid");
const circleElement = document.getElementById("circle");
let allSquareElement;

let defaultGridSize = 16;
let defaultColor = circleElement.value;
let defaultEraserColor = "white";
let defaultBorder = "1px solid black";
let defaultGridWidth = 650;
let defaultGridHeight = 650;
let defaultMode = "color";
let colorMe = false;
let eraserButtonEnabled = false;
let clearButtonEnabled = false;
let colorButtonEnabled = false;
let randomColorButtonEnabled = false;
let defaultButtonBackgroundColor = eraserButton.style.backgroundColor;
let defaultButtonFontColor = eraserButton.style.color;
let clickedButtonFontColor = "white";
let clickedButtonBackgroundColor = "#8bb4e0";
let dragging = false;

const startText = "Click on Sketch to Start Etching"
const stopText = "Click on Sketch to Stop Etching"


function showText(text) {
  textContainer.textContent = text;
}

function removeText(text){
  textContainer.textContent = "";
}

function getSquareColor() {
  if (randomColorButtonEnabled) {
    return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )},${Math.floor(Math.random() * 255)})`;
  } else {
    return defaultColor;
  }
}


// Begin of Grid and Square Functions

function createGrid() {
  gridContainer.style.width = `${defaultGridWidth}px`;
  gridContainer.style.height = `${defaultGridHeight}px`;
  createSquares(defaultGridSize);
}


function createSquares(gridSize) {
  gridContainer.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    divElement = document.createElement("div");
    divElement.class = "grid-row";
    for (let j = 0; j < gridSize; j++) {
      squareElement = document.createElement("div");
      squareElement.classList.add("square");
      squareElement.style.border = defaultBorder;
      squareElement.style.width = `${(defaultGridWidth * 1.0) / gridSize}px`;
      squareElement.style.height = `${(defaultGridHeight * 1.0) / gridSize}px`;
      divElement.appendChild(squareElement);
    }
    gridContainer.appendChild(divElement);
  }
  allSquareElement = document.querySelectorAll(".square");
  colorMe = false;
}


function changeSquareBorder(element) {
  element.style.border = defaultBorder;
}

function colorSquare(event) {
  event.target.style.backgroundColor = getSquareColor();
}

function enableColorSquare() {
  if (colorMe) return;
  colorMe = true;
  allSquareElement.forEach((square) => {
    square.addEventListener("mouseover", colorSquare);
  });
}

function disableColorSquare() {
  if (!colorMe) return;
  colorMe = false;
  allSquareElement.forEach((square) => {
    square.removeEventListener("mouseover", colorSquare);
  });
}

function changeSquareEvent(event) {
  if (colorMe) {
    disableColorSquare();
    showText(startText);
  } else {
    event.target.style.backgroundColor = defaultColor;
    enableColorSquare();
    showText(stopText);
  }
}

function eraseSquare(event) {
  if (dragging) {
    event.target.style.backgroundColor = defaultEraserColor;
  }
}

function enableSquareClickEvent() {
  allSquareElement.forEach((square) => {
    square.addEventListener("click", changeSquareEvent);
  });
}

function disableSquareClickEvent() {
  allSquareElement.forEach((square) => {
    square.removeEventListener("click", changeSquareEvent);
  });

  disableColorSquare();
}

// End of Grid and Square Functions

// Begin of Color Picker Functions

function enableColorPicker() {
  circleElement.style.background = defaultColor;
  circleElement.addEventListener("input", (event) => {
    circleElement.value = event.target.value;
    defaultColor = event.target.value;
    circleElement.style.background = defaultColor;
  });
}

// End of Color Picker Functions

// Begin of Checkbox Functions

function enableCheckboxEvent() {
  checkboxElement.addEventListener("change", (event) => {
    if (event.target.checked) {
      defaultBorder = "1px solid black";
      allSquareElement.forEach(changeSquareBorder);
    } else {
      defaultBorder = "none";
      allSquareElement.forEach(changeSquareBorder);
    }
  });
}

// End of Checkbox Functions

// Begin of Grid Size Picker Functions

function enableGridSizePicker() {
  gridSizePicker.addEventListener("input", (event) => {
    gridSizeElement.textContent = `${event.target.value} x ${event.target.value} Grid`;
    createSquares(event.target.value);
    if (colorButtonEnabled) {
      enableSquareClickEvent();
    }
  });
}

// End of Grid Size Picker Functions

// Begin of Color Button Functions

function enableColorButton() {
  if (colorButtonEnabled) return;
  if (eraserButtonEnabled) disableEraser();
  if (clearButtonEnabled) disableClearButton();
  if (randomColorButtonEnabled) disableRandomColorButton();

  showText(startText);
  colorButtonEnabled = true;
  colorButton.style.backgroundColor = clickedButtonBackgroundColor;
  colorButton.style.color = clickedButtonFontColor;
  enableSquareClickEvent();
}

function disableColorButton() {
  if (!colorButtonEnabled) return;

  removeText();
  colorButtonEnabled = false;
  colorButton.style.backgroundColor = defaultButtonBackgroundColor;
  colorButton.style.color = defaultButtonFontColor;
  disableSquareClickEvent();
}

function addEventToColorButton() {
  colorButton.addEventListener("click", enableColorButton);
}

// End of Color Button Functions

// Begin of Random Color Button Functions

function enableRandomColorButton() {
  if (randomColorButtonEnabled) return;

  if (colorButtonEnabled) disableColorButton();
  if (eraserButtonEnabled) disableEraser();
  if (clearButtonEnabled) disableClearButton();

  showText(startText);
  randomColorButtonEnabled = true;
  randomColorButton.style.backgroundColor = clickedButtonBackgroundColor;
  randomColorButton.style.color = clickedButtonFontColor;

  enableSquareClickEvent();
}

function disableRandomColorButton() {
  if (!randomColorButtonEnabled) return;

  removeText();
  randomColorButtonEnabled = false;
  randomColorButton.style.backgroundColor = defaultButtonBackgroundColor;
  randomColorButton.style.color = defaultButtonFontColor;
  disableSquareClickEvent();
}

function addEventToRandomColorButton() {
  randomColorButton.addEventListener("click", enableRandomColorButton);
}

// End of Random Color Button Functions

// Begin of Eraser Button Functions

function enableDragging(event) {
  dragging = true;
  eraseSquare(event);
}

function disableDragging() {
  dragging = false;
}

function enableEraser() {
  if (eraserButtonEnabled) return;
  if (clearButtonEnabled) disableClearButton();
  if (colorButtonEnabled) disableColorButton();
  if (randomColorButtonEnabled) disableRandomColorButton();

  eraserButton.style.backgroundColor = clickedButtonBackgroundColor;
  eraserButtonEnabled = true;

  allSquareElement.forEach((square) => {
    square.addEventListener("mousedown", enableDragging);
  });

  allSquareElement.forEach((square) => {
    square.addEventListener("mouseover", eraseSquare);
  });

  allSquareElement.forEach((square) => {
    square.addEventListener("mouseup", disableDragging);
  });
}

function disableEraser() {
  if (!eraserButtonEnabled) return;
  eraserButton.style.backgroundColor = defaultButtonBackgroundColor;
  eraserButtonEnabled = false;
  dragging = false;
  allSquareElement.forEach((square) => {
    square.removeEventListener("mousedown", enableDragging);
  });

  allSquareElement.forEach((square) => {
    square.removeEventListener("mouseover", eraseSquare);
  });

  allSquareElement.forEach((square) => {
    square.removeEventListener("mouseup", disableDragging);
  });
}

function addEventToEraserButton() {
  eraserButton.addEventListener("click", () => {
    if (!eraserButtonEnabled) {
      enableEraser();
    }
  });
}

// End of Eraser Button Functions

// Begin of Clear Button Functions

function enableClearButton() {
  if (clearButtonEnabled) return;
  if (eraserButtonEnabled) disableEraser();
  if (colorButtonEnabled) disableColorButton();
  if (randomColorButtonEnabled) disableRandomColorButton();

  clearButtonEnabled = true;
  clearButton.style.backgroundColor = clickedButtonBackgroundColor;
  clearButton.style.color = clickedButtonFontColor;
  allSquareElement.forEach((square) => {
    square.style.backgroundColor = defaultEraserColor;
  });
}

function disableClearButton() {
  if (!clearButtonEnabled) return;
  clearButtonEnabled = false;
  clearButton.style.backgroundColor = defaultButtonBackgroundColor;
  clearButton.style.color = defaultButtonFontColor;
}

function addEventToClearButton() {
  clearButton.addEventListener("click", enableClearButton);
}

// End of Clear Button Functions

window.onload = () => {
  createGrid();

  enableCheckboxEvent();

  enableGridSizePicker();

  enableColorPicker();

  enableColorButton();

  addEventToColorButton();

  addEventToRandomColorButton();

  addEventToEraserButton();

  addEventToClearButton();
};
