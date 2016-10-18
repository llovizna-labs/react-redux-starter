/* @flow */
import React from 'react'
import './Zen.scss'

import type { ZenObject } from '../interfaces/zen'

type Props = {
  zen: ?ZenObject,
  saved: Array<ZenObject>,
  fetchZen: Function,
  saveCurrentZen: Function,
  fetching: boolean,
  error: boolean
}

export const Zen = (props: Props) => (
  <div>
    <div>
      <h2 className='zen__header'>
        {props.zen ? props.zen.value : ''}
      </h2>
      <button className='btn btn-default' onClick={props.fetchZen} disabled={props.fetching ? 'disabled' : ''}>
        Fetch a wisdom
      </button>
      {' '}
      <button className='btn btn-default' onClick={props.saveCurrentZen}>
        Save
      </button>
    </div>
    <div>
      {props.fetching ? 'fetching...' : ''}
    </div>
    {props.saved.length
      ? <div className='zen_savedWisdoms'>
        <h3>
          Saved wisdoms
        </h3>
        <ul className='list-group'>
          {props.saved.map(zen =>
            <li key={zen.id} className='list-group-item'>
              {zen.value}
            </li>
          )}
        </ul>
      </div>
      : null
    }
  </div>
)

Zen.propTypes = {
  zen: React.PropTypes.object,
  saved: React.PropTypes.array.isRequired,
  fetchZen: React.PropTypes.func.isRequired,
  saveCurrentZen: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool.isRequired,
  error: React.PropTypes.bool.isRequired
}

export default Zen
