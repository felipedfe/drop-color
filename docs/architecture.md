# Phaser Template — Arquitetura

Template para jogos Phaser 3 com Vite, ES modules, Event Bus e sistema de áudio.

---

## Início rápido

```bash
npm install
npm run dev      # dev server em localhost:3000
npm run build    # build de produção em dist/
```

---

## Estrutura de pastas

```
src/
  main.js               # Inicializa o Phaser.Game
  config.js             # Dimensões do canvas e constantes de eventos
  EventBus.js           # EventEmitter global (comunicação entre cenas/sistemas)
  ui/
    Button.js           # Factory de botão interativo
  systems/
    AudioManager.js     # Gerenciador de música e SFX
  scenes/
    BootScene.js        # Primeira cena (boot mínimo)
    PreloadScene.js     # Carregamento de assets com barra de progresso
    MenuScene.js        # Menu principal
    GameScene.js        # Gameplay de exemplo
    GameOverScene.js    # Tela de game over
public/
  assets/
    sounds/             # Arquivos de áudio
    images/             # Sprites e fundos (adicione conforme necessário)
```

---

## Event Bus

O `EventBus` é um `Phaser.Events.EventEmitter` singleton. Cenas e sistemas se comunicam por ele — nunca por referência direta entre si.

```js
import { EventBus } from '../EventBus.js';
import { Events } from '../config.js';

// Emitir
EventBus.emit(Events.GAME_OVER, { score: 120 });

// Escutar (sempre dentro de create())
EventBus.on(Events.GAME_OVER, this.handleGameOver, this);

// Limpar no shutdown da cena (obrigatório para evitar memory leak)
this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);

cleanup() {
  EventBus.off(Events.GAME_OVER, this.handleGameOver, this);
}
```

### Adicionando novos eventos

Declare em `src/config.js`:

```js
export const Events = {
  // ...eventos existentes...
  PLAYER_JUMPED: 'player-jumped',
  COIN_COLLECTED: 'coin-collected',
};
```

---

## Cenas

### Criando uma nova cena

```js
import Phaser from 'phaser';
import { EventBus } from '../EventBus.js';
import { Events } from '../config.js';

export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  create() {
    // lógica da cena
    EventBus.on(Events.SOME_EVENT, this.onSomeEvent, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  onSomeEvent(data) {
    // responde ao evento
  }

  cleanup() {
    EventBus.off(Events.SOME_EVENT, this.onSomeEvent, this);
  }
}
```

### Registrando a cena

Em `src/main.js`, adicione no array `scene`:

```js
import { MyScene } from './scenes/MyScene.js';

new Phaser.Game({
  // ...
  scene: [BootScene, PreloadScene, MenuScene, MyScene, GameScene, GameOverScene],
});
```

### Transições entre cenas

```js
// Substituir a cena atual
this.scene.start('GameScene');

// Rodar uma cena em paralelo (ex: HUD overlay)
this.scene.launch('HUDScene');
this.scene.bringToTop('HUDScene');

// Pausar/retomar
this.scene.pause('GameScene');
this.scene.resume('GameScene');
```

---

## Audio Manager

O `AudioManager` é criado uma vez na `PreloadScene` e escuta o `EventBus` pelo resto da vida do jogo. Para controlar áudio, emita eventos — nunca acesse o `AudioManager` diretamente.

### Tocar música de fundo

```js
EventBus.emit(Events.PLAY_MUSIC, 'music');
// Opcional: passar opções do Phaser Sound
EventBus.emit(Events.PLAY_MUSIC, 'music', { volume: 0.5 });
```

### Tocar efeito sonoro

```js
EventBus.emit(Events.PLAY_SFX, 'hit');
```

### Alternar música / SFX

```js
EventBus.emit(Events.TOGGLE_MUSIC);
EventBus.emit(Events.TOGGLE_SFX);
```

O `AudioManager` responde emitindo o estado novo, útil para atualizar a UI:

```js
EventBus.on(Events.MUSIC_STATE_CHANGED, (enabled) => {
  musicButton.setText(enabled ? 'Música: ON' : 'Música: OFF');
});
```

### Adicionando novos sons

1. Coloque o arquivo em `public/assets/sounds/`
2. Carregue na `PreloadScene.preload()`:
   ```js
   this.load.audio('explosion', 'assets/sounds/explosion.mp3');
   ```
3. Use em qualquer cena:
   ```js
   EventBus.emit(Events.PLAY_SFX, 'explosion');
   ```

---

## Button (UI)

Factory simples para botões interativos sem dependência de classe base.

```js
import { createButton } from '../ui/Button.js';

// Uso básico
createButton(this, x, y, 'JOGAR', () => {
  this.scene.start('GameScene');
});

// Com opções
createButton(this, x, y, 'CONFIGURAÇÕES', callback, {
  width: 260,
  height: 60,
  color: 0x2a4a2a,
  hoverColor: 0x3a6a3a,
  pressColor: 0x1a3a1a,
  textStyle: { fontSize: '18px' },
});
```

Retorna `{ btn, text }` caso precise manipular os objetos depois.

---

## Carregando assets

Todos os assets ficam em `public/assets/` e são carregados em `PreloadScene.preload()`.

```js
preload() {
  // Imagem simples
  this.load.image('background', 'assets/images/background.png');

  // Spritesheet para animações
  this.load.spritesheet('player', 'assets/images/player.png', {
    frameWidth: 64,
    frameHeight: 64,
  });

  // Atlas (TexturePacker / Shoebox)
  this.load.atlas('ui', 'assets/images/ui.png', 'assets/images/ui.json');

  // Áudio
  this.load.audio('music', 'assets/sounds/music.ogg');
  this.load.audio('hit', 'assets/sounds/hit.mp3');
}
```

---

## Configurações do jogo

Em `src/config.js`:

```js
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 750;
```

Em `src/main.js`, o `Scale.FIT + CENTER_BOTH` do Phaser cuida do redimensionamento responsivo automaticamente. Nenhum CSS extra é necessário.
