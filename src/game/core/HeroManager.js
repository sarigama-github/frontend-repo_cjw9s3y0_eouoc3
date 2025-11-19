const RARITY_ORDER = ['Common','Rare','Epic','Legendary','Mythic']
const RARITY_MULT = { Common:1, Rare:1.5, Epic:2.5, Legendary:4, Mythic:6 }

function baseStatsForRarity(r){
  const m = RARITY_MULT[r]||1
  return { hp: Math.floor(100*m), atk: Math.floor(10*m), def: Math.floor(5*m), crit: Math.min(50, 5*m) }
}

export class Hero{
  constructor(id, name, rarity='Common'){
    this.id = id
    this.name = name
    this.rarity = rarity
    this.level = 1
    this.exp = 0
    this.stats = baseStatsForRarity(rarity)
    this.skills = { active: [], passive: [] }
    this.skin = 'default'
  }
  get power(){ return this.stats.atk*2 + this.stats.hp*0.2 + this.stats.def*1.2 }
  addExp(v){
    this.exp += v
    let need = this.level * 100
    while(this.exp >= need){
      this.exp -= need
      this.level++
      this.stats.hp = Math.floor(this.stats.hp*1.12)
      this.stats.atk = Math.floor(this.stats.atk*1.12)
      this.stats.def = Math.floor(this.stats.def*1.10)
      need = this.level * 100
    }
  }
  serialize(){ return { id:this.id, name:this.name, rarity:this.rarity, level:this.level, exp:this.exp, stats:this.stats, skills:this.skills, skin:this.skin } }
  static from(d){ const h = new Hero(d.id,d.name,d.rarity); h.level=d.level; h.exp=d.exp; h.stats=d.stats; h.skills=d.skills||{active:[],passive:[]}; h.skin=d.skin||'default'; return h }
}

export class HeroManager{
  constructor(){
    this.heroes = []
    this.activeParty = [] // ids
  }
  addHero(hero){ this.heroes.push(hero); if(this.activeParty.length<3) this.activeParty.push(hero.id) }
  getActiveHeroes(){ return this.activeParty.map(id=>this.heroes.find(h=>h.id===id)).filter(Boolean) }
  randomHero(){
    const rRoll = Math.random()
    const rarity = rRoll<0.6?'Common': rRoll<0.85?'Rare': rRoll<0.95?'Epic': rRoll<0.99?'Legendary':'Mythic'
    const id = 'h_'+Date.now()+Math.floor(Math.random()*999)
    const name = rarity+ ' Hero'
    return new Hero(id, name, rarity)
  }
  serialize(){ return { heroes: this.heroes.map(h=>h.serialize()), activeParty: this.activeParty } }
  deserialize(d){ if(!d) return; this.heroes=(d.heroes||[]).map(Hero.from); this.activeParty=d.activeParty||this.heroes.slice(0,3).map(h=>h.id) }
}
