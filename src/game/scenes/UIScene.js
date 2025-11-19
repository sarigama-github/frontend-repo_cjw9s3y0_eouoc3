import Phaser from 'phaser'

export class UIScene extends Phaser.Scene{
  constructor(){ super('UI') }
  create(){
    this.managers = this.registry.get('managers')

    this.goldText = this.add.text(16, 12, '', { fontFamily:'Inter, sans-serif', fontSize:16, color:'#fef08a' }).setScrollFactor(0)
    this.gemsText = this.add.text(16, 34, '', { fontFamily:'Inter, sans-serif', fontSize:16, color:'#bfdbfe' }).setScrollFactor(0)
    this.mapText = this.add.text(16, 56, '', { fontFamily:'Inter, sans-serif', fontSize:14, color:'#a7f3d0' }).setScrollFactor(0)

    const buttons = [
      { key:'Home' },{ key:'Heroes' },{ key:'Battle' },{ key:'Base' },{ key:'Summon' },{ key:'Shop' },{ key:'Settings' }
    ]
    const w = this.scale.width
    const y = this.scale.height - 44
    this.nav = this.add.container(0, y)
    buttons.forEach((b,i)=>{
      const x = (w/(buttons.length+1))*(i+1)
      const btn = this.add.rectangle(x, 0, 90, 32, 0x1f2937, 0.8).setStrokeStyle(1,0xffffff).setInteractive({ useHandCursor:true })
      const label = this.add.text(x-35, -8, b.key, { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' })
      btn.on('pointerdown', ()=> this.openPanel(b.key))
      this.nav.add(btn)
      this.nav.add(label)
    })

    this.panels = {}
    this.createHomePanel()
    this.createHeroesPanel()
    this.createBasePanel()
    this.createSummonPanel()
    this.createShopPanel()
    this.createSettingsPanel()

    this.openPanel('Home')

    this.time.addEvent({ delay: 200, loop:true, callback: ()=> this.refreshTop() })
  }

  refreshTop(){
    this.goldText.setText(`Gold: ${Math.floor(this.managers.currency.gold)}`)
    this.gemsText.setText(`Gems: ${Math.floor(this.managers.currency.gems)}`)
    const b = this.managers.battle
    this.mapText.setText(`Map ${b.currentMap} - Stage ${b.stage}`)
  }

  hideAll(){ Object.values(this.panels).forEach(p=>p.setVisible(false)) }
  openPanel(name){ this.hideAll(); if(this.panels[name]) this.panels[name].setVisible(true) }

  createBase(bgY=110){
    const g = this.add.container(0, bgY)
    const box = this.add.rectangle(this.scale.width/2, 0, this.scale.width-32, 220, 0x0f172a, 0.9).setStrokeStyle(1,0xffffff)
    g.add(box)
    return g
  }

  createHomePanel(){
    const g = this.createBase()
    const title = this.add.text(24, -90, 'Home', { fontFamily:'Inter, sans-serif', fontSize:18, color:'#fff' })
    const tip = this.add.text(24, -60, 'Your heroes fight automatically. Earn gold and EXP even while away.', { fontFamily:'Inter, sans-serif', fontSize:12, color:'#cbd5e1' })
    const dailyBtn = this.add.rectangle(this.scale.width/2, 0, 140, 32, 0x2563eb).setInteractive({ useHandCursor:true })
    const dailyTxt = this.add.text(this.scale.width/2-44, -10, 'Daily Quests', { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' })
    dailyBtn.on('pointerdown', ()=> this.openDailyQuests())
    g.add([title, tip, dailyBtn, dailyTxt])
    this.panels['Home'] = g
  }

  openDailyQuests(){
    const overlay = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000000, 0.5).setInteractive()
    const box = this.add.rectangle(this.scale.width/2, this.scale.height/2, Math.min(420, this.scale.width-40), 260, 0x111827, 0.95).setStrokeStyle(1,0xffffff)
    const title = this.add.text(this.scale.width/2-70, this.scale.height/2-110, 'Daily Quests', { fontFamily:'Inter, sans-serif', fontSize:16, color:'#fff' })

    const q = this.managers.quests
    q.resetIfNeeded()

    const items = []
    q.quests.forEach((qq,i)=>{
      const y = this.scale.height/2 - 70 + i*60
      const label = this.add.text(this.scale.width/2-180, y, `${qq.name}`, { fontFamily:'Inter, sans-serif', fontSize:13, color:'#e5e7eb' })
      const progress = this.add.text(this.scale.width/2-180, y+18, `Progress: ${this.progressText(qq)}`, { fontFamily:'Inter, sans-serif', fontSize:11, color:'#a3a3a3' })
      const btn = this.add.rectangle(this.scale.width/2+140, y+10, 80, 24, 0x059669).setInteractive({ useHandCursor:true })
      const t = this.add.text(this.scale.width/2+120, y, 'Claim', { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' })
      btn.on('pointerdown', ()=>{ if(q.claim(qq.id)){ this.showToast('Reward claimed!'); overlay.destroy(); box.destroy(); title.destroy(); items.forEach(x=>x.destroy()) } })
      items.push(label,progress,btn,t)
    })

    overlay.on('pointerdown', ()=>{ overlay.destroy(); box.destroy(); title.destroy(); items.forEach(x=>x.destroy()) })
  }

  progressText(qq){
    const p = this.managers.quests.progress
    if(qq.id==='q1') return `${Math.min(qq.target, p.stagesCleared)} / ${qq.target}`
    if(qq.id==='q2') return `${Math.min(qq.target, Math.floor(p.goldEarned))} / ${qq.target}`
    if(qq.id==='q3') return `${Math.min(qq.target, qq.counter||0)} / ${qq.target}`
    return '0'
  }

  createHeroesPanel(){
    const g = this.createBase()
    const title = this.add.text(24, -90, 'Heroes', { fontFamily:'Inter, sans-serif', fontSize:18, color:'#fff' })
    g.add(title)

    const listY = -50
    const heroes = this.managers.heroes
    const render = ()=>{
      g.removeBetween(2)
      heroes.heroes.forEach((h,idx)=>{
        const y = listY + idx*40
        const row = this.add.text(32, y, `${h.name} [${h.rarity}] Lv${h.level} ATK ${h.stats.atk}`, { fontFamily:'Inter, sans-serif', fontSize:12, color:'#e5e7eb' })
        g.add(row)
      })
    }
    render()

    this.time.addEvent({ delay: 1000, loop:true, callback: render })
    this.panels['Heroes'] = g
  }

  createBasePanel(){
    const g = this.createBase()
    const title = this.add.text(24, -90, 'Base', { fontFamily:'Inter, sans-serif', fontSize:18, color:'#fff' })
    g.add(title)

    const rows = [
      { name:'Gold Mine', getCost:()=> this.managers.base.goldMineCost, onClick:()=> this.managers.base.upgradeGoldMine() },
      { name:'Mana Forge', getCost:()=> this.managers.base.manaForgeCost, onClick:()=> this.managers.base.upgradeManaForge() },
      { name:'Training Hall', getCost:()=> this.managers.base.trainingCost, onClick:()=> this.managers.base.upgradeTraining() },
      { name:'Time Accelerator', getCost:()=> this.managers.base.timeAccelCost, onClick:()=> this.managers.base.upgradeTimeAccel() },
    ]

    const render = ()=>{
      g.removeBetween(1)
      g.add(title)
      rows.forEach((r,i)=>{
        const y = -60 + i*40
        const label = this.add.text(32, y, `${r.name} — Cost ${r.getCost()}`, { fontFamily:'Inter, sans-serif', fontSize:12, color:'#e5e7eb' })
        const btn = this.add.rectangle(this.scale.width-90, y+10, 80, 24, 0x059669).setInteractive({ useHandCursor:true })
        const t = this.add.text(this.scale.width-116, y, 'Upgrade', { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' })
        btn.on('pointerdown', ()=>{ r.onClick(); render() })
        g.add([label, btn, t])
      })
    }
    render()

    this.time.addEvent({ delay: 1000, loop:true, callback: render })
    this.panels['Base'] = g
  }

  createSummonPanel(){
    const g = this.createBase()
    const title = this.add.text(24, -90, 'Summon', { fontFamily:'Inter, sans-serif', fontSize:18, color:'#fff' })
    g.add(title)

    const btn = this.add.rectangle(this.scale.width/2, -30, 160, 40, 0x2563eb).setInteractive({ useHandCursor:true })
    const txt = this.add.text(this.scale.width/2-60, -40, 'Summon x1 (100G)', { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' })
    btn.on('pointerdown', ()=>{
      if(this.managers.currency.spendGold(100)){
        const hero = this.managers.heroes.randomHero()
        this.managers.heroes.addHero(hero)
        this.summonAnimation(hero.rarity)
      }
    })
    g.add([btn, txt])

    this.panels['Summon'] = g
  }

  summonAnimation(rarity){
    const overlay = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000000, 0.6)
    const ring = this.add.circle(this.scale.width/2, this.scale.height/2, 20, 0x60a5fa)
    this.tweens.add({ targets:ring, scale:8, alpha:0, duration:800, onComplete: ()=> ring.destroy() })
    const text = this.add.text(this.scale.width/2, this.scale.height/2, `${rarity}!`, { fontFamily:'Inter, sans-serif', fontSize:28, color:'#fff' }).setOrigin(0.5)
    this.tweens.add({ targets:text, y:'-=40', alpha:0, duration:900, onComplete: ()=> { overlay.destroy(); text.destroy() } })
  }

  createShopPanel(){
    const g = this.createBase()
    const title = this.add.text(24, -90, 'Shop', { fontFamily:'Inter, sans-serif', fontSize:18, color:'#fff' })
    g.add(title)

    const offers = [
      { name:'VIP Unlock', action:()=> this.managers.shop.buyVIP(), cost:'500 Gems' },
      { name:'Premium Hero', action:()=> { const h = this.managers.shop.buyPremiumHero(); if(h) this.showToast('Mythic hero acquired!') }, cost:'800 Gems' },
      { name:'Time Skip 2h', action:()=> { const s = this.managers.shop.buyTimeSkip(2); if(s>0){ this.managers.battle.timeSkip(s); this.showToast('Skipped 2 hours') } }, cost:'100 Gems' },
      { name:'100 Gems (free demo)', action:()=> { this.managers.currency.addGems(100); this.showToast('+100 Gems') }, cost:'Demo' }
    ]

    offers.forEach((o,i)=>{
      const y = -60 + i*40
      const label = this.add.text(32, y, `${o.name} — ${o.cost}`, { fontFamily:'Inter, sans-serif', fontSize:12, color:'#e5e7eb' })
      const btn = this.add.rectangle(this.scale.width-90, y+10, 80, 24, 0x7c3aed).setInteractive({ useHandCursor:true })
      const t = this.add.text(this.scale.width-116, y, 'Buy', { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' })
      btn.on('pointerdown', ()=> o.action())
      g.add([label, btn, t])
    })

    this.panels['Shop'] = g
  }

  createSettingsPanel(){
    const g = this.createBase()
    const title = this.add.text(24, -90, 'Settings', { fontFamily:'Inter, sans-serif', fontSize:18, color:'#fff' })
    g.add(title)

    const btn = this.add.rectangle(this.scale.width/2, -40, 140, 32, 0xef4444).setInteractive({ useHandCursor:true })
    const t = this.add.text(this.scale.width/2-40, -50, 'Reset Save', { fontFamily:'Inter, sans-serif', fontSize:12, color:'#fff' })
    btn.on('pointerdown', ()=>{ localStorage.clear(); location.reload() })
    g.add([btn,t])

    this.panels['Settings'] = g
  }

  showToast(msg){
    const label = this.add.text(this.scale.width/2, this.scale.height-120, msg, { fontFamily:'Inter, sans-serif', fontSize:14, color:'#fff', backgroundColor:'#111827', padding:{left:8,right:8,top:4,bottom:4} }).setOrigin(0.5)
    this.tweens.add({ targets:label, y:'-=30', alpha:0, duration:1200, onComplete: ()=> label.destroy() })
  }
}
