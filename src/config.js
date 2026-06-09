export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 750;

export const Events = {
  // Scene navigation
  START_GAME: 'start-game',
  SHOW_MENU: 'show-menu',
  GAME_OVER: 'game-over',

  // Audio control
  TOGGLE_MUSIC: 'toggle-music',
  TOGGLE_SFX: 'toggle-sfx',
  PLAY_MUSIC: 'play-music',
  PLAY_SFX: 'play-sfx',

  // Audio state feedback (emitted by AudioManager)
  MUSIC_STATE_CHANGED: 'music-state-changed',
  SFX_STATE_CHANGED: 'sfx-state-changed',

  // Game state
  SCORE_UPDATED: 'score-updated',
  LIVES_UPDATED: 'lives-updated',
};
