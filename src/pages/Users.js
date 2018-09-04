import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Dropdown from '../components/Dropdown'
import Textarea from '../components/Textarea'
import Checkbox from '../components/Checkbox'

import { GENDERS, USER_TYPES } from '../core/Constants'


class Users extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "user/";
				this.orderBy = "firstName";
		}

		render() {
				let items = [];
				let selectedItem = this.state.selectedItem;

				if (this.state.items) {
						items = this.state.items.map((item, index) => {
								const { firstName, middleName, lastName } = item;
								return <li key={index} onClick={this.onItemClick.bind(this, index)}>
										{`${firstName} ${middleName ? middleName + " " : ""}${lastName}`}
								</li>;
						});
				}

		    return <div>
						<Header location={this.props.location} />
						<div className="ui grid">
								<div className="five wide column ui form">
										<Input label="Search" value={this.state.filter} name="filter"
													onChange={this.onFilter.bind(this)} placeholder="Type here to search" />

										<div className="ui divider"></div>
										<div className="files">
													<ul className="ui list">{items}</ul>
										</div>
								</div>

								<div className="eleven wide column">
										<User value={selectedItem} onFetch={this.onFetch}/>
								</div>
				    </div>
				</div>;
		}
}

class User extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "user/";
    }

		onGenderChange(gender) {
		    let nextState = this.state.value || {};
		    nextState.gender = gender.value;
		    this.setState(nextState);
		}

		onTypeChange(type) {
		    let nextState = this.state.value || {};
		    nextState.type = type.value;
		    this.setState(nextState);
		}

		render() {
				let { value, updateMode } = this.state;

				const passwordConfirmationValue = updateMode ? value.passwordConfirmation : value.password;
				const passwordComponent = <div className="fields">
						<Input name="password" label="Password" type="password" value={value.password}
								onChange={super.onChange.bind(this)} disabled={!updateMode}
								fieldClassName="eight" />

						<Input name="passwordConfirmation" label="Password Confirmation" type="password"
								value={passwordConfirmationValue} onChange={super.onChange.bind(this)} disabled={!updateMode}
								fieldClassName="eight" />
				</div>;

		    return <div>
						<div className="ui form">
								<div className="fields">
										<Input name="userName" label="Username" value={value.userName} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eight" />

										<Dropdown name="type" label="Type" value={value.type} disabled={!updateMode}
												options={USER_TYPES} onChange={this.onTypeChange.bind(this)}
												fieldClassName="eight" />
								</div>

								{passwordComponent}

								<div className="ui horizontal divider">~</div>

								<div className="three fields">
										<Input ref={(input) => {this.initialInput = input}} autoFocus="true"
												name="firstName" label="First Name" value={value.firstName} disabled={!updateMode}
												onChange={super.onChange.bind(this)} />

										<Input name="middleName" label="Middle Name" value={value.middleName} disabled={!updateMode}
												onChange={super.onChange.bind(this)} />

										<Input name="lastName" label="Last Name" value={value.lastName} disabled={!updateMode}
												onChange={super.onChange.bind(this)} />
								</div>

								<div className="fields">
										<Input name="contactNo" label="Contact No." value={value.contactNo} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eleven" />

										<Dropdown name="gender" label="Gender" value={value.gender} disabled={!updateMode}
												options={GENDERS} onChange={this.onGenderChange.bind(this)}
												fieldClassName="five" />
								</div>

								<div className="fields">
										<Input name="email" label="Email" value={value.email} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eleven" />

										<Input name="birthDate" label="Birth Date" value={value.birthDate} disabled={!updateMode}
												onChange={super.onChange.bind(this)} placeholder="MM/dd/yyyy"
												fieldClassName="five" />
								</div>

								<div className="fields">
										<Textarea name="address" label="Address" value={value.address} disabled={!updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="eleven" />

										<div className="five wide field padtop">
												<Checkbox name="active" label="Active" value={value.active} disabled={!updateMode}
														onChange={super.onChecked.bind(this)} />
										</div>
								</div>
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>
		    </div>
		}
}

export default Users;
