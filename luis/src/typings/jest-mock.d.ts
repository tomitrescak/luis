declare module 'jest-mock' {
  interface Mock<T> extends Function, MockInstance<T> {
    new (): T;
    (...args: any[]): any;
  }

  /**
     * Wrap module with mock definitions
     * @example
     *  jest.mock("../api");
     *  import { Api } from "../api";
     *
     *  const myApi: jest.Mocked<Api> = new Api() as any;
     *  myApi.myApiMethod.mockImplementation(() => "test");
     */
  type Mocked<T> = {
    [P in keyof T]: T[P] & MockInstance<T[P]>;
  } & T;

  interface MockInstance<T> {
    mock: MockContext<T>;
    mockClear(): void;
    mockReset(): void;
    mockImplementation(fn: Function): Mock<T>;
    mockImplementationOnce(fn: Function): Mock<T>;
    mockReturnThis(): Mock<T>;
    mockReturnValue(value: any): Mock<T>;
    mockReturnValueOnce(value: any): Mock<T>;
  }

  interface MockContext<T> {
    calls: any[][];
    instances: T[];
  }

  export function fn<T extends {}>(implementation: (...args: any[]) => T): Mock<T>;
  export function fn<T>(implementation?: Function): Mock<T>;
  export function generateFromMetadata<T>(metadata: T): Mocked<T>;
  export function getMetadata<T>(component: T): T;
  export function spyOn<T>(obj: T, methodName: string): Mock<T>;
}