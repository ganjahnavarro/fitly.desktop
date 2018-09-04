import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from '../App'
import Login from '../Login'

import Coaches from '../Coaches'
import Members from '../Members'
import Walkins from '../Walkins'
import Programs from '../Programs'
import Packages from '../Packages'
import Users from '../Users'
import Settings from '../Settings'
import Home from '../Home'
import Todo from '../Todo'

import Fetch from '../../core/Fetch'

function onLogout() {}
function requireAuth(nextState, replaceState) {
    /*
        if not logged on, call replaceState("/login");
    */
}

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Login} />
        <Route path="/logout" component={Login} onEnter={onLogout} />
        <Route path="/users" component={Users} onEnter={requireAuth} />

        <Route path="/home" component={Home} onEnter={requireAuth} />

        <Route path="/coaches" component={Coaches} onEnter={requireAuth} />
        <Route path="/walkins" component={Walkins} onEnter={requireAuth} />
        <Route path="/members" component={Members} onEnter={requireAuth} />
        <Route path="/programs" component={Programs} onEnter={requireAuth} />
        <Route path="/packages" component={Packages} onEnter={requireAuth} />

        <Route path="/settings" component={Settings} onEnter={requireAuth} />
    </Route>

)
