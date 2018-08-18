import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Textarea from '../components/Textarea'
import Dropdown from '../components/Dropdown'


class Agents extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "agent/";
		}

		render() {
				let items = [];
				let selectedItem = this.state.selectedItem;

				if (this.state.items) {
						items = this.state.items.map(this.renderItem.bind(this));
				}

				return  <div>
						<Header />
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
										<Agent value={selectedItem} onFetch={this.onFetch}/>
								</div>
						</div>
		    </div>;
		}
}

class Agent extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "agent/";
    }

		onTypeChange(type) {
		    let value = this.state.value || {};
		    value.type = type.value;
		    this.setState({value});
		}

		render() {
				let value = this.state.value;

				let types = [
						{value: "IN_HOUSE", label: "In House"},
						{value: "FREELANCE", label: "Freelance"},
				];

				return <div>
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={value.name} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<Dropdown name="type" label="Type" value={value.type} disabled={!this.state.updateMode} searchable={false}
										options={types} onChange={this.onTypeChange.bind(this)} />

								<Textarea name="address" label="Address" value={value.address} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<Input name="contact" label="Contact" value={value.contact} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<Input name="tin" label="TIN" value={value.tin} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>
			 </div>
		}
}

export default Agents;
