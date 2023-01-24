import { combineReducers } from 'redux';

import auth from './auth';
import room from './room';

export const reducers = combineReducers({ auth,room });
