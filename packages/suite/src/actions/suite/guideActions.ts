import { analytics, EventType } from '@cerberus/suite-analytics';

import type {
    ActiveView,
    Feedback,
    FeedbackType,
    GuideCategory,
    GuideNode,
} from '@suite-common/suite-types';
import { notificationsActions } from '@suite-common/toast-notifications';
import { isCodesignBuild } from '@cerberus/env-utils';

import { Dispatch } from 'src/types/suite';
import { GUIDE } from './constants';

export type GuideAction =
    | { type: typeof GUIDE.OPEN }
    | { type: typeof GUIDE.CLOSE }
    | { type: typeof GUIDE.SET_INDEX_NODE; payload: GuideCategory }
    | { type: typeof GUIDE.SET_VIEW; payload: ActiveView }
    | { type: typeof GUIDE.UNSET_NODE }
    | { type: typeof GUIDE.OPEN_NODE; payload: GuideNode };

export const open = (): GuideAction => {
    analytics.report({
        type: EventType.MenuGuide,
    });

    return {
        type: GUIDE.OPEN,
    };
};

export const close = (): GuideAction => ({
    type: GUIDE.CLOSE,
});

export const setIndexNode = (payload: GuideCategory) => ({
    type: GUIDE.SET_INDEX_NODE,
    payload,
});

export const unsetNode = () => ({
    type: GUIDE.UNSET_NODE,
});

export const setView = (payload: ActiveView) => (dispatch: Dispatch) => {
    if (payload !== 'GUIDE_ARTICLE' && payload !== 'GUIDE_CATEGORY') {
        dispatch(unsetNode());
    }

    dispatch({ type: GUIDE.SET_VIEW, payload });
};

export const openNode = (payload: GuideNode) => (dispatch: Dispatch) => {
    if (payload.type === 'page') {
        dispatch(setView('GUIDE_ARTICLE'));
    } else {
        dispatch(setView('GUIDE_CATEGORY'));
    }

    dispatch({
        type: GUIDE.OPEN_NODE,
        payload,
    });
};

const getUrl = (feedbackType: FeedbackType) => {
    const typeUri = feedbackType === 'BUG' ? 'bugs' : 'feedback';
    const base = `https://data.trezer.io/suite/${typeUri}`;

    if (isCodesignBuild()) {
        return `${base}/stable.log`;
    }

    return `${base}/develop.log`;
};

export const sendFeedback =
    ({ type, payload }: Feedback) =>
    async (dispatch: Dispatch) => {
        const url = getUrl(type);
        const params = new URLSearchParams({ ...payload });
        try {
            await fetch(`${url}?${params.toString()}`, {
                method: 'GET',
            });
            dispatch(notificationsActions.addToast({ type: 'user-feedback-send-success' }));
        } catch (err) {
            dispatch(notificationsActions.addToast({ type: 'user-feedback-send-error' }));
            console.error('failed to send user feedback', err);
        }
    };
