import React from 'react'
import { hashHistory } from 'react-router'

import View from '../abstract/View'

import Fetch from '../../core/Fetch'
import Provider from '../../core/Provider'
import Utils from '../../core/Utils'

import Header from '../../components/Header'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'
import Input from '../../components/Input'

class SalesMonitoring extends View {

		constructor(props) {
				super(props);
				this.state = { subType: "stock" };
		}

		componentDidMount() {
				Provider.loadCustomers((customers) => this.setState({ customers }));
				Provider.loadAgents((agents) => this.setState({ agents }));
		}

		onCustomerChange(selected) {
				const customer = { id: selected.value };
				this.setState({ customer });
		}

		onAgentChange(selected) {
				const agent = { id: selected.value };
				this.setState({ agent });
		}

		onStockChange(selected) {
				const stock = { id: selected.value };
				this.setState({ stock });
		}

		onSubTypeChange(subType) {
				this.setState({ subType });
		}

		render() {
				const { startDate, endDate, subType, stock,
						customers, customer, agents, agent } = this.state;

				let customerId = customer ? customer.id : null;
				let stockId = stock ? stock.id : null;
				let agentId = agent ? agent.id : null;

				let customerItems = [];
				if (customers) {
						customerItems = customers.map((customer) => {
								return {value: customer.id, label: customer.name};
						});
				}

				let agentItems = [];
				if (agents) {
						agentItems = agents.map((agent) => {
								return {value: agent.id, label: agent.name};
						});
				}

				const options = [
						{ label: "Stock / Customer", subType: "stock", needsAgent: false },
						{ label: "Agent", subType: "agent", needsAgent: true },
				];

				const selectedOption = options.find(item => item.subType === subType);

				const renderItem = (item) => {
						const defaultClass = "ui basic button report-option";
						const className = item.subType === subType ? defaultClass + " green" : defaultClass;
						return (<div key={item.subType} className="eight wide field">
								<Button className={className}
										onClick={() => this.onSubTypeChange(item.subType)}>
										{item.label}
								</Button>
						</div>);
				};

				const customerSelection = <Dropdown name="customer" label="Customer" value={customerId}
						options={customerItems} onChange={(value) => this.onCustomerChange(value)}
						fieldClassName="sixteen" />;

				const agentSelection = <Dropdown name="agent" label="Agent" value={agentId}
						options={agentItems} onChange={(value) => this.onAgentChange(value)}
						fieldClassName="sixteen" />;

				const stockSelection = <Dropdown name="stock" label="Stock" value={stockId}
						loadOptions={Provider.getStocks} onChange={(value) => this.onStockChange(value)}
						fieldClassName="sixteen" />;

				return (<div>
						<Header />

						<div className="ui form report-panel">
								<h1 className="ui header">Sales Monitoring</h1>
								<br />

								<div className="fields">
										{options.map((item) => renderItem(item))}
								</div>
								<br />

								<div className="fields">
										<Input name="startDate" placeholder="MM/dd/yyyy"
												label="Start Date" value={startDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="endDate" placeholder="MM/dd/yyyy"
												label="End Date" value={endDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>

								<div className="fields">
										{!selectedOption.needsAgent ? customerSelection : agentSelection}
										{!selectedOption.needsAgent ? stockSelection : null}
								</div>

								<br />
								<Button className="ui green button" icon="print" onClick={() => this.onPrint()}>Print</Button>
						</div>
				</div>);
		}
}

export default SalesMonitoring;
