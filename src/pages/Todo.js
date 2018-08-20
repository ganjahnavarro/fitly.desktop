import React from 'react'
import { hashHistory } from 'react-router'
import View from './abstract/View'

import Fetch from '../core/Fetch'
import Alert from '../core/Alert'

import Input from '../components/Input'
import Button from '../components/Button'
import Header from '../components/Header'

class Todo extends View {

		render() {
				return <div>
						<Header location={this.props.location} />
						<div className="ui grey image">
								<p className="message">This page is under construction.</p>
						</div>
				</div>;
		}
}

export default Todo;
