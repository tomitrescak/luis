// const ReactTestComponentPlugin = require('./pretty-print/react_test_component');
// const ReactElementPlugin = require('./pretty-print/react_element');

const ReactTestComponentPlugin = require('pretty-format/build/plugins/ReactTestComponent');
const ReactElementPlugin = require('pretty-format/build/plugins/ReactElement');
const prettyFormat = require('pretty-format');

let PLUGINS = [ReactElementPlugin, ReactTestComponentPlugin];

const normalizeNewlines = string => string.replace(/\r\n|\r/g, '\n');

const addExtraLineBreaks = string => string.includes('\n') ? `\n${string}\n` : string;

export function formatComponent (component: any) {
  return addExtraLineBreaks (normalizeNewlines(prettyFormat(component, {
    escapeRegex: true,
    plugins: PLUGINS,
    printFunctionName: false,
  })));
}

export function trim(str: string) {
  str = str.trim();
  if (str[0] === '"') {
    str = str.substring(1, str.length - 1).trim().replace(/\\"/g, '"');
  }
  return str;
}
