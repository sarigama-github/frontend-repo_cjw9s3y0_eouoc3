import Phaser from 'phaser'
import { SaveManager } from '../core/SaveManager'

export class BattleScene extends Phaser.Scene{
  constructor(){ super('Battle') }
  create(){
    window.__ECLIPSE_READY__ = true
    this.managers = this.registry.get('managers')
    this.lastSave = 0

    // quest manager hook
    this.questTapCount = 0

    // hero and enemy placeholders
    this.heroSprites = []
    this.enemy = this.add.rectangle(900, this.scale.height/2, 80, 80, 0xdc2626).setStrokeStyle(2,0xffffff)
    this.enemyText = this.add.text(860, this.scale.height/2-70, 'Enemy', { fontFamily:'Inter, sans-serif', fontSize:14, color:'#fff' })

    this.time.addEvent({ delay: 1000/20, loop:true, callback: () => this.step(0.05) })

    // events
    window.addEventListener('ad:reward', (e)=>{
      const { value=1.2, duration=600 } = e.detail||{}
      this.managers.currency.multipliers.gold *= value
      this.managers.currency.multipliers.exp *= value
      this.time.delayedCall(duration*1000, ()=>{
        this.managers.currency.multipliers.gold /= value
        this.managers.currency.multipliers.exp /= value
      })
      this.showPopup(`Ad Reward: ${Math.round((value-1)*100)}% Boost for ${Math.floor(duration/60)}m`)
    })
    window.addEventListener('premium:timeskip', (e)=>{
      const s = (e.detail&&e.detail.seconds)||0
      this.managers.battle.timeSkip(s)
      this.showPopup(`Time skipped ${Math.floor(s/60)}m`)
    })

    this.input.on('pointerdown', (p)=>{
      this.managers.battle.enemyHP -= 5
      this.flashEnemy()
      if(this.managers.quests){ this.managers.quests.onTap() }
    })
  }

  step(dt){
    const beforeStage = this.managers.battle.stage
    const beforeMap = this.managers.battle.currentMap

    this.managers.battle.tick(dt)

    // detect stage clear
    if(this.managers.battle.stage !== beforeStage || this.managers.battle.currentMap !== beforeMap){
      window.dispatchEvent(new CustomEvent('stage:clear'))
    }

    // draw hero sprites
    this.heroSprites.forEach(s=>s.destroy())
    this.heroSprites = []
    const heroes = this.managers.heroes.getActiveHeroes()
    heroes.forEach((h,i)=>{
      const x = 150
      const y = this.scale.height/2 + (i-1)*90
      const rect = this.add.rectangle(x,y,70,70,0x3b82f6).setStrokeStyle(2,0xffffff)
      const txt = this.add.text(x-30,y-50, `${h.name} Lv${h.level}`, { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' })
      const hpPct = Math.min(1, h.stats.hp/(h.stats.hp))
      const hpbar = this.add.rectangle(x,y+50, 60*hpPct, 6, 0x10b981).setOrigin(0.5)
      this.heroSprites.push(rect, txt, hpbar)

      if(Math.random()<0.1){
        const bolt = this.add.rectangle(x+40,y,8,4,0x93c5fd)
        this.tweens.add({ targets: bolt, x: this.enemy.x-40, duration: 200, onComplete: ()=> bolt.destroy() })
      }
    })

    const hp = Math.max(0, Math.floor(this.managers.battle.enemyHP))
    if(!this.enemyHPText){ this.enemyHPText = this.add.text(this.enemy.x-50, this.enemy.y+50, '', { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' }) }
    this.enemyHPText.setText(`HP ${hp}`)

    // save periodically
    this.lastSave += dt
    if(this.lastSave > 5){
      this.lastSave = 0
      const state = {
        currency: this.managers.currency.serialize(),
        heroes: this.managers.heroes.serialize(),
        battle: this.managers.battle.serialize(),
        base: this.managers.base.serialize(),
        quests: this.managers.quests?.serialize?.(),
        ts: Date.now()
      }
      SaveManager.save(state)
    }
  }

  flashEnemy(){
    this.tweens.add({ targets: this.enemy, duration: 60, alpha: 0.6, yoyo: true, repeat: 2 })
  }

  showPopup(text){
    const label = this.add.text(this.scale.width/2, 80, text, { fontFamily:'Inter, sans-serif', fontSize:16, color:'#fff', backgroundColor:'#111827', padding:{left:10,right:10,top:6,bottom:6} }).setOrigin(0.5)
    this.tweens.add({ targets: label, y: 40, alpha: 0, duration: 1200, onComplete: ()=> label.destroy() })
  }
}
