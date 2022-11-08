import { createStore } from 'redux';
import combinedReducer from './stores/root';

let store = createStore(combinedReducer)

export default store
