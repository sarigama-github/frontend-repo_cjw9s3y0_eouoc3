export class QuestManager{
  constructor(currency){
    this.currency = currency
    this.quests = []
    this.lastReset = 0
    this.progress = { stagesCleared:0, goldEarned:0 }
    // Listen for events
    window.addEventListener('stage:clear', ()=>{ this.progress.stagesCleared++ })
    window.addEventListener('currency:goldEarned', (e)=>{ this.progress.goldEarned += (e.detail?.amount||0) })
  }
  resetIfNeeded(){
    const now = Date.now()
    const d = new Date(now)
    const todayKey = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    if(this.lastReset !== todayKey){
      this.lastReset = todayKey
      this.progress = { stagesCleared:0, goldEarned:0 }
      this.quests = [
        { id:'q1', name:'Clear 20 Stages', target:20, reward:{ gems:20 }, claimed:false },
        { id:'q2', name:'Earn 1,000 Gold', target:1000, reward:{ gems:10 }, claimed:false },
        { id:'q3', name:'Tap 10 times', target:10, reward:{ gems:5 }, claimed:false, counter:0 }
      ]
    }
  }
  onTap(){
    const q = this.quests.find(x=>x.id==='q3')
    if(q && !q.claimed){ q.counter=(q.counter||0)+1 }
  }
  canClaim(q){
    if(q.claimed) return false
    if(q.id==='q1') return this.progress.stagesCleared >= q.target
    if(q.id==='q2') return this.progress.goldEarned >= q.target
    if(q.id==='q3') return (q.counter||0) >= q.target
    return false
  }
  claim(id){
    const q = this.quests.find(x=>x.id===id)
    if(!q || q.claimed) return false
    if(!this.canClaim(q)) return false
    q.claimed = true
    if(q.reward?.gems) this.currency.addGems(q.reward.gems)
    return true
  }
  serialize(){ return { lastReset:this.lastReset, quests:this.quests, progress:this.progress } }
  deserialize(d){ if(!d) return; this.lastReset=d.lastReset||0; this.quests=d.quests||[]; this.progress=d.progress||{stagesCleared:0,goldEarned:0} }
}
