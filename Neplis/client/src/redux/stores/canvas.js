import { ON_OFF_ELEMENT, SAVE_POSITION } from "../actions/canvas";

const initialState = {
  onNOff: [0,0,0,0],
  positions : [[],[],[],[]]
};

// Reducer
function canvas(state = initialState, action) {
  switch (action.type) {
    case ON_OFF_ELEMENT:
      state.onNOff[action.index] = !state.onNOff[action.index]
      return { ...state, onNOff:[...state.onNOff,]}

    case SAVE_POSITION :
      return {...state, positions : action.positions}

    default:
      return state;
  }
}

export default canvas;