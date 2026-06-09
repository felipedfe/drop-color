import Phaser from 'phaser';
import { EventBus } from '../EventBus.js';
import { Events } from '../config.js';

const PLAYER_SPEED = 420;
const MAX_LIVES = 3;
const ENEMY_COLORS = [0xe74c3c, 0xe67e22, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0x1abc9c];

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.score = 0;
    this.lives = MAX_LIVES;
    this.isGameOver = false;
    this.spawnDelay = 1100;

    this.add.rectangle(0, 0, width, height, 0x0f0f1e).setOrigin(0);

    // Player
    this.player = this.add.rectangle(width / 2, height - 70, 70, 18, 0x3a7bd5);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setImmovable(true);

    // Enemies
    this.enemies = this.physics.add.group();
    this.physics.add.overlap(this.player, this.enemies, this.onCollision, null, this);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    // Touch drag
    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown && !this.isGameOver) {
        this.player.x = Phaser.Math.Clamp(pointer.x, 35, width - 35);
      }
    });

    // HUD
    this.scoreText = this.add
      .text(16, 16, 'Score: 0', { fontSize: '22px', fontFamily: 'Arial Black, Arial', color: '#ffffff' })
      .setDepth(10);

    this.livesText = this.add
      .text(width - 16, 16, '♥♥♥', { fontSize: '22px', fontFamily: 'Arial', color: '#e74c3c' })
      .setOrigin(1, 0)
      .setDepth(10);

    // Spawn
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // Difficulty ramp
    this.time.addEvent({
      delay: 8000,
      callback: this.increaseSpeed,
      callbackScope: this,
      loop: true,
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  spawnEnemy() {
    const { width } = this.scale;
    const radius = Phaser.Math.Between(12, 20);
    const x = Phaser.Math.Between(radius, width - radius);
    const color = Phaser.Utils.Array.GetRandom(ENEMY_COLORS);

    const circle = this.add.circle(x, -radius * 2, radius, color);
    this.physics.add.existing(circle);
    circle.body.setVelocityY(Phaser.Math.Between(160, 280));
    circle.body.setCircle(radius);
    this.enemies.add(circle);
  }

  increaseSpeed() {
    this.spawnDelay = Math.max(400, this.spawnDelay - 80);
    this.spawnTimer.delay = this.spawnDelay;
  }

  onCollision(_player, enemy) {
    enemy.destroy();
    this.lives = Math.max(0, this.lives - 1);
    this.livesText.setText('♥'.repeat(this.lives) || '');

    EventBus.emit(Events.PLAY_SFX, 'hit');
    this.cameras.main.shake(180, 0.012);

    if (this.lives <= 0 && !this.isGameOver) {
      this.triggerGameOver();
    }
  }

  triggerGameOver() {
    this.isGameOver = true;
    this.spawnTimer.remove();
    this.physics.pause();

    this.time.delayedCall(600, () => {
      EventBus.emit(Events.GAME_OVER, { score: this.score });
    });
  }

  update() {
    if (this.isGameOver) return;

    this.player.body.setVelocityX(0);

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.body.setVelocityX(-PLAYER_SPEED);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.body.setVelocityX(PLAYER_SPEED);
    }

    // Score for each enemy that exits the bottom
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy.y > this.scale.height + 30) {
        enemy.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
      }
    });
  }

  cleanup() {
    this.spawnTimer?.remove();
  }
}
