import React from 'react'
import { hashHistory } from 'react-router'
import View from './abstract/View'

import Fetch from '../core/Fetch'
import Alert from '../core/Alert'
import Utils from '../core/Utils'

import Input from '../components/Input'
import Button from '../components/Button'

class Login extends View {

		login() {
				let { userName, password } = this.state;
				let data = { userName, password };

				if (userName && password) {
						Fetch.post("/login", data, (success) => {
								if (success) {
										hashHistory.push("/dashboard");
								} else {
										Alert.error("Invalid username and/or password.");
								}
						});
				} else {
						Alert.error("Username and password is required.");
				}
		}

		render() {
				return <div className="login ui middle aligned center aligned grid">
						<div className="column">
								<div className="ui grey image">
										<img id="brand" src="resources/images/logo.png" className="image" />
										<p className="message">Log-in to your account</p>
								</div>

								<div className="ui large form stacked segment">
										<Input ref={(input) => {this.initialInput = input}} autoFocus="true" placeholder="Username"
												name="userName" value={this.state.userName} icon="user"
												onChange={super.onChange.bind(this)} />

										<Input placeholder="Password" name="password" value={this.state.password}
												onChange={super.onChange.bind(this)} icon="lock" type="password" />

										<Button className="ui fluid large basic purple submit button" onClick={() => this.login()}>Login</Button>
								</div>
						</div>
				</div>;
		}
}

export default Login;
