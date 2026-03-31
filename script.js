class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerDisplay = document.querySelector('.player-turn');
        this.modal = document.getElementById('gameModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');
        
        this.initializeGame();
        this.loadScores();
    }
    
    initializeGame() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('resetScoreBtn').addEventListener('click', () => this.resetScores());
        document.getElementById('modalPlayAgain').addEventListener('click', () => {
            this.hideModal();
            this.resetGame();
        });
        
        this.updateDisplay();
    }
    
    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.makeMove(index);
    }
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.updateCell(index);
        this.checkResult();
    }
    
    updateCell(index) {
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer;
        cell.classList.add('taken', this.currentPlayer.toLowerCase());
        
        // Add sparkle effect
        this.createSparkles(cell);
    }
    
    createSparkles(cell) {
        const rect = cell.getBoundingClientRect();
        const sparkles = 6;
        
        for (let i = 0; i < sparkles; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.left = rect.left + rect.width / 2 + 'px';
            sparkle.style.top = rect.top + rect.height / 2 + 'px';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.background = this.currentPlayer === 'X' ? '#ff6b9d' : '#c66cfd';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = `sparkle 0.8s ease-out forwards`;
            sparkle.style.transform = `rotate(${i * 60}deg) translateX(20px)`;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 800);
        }
    }
    
    checkResult() {
        let roundWon = false;
        let winningCombination = [];
        
        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                roundWon = true;
                winningCombination = [a, b, c];
                break;
            }
        }
        
        if (roundWon) {
            this.handleWin(winningCombination);
            return;
        }
        
        if (!this.board.includes('')) {
            this.handleDraw();
            return;
        }
        
        this.switchPlayer();
    }
    
    handleWin(winningCombination) {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.saveScores();
        
        // Highlight winning cells
        winningCombination.forEach(index => {
            this.cells[index].classList.add('winner');
        });
        
        // Create celebration effect
        this.createCelebration();
        
        const playerName = this.currentPlayer === 'X' ? '💖 Player X' : '💜 Player O';
        this.showModal('🎉 Victory! 🎉', `${playerName} wins the game!`);
    }
    
    handleDraw() {
        this.gameActive = false;
        this.showModal('🤝 Draw! 🤝', "It's a tie! Well played both!");
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }
    
    updateDisplay() {
        const playerDisplay = this.currentPlayer === 'X' ? '💖 X' : '💜 O';
        this.currentPlayerDisplay.textContent = playerDisplay;
        this.currentPlayerDisplay.style.color = this.currentPlayer === 'X' ? '#ff6b9d' : '#c66cfd';
    }
    
    updateScores() {
        this.scoreXDisplay.textContent = this.scores.X;
        this.scoreODisplay.textContent = this.scores.O;
        
        // Animate score update
        this.scoreXDisplay.style.animation = 'pulse 0.5s ease';
        this.scoreODisplay.style.animation = 'pulse 0.5s ease';
        
        setTimeout(() => {
            this.scoreXDisplay.style.animation = '';
            this.scoreODisplay.style.animation = '';
        }, 500);
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken', 'x', 'o', 'winner');
        });
        
        this.updateDisplay();
    }
    
    resetScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
        this.saveScores();
        
        // Visual feedback
        this.scoreXDisplay.style.animation = 'shake 0.5s ease';
        this.scoreODisplay.style.animation = 'shake 0.5s ease';
        
        setTimeout(() => {
            this.scoreXDisplay.style.animation = '';
            this.scoreODisplay.style.animation = '';
        }, 500);
    }
    
    showModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.classList.add('show');
    }
    
    hideModal() {
        this.modal.classList.remove('show');
    }
    
    createCelebration() {
        const colors = ['#ff6b9d', '#c66cfd', '#feca57', '#48dbfb', '#ff9ff3'];
        const celebrationCount = 20;
        
        for (let i = 0; i < celebrationCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = '-20px';
                particle.style.width = '10px';
                particle.style.height = '10px';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1001';
                particle.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 4000);
            }, i * 100);
        }
    }
    
    saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }
    
    loadScores() {
        const savedScores = localStorage.getItem('ticTacToeScores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
            this.updateScores();
        }
    }
}

// Add custom animations to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: rotate(var(--rotation)) translateX(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: rotate(var(--rotation)) translateX(40px) scale(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Add some interactive background effects
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.background = `
        radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
        radial-gradient(circle at ${(1 - x) * 100}% ${(1 - y) * 100}%, rgba(221, 160, 221, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%)
    `;
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        const cell = document.querySelectorAll('.cell')[index];
        if (cell && !cell.classList.contains('taken')) {
            cell.click();
        }
    }
    
    if (e.key === 'r' || e.key === 'R') {
        document.getElementById('resetBtn').click();
    }
});
