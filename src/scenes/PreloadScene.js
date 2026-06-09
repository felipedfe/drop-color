import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager.js';
import { EventBus } from '../EventBus.js';
import { Events } from '../config.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    const { width, height } = this.scale;

    // Progress bar
    const box = this.add.graphics();
    box.fillStyle(0x222233, 1);
    box.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const bar = this.add.graphics();

    const percent = this.add
      .text(width / 2, height / 2, '0%', {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.load.on('progress', (value) => {
      percent.setText(Math.floor(value * 100) + '%');
      bar.clear();
      bar.fillStyle(0x3a7bd5, 1);
      bar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      bar.destroy();
      box.destroy();
      percent.destroy();
    });

    // --- Load your assets here ---
    // Images:   this.load.image('key', 'assets/images/file.png');
    // Sprites:  this.load.spritesheet('key', 'assets/images/sheet.png', { frameWidth: 64, frameHeight: 64 });
    // Audio:    this.load.audio('key', 'assets/sounds/file.ogg');
    // Atlas:    this.load.atlas('key', 'assets/images/atlas.png', 'assets/images/atlas.json');

    this.load.audio('music', 'assets/sounds/music.ogg');
    this.load.audio('hit', 'assets/sounds/hit.mp3');
  }

  create() {
    // AudioManager lives for the whole game — store in registry so any
    // scene can grab it via this.registry.get('audioManager') if needed.
    const audioManager = new AudioManager(this.game);
    this.game.registry.set('audioManager', audioManager);

    EventBus.emit(Events.PLAY_MUSIC, 'music');

    this.scene.start('MenuScene');
  }
}
