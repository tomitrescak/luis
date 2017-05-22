import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { bottomTabPane, hidePassing, renderFields } from './story_common';
import { StateType } from "../state/state";


// All tests

export interface AllTestsProps {
  title?: any;
  state?: StateType;
}

export const AllTestsTitle = inject('state')(observer(({ state }: AllTestsProps) => (
  <span>All Tests [
    <span className="pass">{state.passingTests}</span> /
    <span className="fail">{state.failingTests}</span>]
  </span>
)));

export const AllTests = observer(({ state }: AllTestsProps) => (
  <div className={bottomTabPane}>
    <div className={hidePassing}>
      <input type="checkbox" defaultChecked={state.hidePassing} onChange={(e) => { state.hidePassing = e.currentTarget.checked; }} /> Hide Passing
    </div>
    {renderFields(state, state.root as any)}
  </div>
));
