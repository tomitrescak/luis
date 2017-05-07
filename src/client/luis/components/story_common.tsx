import * as React from 'react';
import { style } from 'typestyle';
import { RouteState } from '../state/state';

const header = style({
  marginLeft: `20px`
});

export const bottomTabPane = style({
  position: 'absolute',
  top: '36px',
  bottom: '0px',
  overflow: 'auto',
  left: '6px',
  right: '6px'
});

export const hidePassing = style({
  float: 'right'
});

export const toolBelt = style({
  width: '100%',
  padding: '6px'
});

export function renderFields(state: RouteState, current: Object) {
  if (!current) {
    return <div>No tests ...</div>;
  }
  return Object.keys(current).map((k, i) => {
    if (typeof current[k] === 'string') {
      return current[k] ?
        <div key={i}><span className="fail">[FAIL] {`${k}: ${current[k]}`}</span></div> :
        state.catalogue.hidePassing || <div key={i}><span className="pass">[PASS] {`${k}`}</span></div>;
    } else {
      return (
        <div key={i}>
          <span>{k}</span>
          <div className={header}>
            {renderFields(state, current[k])}
          </div>
        </div>
      );
    }
  });
}
