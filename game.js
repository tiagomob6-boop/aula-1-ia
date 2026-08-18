// Elementos do DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const livesSpan = document.getElementById('lives');
const levelSpan = document.getElementById('level');
const statusDiv = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

// Tamanho da grade
const COLS = 28;
const ROWS = 21;
let CELL_SIZE = 20;  // Será calculado dinamicamente

// Estados do jogo
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;
let level = 1;
let pelletsRemaining = 0;

// Controle de velocidade
let frameCounter = 0;
const PACMAN_SPEED = 2;  // Pac-Man se move a cada 2 frames (mais rápido/fluido)
const GHOST_SPEED = 2;   // Fantasmas se movem a cada 2 frames (mais rápido/fluido)
const POWER_UP_DURATION = 300;  // Duração do power-up em frames (~5 segundos)
const POWER_UP_SPAWN_CHANCE = 0.02;  // Chance de spawnar fruta de poder

// Mapa do jogo (1 = parede, 0 = caminho)
let maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1],
    [1,1,1,1,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,1,1,1,1],
    [1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,0,1,1,1,1,1],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1],
    [1,1,1,1,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,1,1,1,1],
    [1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Comida no mapa
let pellets = [];
let powerUps = [];

function wrapPosition(x, y) {
    if (y === 10 && (x < 0 || x >= COLS)) {
        return {
            x: x < 0 ? COLS - 1 : 0,
            y,
        };
    }

    return { x, y };
}

// Classe Pac-Man
class PacMan {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.nextX = x;
        this.nextY = y;
        this.direction = 0; // 0=parado, 1=cima, 2=baixo, 3=esquerda, 4=direita
        this.nextDirection = 0;
        this.mouthOpen = false;
        this.frameCounter = 0;
        this.powerUpTimer = 0;  // Contador para o poder invencível
        this.isInvincible = false;  // Estado de invencibilidade
    }

    update() {
        // Controlar duração do poder invencível
        if (this.isInvincible) {
            this.powerUpTimer--;
            if (this.powerUpTimer <= 0) {
                this.isInvincible = false;
                this.powerUpTimer = 0;
            }
        }
        
        this.frameCounter++;
        
        // Apenas se move a cada PACMAN_SPEED frames
        if (this.frameCounter < PACMAN_SPEED) return;
        
        this.frameCounter = 0;
        
        // Tentar mover na próxima direção
        if (this.canMove(this.nextX, this.nextY, this.nextDirection)) {
            this.direction = this.nextDirection;
        }

        // Tentar mover na direção atual
        let newX = this.x;
        let newY = this.y;

        if (this.direction === 1) newY--; // cima
        if (this.direction === 2) newY++; // baixo
        if (this.direction === 3) newX--; // esquerda
        if (this.direction === 4) newX++; // direita

        const wrapped = wrapPosition(newX, newY);
        if (this.canMove(newX, newY, this.direction)) {
            this.x = wrapped.x;
            this.y = wrapped.y;
        }

        this.mouthOpen = !this.mouthOpen;
    }

    canMove(x, y, dir) {
        const wrapped = wrapPosition(x, y);
        x = wrapped.x;
        y = wrapped.y;

        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
        if (maze[y][x] === 1) return false;
        return true;
    }

    draw() {
        const size = CELL_SIZE - 2;
        const mouthSize = this.mouthOpen ? 4 : 2;
        
        // Cor muda quando invencível (pisca entre amarelo e branco)
        if (this.isInvincible) {
            ctx.fillStyle = this.powerUpTimer % 20 < 10 ? '#FFFFFF' : '#FFD700';
        } else {
            ctx.fillStyle = '#FFD700';
        }
        
        ctx.beginPath();
        
        const startAngle = (this.direction === 4 ? 0 : this.direction === 3 ? Math.PI : 
                           this.direction === 1 ? Math.PI * 1.5 : Math.PI * 0.5);
        
        ctx.arc(
            this.x * CELL_SIZE + CELL_SIZE / 2,
            this.y * CELL_SIZE + CELL_SIZE / 2,
            size / 2,
            startAngle + mouthSize * 0.1,
            startAngle + Math.PI * 2 - mouthSize * 0.1
        );
        
        ctx.lineTo(this.x * CELL_SIZE + CELL_SIZE / 2, this.y * CELL_SIZE + CELL_SIZE / 2);
        ctx.fill();
    }
}

