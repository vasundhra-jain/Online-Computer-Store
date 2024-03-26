import './App.css';

import {Switch,Route} from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import ItemDetails from './Components/ItemDetails';
import Cart from './Components/Cart';
import NotFound from './Components/NotFound';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/Login" component={Login} />
        <Route exact path="/" component={Home} />
        <Route exact path="/ItemDetails" component={ItemDetails} />
        <Route exact path="/Cart" component={Cart} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
