# Pac-Man em JavaScript

Um jogo de Pac-Man feito com HTML, CSS e JavaScript.

## Funcionalidades

- Movimento por teclado com as setas.
- Coleta de bolinhas e progressão por níveis.
- Fantasmas com movimentação e perseguição simples.
- Frutas de poder que deixam o Pac-Man invencível.
- Controles direcionais por toque em telas pequenas.
- Sistema de vidas, pausa e reinício.
- Recorde persistente salvo no navegador com `localStorage`.
- Layout em tela cheia com redimensionamento responsivo do canvas.

## Como executar

1. Abra o arquivo `index.html` em um navegador moderno.
2. Clique em **Iniciar Jogo**.
3. Use as setas do teclado para controlar o Pac-Man.

Em celulares ou tablets, use os quatro botões direcionais exibidos na parte inferior da tela.

Não há dependências ou etapa de compilação. Para testar o recorde, jogue uma partida, obtenha pontos e recarregue a página: o maior valor continuará visível.

## Estrutura

- `index.html`: estrutura da página, indicadores e controles.
- `style.css`: aparência e posicionamento da interface.
- `game.js`: mapa, entidades, regras, loop e persistência do recorde.

## Refatoração com IA

O tratamento das direções foi centralizado na função `setDirection()`. Assim, o teclado e os controles de toque usam a mesma regra para alterar o próximo movimento do Pac-Man, evitando lógica duplicada.

Uma sugestão considerada foi implementar gestos de arrastar para controlar o personagem. Optei pelos botões direcionais porque são mais fáceis de descobrir, funcionam melhor para iniciantes e oferecem rótulos acessíveis para leitores de tela. Gestos podem ser uma melhoria futura.
