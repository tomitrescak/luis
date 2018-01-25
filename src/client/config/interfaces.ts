import { ReactElement } from "react";
import { ReactWrapper } from 'enzyme';

declare module 'enzyme' {
  interface ReactWrapper {
    change(value: string): void;
    select(value: number): void;
    click(): void;
  }
}

declare global {
  function xit(name: string, implementation: () => void): void;
  function it(name: string, implementation: () => void): void;
  function describe(name: string, implementation: () => void): void;
  function storyOf<T extends StoryConfig>(name: string, config: T, implementation: (params: T) => void): void;
  function xdescribe(name: string, implementation: () => void): void;
  function before(implementation: () => void): void;
  function beforeAll(implementation: () => void): void;
  function beforeEach(implementation: () => void): void;
  function after(implementation: () => void): void;
  function afterEach(implementation: () => void): void;
  function afterAll(implementation: () => void): void;

  // function xitTest(name: string, implementation: () => void): void;
  // function itTest(name: string, implementation: () => void): void;
  // function describeTest(name: string, implementation: () => void): void;
  // function storyOfTest<T extends StoryConfig>(name: string, config: T, implementation: (params: T) => void): void;
  // function xdescribeTest(name: string, implementation: () => void): void;
  // function beforeTest(implementation: () => void): void;
  // function beforeAllTest(implementation: () => void): void;
  // function beforeEachTest(implementation: () => void): void;
  // function afterTest(implementation: () => void): void;
  // function afterEachTest(implementation: () => void): void;
  // function afterAllTest(implementation: () => void): void;


  interface StoryConfig {
    [index: string]: any;
    component?: JSX.Element;
    info?: string;
    cssClassName?: string;
    componentWithData? (...props: any[]): JSX.Element | {
      [index: string]: any;
      component: JSX.Element;
      documentRoot?: HTMLElement;
      afterMount?(wrapper: ReactWrapper): void;
    }
  }

  type FunctionInitialiser<P> = () => ReactElement<P>;
  type Wrapped<P, W> = W & { component: ReactElement<P> };
  type Wrapper<P, S, W> = W & { wrapper: ReactWrapper<P, S> };
  type AdvancedFunctionInitialiser<P, W> = () => Wrapped<P, W>;

  function itMountsAnd<P, S, W>(
    name: string,
    component: AdvancedFunctionInitialiser<P, W>,
    test: (data: Wrapper<P, S, W>) => void
  ): void;
  function itMountsAnd<P>(
    name: string,
    component: FunctionInitialiser<P>,
    test: (wrapper: ReactWrapper<P, any>) => void
  ): void;

  function itMountsContainerAnd<P, S>(
    name: string,
    component: FunctionInitialiser<P>,
    test: (wrapper: ReactWrapper<P, S>) => void
  ): void;
  function itMountsContainerAnd<P, S, W>(
    name: string,
    component: AdvancedFunctionInitialiser<P, W>,
    test: (data: Wrapper<P, S, W>) => void
  ): void;

  export type MatchOptions = {
    serializer?: (source: string) => string;
  };

  export namespace Chai {
    interface Assertion {
      matchSnapshot(name?: string, options?: MatchOptions): Assertion
    }
  }
}
