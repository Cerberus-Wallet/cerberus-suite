import { MiddlewareAPI } from 'redux';

import { Dispatch, AppState, Action } from '../types';
import { getQueryVariable } from '../utils/windowUtils';
import { ON_LOCATION_CHANGE } from '../actions';
import { init } from '../actions/cerberusConnectActions';

export const cerberusConnectMiddleware =
    (api: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (action: Action) => {
        const prevConnectOptions = api.getState().connect.options;

        next(action);

        if (action.type === ON_LOCATION_CHANGE && !prevConnectOptions) {
            const connectSrc = getQueryVariable('src');
            const options = {};
            if (connectSrc) {
                Object.assign(options, { connectSrc });
            }
            api.dispatch(init(options));
        }
    };
