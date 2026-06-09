import Phaser from 'phaser';
import { EventBus } from '../EventBus.js';
import { Events } from '../config.js';
import { createButton } from '../ui/Button.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x0f0f1e).setOrigin(0);

    this.add
      .text(width / 2, height * 0.2, 'PHASER', {
        fontSize: '64px',
        fontFamily: 'Arial Black, Arial',
        color: '#3a7bd5',
        stroke: '#1a3a65',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add.rectangle(width / 2, height * 0.29, 200, 3, 0x3a7bd5);

    this.add
      .text(width / 2, height * 0.33, 'TEMPLATE', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#7a8a9a',
        letterSpacing: 10,
      })
      .setOrigin(0.5);

    createButton(this, width / 2, height * 0.53, 'PLAY', () => {
      this.scene.start('GameScene');
    });

    // Music toggle — demonstrates two-way EventBus communication:
    // this scene emits TOGGLE_MUSIC, AudioManager responds with MUSIC_STATE_CHANGED.
    const { btn: musicBtn, text: musicText } = createButton(
      this,
      width / 2,
      height * 0.67,
      '♪  Music  ON',
      () => EventBus.emit(Events.TOGGLE_MUSIC),
      { color: 0x2a4a2a, hoverColor: 0x3a6a3a, pressColor: 0x1a3a1a, width: 200 }
    );

    this.musicBtn = musicBtn;
    this.musicText = musicText;

    EventBus.on(Events.MUSIC_STATE_CHANGED, this.onMusicStateChanged, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  onMusicStateChanged(enabled) {
    this.musicText.setText(`♪  Music  ${enabled ? 'ON' : 'OFF'}`);
    this.musicBtn.setFillStyle(enabled ? 0x2a4a2a : 0x4a2a2a);
  }

  cleanup() {
    EventBus.off(Events.MUSIC_STATE_CHANGED, this.onMusicStateChanged, this);
  }
}
