import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory } from 'react-router'

import Routes from './pages/abstract/Routes'

render (
		<Router onUpdate={() => {window.scrollTo(0, 0);}}
				routes={Routes} history={hashHistory}/>,
				document.getElementById('app')
);
