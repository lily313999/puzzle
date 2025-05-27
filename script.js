const puzzle = document.getElementById("puzzle");
const moveCounter = document.createElement("div");
moveCounter.id = "move-counter";
moveCounter.textContent = "步數：0";
document.getElementById("game-container").appendChild(moveCounter);

const levels = [
  "puzzle1.jpg",
  "puzzle2.jpg",
  "puzzle3.jpg",
  "puzzle4.jpg"
];

let tiles = [];
let emptyIndex = 8;
let currentLevel = 0;
let gameCompleted = false;
let moveCount = 0;

function createTiles(image) {
  puzzle.innerHTML = "";
  tiles = [];
  gameCompleted = false;
  moveCount = 0;
  moveCounter.textContent = "步數：0";

  let indices;
  do {
    indices = [...Array(8).keys()];
    shuffleArray(indices);
  } while (!isSolvable(indices));

  indices.push(8);

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.index = i;
    tile.addEventListener("click", () => moveTile(i));

    if (indices[i] === 8) {
      tile.classList.add("empty");
      emptyIndex = i;
    } else {
      const x = (indices[i] % 3) * 100 / 2;
      const y = Math.floor(indices[i] / 3) * 100 / 2;
      tile.style.backgroundImage = `url('${image}')`;
      tile.style.backgroundPosition = `${x}% ${y}%`;
    }

    tiles.push(tile);
    puzzle.appendChild(tile);
  }
}

function moveTile(index) {
  if (gameCompleted) return;

  const validMoves = [index - 1, index + 1, index - 3, index + 3];
  if (
    validMoves.includes(emptyIndex) &&
    Math.abs((emptyIndex % 3) - (index % 3)) <= 1 &&
    Math.abs(Math.floor(emptyIndex / 3) - Math.floor(index / 3)) <= 1
  ) {
    swapTiles(index, emptyIndex);
    emptyIndex = index;
    moveCount++;
    moveCounter.textContent = `步數：${moveCount}`;
    checkComplete();
  }
}

function swapTiles(i, j) {
  [tiles[i].style.backgroundImage, tiles[j].style.backgroundImage] = [tiles[j].style.backgroundImage, tiles[i].style.backgroundImage];
  [tiles[i].style.backgroundPosition, tiles[j].style.backgroundPosition] = [tiles[j].style.backgroundPosition, tiles[i].style.backgroundPosition];
  tiles[i].classList.toggle("empty");
  tiles[j].classList.toggle("empty");
}

function checkComplete() {
  for (let i = 0; i < 8; i++) {
    const x = (i % 3) * 100 / 2;
    const y = Math.floor(i / 3) * 100 / 2;
    if (tiles[i].style.backgroundPosition !== `${x}% ${y}%`) return;
  }

  const tile = document.createElement("div");
  tile.className = "tile";
  tile.style.overflow = "hidden";

  const img = document.createElement("img");
  img.src = levels[currentLevel].replace('.jpg', '-last.jpg');
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  tile.appendChild(img);

  puzzle.replaceChild(tile, tiles[emptyIndex]);
  gameCompleted = true;
}

function setLevel(level) {
  currentLevel = level;
  createTiles(levels[level]);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isSolvable(arr) {
  let invCount = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) invCount++;
    }
  }
  return invCount % 2 === 0;
}

window.onload = () => setLevel(0);
