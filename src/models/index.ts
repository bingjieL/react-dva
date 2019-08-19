import globalData from './globalData';
import user from './user'
import bannerModel from './banner'
import blogModel from './blog'
import bookModel from './book'
import hotSwiperModel from './hotSwiper'
import musicSheetModel from './musicSheet'
import blogTypeModel from './blogType';

export default function registerModels(app: any){
  app.model(globalData)
  app.model(user)
  app.model(bannerModel)
  app.model(blogModel)
  app.model(bookModel)
  app.model(hotSwiperModel)
  app.model(musicSheetModel)
  app.model(blogTypeModel)
}
