import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import Dashboard from './pages/Dashboard';
import UpdateUser from './pages/UpdateUser';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/createUser" component={CreateUser} />
          <Route path="/updateUser/:id" component={UpdateUser} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
