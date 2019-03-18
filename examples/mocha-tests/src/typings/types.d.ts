declare namespace Chai {
  export interface Assertion {
    matchSnapshot(name?: string): void;
  }
}
