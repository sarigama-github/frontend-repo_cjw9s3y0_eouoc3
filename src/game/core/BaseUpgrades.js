export class BaseUpgrades{
  constructor(currency){
    this.currency = currency
    this.goldMine = 1
    this.manaForge = 1
    this.trainingHall = 1
    this.timeAccelerator = 0
  }
  get goldMineCost(){ return Math.floor(50 * Math.pow(1.5, this.goldMine-1)) }
  get manaForgeCost(){ return Math.floor(75 * Math.pow(1.6, this.manaForge-1)) }
  get trainingCost(){ return Math.floor(100 * Math.pow(1.7, this.trainingHall-1)) }
  get timeAccelCost(){ return 100 + this.timeAccelerator*200 }

  upgradeGoldMine(){ if(this.currency.spendGold(this.goldMineCost)){ this.goldMine++; this.currency.multipliers.gold = 1 + (this.goldMine-1)*0.15; return true } return false }
  upgradeManaForge(){ if(this.currency.spendGold(this.manaForgeCost)){ this.manaForge++; this.currency.multipliers.exp = 1 + (this.manaForge-1)*0.15; return true } return false }
  upgradeTraining(){ if(this.currency.spendGold(this.trainingCost)){ this.trainingHall++; return true } return false }
  upgradeTimeAccel(){ if(this.currency.spendGems(this.timeAccelCost)){ this.timeAccelerator++; return true } return false }
  serialize(){ return { goldMine:this.goldMine, manaForge:this.manaForge, trainingHall:this.trainingHall, timeAccelerator:this.timeAccelerator } }
  deserialize(d){ if(!d) return; this.goldMine=d.goldMine||1; this.manaForge=d.manaForge||1; this.trainingHall=d.trainingHall||1; this.timeAccelerator=d.timeAccelerator||0 }
}
