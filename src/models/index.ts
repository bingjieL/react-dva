import globalData from './globalData';
import user from './user'
import bannerModel from './banner'

export default function registerModels(app: any){
  app.model(globalData)
  app.model(user)
  app.model(bannerModel)

}
