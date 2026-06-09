import Phaser from 'phaser';
import { EventBus } from '../EventBus.js';
import { Events } from '../config.js';
import { createButton } from '../ui/Button.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data?.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x0f0f1e).setOrigin(0);

    const title = this.add
      .text(width / 2, height * 0.3, 'GAME OVER', {
        fontSize: '52px',
        fontFamily: 'Arial Black, Arial',
        color: '#e74c3c',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const scoreLabel = this.add
      .text(width / 2, height * 0.45, `Score: ${this.finalScore}`, {
        fontSize: '30px',
        fontFamily: 'Arial',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({ targets: [title, scoreLabel], alpha: 1, duration: 400 });

    this.time.delayedCall(500, () => {
      createButton(this, width / 2, height * 0.62, 'PLAY AGAIN', () => {
        this.scene.start('GameScene');
      });

      createButton(this, width / 2, height * 0.75, 'MENU', () => {
        this.scene.start('MenuScene');
      }, {
        color: 0x444455,
        hoverColor: 0x666677,
        pressColor: 0x333344,
      });
    });
  }
}
