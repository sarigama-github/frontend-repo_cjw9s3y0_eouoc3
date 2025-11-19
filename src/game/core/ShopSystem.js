export class ShopSystem{
  constructor(currency, heroManager){
    this.currency = currency
    this.heroManager = heroManager
  }
  buySkin(hero, skin){
    const cost = 100
    if(this.currency.spendGems(cost)){
      hero.skin = skin
      return true
    }
    return false
  }
  buyVIP(){ if(this.currency.spendGems(500)){ this.currency.vip = 1; this.currency.multipliers.gold *= 1.25; this.currency.multipliers.exp *= 1.25; return true } return false }
  buyTimeSkip(hours){ const cost = 50*hours; if(this.currency.spendGems(cost)){ return hours*3600 } return 0 }
  buyPremiumHero(){
    const cost = 800
    if(this.currency.spendGems(cost)){
      const id = 'p_'+Date.now()
      const hero = { id, name: 'Mythic Vanguard', rarity:'Mythic', level:1, exp:0, stats:{hp:900,atk:80,def:40,crit:25}, skills:{active:['Meteor Slash'], passive:['Divine Aura']}, skin:'crimson' }
      this.heroManager.addHero(hero)
      return hero
    }
    return null
  }
}
