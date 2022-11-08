import playlist from './playlist'
import canvas from './canvas'
import {combineReducers} from 'redux'

const combinedReducer = combineReducers({
  playlist,
  canvas
})
export default combinedReducer