// Classe Fantasma
class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = Math.floor(Math.random() * 4) + 1;
        this.moveCounter = 0;
        this.frameCounter = 0;
    }

    update(pacman) {
        this.frameCounter++;
        
        // Apenas se move a cada GHOST_SPEED frames
        if (this.frameCounter < GHOST_SPEED) return;
        
        this.frameCounter = 0;
        
        // IA básica do fantasma
        this.moveCounter++;
        
        if (this.moveCounter > 30) {
            // Perseguir Pac-Man ou se mover aleatoriamente
            const dx = pacman.x - this.x;
            const dy = pacman.y - this.y;
            
            if (Math.random() > 0.3) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.direction = dx > 0 ? 4 : 3;
                } else {
                    this.direction = dy > 0 ? 2 : 1;
                }
            } else {
                this.direction = Math.floor(Math.random() * 4) + 1;
            }
            
            this.moveCounter = 0;
        }

        let newX = this.x;
        let newY = this.y;

        if (this.direction === 1) newY--;
        if (this.direction === 2) newY++;
        if (this.direction === 3) newX--;
        if (this.direction === 4) newX++;

        const wrapped = wrapPosition(newX, newY);
        newX = wrapped.x;
        newY = wrapped.y;

        if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS && maze[newY][newX] !== 1) {
            this.x = newX;
            this.y = newY;
        } else {
            this.direction = Math.floor(Math.random() * 4) + 1;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * CELL_SIZE + 1, this.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        
        // Olhos
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x * CELL_SIZE + 4, this.y * CELL_SIZE + 4, 3, 3);
        ctx.fillRect(this.x * CELL_SIZE + 13, this.y * CELL_SIZE + 4, 3, 3);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x * CELL_SIZE + 5, this.y * CELL_SIZE + 5, 1, 1);
        ctx.fillRect(this.x * CELL_SIZE + 14, this.y * CELL_SIZE + 5, 1, 1);
    }
}

// Classe PowerUp (Fruta de Poder)
class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = 'invincible';  // Tipo de poder
    }

    draw() {
        // Desenha uma maçã/fruta piscante
        ctx.fillStyle = '#FF1493';  // Rosa/Magenta
        ctx.beginPath();
        ctx.arc(
            this.x * CELL_SIZE + CELL_SIZE / 2,
            this.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Desenha um brilho
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(
            this.x * CELL_SIZE + CELL_SIZE / 2 - 3,
            this.y * CELL_SIZE + CELL_SIZE / 2 - 3,
            3,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

// Inicializar jogo
let pacman;
let ghosts = [];

function initGame() {
    pacman = new PacMan(1, 1);
    ghosts = [
        new Ghost(13, 10, '#FF0000'),  // Vermelho
        new Ghost(12, 11, '#FFB8FF'),  // Rosa
        new Ghost(13, 11, '#00FFFF'),  // Ciano
        new Ghost(14, 11, '#FFB847'),  // Laranja
    ];

    // Criar pellets
    pellets = [];
    powerUps = [];  // Limpar power-ups
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (maze[y][x] === 0) {
                pellets.push({ x, y });
            }
        }
    }
    pelletsRemaining = pellets.length;
}

// Controles do teclado
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (pacman) {
        if (e.key === 'ArrowUp') pacman.nextDirection = 1;
        if (e.key === 'ArrowDown') pacman.nextDirection = 2;
        if (e.key === 'ArrowLeft') pacman.nextDirection = 3;
        if (e.key === 'ArrowRight') pacman.nextDirection = 4;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Botões
startBtn.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        score = 0;
        lives = 3;
        level = 1;
        initGame();
        updateUI();
        statusDiv.textContent = 'Jogo iniciado! Use as setas para mover.';
        pauseBtn.textContent = 'Pausar';
        gameLoop();
    }
});

