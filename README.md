# Pac-Man em JavaScript

Um jogo de Pac-Man feito com HTML, CSS e JavaScript.

## Funcionalidades

- Movimento por teclado com as setas.
- Coleta de bolinhas e progressão por níveis.
- Fantasmas com movimentação e perseguição simples.
- Frutas de poder que deixam o Pac-Man invencível.
- Sistema de vidas, pausa e reinício.
- Recorde persistente salvo no navegador com `localStorage`.
- Layout em tela cheia com redimensionamento responsivo do canvas.

## Como executar

1. Abra o arquivo `index.html` em um navegador moderno.
2. Clique em **Iniciar Jogo**.
3. Use as setas do teclado para controlar o Pac-Man.

Não há dependências ou etapa de compilação. Para testar o recorde, jogue uma partida, obtenha pontos e recarregue a página: o maior valor continuará visível.

## Estrutura

- `index.html`: estrutura da página, indicadores e controles.
- `style.css`: aparência e posicionamento da interface.
- `game.js`: mapa, entidades, regras, loop e persistência do recorde.
