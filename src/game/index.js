import Phaser from 'phaser'
import { PreloadScene } from './scenes/PreloadScene'
import { UIScene } from './scenes/UIScene'
import { BattleScene } from './scenes/BattleScene'
import { BootScene } from './scenes/BootScene'

let globalGame = null
export function getGlobalGame() { return globalGame }

export function createGameConfig(parentEl){
  const width = parentEl.clientWidth || window.innerWidth
  const height = parentEl.clientHeight || window.innerHeight
  const config = {
    type: Phaser.AUTO,
    parent: parentEl,
    backgroundColor: '#0b1020',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width, height
    },
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [BootScene, PreloadScene, BattleScene, UIScene]
  }
  globalGame = new Phaser.Game(config)
  return config
}
