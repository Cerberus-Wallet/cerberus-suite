import { combineReducers } from 'redux';

import method from './methodReducer';
import docs from './docsReducer';
import connect from './cerberusConnectReducer';

const reducers = combineReducers({
    method,
    docs,
    connect,
});
export default reducers;

export type AppState = ReturnType<typeof reducers>;
