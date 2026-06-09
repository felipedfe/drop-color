import { EventBus } from '../EventBus.js';
import { Events } from '../config.js';

/**
 * Manages background music and SFX for the entire game lifetime.
 * Instantiated once in PreloadScene and stored in game.registry.
 * All control goes through EventBus — scenes never hold a direct reference.
 *
 * Usage from any scene:
 *   EventBus.emit(Events.PLAY_MUSIC, 'music');
 *   EventBus.emit(Events.PLAY_SFX, 'hit');
 *   EventBus.emit(Events.TOGGLE_MUSIC);
 */
export class AudioManager {
  constructor(game) {
    this.sound = game.sound;
    this.music = null;
    this.musicEnabled = true;
    this.sfxEnabled = true;

    EventBus.on(Events.PLAY_MUSIC, this.playMusic, this);
    EventBus.on(Events.PLAY_SFX, this.playSfx, this);
    EventBus.on(Events.TOGGLE_MUSIC, this.toggleMusic, this);
    EventBus.on(Events.TOGGLE_SFX, this.toggleSfx, this);
  }

  playMusic(key, options = {}) {
    if (this.music?.isPlaying) this.music.stop();
    if (!this.musicEnabled) return;
    this.music = this.sound.add(key, { loop: true, volume: 0.35, ...options });
    this.music.play();
  }

  playSfx(key, options = {}) {
    if (!this.sfxEnabled) return;
    this.sound.play(key, { volume: 0.7, ...options });
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.music) {
      this.musicEnabled ? this.music.resume() : this.music.pause();
    }
    EventBus.emit(Events.MUSIC_STATE_CHANGED, this.musicEnabled);
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    EventBus.emit(Events.SFX_STATE_CHANGED, this.sfxEnabled);
  }
}
