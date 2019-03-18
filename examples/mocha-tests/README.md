# Luis Catalogue

This example showcases the simplest setup for Luis, only as a component catalogue.

To start Luis simply run:

```
yarn
yarn run luis
```

Then visit: `http://localhost:9001` and you will see the friendly Luis interface:

# How Did We do This?

You can use this project as your starter project for building catalogues, but if you wish to start from the scratch and give this a go yourself, following are the instructions on how we created this project.

Start with a fresh project, intialise the new node.js project, add luis and initialise the catalogue:

```
mkdir Catalogue
cd Catalogue
yarn init -y
tsc --init
yarn add luis fuse-box
yarn add @types/react
yarn luis --init
```

Then we optimised our tsconfig.json. The most important bit is to disable `esModuleInterop` and enable `synteticDefaultImports`. The Typescript's interop is a good attempt but does not work very well.

```json
{
  "allowSyntheticDefaultImports": true,
  "esModuleInterop": false
}
```

Then we added our component `greeting.ts`:

```ts
import * as React from 'react';
export const Greeting = () => <div>Hello</div>;
```

and imported it into the catalogue in the `greeting.story.ts` story file:

```ts
import { Greeting } from '../greeting';

describe('Greeting', () => {
  return {
    component: Greeting
  };
});
```

All components are added to catalogue in `*.test` files. You can also add components in following files:

- `*.test`
- `*.fixture`
- `*.story`

or in following directories:

- `/__tests__/*`
- `/__fixtures__/*`
- `/__stories__/*`

The main file, where we load all tests is in the default location `src/luis.ts`, with following content.

Once you are ready just run following and go to http://localhost:9001:

```
yarn luis
```

Please see the docs on how to create and export items of your catalogue.

# Tests

This setup does not support tests. If you want to see Luis with tests and snapshots, please see the `snapshots` example (TBA).
