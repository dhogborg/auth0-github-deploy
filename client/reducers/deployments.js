import moment from 'moment';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: [],
  activeRecord: null
};

export const deployments = createReducer(fromJS(initialState), {
  [constants.OPEN_DEPLOYMENT]: (state, action) =>
    state.merge({
      activeRecord: action.payload.deployment
    }),
  [constants.CLEAR_DEPLOYMENT]: (state) =>
    state.merge({
      activeRecord: null
    }),
  [constants.FETCH_DEPLOYMENTS_PENDING]: (state) =>
    state.merge({
      loading: true,
      records: [ ]
    }),
  [constants.FETCH_DEPLOYMENTS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the deployments: ${action.errorMessage}`
    }),
  [constants.FETCH_DEPLOYMENTS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      records: state.get('records').concat(fromJS(data.map(deployment => {
        deployment.date_relative = moment(deployment.date).fromNow();
        return deployment;
      })))
    });
  }
});
