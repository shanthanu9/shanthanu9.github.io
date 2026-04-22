const gridEl = document.getElementById('grid');
const rowsInput = document.getElementById('rowsInput');
const colsInput = document.getElementById('colsInput');
const newBtn = document.getElementById('newBtn');
const undoBtn = document.getElementById('undoBtn');
const hintBtn = document.getElementById('hintBtn');
const currentPlayerEl = document.getElementById('currentPlayer');
const messageEl = document.getElementById('message');

// TODO: Bad practice! Using global variables!
let rows = 6, cols = 6;
let token = { r: rows - 1, c: 0 };
let currentPlayer = 'A';
let history = [];

/* ---------------- CREATE NEW GRID ---------------- */
function createGrid(r, c) {
  rows = r; cols = c;

  gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gridEl.innerHTML = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = row;
      cell.dataset.c = col;
      cell.id = `cell-pos: (${row}, ${col})`;

      // Don't need to add coordinates
      // const coord = document.createElement('div');
      // coord.className = 'coord';
      // coord.textContent = `${row},${col}`;
      // cell.appendChild(coord);

      
      // Specially denote end cell
      if (row === 0 && col === cols - 1) {
        cell.classList.add("end");
      }

      cell.addEventListener('click', () => onCellClick(row, col, cell));
      gridEl.appendChild(cell);
    }
  }
}

/* ---------------- START GAME ---------------- */
function startGame(r, c) {
  createGrid(r, c);
  token = { r: rows - 1, c: 0 };
  currentPlayer = 'A';
  history = [];

  updatePlayerLabel();
  render();
  setMessage("Click a highlighted square.");
}

/* ---------------- RENDER ---------------- */
function render() {
  document.querySelectorAll('.cell').forEach(el => {
    el.classList.remove('legal', 'invalid');
    const existing = el.querySelector('.token');
    if (existing) existing.remove();
  });

  const idx = token.r * cols + token.c;
  const cell = gridEl.children[idx];

  const tokenEl = document.createElement('div');
  tokenEl.className = `token player-${currentPlayer.toLowerCase()}`;
  tokenEl.textContent = currentPlayer;
  cell.appendChild(tokenEl);

  highlightLegalMoves();
}

/* ---------------- LEGAL MOVES ---------------- */
function highlightLegalMoves() {
  for (let c = token.c + 1; c < cols; c++) {
    gridEl.children[token.r * cols + c].classList.add('legal');
  }
  for (let r = 0; r < token.r; r++) {
    gridEl.children[r * cols + token.c].classList.add('legal');
  }
}

function isLegalMove(r, c) {
  if (r === token.r && c > token.c) return true;
  if (c === token.c && r < token.r) return true;
  return false;
}

/* ---------------- MOVE HANDLING ---------------- */
function onCellClick(r, c, el) {
  if (!isLegalMove(r, c)) {
    el.classList.add('invalid');
    setTimeout(() => el.classList.remove('invalid'), 220);
    setMessage("Illegal move. Move right or up only.", true);
    return;
  }

  history.push({ token: { ...token }, player: currentPlayer });

  token.r = r;
  token.c = c;

  if (token.r === 0 && token.c === cols - 1) {
    render();
    setMessage(`Player ${currentPlayer} wins! 🎉`);
    currentPlayerEl.textContent = `Winner: Player ${currentPlayer}`;
    return;
  }

  currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
  updatePlayerLabel();
  render();
}

/* --------- HIGHLIGHT DIAGONAL SQUARES --------- */
function highlightDiagonalEntries() {
  for (let row = 0; row < rows; row++) {
    const col = cols - row - 1;
    const cell = document.getElementById(`cell-pos: (${row}, ${col})`);
    if (cell !== null) {
      cell.classList.toggle("highlight");
    }
  }

  setMessage("Highlighted diagonal entries.");
}

/* ---------------- UI HELPERS ---------------- */
function updatePlayerLabel() {
  currentPlayerEl.textContent = `Player ${currentPlayer}'s turn`;
  currentPlayerEl.className = `player-pill pill-${currentPlayer.toLowerCase()}`;
}

function setMessage(text, error = false) {
  messageEl.textContent = text;
  messageEl.style.color = error ? "#a33" : "#556";
}

/* ---------------- UNDO ---------------- */
undoBtn.addEventListener('click', () => {
  if (history.length === 0) {
    setMessage("Nothing to undo.", true);
    return;
  }
  const last = history.pop();
  token = last.token;
  currentPlayer = last.player;
  updatePlayerLabel();
  render();
  setMessage("Undid last move.");
});

/* ---------------- NEW GAME ---------------- */
newBtn.addEventListener('click', () => {
  const r = parseInt(rowsInput.value) || 6;
  const c = parseInt(colsInput.value) || 6;

  if (r < 2 || c < 2) {
    setMessage("Rows and columns must be at least 2.", true);
    return;
  }
  startGame(r, c);
});

/* -------------- HIGHLIGHT -------------- */
hintBtn.addEventListener('click', () => {
  highlightDiagonalEntries();
});

/* Start initial */
startGame(6, 6);
