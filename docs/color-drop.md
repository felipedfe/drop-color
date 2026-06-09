# Color Drop

## Conceito

Color Drop é um jogo mobile de percepção visual e velocidade.

O jogador vê uma grade de cartas sobre um fundo preto. Cada carta exibe um símbolo gráfico. Um símbolo-alvo é exibido no topo da tela.

O objetivo é tocar em todas as cartas com o símbolo-alvo antes que o tempo acabe.

Ao tocar em uma carta correta, ela desaparece com uma animação simples, revelando o fundo preto.

Se o jogador tocar em qualquer carta errada, a partida termina imediatamente.

---

## Plataforma

* Mobile Web
* Desenvolvido com Phaser 3
* Orientação vertical (portrait)

---

## Direção de Arte

Inspiração: Bauhaus, Memphis Design, pôsteres modernistas, identidade visual de festivais.

* Fundo totalmente preto (#000000)
* Cartas brancas ou off-white
* Símbolos geométricos chapados, 1 a 2 cores vibrantes por símbolo
* Sem gradientes
* Sem texturas

Os símbolos devem ser reconhecíveis em menos de 0,2 segundos.

---

## Símbolos

Lista inicial (10 símbolos para o protótipo):

* Chama
* Nuvem
* Raio
* Sol
* Gota
* Espiral
* Listras diagonais
* Círculos concêntricos
* Zigue-zague
* Quadrados sobrepostos

Cada símbolo é desenhado como SVG individual, exportado como arquivo separado.

---

## Layout da Tela

### Fundo

* Fundo totalmente preto (#000000)

### Área Superior

Exibir:

* Fase atual
* Tempo restante
* Carta de referência mostrando o símbolo-alvo

Exemplo:

Fase 3

[ carta com raio ]

Tempo: 12

### Área Principal

Grid de cartas com símbolos.

Configuração:

* 5 colunas
* 5 linhas
* Total: 25 cartas

Canvas: 540×960px

Tamanho de cada carta: **108×192px** (proporção ~9:16)

Gap entre cartas: 2px

Os SVGs dos símbolos devem ser desenhados em **108×192px**.

---

## Mecânica

### Início da Fase

1. Escolher uma quantidade de símbolos para a fase.
2. Preencher o grid com cartas sorteadas entre esses símbolos.
3. Escolher um dos símbolos presentes como alvo.
4. Mostrar esse símbolo na carta de referência no topo.

### Durante a Fase

Quando o jogador toca em uma carta:

#### Acerto

Se a carta possui o símbolo-alvo:

* tocar animação de remoção
* desaparecer
* revelar fundo preto

#### Erro

Se a carta NÃO possui o símbolo-alvo:

* Game Over imediato

### Conclusão da Fase

Quando todas as cartas do símbolo-alvo forem removidas:

* avançar para próxima fase
* gerar novo grid
* aumentar dificuldade

---

## Progressão de Dificuldade

A dificuldade aumenta pelo número de símbolos distintos presentes no grid.

### Fase 1

3 símbolos

### Fase 2

4 símbolos

### Fase 3

5 símbolos

### Fase 4

6 símbolos

### Fase 5+

Continuar aumentando até o limite de símbolos disponíveis.

O tamanho do grid (5×5) permanece igual na primeira versão.

---

## Animação de Remoção

Ao acertar:

* carta move levemente para baixo
* reduz escala
* fade out
* é destruída ao final

Duração aproximada: 200 a 300 ms

Objetivo: dar sensação de que a carta caiu para dentro do fundo preto.

---

## Game Over

Exibir:

GAME OVER

Fase alcançada: X

Botão: Jogar Novamente

---

## Assets

Cada símbolo é um arquivo SVG individual em `public/assets/symbols/`.

Convenção de nomes: `flame.svg`, `cloud.svg`, `lightning.svg`, etc.

Phaser carrega SVGs rasterizados no tamanho da carta:

```js
this.load.svg('flame', 'assets/symbols/flame.svg', { width: 90, height: 135 });
```

Quando os designs estiverem finalizados, exportar como PNG spritesheet para produção.

---

## Estrutura Inicial

### Scenes

BootScene
* preload de assets

GameScene
* gameplay principal

GameOverScene
* tela de derrota

### Classes

Card
* representa uma carta individual
* exibe um símbolo
* responde ao toque

Board
* gera e controla o grid
* sorteia símbolos por fase

GameManager
* controla fase, dificuldade e estado de jogo

---

## Objetivo da Primeira Versão

Criar um protótipo funcional contendo:

* geração do grid com símbolos
* seleção do símbolo-alvo
* toque correto com animação de remoção
* toque errado com game over imediato
* avanço de fase
* tela de game over

Sem sons.
Sem partículas.
Sem microanimações nos símbolos.

Foco total em validar a mecânica principal.
