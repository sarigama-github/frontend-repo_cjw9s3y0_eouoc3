export class SaveManager {
  static key = 'eclipse_reborn_save_v1'

  static load(){
    try{
      const raw = localStorage.getItem(SaveManager.key)
      if(!raw) return null
      const data = JSON.parse(raw)
      return data
    }catch(e){
      console.warn('Load failed', e)
      return null
    }
  }

  static save(state){
    try{
      localStorage.setItem(SaveManager.key, JSON.stringify(state))
    }catch(e){
      console.warn('Save failed', e)
    }
  }
}
