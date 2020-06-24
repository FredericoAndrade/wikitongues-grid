"use strict";

const batch = require("./batch.js");
const rawData = require("./data.json");
// ES6 syntax below duplicates array instead of simply assigning a new variable name.
let availableData = [...rawData];
let usedData = [];
let latest = [];

class Grid {
  constructor(columns, rows, border) {
    this.columns = columns,
    this.rows = rows;
    this.border = border;
    this.borderColor = "white";
    this.context = "random";
    this.data = [];
  };
  get cells() {
    return this.columns * this.rows;
  };
};

class Cell {
  constructor(obj) {
    this.datum = obj ? obj : getRandomCell();
    this.title = this.datum.title;
    this.key = this.datum.id;
    this.image = this.datum.img;
    this.url = this.datum.youtube
    this.height = height / grid.rows;
    this.width = width / grid.columns;
    this.color = getRandomColor();
  };
};

const grid = new Grid(2,2,2);

let canvas = $("#canvas"),
height = canvas.innerHeight(),
width = canvas.innerWidth();

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||| DOM |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

( //Render Grid
  function() {
    getLatestDataHelper()
    let mql = window.matchMedia('(max-width: 600px)');
    if (mql.matches) {
      grid.columns = 1;
    } else {
      grid.columns = 2;
    }
    for (var i = 0; i <= grid.cells -1; i++) {
      let cell = getRandomCell()
      addCell(cell);
    };
    console.log(rawData.length)
  }()
);

// Create latest data array
function getLatestDataHelper() {
  for (var i = 0; i <= grid.cells - 1; i++) {
    latest.push(rawData[i])
  }
}

function updateGrid() {
  const context = grid.context;
  let currGridLen = canvas.children().length,
  targetGridLen = grid.cells,
  diff = targetGridLen - currGridLen;

  if( diff > 0 ) {
    for (var i = currGridLen; i <= targetGridLen - 1; i++) {
      if (context === "latest") {
        addCell(rawData[i]);
      } else {
        addCell();
      }
    };
  } else if ( diff < 0 ) {
    for (var i = (diff * -1) - 1; i >= 0; i--) {
      removeCells();
    }
  };
  updateCellSize();
};

function addCell(obj) {
  const cell = new Cell(obj);
  const prevData = grid.data;
  const newData = prevData.push(cell);
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
        border-width:${grid.border}px;
        border-color:${grid.borderColor};
        background-image:url('${cell.image}');
        "
      >
      </div>
    </div>
  `);
};

function removeCells() {
  console.log("removing each")
  const target = canvas.children().last().attr("data"),
  index = usedData.map(p => p.id).indexOf(target),
  removedCell = usedData[index];

  console.log("target: ",target)
  console.log($(canvas.children(`[data]=${target}`)))
  canvas.children().last().remove();
  usedData.splice(index,1);
  availableData.push(removedCell);
};

function randomizeAllCells() {
  console.log("randomizing all cells")
  console.log("setup; u:", usedData.length,"  a:", availableData.length)
  console.log("steps: ",grid.cells)
  const limit = grid.cells <= usedData.length ? grid.cells : usedData.length
  // while(usedData.length > 0) {
    console.log("removing")
    for (var i = limit - 1; i >= 0; i--) {
      console.log("  i:",i,"  u:", usedData.length,"  a:", availableData.length)
      removeCells()
    }
  // }
  console.log("reset; u:", usedData.length,"  a:", availableData.length)
  console.log("adding")
  for (var i = grid.cells - 1; i >= 0; i--) {
    console.log("  i:",i,"  u:", usedData.length,"  a:", availableData.length)
    // console.log("a:", availableData.length)
    addCell()
  }
}
function setLatestData() {
  console.log("setting latest data")
  console.log("setup; u:", usedData.length,"  a:", availableData.length)
  console.log("steps: ",grid.cells)
  console.log("removing")
  for (var i = 0; i <= grid.cells - 1; i++) {
    console.log("  i:",i,"  u:", usedData.length,"  a:", availableData.length)
    removeCells()
  }
  console.log("reset; u:", usedData.length,"  a:", availableData.length)
  console.log("adding")
  for (var i = 0; i <= grid.cells - 1; i++) {
    usedData.push(rawData[i])
    availableData.splice(i,1);
    addCell(rawData[i])
    console.log("  i:",i,"  u:", usedData.length,"  a:", availableData.length)
  }
}

function getRandomCell() {
  const index = Math.floor(Math.random()*availableData.length),
  cell = availableData[index];
  usedData.push(cell);
  availableData.splice(index,1);
  // console.log("u:", usedData.length)
  // console.log("a:", availableData.length)

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
  const target = e.target
  const preChange = grid[target.id]
  grid[target.id] = Number(this.value);
  if (rawData.length >= grid.cells) {
    console.log("updating")
    updateGrid();
  } else {
    target.value = preChange;
    alert("Error. Not enough additional data to display.")
    grid[target.id] = preChange;
  }

  $(".nucleus").css("border-width",`${grid.border}px`);
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
 event.key === "Escape" ? $("#wrapper #modalWrapper").remove() : undefined
});

$("#wrapper").click(function(e) {
  e.target.id === "modalWrapper" ? $("#wrapper #modalWrapper").remove() : undefined
});

$("#close").click(function(e) {
  $("#tool").toggleClass("hidden")
})

$("#menu").click(function(e) {
  $("#tool").toggleClass("hidden")
})

$("#random").click(function(e){
  grid.context = "random"
  randomizeAllCells()
})

$("#latest").click(function(e){
  grid.context = "latest"
  setLatestData()
})

$(".borderColor").click(function(e){
  const color = e.target.id;
  grid.borderColor = color;
  $("#canvas").css("border-color",color);
  $(".nucleus").css("border-color",color);
})

$("#details").click(function(e) {
  const gridData = grid.data.map(p => `<li><p>${p.key}</p></li>`).join('')
  $("#gridSize").parent().after(`
    <ol id="gridData">${gridData}</ol>
    `)
})
$()
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||| DIAGNOSTICS |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Add column and row values
$("input#columns").val(grid.columns);
$("input#rows").val(grid.rows);
$("input#border").val(grid.border);
$("input#gridSize").val(grid.cells);
