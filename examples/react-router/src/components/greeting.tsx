import * as React from 'react';

type Props = { name: string };
export const Greeting: React.FC<Props> = ({ name }) => <div>Hello {name}</div>;
