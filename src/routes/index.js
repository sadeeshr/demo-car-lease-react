import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Main from '../containers/Main';
import Home from '../containers/Home';
import Members from '../containers/Members';
import AddMember from '../containers/AddMember';
import Invest from '../containers/Invest';
import Invoices from '../containers/Invoices';

export default (
    <div>
        <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/members" component={Members} />
            <Route exact path="/addMember" component={AddMember} />
            <Route exact path="/invest" component={Invest} />
            <Route exact path="/invoices" component={Invoices} />
        </Switch>
    </div>
)
