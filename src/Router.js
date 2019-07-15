import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Index from "./components/index";
import AvailableSeat from "./components/AvailableSeat/index";
import Search from './components/Search/search';

function AppRouter() {
  return (
    <Router>
        <Index>
            <Switch>
                <Route path="/" exact component={Search} />
                <Route path="/AvailableSeat" component={AvailableSeat} />     
            </Switch> 
        </Index>
    </Router>
  );
}

export default AppRouter;