pauseBtn.addEventListener('click', () => {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Continuar' : 'Pausar';
        statusDiv.textContent = gamePaused ? 'Jogo pausado' : 'Jogo retomado';
        if (!gamePaused) gameLoop();
    }
});

// Atualizar interface
function updateUI() {
    scoreSpan.textContent = score;
    livesSpan.textContent = lives;
    levelSpan.textContent = level;
}

// Loop principal
function gameLoop() {
    if (!gameRunning || gamePaused) return;

    // Atualizar
    pacman.update();
    ghosts.forEach(ghost => ghost.update(pacman));

    // Verificar colisão com comida
    pellets = pellets.filter(p => {
        if (p.x === pacman.x && p.y === pacman.y) {
            score += 10;
            pelletsRemaining--;
            return false;
        }
        return true;
    });

    // Verificar colisão com power-ups (frutas)
    powerUps = powerUps.filter(p => {
        if (pacman && p.x === pacman.x && p.y === pacman.y) {
            pacman.isInvincible = true;
            pacman.powerUpTimer = POWER_UP_DURATION;
            score += 100;
            statusDiv.textContent = '🔥 MODO INVENCÍVEL! Você pode comer fantasmas!';
            return false;  // Remove o power-up
        }
        return true;
    });

    // Verificar colisão com fantasmas
    for (let i = ghosts.length - 1; i >= 0; i--) {
        let ghost = ghosts[i];
        if (pacman && ghost.x === pacman.x && ghost.y === pacman.y) {
            if (pacman.isInvincible) {
                // Pac-Man come o fantasma enquanto invencível
                score += 500;
                statusDiv.textContent = '💥 Fantasma comido! +500 pontos!';
                ghosts.splice(i, 1);
                // Spawnar novo fantasma após um tempo
                setTimeout(() => {
                    ghosts.push(new Ghost(13, 9, ghost.color));
                }, 2000);
            } else {
                // Perder uma vida
                lives--;
                if (lives <= 0) {
                    gameRunning = false;
                    statusDiv.textContent = `Game Over! Pontuação final: ${score}`;
                    return;
                } else {
                    initGame();
                    statusDiv.textContent = `Perdeu uma vida! Vidas restantes: ${lives}`;
                    updateUI();
                }
            }
        }
    }

    // Spawnar power-up aleatoriamente
    if (Math.random() < POWER_UP_SPAWN_CHANCE && powerUps.length === 0) {
        let randomX, randomY;
        do {
            randomX = Math.floor(Math.random() * COLS);
            randomY = Math.floor(Math.random() * ROWS);
        } while (maze[randomY][randomX] === 1 || (randomX === pacman.x && randomY === pacman.y));
        
        powerUps.push(new PowerUp(randomX, randomY));
    }

    // Verificar vitória
    if (pelletsRemaining === 0) {
        level++;
        score += 1000;
        initGame();
        statusDiv.textContent = `Nível ${level}! Continue coletando as bolinhas!`;
        updateUI();
    }

    // Desenhar
    draw();
    updateUI();

    requestAnimationFrame(gameLoop);
}

// Desenhar tudo
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar paredes
    ctx.fillStyle = '#0066FF';
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                // Bordas da parede
                ctx.strokeStyle = '#0099FF';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    // Desenhar pellets
    ctx.fillStyle = '#FFAA00';
    pellets.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * CELL_SIZE + CELL_SIZE / 2, p.y * CELL_SIZE + CELL_SIZE / 2, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenhar power-ups (frutas)
    powerUps.forEach(p => p.draw());

    // Desenhar Pac-Man
    if (pacman) pacman.draw();

    // Desenhar fantasmas
    ghosts.forEach(ghost => ghost.draw());
}

// Inicialização
statusDiv.textContent = 'Clique em "Iniciar Jogo" para começar!';
draw();

// Redimensionar canvas para tela cheia
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Calcular tamanho da célula para preencher a tela
    const cellSizeByWidth = Math.floor(canvas.width / COLS);
    const cellSizeByHeight = Math.floor(canvas.height / ROWS);
    CELL_SIZE = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // Garantir tamanho mínimo
    if (CELL_SIZE < 10) CELL_SIZE = 10;
    
    draw();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
