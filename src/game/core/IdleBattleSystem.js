export class IdleBattleSystem{
  constructor(heroManager, currency){
    this.heroManager = heroManager
    this.currency = currency
    this.currentMap = 1
    this.stage = 1
    this.timer = 0
    this.enemyHP = this.getEnemyMaxHP()
    this.idleGoldPerSec = 1
    this.expPerSec = 1
    this.offlineTimestamp = Date.now()
  }
  getEnemyMaxHP(){
    const base = 100 * Math.pow(1.25, (this.currentMap-1)*10 + (this.stage-1))
    return Math.floor(base)
  }
  tick(dt){
    // damage from heroes
    const heroes = this.heroManager.getActiveHeroes()
    const dps = heroes.reduce((s,h)=> s + h.stats.atk*(1 + h.stats.crit/100*0.5), 0)
    this.enemyHP -= dps * dt

    // idle income
    const goldGain = (this.idleGoldPerSec * (this.currency.multipliers.gold||1)) * dt
    const expGain = (this.expPerSec * (this.currency.multipliers.exp||1)) * dt
    this.currency.addGold(goldGain)
    heroes.forEach(h=>h.addExp(expGain/Math.max(1,heroes.length)))

    if(this.enemyHP <= 0){
      // next stage
      this.stage++
      if(this.stage>10){ this.stage=1; this.currentMap++ }
      this.enemyHP = this.getEnemyMaxHP()
      // stage clear bonus
      this.currency.addGold(10 * this.currentMap * this.stage)
    }
  }
  handleOfflineProgress(){
    const now = Date.now()
    const sec = Math.max(0, Math.floor((now - this.offlineTimestamp)/1000))
    this.offlineTimestamp = now
    if(sec>0){
      // Simulate
      const totalGold = sec * this.idleGoldPerSec * (this.currency.multipliers.gold||1)
      const totalExp = sec * this.expPerSec * (this.currency.multipliers.exp||1)
      this.currency.addGold(totalGold)
      this.heroManager.getActiveHeroes().forEach(h=>h.addExp(totalExp/Math.max(1,this.heroManager.getActiveHeroes().length)))
    }
  }
  timeSkip(seconds){
    const loops = Math.min(3600*24*7, seconds) // cap 1 week
    const gold = loops * this.idleGoldPerSec * (this.currency.multipliers.gold||1)
    const exp = loops * this.expPerSec * (this.currency.multipliers.exp||1)
    this.currency.addGold(gold)
    this.heroManager.getActiveHeroes().forEach(h=>h.addExp(exp/Math.max(1,this.heroManager.getActiveHeroes().length)))
  }
  serialize(){
    return { currentMap:this.currentMap, stage:this.stage, enemyHP:this.enemyHP, idleGoldPerSec:this.idleGoldPerSec, expPerSec:this.expPerSec, offlineTimestamp:this.offlineTimestamp }
  }
  deserialize(d){ if(!d) return; this.currentMap=d.currentMap||1; this.stage=d.stage||1; this.enemyHP=d.enemyHP||this.getEnemyMaxHP(); this.idleGoldPerSec=d.idleGoldPerSec||1; this.expPerSec=d.expPerSec||1; this.offlineTimestamp=d.offlineTimestamp||Date.now() }
}
