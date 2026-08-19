# Registro do uso de IA

## 1. Prompt inicial, ainda vago

> Adicione uma nova funcionalidade ao meu jogo de Pac-Man e refatore o código.

Esse pedido não definia qual problema deveria ser resolvido, onde a mudança deveria acontecer nem como verificar o resultado.

## 2. Prompt refinado

> Analise o jogo de Pac-Man existente em `index.html`, `style.css` e `game.js`. Implemente uma funcionalidade pequena e coerente com o projeto: um recorde persistente entre partidas usando `localStorage`. Mostre o recorde junto da pontuação atual, atualize-o apenas quando a pontuação superar o valor salvo e mantenha os controles e a lógica de movimento existentes. .

O refinamento definiu o objetivo, a restrição de escopo, o local de integração, o comportamento esperado e os critérios de validação.

## 3. Refatoração realizada

- Centralizei a atualização do recorde em `updateUI()`, que já é o ponto comum de atualização dos indicadores.
- Usei uma chave explícita, `pacmanHighScore`, para evitar misturar o dado com outras informações do navegador.
- Mantive a lógica de pontuação, movimento, vidas, pausa e níveis sem alterações desnecessárias.
- Adicionei o indicador `Recorde` ao painel existente e documentei a execução no `README.md`.

## 4. Sugestão da IA ajustada

A sugestão inicial era adicionar um botão para **resetar o recorde**. Decidi não incluir esse botão nesta versão porque ele não era necessário para a funcionalidade principal e acrescentaria uma ação destrutiva à interface, com necessidade de confirmação e mais estados para tratar. O recorde pode continuar simples e persistente, mantendo o foco do jogo.
