import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Header, Index, About } from './components';

function WaitingComponent<T>(Component: React.FC<T>) {
  return (props: T) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
}

// split the luis from the app
const Luis = React.lazy(() => import('./luis'));

export const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/luis/" />
          <Route path="/" component={Header} />
        </Switch>

        <Switch>
          <Route path="/luis/" component={WaitingComponent(Luis)} />
          <Route path="/" exact component={Index} />
          <Route path="/about" exact component={About} />
        </Switch>
      </div>
    </Router>
  );
};
