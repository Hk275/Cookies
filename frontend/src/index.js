import * as React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import EventDetails from './pages/EventDetails/EventDetails';
import Account from './pages/Account/Account';
import AccountEdit from './pages/AccountEdit/AccountEdit';
import Wallet from './pages/Wallet/Wallet';
import PastEvents from './pages/PastEvents/PastEvent';
import FutureEvents from './pages/FutureEvents/FutureEvents';
import CreateNewEvent from './pages/CreateNewEvent/CreateNewEvent';
import EditEvent from './pages/EditEvent/EditEvent';
import PastBookings from './pages/PastBookings/PastBookings';
import CurrentOrders from './pages/CurrentOrders/CurrentOrders';
import Friends from './pages/Friends/Friends';
import Booking from './pages/Booking/Booking';
import AddItem from './pages/AddItem/AddItem';
import RewardPointsShop from './pages/RewardPointsShop/RewardPointsShop';
import MyItem from './pages/MyItem/MyItem';
import HostItem from './pages/MyItem/HostItem';
import Requests from "../src/pages/Requests/Requests"
// import './styles/index.css';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/eventdetails">
          <EventDetails />
        </Route>
        <Route exact path="/account">
          <Account />
        </Route>
        <Route exact path="/accountedit">
          <AccountEdit />
        </Route>
        <Route exact path="/wallet">
          <Wallet />
        </Route>
        <Route exact path="/pastevents">
          <PastEvents />
        </Route>
        <Route exact path="/futureevents">
          <FutureEvents />
        </Route>
        <Route exact path="/createnewevent">
          <CreateNewEvent />
        </Route>
        <Route exact path="/editevent">
          <EditEvent />
        </Route>
        <Route exact path="/pastbookings">
          <PastBookings />
        </Route>
        <Route exact path="/currentorders">
          <CurrentOrders />
        </Route>
        <Route exact path="/friends">
          <Friends />
        </Route>
        <Route exact path="/booking">
          <Booking />
        </Route>
        <Route exact path="/addItem">
          <AddItem />
        </Route>
        <Route exact path="/rewardpointsshop">
          <RewardPointsShop />
        </Route>
        <Route exact path="/myitem">
          <MyItem />
        </Route>
        <Route exact path="/hostitem">
          <HostItem />
        </Route>
        <Route exact path="/grouprequests">
          <Requests />
        </Route>
      </Switch>
    </Router>
  </ThemeProvider>,
  document.querySelector('#root'),
);