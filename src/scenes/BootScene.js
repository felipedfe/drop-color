import Phaser from 'phaser';

/**
 * Minimal first scene. Useful for loading a tiny splash or font before
 * the full preloader starts. Currently just forwards to PreloadScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
