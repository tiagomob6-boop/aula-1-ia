# Registro do uso de IA

# Finalidade e organização identificadas

O projeto é um jogo de Pac-Man desenvolvido sem dependências externas. O `index.html` organiza a interface e os indicadores da partida, o `style.css` posiciona o jogo em tela cheia e o `game.js` controla o mapa, os personagens, as colisões, a pontuação, o loop e o recorde salvo no navegador.

# 1. Prompt inicial, ainda vago

> Adicione uma nova funcionalidade ao meu jogo de Pac-Man e refatore o código.

Esse pedido não definia qual problema deveria ser resolvido, onde a mudança deveria acontecer nem como verificar o resultado.

# 2. Prompt intermediário

> Analise meu jogo de Pac-Man em HTML, CSS e JavaScript. Sugira uma funcionalidade simples para melhorar a experiência em celulares e refatore algum trecho repetido sem alterar as regras atuais.

Esse pedido já indicava o público e a restrição, mas ainda não definia como a funcionalidade deveria ser validada.

# 3. Prompt refinado

> Analise o jogo de Pac-Man existente em `index.html`, `style.css` e `game.js`. Implemente uma funcionalidade pequena e coerente com o projeto: um recorde persistente entre partidas usando `localStorage`. Mostre o recorde junto da pontuação atual, atualize-o apenas quando a pontuação superar o valor salvo e mantenha os controles e a lógica de movimento existentes. .

O refinamento definiu o objetivo, a restrição de escopo, o local de integração, o comportamento esperado e os critérios de validação.

# 4. Implementação e refatoração realizadas

- Adicionei quatro botões direcionais que aparecem em telas de até 600 pixels.
- Fiz os botões reutilizarem a mesma propriedade `pacman.nextDirection` usada pelo teclado.
- Centralizei a alteração de direção na função `setDirection()`, removendo comparações repetidas no evento de teclado.
- Mantive a lógica de pontuação, movimento, vidas, pausa, níveis e recorde sem alterações desnecessárias.
- Atualizei o `README.md` com a nova forma de controle e a justificativa da refatoração.

# 5. Sugestão da IA ajustada

A sugestão foi implementar gestos de arrastar para controlar o personagem. Ajustei essa ideia para botões direcionais porque eles são mais visíveis para iniciantes, têm comportamento previsível, melhorando a acessibilidade. A decisão mantém o escopo pequeno e deixa os gestos como possível evolução futura.
