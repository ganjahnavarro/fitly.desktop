import React from 'react'
import { hashHistory } from 'react-router'
import View from './abstract/View'

import Fetch from '../core/Fetch'
import Alert from '../core/Alert'
import Utils from '../core/Utils'

import Input from '../components/Input'
import Button from '../components/Button'

import { COMPANY_NAME, COMPANY_DESCRIPTION } from '../core/Constants'

class Login extends View {

		login() {
				let { userName, password } = this.state;
				let data = { userName, password };

				if (userName && password) {
						Fetch.post("login", data, (success) => {
								if (success) {
										hashHistory.push("/home");
								} else {
										Alert.error("Invalid username and/or password.");
								}
						});
				} else {
						Alert.error("Username and password is required.");
				}
		}

		render() {
				const onEnter = (event) => {
						event.preventDefault();
						this.login();
				};

				return <div className="login">
						<form className="ui large form stacked segment" onSubmit={onEnter}>
								<div className="title">{COMPANY_NAME}</div>
								<div className="description">{COMPANY_DESCRIPTION}</div>

								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" placeholder="Username"
										name="userName" value={this.state.userName} icon="user"
										onChange={super.onChange.bind(this)} />

								<Input placeholder="Password" name="password" value={this.state.password}
										onChange={super.onChange.bind(this)} icon="lock" type="password" />

								<Button className="ui fluid large blue submit button" onClick={() => this.login()}>Login</Button>
						</form>
				</div>;
		}
}

export default Login;
