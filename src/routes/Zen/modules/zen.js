/* @flow */

import axios from 'axios'

import type {
  ZenObject,
  ZenStateObject
} from '../interface/zen.js'

//
// Constants
//
export const ZEN_PENDING = 'ZEN_PENDING'
export const ZEN_FULFILLED = 'ZEN_FULFILLED'
export const ZEN_REJECTED = 'ZEN_REJECTED'
export const ZEN_RECIEVED = 'ZEN_RECIEVED'
export const SAVE_CURRENT_ZEN = 'SAVE_CURRENT_ZEN'
export const REQUEST_ZEN_ERROR = 'REQUEST_ZEN_ERROR'

//
// Actions
//

export function requestZen () {
  return {
    type: ZEN_PENDING
  }
}

export function requestZenRejected () {
  return {
    type: ZEN_REJECTED
  }
}

let availableId = 0
export function recievedZen (value: Promise) {
  return {
    type: ZEN_RECIEVED,
    payload: {
      id: availableId++,
      value
    }
  }
}

export function saveCurrentZen () {
  return {
    type: SAVE_CURRENT_ZEN
  }
}

export const fetchZen = () => {
  // return (dispatch: Function, getState: Function): Promise => {
  //
  //   if (getState().zen.fetching) return
  //
  //   dispatch(requestZen())
  //
  //   return fetch('https://api.github.com/zen')
  //     .then(data => data.text())
  //     .then(text => dispatch(recieveZen(text)))
  // }
  return {
    type: 'ZEN',
    payload: axios.get('https://api.github.com/zen')
  }
}

export const actions = {
  requestZen,
  fetchZen,
  saveCurrentZen
}

const ZEN_ACTION_HANDLERS = {
  [ZEN_PENDING]: (state: ZenStateObject): ZenStateObject => {
    return ({ ...state,
      fetching: true
    })
  },
  [ZEN_REJECTED]: (state: ZenStateObject, action): ZenStateObject => {
    return ({ ...state,
      fetching: false,
      error: action.error || true
    })
  },

  [ZEN_FULFILLED]: (state: ZenStateObject, action: {
    payload: ZenObject
  }): ZenStateObject => {
    let zen = {
      value: action.payload.data,
      id: availableId++
    }

    return ({ ...state,
      zens: state.zens.concat(zen),
      current: zen.id,
      fetching: false
    })
  },
  [SAVE_CURRENT_ZEN]: (state: ZenStateObject): ZenStateObject => {
    return state.current != null ? ({ ...state,
      saved: state.saved.concat(state.current)
    }) : state
  }
}

const initialState: ZenStateObject = {
  fetching: false,
  current: null,
  zens: [],
  saved: [],
  error: false
}

export default function zenReducer (state: ZenStateObject = initialState, action): ZenStateObject {
  const handler = ZEN_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
