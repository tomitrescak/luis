export function getRootNode(rootId: string) {
  const rootNode = document.getElementById(rootId);

  if (rootNode) {
    return rootNode;
  }

  const rootNodeHtml = '<div id="' + rootId + '"></div>';
  const body = document.getElementsByTagName('body')[0];
  body.insertAdjacentHTML('beforeend', rootNodeHtml);

  return document.getElementById(rootId);
}

// enzyme helpers

import ShallowWrapper from 'enzyme/build/ShallowWrapper';
import ReactWrapper from 'enzyme/build/ReactWrapper';

ShallowWrapper.prototype.change = function (this: ShallowWrapper, value: string) {
  change(this, value);
};
ReactWrapper.prototype.change = function (this: ShallowWrapper, value: string) {
  change(this, value);
};
function change(wrapper: any, value: string) {
  wrapper.simulate('change', {
    target: {
      value
    }
  });
  wrapper.node.value = value;
}
ShallowWrapper.prototype.select = function (this: ShallowWrapper, number: string) {
  select(this, number);
};
ReactWrapper.prototype.select = function (this: ShallowWrapper, number: string) {
  select(this, number);
};
function select(wrapper, value) {
  const { Dropdown } = require('semantic-ui-react');
  if (wrapper.find(Dropdown.Item).length > 0) {
    wrapper.simulate('click').find(Dropdown.Item).at(value).simulate('click');
  } else {
    wrapper.parent().find('Dropdown').find(Dropdown.Item).at(value).simulate('click');
  }
}
