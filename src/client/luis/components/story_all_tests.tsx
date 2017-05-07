import * as React from 'react';
import { observer } from 'mobx-react';
import { RouteState } from '../state/state';
import { bottomTabPane, hidePassing, renderFields } from './story_common';


// All tests

export interface AllTestsProps {
  title?: any;
  state: RouteState;
}

export const AllTestsTitle = observer(({ state }: AllTestsProps) => (
  <span>All Tests [
    <span className="pass">{state.catalogue.passingTests}</span> /
    <span className="fail">{state.catalogue.failingTests}</span>]
  </span>
));

export const AllTests = observer(({ state }: AllTestsProps) => (
  <div className={bottomTabPane}>
    <div className={hidePassing}>
      <input type="checkbox" defaultChecked={state.catalogue.hidePassing} onChange={(e) => { state.catalogue.hidePassing = e.currentTarget.checked; }} /> Hide Passing
    </div>
    {renderFields(state, state.catalogue.catalogue)}
  </div>
));
