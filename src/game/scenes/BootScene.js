import Phaser from 'phaser'
import { SaveManager } from '../core/SaveManager'
import { CurrencyManager } from '../core/CurrencyManager'
import { HeroManager, Hero } from '../core/HeroManager'
import { IdleBattleSystem } from '../core/IdleBattleSystem'
import { BaseUpgrades } from '../core/BaseUpgrades'
import { ShopSystem } from '../core/ShopSystem'
import { QuestManager } from '../core/QuestManager'

export class BootScene extends Phaser.Scene{
  constructor(){ super('Boot') }
  init(){
    this.registry.set('gameTitle', 'ECLIPSE REBORN: Idle Legends')
  }
  create(){
    const currency = new CurrencyManager()
    const heroes = new HeroManager()
    const battle = new IdleBattleSystem(heroes, currency)
    const base = new BaseUpgrades(currency)
    const shop = new ShopSystem(currency, heroes)
    const quests = new QuestManager(currency)

    const save = SaveManager.load()
    if(save){
      currency.deserialize(save.currency)
      heroes.deserialize(save.heroes)
      battle.deserialize(save.battle)
      base.deserialize(save.base)
      quests.deserialize(save.quests)
    } else {
      heroes.addHero(new Hero('starter','Astra', 'Common'))
      currency.addGold(25)
      currency.addGems(100)
    }

    battle.handleOfflineProgress()

    this.registry.set('managers', { currency, heroes, battle, base, shop, quests })
    this.scene.launch('Preload')
  }
}
