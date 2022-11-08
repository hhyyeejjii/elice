//Action
export const ON_OFF_ELEMENT = 'ON_OFF_ELEMENT'
export const SAVE_POSITION = 'SAVE_POSITION'

//Action Creators
export const onOffElement = (index) => {
  return {
  type: ON_OFF_ELEMENT,
  index 
}}

export const savePosition = (positions) => { 
  return {
  type : SAVE_POSITION,
  positions
}}
