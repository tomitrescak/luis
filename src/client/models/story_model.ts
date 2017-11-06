import { TestGroup } from './test_group_model';

export class Story extends TestGroup {
  component: JSX.Element;
  decorator?: React.SFC;
  cssClassName: string;
  info: string;

  constructor(parent: TestGroup, name: string, props: StoryConfig) {
    super(parent, name);

    this.component =
      props.component ||
      (props.componentWithData &&
        ((props.componentWithData() as any).component || props.componentWithData()));
    if (!this.component) {
      throw new Error(
        `Story "${name}" needs to either define a "get component()" or "componentWithData()"`
      );
    }
    this.info = props.info;
    this.decorator = props.decorator;
    this.cssClassName = props.cssClassName;
  }
}
