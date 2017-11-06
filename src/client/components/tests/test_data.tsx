import { StateModel } from '../../models/state_model';
import { ViewState } from '../../models/state_view_model';

export const create = {
  state(stateOverride?: Partial<StateModel>, viewStateOverride?: Partial<ViewState>) {
    let model = new StateModel();
    if (stateOverride) {
      model = { ...model, ...stateOverride } as any;
    }
    if (viewStateOverride) {
      model.viewState = { ...model.viewState, ...viewStateOverride } as any;
    }
    return model;
  }
};
