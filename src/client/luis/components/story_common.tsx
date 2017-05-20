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
  float: 'right',
  marginTop: '8px',
  marginRight: '6px'
});

export const toolBelt = style({
  width: '100%',
  padding: '6px'
});

export const testHeader = style({
  width: '100%',
  padding: '6px'
});

export const testHeaderLine = style({
  background: '#ddd',
  padding: '3px',
  marginTop: '6px',
  fontWeight: 'bold',
  marginBottom: '3px',
  $nest: {
    '&:first-child': {
      marginTop: '0px'
    }
  }
});

export const testLine = style({
  marginLeft: '6px'
});

export function renderFields(state: RouteState, current: Object, path = '') {
  if (!current) {
    return <div>No tests ...</div>;
  }
  let keys = Object.keys(current);

  if (typeof current[keys[0]] !== 'object') {
    let result = [];
    for (let i=0; i<keys.length; i++) {
      let k = keys[i];
      let c = current[k];
      let name = k;

      if (current[k]) {
        result.push(<div key={i} className={testLine}><div className="fail" dangerouslySetInnerHTML={{__html: `[FAIL] ${k}: ${current[k]}`}}></div></div>);
      } else if (!state.catalogue.hidePassing) {
        result.push(<div key={i} className={testLine}><div className="pass" >[PASS] {`${k}`}</div></div>);
      }
    }
    if (result.length) {
      result.unshift(<div className={testHeaderLine} key={path}>{path}</div>);
    }
    return result;
  } else {
    return Object.keys(current).map((k, i) => {
      return renderFields(state, current[k], path ? path + ' > ' + k : k)
    });
  }
}
