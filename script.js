const puzzle = document.getElementById("puzzle");
const moveCounter = document.createElement("div");
moveCounter.id = "move-counter";
moveCounter.textContent = "步數：0";
document.getElementById("game-container").appendChild(moveCounter);

const levels = [
  "puzzle1.jpg",
  "puzzle2.jpg",
  "puzzle3.jpg",
  "puzzle4.jpg",
  "puzzle5" // 第五關使用裁切圖
];

let tiles = [];
let emptyIndex = 8;
let currentLevel = 0;
let gameCompleted = false;
let moveCount = 0;

let clickCount = 0;
let lastClickedLevel = null;

function createStandardTiles(image) {
  let indices;
  do {
    indices = [...Array(8).keys()];
    shuffleArray(indices);
  } while (!isSolvable(indices));
  indices.push(8); // 最後一格為空白

  tiles = [];
  puzzle.innerHTML = "";
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
      tile.style.backgroundSize = `300% 300%`;
    }

    tiles.push(tile);
    puzzle.appendChild(tile);
  }
}

function createPuzzle5Tiles(imageBase) {
  let indices;
  do {
    indices = [0, 1, 2, 4, 5, 6, 7, 8]; // 排除 index 3（第4塊）
    shuffleArray(indices);
  } while (!isSolvable(indices));

  indices.splice(3, 0, 9); // 在 index 3 插入空白

  tiles = [];
  puzzle.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.index = i;
    tile.addEventListener("click", () => moveTile(i));

    const tileIndex = indices[i];
    if (tileIndex === 9) {
      tile.classList.add("empty");
      emptyIndex = i;
    } else {
      const img = document.createElement("img");
      img.src = `${imageBase}-part${tileIndex}.jpg`;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      tile.appendChild(img);
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
    if (currentLevel === 4) {
      checkPuzzle5Complete();
    } else {
      checkStandardComplete();
    }
  }
}

function swapTiles(i, j) {
  [tiles[i].innerHTML, tiles[j].innerHTML] = [tiles[j].innerHTML, tiles[i].innerHTML];
  [tiles[i].style.backgroundImage, tiles[j].style.backgroundImage] = [tiles[j].style.backgroundImage, tiles[i].style.backgroundImage];
  [tiles[i].style.backgroundPosition, tiles[j].style.backgroundPosition] = [tiles[j].style.backgroundPosition, tiles[i].style.backgroundPosition];
  [tiles[i].style.backgroundSize, tiles[j].style.backgroundSize] = [tiles[j].style.backgroundSize, tiles[i].style.backgroundSize];
  tiles[i].classList.toggle("empty");
  tiles[j].classList.toggle("empty");
}

function checkStandardComplete() {
  for (let i = 0; i < 8; i++) {
    const tile = tiles[i];
    const x = (i % 3) * 100 / 2;
    const y = Math.floor(i / 3) * 100 / 2;

    if (
      tile.classList.contains("empty") ||
      tile.style.backgroundPosition !== `${x}% ${y}%`
    ) {
      return;
    }
  }

  const tile = document.createElement("div");
  tile.className = "tile";
  tile.style.overflow = "hidden";

  const img = document.createElement("img");
  img.src = levels[currentLevel].replace(".jpg", "-last.jpg");
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  tile.appendChild(img);

  puzzle.replaceChild(tile, tiles[emptyIndex]);
  gameCompleted = true;
}

function checkPuzzle5Complete() {
  const expected = [0, 1, 2, 4, 5, 6, 7, 8];
  let k = 0;
  for (let i = 0; i < 9; i++) {
    if (i === 3) continue;
    const img = tiles[i].querySelector("img");
    if (!img || !img.src.includes(`puzzle5-part${expected[k++]}.jpg`)) return;
  }

  const tile = document.createElement("div");
  tile.className = "tile";
  tile.style.overflow = "hidden";

  const img = document.createElement("img");
  img.src = "puzzle5-part3.jpg";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  tile.appendChild(img);

  puzzle.replaceChild(tile, tiles[3]);
  gameCompleted = true;
}

function setLevel(level) {
  if (level === 3) {
    if (lastClickedLevel !== 3) clickCount = 0;
    clickCount++;
    lastClickedLevel = 3;

    if (clickCount >= 30) {
      const level5 = document.getElementById("level5");
      if (level5) level5.style.display = "inline-block";
    }
  } else {
    clickCount = 0;
    lastClickedLevel = level;
  }

  currentLevel = level;
  gameCompleted = false;
  moveCount = 0;
  moveCounter.textContent = "步數：0";

  if (currentLevel === 4) {
    createPuzzle5Tiles(levels[4]);
  } else {
    createStandardTiles(levels[level]);
  }
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

function toggleInstructions() {
  const overlay = document.getElementById("instruction-overlay");
  overlay.style.display = (overlay.style.display === "flex") ? "none" : "flex";
}

window.onload = () => setLevel(0);
