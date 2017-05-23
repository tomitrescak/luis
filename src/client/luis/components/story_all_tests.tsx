import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { bottomTabPane, hidePassing, renderFields, renderFolder } from './story_common';
import { StateType } from '../state/state';
import { Loader } from 'semantic-ui-react';


// All tests

export interface AllTestsProps {
  title?: {};
  state?: StateType;
}

export const AllTestsTitle = inject('state')(observer(({ state }: AllTestsProps) => {
  return (
    <span>{state.runningTests && <Loader size="mini" active inline />} All Tests [
    <span className="pass">{state.passingTests}</span> /
    <span className="fail">{state.failingTests}</span>]
  </span>
  );
}
));

export const AllTests = inject('state')(observer(({ state }: AllTestsProps) => (
  <div className={bottomTabPane}>
    <div className={hidePassing}>
      <input type="checkbox" defaultChecked={state.hidePassing} onChange={(e) => { state.hidePassing = e.currentTarget.checked; }} /> Hide Passing
    </div>
    {state.runningTests && <div><Loader size="mini" active inline /> Loading ...</div>}
    {renderFolder(state, state.root)}
  </div>
)));
