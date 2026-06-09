import Phaser from 'phaser';

// Singleton EventEmitter for cross-scene communication.
// Scenes and systems communicate through this bus instead of holding
// direct references to each other.
export const EventBus = new Phaser.Events.EventEmitter();
