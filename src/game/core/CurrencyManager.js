export class CurrencyManager{
  constructor(){
    this.gold = 0
    this.gems = 0
    this.vip = 0
    this.multipliers = { gold: 1, exp: 1 }
  }
  addGold(v){ const inc = Math.max(0, v); this.gold += inc; try{ window.dispatchEvent(new CustomEvent('currency:goldEarned', { detail:{ amount: inc } })) }catch(_){} }
  spendGold(v){ if(this.gold>=v){ this.gold -= v; return true } return false }
  addGems(v){ this.gems += Math.max(0, v) }
  spendGems(v){ if(this.gems>=v){ this.gems -= v; return true } return false }
  serialize(){ return { gold: this.gold, gems: this.gems, vip: this.vip, multipliers: this.multipliers } }
  deserialize(d){ if(!d) return; this.gold=d.gold||0; this.gems=d.gems||0; this.vip=d.vip||0; this.multipliers=d.multipliers||{gold:1,exp:1} }
}
