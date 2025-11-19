import Phaser from 'phaser'

// Using simple generated rectangles and text instead of external sprites to keep runnable
export class PreloadScene extends Phaser.Scene{
  constructor(){ super('Preload') }
  preload(){
    // Could load sprite sheets here if available; we'll create graphics procedurally
  }
  create(){
    this.scene.start('Battle')
    this.scene.launch('UI')
  }
}
