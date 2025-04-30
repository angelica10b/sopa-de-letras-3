document.addEventListener("DOMContentLoaded", function () {
    const niveles = {
      facil: ["SOL", "LUNA", "MAR", "RIO", "AVE"],
      medio: ["HTML", "CSS", "WEB", "NUBE", "SCRIPT"],
      dificil: ["JAVASCRIPT", "PROGRAMACION", "ALGORITMO", "DESARROLLO", "VARIABLE"]
    };
  
    const gridSize = 12;
    let selectedCells = [];
    let grid = [];
    const nivelSelect = document.getElementById("nivel");
    const wordListElement = document.getElementById("word-list");
    const message = document.getElementById("message");
  
    nivelSelect.addEventListener("change", () => {
      generarSopa(nivelSelect.value);
    });
  
    function generarSopa(nivel) {
      selectedCells = [];
      grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
      const words = niveles[nivel];
      wordListElement.innerHTML = "<strong>Palabras:</strong> " + words.join(", ");
      placeWords(words);
      fillGrid();
      drawGrid(words);
    }
  
    function placeWords(words) {
      words.forEach(word => {
        let row, col;
        let intentos = 0;
        do {
          row = Math.floor(Math.random() * gridSize);
          col = Math.floor(Math.random() * (gridSize - word.length + 1));
          intentos++;
          if (intentos > 100) return; // evitar bucles infinitos
        } while (!canPlaceWord(word, row, col));
  
        for (let i = 0; i < word.length; i++) {
          grid[row][col + i] = word[i];
        }
      });
    }
  
    function canPlaceWord(word, row, col) {
      for (let i = 0; i < word.length; i++) {
        const current = grid[row][col + i];
        if (current !== "" && current !== word[i]) return false;
      }
      return true;
    }
  
    function fillGrid() {
      const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (grid[i][j] === "") {
            grid[i][j] = letras[Math.floor(Math.random() * letras.length)];
          }
        }
      }
    }
  
    function drawGrid(words) {
      const gridElement = document.getElementById("grid");
      gridElement.innerHTML = "";
      gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
  
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          cell.textContent = grid[i][j];
          cell.dataset.row = i;
          cell.dataset.col = j;
          cell.addEventListener("click", () => selectCell(cell, words));
          gridElement.appendChild(cell);
        }
      }
    }
  
    function selectCell(cell, words) {
      cell.classList.toggle("selected");
  
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const index = selectedCells.findIndex(c => c.row === row && c.col === col);
  
      if (index >= 0) {
        selectedCells.splice(index, 1);
      } else {
        selectedCells.push({ row, col, letter: cell.textContent, element: cell });
      }
  
      checkSelectedWord(words);
    }
  
    function checkSelectedWord(words) {
      const selectedWord = selectedCells.map(c => c.letter).join("");
      const reversedWord = selectedWord.split("").reverse().join("");
  
      if (words.includes(selectedWord) || words.includes(reversedWord)) {
        selectedCells.forEach(c => {
          c.element.classList.remove("selected");
          c.element.classList.add("found");
        });
        selectedCells = [];
        message.textContent = "¡Palabra encontrada!";
        setTimeout(() => (message.textContent = ""), 2000);
      }
    }
  
    generarSopa("facil"); // iniciar con nivel fácil
  });
  