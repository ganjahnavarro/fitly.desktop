import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Provider from '../core/Provider'

import Input from '../components/Input'
import Audit from '../components/Audit'
import Header from '../components/Header'
import Dropdown from '../components/Dropdown'
import Textarea from '../components/Textarea'
import Button from '../components/Button'

import BasicTable from '../components/BasicTable'


class Customers extends ListView {

		constructor(props) {
		    super(props);
				this.endpoint = "customer/";
		}

		onItemClick(index) {
				super.onItemClick(index);

				let item = this.state.items[index];
				Provider.loadCustomerDiscounts(item.id, (discounts) => this.setState({discounts}));
		}

		render() {
				let items = [];
				let { selectedItem, discounts } = this.state;

				if (this.state.items) {
						items = this.state.items.map(this.renderItem.bind(this));
				}

				return <div>
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
										<Customer value={selectedItem} onFetch={this.onFetch} discounts={discounts} />
								</div>
						</div>
		    </div>;
		}
}

class Customer extends DetailView {

		constructor(props) {
		    super(props);
				this.endpoint = "customer/";
				this.state.activeTab = "information";
    }

    componentDidMount() {
        Provider.loadAgents((agents) => this.setState({agents}));
    }

		onAgentChange(agent) {
		    let nextState = this.state.value || {};
		    nextState.agent = {id: agent.value};
		    this.setState(nextState);
		}

		setActiveTab(tab) {
				this.setState({ activeTab: tab });
		}

		renderDiscounts() {
				const columns = [
						{ key: "supplier.name", name: "Supplier" },
						{ key: "discount1", name: "Discount 1" },
						{ key: "discount2", name: "Discount 2" },
				];
				return (<div>
						<h3 className="ui header">Supplier Discounts</h3>
						<BasicTable columns={columns} rows={this.props.discounts} allowedDelete />

						<div className="actions">
								<Button className="ui green button" icon="add" onClick={() => console.log("Add supplier discount..")}>Add</Button>
						</div>
						<div className="clearfix" />
				</div>);
		}

		render() {
				let { value, updateMode, activeTab } = this.state;
				let agentId = value && value.agent ? value.agent.id : null;

				let agents = [];
        if (this.state.agents) {
						agents = this.state.agents.map((agent, index) => {
								return {value: agent.id, label: agent.name};
						});
        }

				return <div>
						<div className="ui top attached tabular menu">
								<div onClick={() => this.setActiveTab("information")} className={`item${activeTab === "information" ? " active" : ""}`}>Information</div>
								<div onClick={() => this.setActiveTab("discounts")} className={`item${activeTab === "discounts" ? " active" : ""}`}>Discounts</div>
						</div>

						<div className={`ui bottom attached tab segment${activeTab === "information" ? " active" : ""}`}>
								<div>
										<div className="ui form">
												<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
														name="name" value={value.name} disabled={!updateMode}
														onChange={super.onChange.bind(this)} />

												<Dropdown name="agent" label="Agent" value={agentId} disabled={!updateMode}
														options={agents} onChange={this.onAgentChange.bind(this)} />

												<Textarea name="address" label="Office Address" value={value.address} disabled={!updateMode}
														onChange={super.onChange.bind(this)} rows={2} />

												<Textarea name="homeAddress" label="Home Address" value={value.homeAddress} disabled={!updateMode}
														onChange={super.onChange.bind(this)} rows={2} />

												<div className="fields">
														<Input name="contact" label="Contact" value={value.contact} disabled={!updateMode}
																onChange={super.onChange.bind(this)} fieldClassName="six" />

														<Input name="fax" label="Fax" value={value.fax} disabled={!updateMode}
																onChange={super.onChange.bind(this)} fieldClassName="six"  />

														<Input name="commission" label="Commission" value={value.commission} disabled={!updateMode}
																onChange={super.onChange.bind(this)} fieldClassName="four" />
												</div>

												<div className="fields">
														<Input name="tin" label="TIN" value={value.tin} disabled={!updateMode}
																onChange={super.onChange.bind(this)} fieldClassName="eight" />

														<Input name="terms" label="Terms" value={value.terms} disabled={!updateMode}
																onChange={super.onChange.bind(this)} fieldClassName="eight" />
												</div>

												<div className="fields">
														<Input name="ownersName" label="Owner's Name" value={value.ownersName} disabled={!updateMode}
															onChange={super.onChange.bind(this)} fieldClassName="eight" />

														<Input name="accountNumber" label="Account Number" value={value.accountNumber} disabled={!updateMode}
																onChange={super.onChange.bind(this)} fieldClassName="eight" />
												</div>
										</div>

										<div>
												<Audit value={value} />
												{super.getActions()}
												<div className="clearfix" />
										</div>
								</div>
						</div>

						<div className={`ui bottom attached tab segment${activeTab === "discounts" ? " active" : ""}`}>
								{this.renderDiscounts()}
						</div>
		    </div>
		}
}

export default Customers;
