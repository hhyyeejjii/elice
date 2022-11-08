import { act } from "@react-three/fiber";
import { ADD_MUSIC, DELETE_MUSIC, SET_NOWPLAYING, SET_CATEGORY, SET_PLAYLIST } from "../actions/playlist";

const initialState = {
  user: "test", // 따로 스토어
  nowPlaying: 0,
  playlist: [
    {
      title: "test",
      albumImage:
        "https://cdn.notefolio.net/img/ea/f0/eaf061b315f6f9e515ea5d49c84ca9d0a0e270a0a50a60c6c3e83a187e5dc112_v1.jpg",
      musician: "For Test",
      lyrics: "testLyrics",
      bgImg:
        "https://cdn.notefolio.net/img/8d/04/8d043e4b1d6d498da68b95255f79bdc35b2b5897da459cdc442fb94c5aec8738_v1.jpg",
      audio:
        "https://p.scdn.co/mp3-preview/95a1c576b938bd5c9a091654328fe2c66d6abd77?cid=9ebd371789ec4d41a6e4091dffeec2cb",
      id: -1,
      category: null,

      elements: [
        {
          id: "1",
          category: "love",
          coordinate: [0, 0],
        },
      ],
    },
  ],
};

// Reducer
function playlist(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYLIST:
      return { ...state, playlist: [ action.playlist ] };

    case ADD_MUSIC:
      return { ...state, playlist: [...state.playlist, action.music] };
// nowPlaying이 0일 경우 ?
// nowPlaying이 0일 경우에는
// 

    case DELETE_MUSIC:
      if (action.index == state.nowPlaying && state.nowPlaying == (state.playlist.length - 1) ) {
        state.playlist.splice(action.index, 1);
        return { ...state, nowPlaying : ( state.nowPlaying - 1 ), playlist: [...state.playlist] };
      }
      else {
        state.playlist.splice(action.index, 1);
        return { ...state, playlist: [...state.playlist] };  
      }

    case SET_NOWPLAYING:
      return {
        ...state,
        nowPlaying: action.index,
      };

    case SET_CATEGORY:
      state.playlist[action.data.idx]["category"] = action.data.category;
      return {
        ...state,
        playlist: [...state.playlist],
      };

    default:
      return state;
  }
}

export default playlist;
