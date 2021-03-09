import logo from './logo.svg';
import './App.css';
import Register from './Layout/Register';
import Dashboard from './Layout/Dashboard';
import InitateCall from './Layout/InitateCall';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <>
      {}
      <BrowserRouter>
        <Switch>
          <Route path='/Register' exact> <Register /></Route>
          <Route path='/Dashboard' exact component={Dashboard} />
          <Route path='/Initatecall' exact component={InitateCall} />
          <Route path='/' exact component={Register} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
