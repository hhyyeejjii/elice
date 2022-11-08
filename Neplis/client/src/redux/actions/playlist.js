//Action
export const ADD_MUSIC = 'ADD_MUSIC'
export const DELETE_MUSIC = 'DELETE_MUSIC'
export const SET_NOWPLAYING = 'SET_NOWPLAYING'
export const SET_CATEGORY = 'SET_CATEGORY'
export const SET_PLAYLIST = 'SET_PLAYLIST'

//Action Creators
export const addMusic = (music) => {
  return {
  type: ADD_MUSIC,
  music
}}

export const setPlaylist = (playlist) => {
  return {
  type: SET_PLAYLIST,
  playlist
}}

export const deleteMusic = (index) => { 
  return {
  type : DELETE_MUSIC,
  index
}}

export const setNowPlaying = (index) => {
  return {
    type : SET_NOWPLAYING,
    index
  }
}

export const setCategory = (data) => {
  return {
    type : SET_CATEGORY,
    data
    // id, category, ind도 줘야할 듯.
  }
}