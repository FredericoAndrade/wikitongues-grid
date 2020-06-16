"use strict";

const batch = require("./batch.js");
const data = require("./data.json");
let availableData = data;
let usedData = [];

batch.batch(5)

class Grid {
  constructor(columns, rows, gutter) {
    this.columns = columns,
    this.rows = rows;
    this.gutter = gutter;
  };
  get cells() {
    return this.columns * this.rows;
  };
};

class Cell {
  constructor() {
    this.datum = getRandomCell();
    this.title = this.datum.title;
    this.key = this.datum.id;
    this.image = this.datum.url;
    this.url = this.datum.youtube
    this.height = height / grid.rows;
    this.width = width / grid.columns;
    this.color = getRandomColor();
  };
};

const grid = new Grid(4,3,2);

let canvas = $("#canvas"),
height = canvas.innerHeight(),
width = canvas.innerWidth();

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||| DOM |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

( //Render Grid
  function() {
    for (var i = 0; i <= grid.cells -1; i++) {
      addCell(i);
    };
  }()
);

function updateGrid() {
  let currGridLen = canvas.children().length,
  targetGridLen = grid.cells,
  diff = targetGridLen - currGridLen;

  if( diff > 0 ) {
    for (var i = 0; i <= diff - 1; i++) {
      addCell();
    };
  } else if ( diff < 0 ) {
    for (var i = 0; i <= (diff * -1) - 1; i++) {
      removeCells();
    };
  };
  updateCellSize();
};

function addCell(i) {
  const cell = new Cell();
  canvas.append(`
    <div class="cell"
    data="${cell.key}"
    data-url="${cell.url}"
    data-title="${cell.title}"
    style="
      height:${cell.height}px;
      width: ${cell.width}px;
      background:${cell.color};
      "
    >
      <div class="nucleus"
        style="
        border-width:${grid.gutter}px;
        background-image:url(${cell.image});
        "
      >
      </div>
    </div>
  `);
};

function removeCells() {
  const t = canvas.children().last().attr("data"),
  index = usedData.map(p => p.id).indexOf(t),
  removedCell = usedData[index];

  canvas.children().last().detach();
  usedData.splice(index,1);
  availableData.push(removedCell);
};

function getRandomCell() {
  const index = Math.floor(Math.random()*availableData.length),
  cell = availableData[index];
  usedData.push(cell);
  availableData.splice(index,1);

  return cell;
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (var i = 0; i < 6; i++) {
    color += letters[8 + Math.floor(Math.random() * 8)];
  };

  return color;
};


// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||| INTERACTION |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

function reportWindowSize() {
  height = window.innerHeight;
  width = window.innerWidth;
  updateCellSize();
};

function updateCellSize() {
  $(".cell").height(canvas.innerHeight()/grid.rows);
  $(".cell").width(canvas.innerWidth()/grid.columns);
};

window.onresize = reportWindowSize;

$("input").change(function(e){
  grid[e.target.id] = Number(this.value);
  updateGrid();
  $(".nucleus").css("border-width",`${grid.gutter}px`);
  $("input#gridSize").val(grid.cells);
})

$(document).on("mouseover", ".cell", function(e) {
  const obj = $(e.target).parent().attr("data");
  const title = $(e.target).parent().attr("data-title");
  history.pushState({page:obj}, obj, `?video=${obj}`);
  document.querySelector("#title").textContent = title;
})

$(document).on("click", ".nucleus", function(e) {
  const url = $(e.target).parent().attr("data-url");
  const iframe = `<div id="modalWrapper"><div id="modal"><iframe id="iframe" width="560" height="315" src="https://www.youtube.com/embed/${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>`;
  $("#wrapper").append(iframe);
});

$(document).on("keydown", function(event) {
 if (event.key == "Escape") {
   $("#wrapper #modalWrapper").remove()
 }
});

$("#wrapper").click(function(e) {
  if(e.target.id === "modalWrapper") {
    $("#wrapper #modalWrapper").remove();
  };
});
$("#close").click(function(e) {
  $("#tool").toggleClass("hidden")
})
$("#menu").click(function(e) {
  $("#tool").toggleClass("hidden")
})

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||| DIAGNOSTICS |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Add column and row values
$("input#columns").val(grid.columns);
$("input#rows").val(grid.rows);
$("input#gutter").val(grid.gutter);
$("input#gridSize").val(grid.cells);
