import React from 'react';
import { Main, Room } from './pages';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route exact path="/:room/:name">
          <Room />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
