import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from '../App'
import Login from '../Login'

import Trainers from '../Trainers'
import Members from '../Members'
import Programs from '../Programs'
import Packages from '../Packages'
import TrainingSessions from '../TrainingSessions'
import Users from '../Users'
import Settings from '../Settings'

import Todo from '../Todo'

function requireAuth(nextState, replaceState) {
    /*
        if not logged on, call replaceState("/login");
    */
}

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Todo}/>
        <Route path="/login" component={Login} />

        <Route path="/trainers" component={Trainers} onEnter={requireAuth}/>
        <Route path="/members" component={Members} onEnter={requireAuth}/>
        <Route path="/programs" component={Programs} onEnter={requireAuth}/>
        <Route path="/packages" component={Packages} onEnter={requireAuth}/>
        <Route path="/training-sessions" component={TrainingSessions} onEnter={requireAuth}/>
        <Route path="/users" component={Users} onEnter={requireAuth}/>
        <Route path="/settings" component={Settings} onEnter={requireAuth}/>

        <Route path="/todo" component={Todo} onEnter={requireAuth}/>
    </Route>

)
